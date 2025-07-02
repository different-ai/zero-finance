import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { userSafes, earnDeposits, earnWithdrawals, autoEarnConfigs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { USDC_ADDRESS } from '@/lib/constants';
import {
  createWalletClient,
  http,
  encodeFunctionData,
  parseAbi,
  Hex,
  getAddress,
  createPublicClient,
  decodeEventLog,
  type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import crypto from 'crypto';

const AUTO_EARN_MODULE_ADDRESS = process.env.AUTO_EARN_MODULE_ADDRESS as
  | Hex
  | undefined;
const RELAYER_PK = process.env.RELAYER_PK as Hex | undefined;
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

if (!AUTO_EARN_MODULE_ADDRESS) {
  console.warn(
    'AUTO_EARN_MODULE_ADDRESS environment variable is not set. Auto-earn trigger will fail.',
  );
}
if (!RELAYER_PK) {
  console.warn(
    'RELAYER_PK environment variable is not set. Auto-earn trigger will fail.',
  );
}

const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
});



//   /**
//    * @dev Initiates the auto-earn process for the specified token and amount.
//    *      This overload assumes the caller is already an authorized relayer.
//    * @param token The address of the token to be saved.
//    * @param amountToSave The amount of tokens to deposit into the vault.
//    * @param safe The address of the Safe from which the transaction is executed.
//    */
//   function autoEarn(
//     address token,
//     uint256 amountToSave,
//     address safe
// )
//     external
//     onlyAuthorizedRelayer
// {
//     _autoEarn(token, amountToSave, safe);
// }

const autoEarnModuleAbi = parseAbi([
  'function autoEarn(address token, uint256 amountToSave, address safe)',
]);

const SAFE_IS_MODULE_ENABLED_ABI = parseAbi([
  'function isModuleEnabled(address module) external view returns (bool)'
]);

const EARN_MODULE_IS_INITIALIZED_ABI = parseAbi([
  'function isInitialized(address smartAccount) public view returns (bool)'
]);

// ABIs for FluidkeyEarnModule view functions and ERC4626 event
const FLUIDKEY_EARN_MODULE_VIEW_ABI = parseAbi([
  'function accountConfig(address smartAccount) external view returns (uint256)',
  'function config(uint256 configHash, uint256 chainId, address token) external view returns (address vaultAddress)',
  'function wrappedNative() external view returns (address)',
]);

const ERC4626_VAULT_ABI = parseAbi([
  'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
  'function convertToAssets(uint256 shares) public view returns (uint256 assets)',
  'function asset() public view returns (address)', // To get the underlying asset for a vault
  'function decimals() public view returns (uint8)', // Standard ERC20/ERC4626 decimals
]);

const ERC4626_VAULT_ABI_EXTENDED = parseAbi([
  'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
  'function convertToAssets(uint256 shares) public view returns (uint256 assets)',
  'function asset() public view returns (address)', 
  'function decimals() public view returns (uint8)',
  'function balanceOf(address owner) public view returns (uint256)',
]);

// First, update the ABI to be more explicit for the vault functions we need
const ERC4626_VAULT_ABI_FOR_INFO = parseAbi([
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function decimals() external view returns (uint8)', 
  'function asset() external view returns (address)'
]);

// Some vaults expose an explicit supply APY. Morpho Seamless does:
// function supplyAPY() returns uint256 expressed as a ray (1e27).
const VAULT_SUPPLY_APY_ABI = parseAbi([
  'function supplyAPY() view returns (uint256)'
]);

export const earnRouter = router({
  recordInstall: protectedProcedure
    .input(z.object({ safeAddress: z.string().length(42) }))
    .mutation(async ({ ctx, input }) => {
      const { safeAddress } = input;
      const privyDid = ctx.userId;

      if (!privyDid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated for recording install.',
        });
      }

      const safe = await db.query.userSafes.findFirst({
        where: (safes, { and, eq }) =>
          and(
            eq(safes.userDid, privyDid),
            eq(safes.safeAddress, safeAddress as `0x${string}`),
          ),
      });

      if (!safe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Safe not found for the current user to record install.',
        });
      }

      // Also ensure earn module is initialized on-chain before recording in DB
      if (AUTO_EARN_MODULE_ADDRESS) {
        const isModuleInitializedOnChain = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: EARN_MODULE_IS_INITIALIZED_ABI,
          functionName: 'isInitialized',
          args: [getAddress(safeAddress)],
        });
        if (!isModuleInitializedOnChain) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Earn module is not yet initialized on-chain for this Safe. Please complete the on-chain installation step.',
          });
        }
      } else {
         throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Auto-earn module address not configured on the server.',
        });
      }

      await db
        .update(userSafes)
        .set({ isEarnModuleEnabled: true })
        .where(eq(userSafes.id, safe.id));

      return { success: true };
    }),

  triggerAutoEarn: protectedProcedure
    .input(
      z.object({
        tokenAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid token address format',
          })
          .transform((val) => getAddress(val)),
        amount: z
          .string()
          .refine((val) => /^\d+$/.test(val), {
            message:
              'Amount must be a string representing a non-negative integer',
          })
          .transform((val) => BigInt(val)),
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address format',
          })
          .transform((val) => getAddress(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tokenAddress, amount, safeAddress } = input;
      const privyDid = ctx.userId;

      if (!privyDid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated for triggering auto-earn.',
        });
      }
      if (!AUTO_EARN_MODULE_ADDRESS || !RELAYER_PK) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Auto-earn module or relayer not configured on the server.',
        });
      }

      const currentChainId = BigInt(base.id);

      // Verify the safe belongs to the user and has earn module enabled (recorded in DB)
      const safeUserLink = await db.query.userSafes.findFirst({
        where: (safes, { and, eq }) =>
          and(
            eq(safes.userDid, privyDid),
            eq(safes.safeAddress, safeAddress as `0x${string}`),
          ),
      });

      if (!safeUserLink) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Safe not found for the current user.',
        });
      }
      // Check DB flag first as a quick check
      if (!safeUserLink.isEarnModuleEnabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Auto-earn is not enabled (recorded in DB) for this Safe. Please use the "Enable Earn Module" steps first.',
        });
      }
      // Then, double check on-chain initialization status as source of truth
      const isModuleInitializedOnChain = await publicClient.readContract({
        address: AUTO_EARN_MODULE_ADDRESS,
        abi: EARN_MODULE_IS_INITIALIZED_ABI,
        functionName: 'isInitialized',
        args: [safeAddress],
      });

      if (!isModuleInitializedOnChain) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Auto-earn module is not initialized on-chain for this Safe. Please complete the full installation process.',
        });
      }

      try {
        const account = privateKeyToAccount(RELAYER_PK);
        const walletClient = createWalletClient({
          account,
          chain: base,
          transport: http(BASE_RPC_URL),
        });

        const { request } = await publicClient.simulateContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: autoEarnModuleAbi,
          functionName: 'autoEarn',
          args: [tokenAddress, amount, safeAddress],
          account, // For simulation, account can also be the relayer to check permissions if needed
        });

        const txHash = await walletClient.writeContract(request);

        console.log(
          `Auto-earn triggered for ${amount.toString()} of ${tokenAddress} to Safe ${safeAddress}. Tx hash: ${txHash}`,
        );

        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });

        if (receipt.status !== 'success') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Transaction ${txHash} failed or was reverted. Status: ${receipt.status}`,
          });
        }
        
        console.log(`Transaction ${txHash} confirmed. Status: ${receipt.status}. Fetching vault and parsing logs...`);

        // 1. Get configHash for the safe
        const configHash = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
          functionName: 'accountConfig',
          args: [safeAddress],
        });

        if (configHash === 0n) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Safe ${safeAddress} does not have a valid earn module config hash set. Module might not be fully initialized.`,
            });
        }
        console.log(`Config hash for safe ${safeAddress}: ${configHash}`);

        // 2. Get actual token address to use (handle NATIVE_TOKEN case)
        let effectiveTokenAddress = tokenAddress;
        if (tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'.toLowerCase()) {
            effectiveTokenAddress = await publicClient.readContract({
                address: AUTO_EARN_MODULE_ADDRESS,
                abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
                functionName: 'wrappedNative',
                args: [],
            });
            console.log(`Native token detected, using wrapped native: ${effectiveTokenAddress}`);
        }


        // 3. Get vaultAddress for the token and current chainId from the module's config
        const vaultAddress = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
          functionName: 'config',
          args: [configHash, currentChainId, effectiveTokenAddress],
        });

        if (!vaultAddress || vaultAddress === '0x0000000000000000000000000000000000000000') {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: `Could not find vault address for token ${effectiveTokenAddress} (original: ${tokenAddress}) with config hash ${configHash} on chain ${currentChainId}.`,
            });
        }
        console.log(`Vault address for token ${effectiveTokenAddress} on chain ${currentChainId} with hash ${configHash}: ${vaultAddress}`);
        
        // 4. Parse logs to find Deposit event from the determined vaultAddress
        let sharesReceived = 0n;
        let foundDepositEvent = false;

        for (const log of receipt.logs) {
          if (log.address.toLowerCase() === vaultAddress.toLowerCase()) {
            try {
              const decodedEvent = decodeEventLog({
                abi: ERC4626_VAULT_ABI, // Specifically use the vault's ABI for its events
                data: log.data,
                topics: log.topics,
              });

              if (decodedEvent.eventName === 'Deposit') {
                const { caller, owner, assets: depositedAssets, shares } = decodedEvent.args as {
                  caller: Address;
                  owner: Address;
                  assets: bigint;
                  shares: bigint;
                };
                // Ensure the deposit was for the correct safe and amount.
                // The module executes `deposit(amountToSave, safe)` so `owner` should be `safeAddress`.
                // `caller` will be the module itself.
                if (owner.toLowerCase() === safeAddress.toLowerCase() && depositedAssets === amount) {
                  sharesReceived = shares;
                  foundDepositEvent = true;
                  console.log(`Deposit event found for vault ${vaultAddress}: owner ${owner}, assets ${depositedAssets}, shares ${sharesReceived}`);
                  break; 
                }
              }
            } catch (e) {
              // Not a Deposit event or not decodable with this ABI, ignore
              // console.warn('Could not decode log or not a target Deposit event:', e);
            }
          }
        }

        if (!foundDepositEvent) {
          // Fallback: If logs didn't yield shares, or if Deposit event structure is different.
          // This part is tricky as direct share calculation post-tx without event isn't standard.
          // For now, we'll rely on the event. If this fails, we should log an error.
          console.error(`Could not find or verify Deposit event for tx ${txHash} from vault ${vaultAddress} for safe ${safeAddress} and amount ${amount}. Shares received will be 0.`);
           throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to parse Deposit event from vault ${vaultAddress} for tx ${txHash}. Cannot determine shares received.`,
          });
        }

        // 5. Get the current auto-earn percentage for this safe
        const autoEarnConfig = await db.query.autoEarnConfigs.findFirst({
          where: (tbl, { and, eq }) =>
            and(
              eq(tbl.userDid, privyDid),
              eq(tbl.safeAddress, safeAddress as `0x${string}`),
            ),
        });
        const depositPercentage = autoEarnConfig?.pct || null;

        // 6. Record the deposit in the database with the percentage used
        await db.insert(earnDeposits).values({
          id: crypto.randomUUID(),
          userDid: privyDid,
          safeAddress: safeAddress,
          vaultAddress: vaultAddress,
          tokenAddress: effectiveTokenAddress, 
          assetsDeposited: amount,
          sharesReceived: sharesReceived,
          txHash: txHash,
          timestamp: new Date(),
          depositPercentage: depositPercentage, // Store the percentage used at deposit time
        });
        console.log(`Deposit recorded in DB for tx ${txHash} with percentage ${depositPercentage}.`);

        return { success: true, txHash, sharesReceived: sharesReceived.toString() };
      } catch (error: any) {
        console.error('Failed to trigger auto-earn:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to trigger auto-earn: ${error.shortMessage || error.message || 'Unknown error'}`,
        });
      }
    }),

  isSafeModuleActivelyEnabled: protectedProcedure
    .input(z.object({ 
      safeAddress: z.string().length(42).transform(val => getAddress(val)),
      moduleAddress: z.string().length(42).transform(val => getAddress(val)),
    }))
    .query(async ({ input }) => {
      const { safeAddress, moduleAddress } = input;
      try {
        const isEnabled = await publicClient.readContract({
          address: safeAddress,
          abi: SAFE_IS_MODULE_ENABLED_ABI,
          functionName: 'isModuleEnabled',
          args: [moduleAddress],
        });
        return { isEnabled };
      } catch (error: any) {
        console.error(`Failed to check if module ${moduleAddress} is enabled for safe ${safeAddress}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to query module status on-chain: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  getEarnModuleOnChainInitializationStatus: protectedProcedure
    .input(z.object({
      safeAddress: z.string().length(42).transform(val => getAddress(val)),
      // moduleAddress is implicitly AUTO_EARN_MODULE_ADDRESS for this specific check
    }))
    .query(async ({ input }) => {
      const { safeAddress } = input;
      console.log('on chain initialization status check for safe', safeAddress);
      if (!AUTO_EARN_MODULE_ADDRESS) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Auto-earn module address not configured on the server.',
        });
      }
      // log more info about the public client
      console.log('public client', publicClient);
      console.log('chain', publicClient.chain);
      try {
        console.log('reading contract');
        const isInitializedResult = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS, // Calling the Earn Module contract
          abi: EARN_MODULE_IS_INITIALIZED_ABI,
          functionName: 'isInitialized',
          args: [safeAddress], // Checking for the specific Safe
        });
        console.log('isInitializedResult', isInitializedResult);
        return { isInitializedOnChain: isInitializedResult };
      } catch (error: any) {
        console.error(`Failed to check if earn module is initialized for safe ${safeAddress} on module ${AUTO_EARN_MODULE_ADDRESS}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to query earn module initialization status on-chain: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  // New 'stats' query
  stats: protectedProcedure
    .input(z.object({ 
        safeAddress: z.string().length(42).transform(val => getAddress(val)),
    }))
    .query(async ({ ctx, input }) => {
      const { safeAddress } = input;
      const privyDid = ctx.userId;

      if (!privyDid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated.',
        });
      }

      // Verify the safe belongs to the user
      const safeUserLink = await db.query.userSafes.findFirst({
        where: (safes, { and, eq }) =>
          and(
            eq(safes.userDid, privyDid),
            eq(safes.safeAddress, safeAddress as `0x${string}`),
          ),
      });

      if (!safeUserLink) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Safe not found for the current user.',
        });
      }

      const deposits = await db.query.earnDeposits.findMany({
        where: (earnDepositsTable, { eq }) => eq(earnDepositsTable.safeAddress, safeAddress),
      });

      console.log('deposits', deposits);

      if (!deposits.length) {
        return []; // No deposits yet for this safe
      }

      // Group deposits by vault
      const byVault: Record<
        string,
        { principal: bigint; shares: bigint; tokenAddress: Address; tokenDecimals: number }
      > = {};

      for (const dep of deposits) {
        const key = dep.vaultAddress.toLowerCase();
        if (!byVault[key]) {
          let underlyingAssetAddress = dep.tokenAddress as Address;
          let tokenDecimals = 6;
          try {
            underlyingAssetAddress = await publicClient.readContract({
              address: dep.vaultAddress as Address,
              abi: ERC4626_VAULT_ABI,
              functionName: 'asset',
            });
            tokenDecimals = await publicClient.readContract({
              address: underlyingAssetAddress,
              abi: ERC4626_VAULT_ABI,
              functionName: 'decimals',
            });
          } catch (e) {
            console.warn(
              `Could not fetch decimals for asset ${underlyingAssetAddress} of vault ${dep.vaultAddress}. Defaulting to ${tokenDecimals}. Error: ${e}`,
            );
          }

          byVault[key] = {
            principal: 0n,
            shares: 0n,
            tokenAddress: underlyingAssetAddress,
            tokenDecimals: tokenDecimals,
          };
        }
        byVault[key].principal += dep.assetsDeposited;
        byVault[key].shares += dep.sharesReceived;
      }

      console.log('byVault', byVault);
      const statsPromises = Object.entries(byVault).map(
        async ([vaultAddressStr, data]) => {
          const vaultAddress = vaultAddressStr as Address;
          
          // Try to get APY
          let supplyApyPct = 0;
          try {
            const supplyApyRay = await publicClient.readContract({
              address: vaultAddress,
              abi: VAULT_SUPPLY_APY_ABI,
              functionName: 'supplyAPY',
            });
            supplyApyPct = Number(supplyApyRay) / 1e25; // Convert from ray (1e27) to percentage
          } catch (e) {
            console.warn(
              `Could not fetch supplyAPY for vault ${vaultAddress}. Defaulting to 0%. Error: ${e}`,
            );
          }

          // If shares are 0 in the database (due to failed event parsing), 
          // try to get the actual balance from the vault
          let actualShares = data.shares;
          if (actualShares === 0n && data.principal > 0n) {
            try {
              actualShares = await publicClient.readContract({
                address: vaultAddress,
                abi: ERC4626_VAULT_ABI_FOR_INFO,
                functionName: 'balanceOf',
                args: [safeAddress],
              });
              console.log(`Fetched actual shares from vault for ${safeAddress}: ${actualShares}`);
            } catch (e) {
              console.warn(`Could not fetch actual shares from vault: ${e}`);
            }
          }

          if (actualShares === 0n) {
            return {
              vaultAddress: vaultAddress,
              tokenAddress: data.tokenAddress,
              tokenDecimals: data.tokenDecimals,
              principal: data.principal,
              currentAssets: 0n,
              yield: -data.principal,
              supplyApy: supplyApyPct,
            };
          }
          try {
            const currentAssets = await publicClient.readContract({
              address: vaultAddress,
              abi: ERC4626_VAULT_ABI,
              functionName: 'convertToAssets',
              args: [actualShares],
            });
            return {
              vaultAddress: vaultAddress,
              tokenAddress: data.tokenAddress,
              tokenDecimals: data.tokenDecimals,
              principal: data.principal,
              currentAssets: currentAssets,
              yield: currentAssets - data.principal,
              supplyApy: supplyApyPct,
            };
          } catch (error: any) {
            console.error(
              `Failed to get current assets for vault ${vaultAddress} with shares ${actualShares}:`,
              error,
            );
            return {
              vaultAddress: vaultAddress,
              tokenAddress: data.tokenAddress,
              tokenDecimals: data.tokenDecimals,
              principal: data.principal,
              currentAssets: 0n,
              yield: -data.principal,
              supplyApy: supplyApyPct,
            };
          }
        },
      );

      const results = await Promise.all(statsPromises);
      return results;
    }),

  apy: protectedProcedure
    .input(z.object({
      safeAddress: z.string().length(42).transform(val => getAddress(val)),
    }))
    .query(async ({ ctx, input }) => {
      const { safeAddress } = input;
      const privyDid = ctx.userId;
      const USDC_BASE_ADDRESS = USDC_ADDRESS as Address;
      const currentChainId = BigInt(base.id);

      if (!privyDid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated for APY calculation.',
        });
      }

      if (!AUTO_EARN_MODULE_ADDRESS) {
        console.error('AUTO_EARN_MODULE_ADDRESS is not set. Cannot fetch APY.');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Earn module configuration error on server.',
        });
      }

      let supplyApyPct: number | null = null;

      try {
        // 1. Get configHash for the safe
        const configHash = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
          functionName: 'accountConfig',
          args: [safeAddress],
        });

        if (configHash === 0n) {
          console.warn(`No configHash found for safe ${safeAddress}. Module might not be installed or configured for this safe.`);
          return { apy: null };
        }

        // 2. Get vaultAddress for USDC on the current chain using the configHash
        const vaultAddress = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
          functionName: 'config',
          args: [configHash, currentChainId, USDC_BASE_ADDRESS],
        });

        console.log('vaultAddress for APY lookup:', vaultAddress);

        if (!vaultAddress || vaultAddress === '0x0000000000000000000000000000000000000000') {
          console.warn(`No vault address configured for USDC token (${USDC_BASE_ADDRESS}) with config hash ${configHash} on chain ${currentChainId} for safe ${safeAddress}.`);
          return { apy: null };
        }
        
        console.log(`Target vault for APY for safe ${safeAddress} is ${vaultAddress}`);

        // Morpho GraphQL API is the primary method
        try {
          const response = await fetch('https://blue-api.morpho.org/graphql', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              query: `
                  query ($address: String!, $chainId: Int!) {
                    vaultByAddress(address: $address, chainId: $chainId) {
                      address
                      state {
                        apy
                      }
                    }
                  }`,
              variables: { address: vaultAddress.toLowerCase(), chainId: base.id }
            }),
          });
          if (!response.ok) {
            throw new Error(`GraphQL API request failed with status ${response.status}`);
          }
          const result = await response.json();
          if (result.errors) {
            console.error('Morpho GraphQL API errors:', result.errors);
            throw new Error(`GraphQL API returned errors: ${JSON.stringify(result.errors)}`);
          }

          if (result.data?.vaultByAddress?.state?.apy !== undefined) {
            supplyApyPct = Number(result.data.vaultByAddress.state.apy);
          } else {
            console.warn(`APY missing from GraphQL response for vault ${vaultAddress}.`);
            supplyApyPct = null;
          }
        } catch (graphQlError: any) {
          console.error(`Morpho GraphQL API call failed for vault ${vaultAddress} in apy resolver: ${graphQlError.message}`);
          supplyApyPct = null; // Ensure APY is null if GraphQL also fails
        }
        
        return { apy: supplyApyPct !== null ? Number(supplyApyPct) * 100 : null };

      } catch (error: any) {
        console.error(`Failed to fetch APY for safe ${safeAddress}:`, error);
        // Log more specific errors if possible
        if (error.message?.includes('configHash')) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Failed to retrieve module config hash for safe: ${error.message}` });
        }
        if (error.message?.includes('vaultAddress')) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Failed to retrieve vault address from module config: ${error.message}` });
        }
        // The specific supplyAPY error is now handled inside the inner try-catch
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An unexpected error occurred while fetching APY: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  /**
   * Get vault information for a Safe
   */
  getVaultInfo: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address format',
          })
          .transform((val) => getAddress(val)),
        vaultAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid vault address format',
          })
          .transform((val) => getAddress(val)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress, vaultAddress } = input;

      // Verify Safe belongs to user
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });

      if (!safeRecord) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Safe not found or not owned by user',
        });
      }

      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL),
      });

      try {
        // Get vault balances
        const [shares, assetAddress] = await Promise.all([
          publicClient.readContract({
            address: vaultAddress,
            abi: parseAbi(['function balanceOf(address owner) external view returns (uint256)']),
            functionName: 'balanceOf',
            args: [safeAddress],
          }),
          publicClient.readContract({
            address: vaultAddress,
            abi: parseAbi(['function asset() external view returns (address)']),
            functionName: 'asset',
            args: [],
          }),
        ]);

        // Convert shares to assets
        const assets = await publicClient.readContract({
          address: vaultAddress,
          abi: parseAbi(['function convertToAssets(uint256 shares) external view returns (uint256)']),
          functionName: 'convertToAssets',
          args: [shares],
        });

        // Get asset decimals
        const decimals = await publicClient.readContract({
          address: assetAddress,
          abi: parseAbi(['function decimals() external view returns (uint8)']),
          functionName: 'decimals',
          args: [],
        });

        return {
          shares: shares.toString(),
          assets: assets.toString(),
          decimals: Number(decimals),
          assetAddress: assetAddress,
        };
      } catch (error) {
        ctx.log.error({ error }, 'Error fetching vault info');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch vault information',
        });
      }
    }),

  /**
   * Check token allowance for a spender
   */
  checkAllowance: protectedProcedure
    .input(
      z.object({
        tokenAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid token address format',
          })
          .transform((val) => getAddress(val)),
        ownerAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid owner address format',
          })
          .transform((val) => getAddress(val)),
        spenderAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid spender address format',
          })
          .transform((val) => getAddress(val)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { tokenAddress, ownerAddress, spenderAddress } = input;

      // Verify Safe belongs to user
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, ownerAddress as `0x${string}`)),
      });

      if (!safeRecord) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Safe not found or not owned by user',
        });
      }

      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL),
      });

      try {
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: parseAbi(['function allowance(address owner, address spender) external view returns (uint256)']),
          functionName: 'allowance',
          args: [ownerAddress, spenderAddress],
        });

        return {
          allowance: allowance.toString(),
        };
      } catch (error) {
        ctx.log.error({ error }, 'Error checking allowance');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check allowance',
        });
      }
    }),

  // --- AUTO-EARN CONFIG MANAGEMENT --------------------------------------------------

  /**
   * Fetch the auto-earn configuration for a given Safe.
   * Returns { pct, lastTrigger } or pct = 0 if not configured.
   */
  getAutoEarnConfig: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address format',
          })
          .transform((val) => getAddress(val)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress } = input;

      // Verify Safe belongs to user
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      const config = await db.query.autoEarnConfigs.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });

      return {
        pct: config?.pct ?? 0,
        lastTrigger: config?.lastTrigger ?? null,
      };
    }),

  /**
   * Upsert auto-earn percentage (whole integers 1-100).
   */
  setAutoEarnPct: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address',
          })
          .transform((val) => getAddress(val)),
        pct: z.number().int().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress, pct } = input;

      // verify safe ownership
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      // Check if earn module is initialized on-chain before enabling
      if (AUTO_EARN_MODULE_ADDRESS) {
        const isModuleInitializedOnChain = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: EARN_MODULE_IS_INITIALIZED_ABI,
          functionName: 'isInitialized',
          args: [safeAddress],
        });
        if (!isModuleInitializedOnChain) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Earn module is not yet initialized on-chain for this Safe. Please complete the on-chain installation step first.',
          });
        }
      }

      // upsert auto-earn config
      await db
        .insert(autoEarnConfigs)
        .values({ userDid: userId, safeAddress: safeAddress as `0x${string}`, pct })
        .onConflictDoUpdate({
          target: [autoEarnConfigs.userDid, autoEarnConfigs.safeAddress],
          set: { pct },
        });

      // Enable the earn module flag so the worker will process this Safe
      await db
        .update(userSafes)
        .set({ isEarnModuleEnabled: true })
        .where(eq(userSafes.id, safeRecord.id));

      return { success: true };
    }),

  /**
   * Disable auto-earn rule for a Safe (delete config row).
   */
  disableAutoEarn: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address',
          })
          .transform((val) => getAddress(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress } = input;

      // verify safe ownership
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      // Delete the auto-earn config
      await db
        .delete(autoEarnConfigs)
        .where(
          and(
            eq(autoEarnConfigs.userDid, userId),
            eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
          ),
        );

      // Disable the earn module flag so the worker will skip this Safe
      await db
        .update(userSafes)
        .set({ isEarnModuleEnabled: false })
        .where(eq(userSafes.id, safeRecord.id));

      return { success: true };
    }),

  // ---------------- Legacy UI compatibility helpers -----------------
  /**
   * getState – lightweight summary used by FE settings page
   */
  getState: protectedProcedure
    .input(z.object({ safeAddress: z.string().length(42).transform(v=>getAddress(v)) }))
    .query(async ({ ctx, input }) => {
      const userDid = ctx.userId;
      if (!userDid) throw new TRPCError({code:'UNAUTHORIZED'});

      const safe = await db.query.userSafes.findFirst({ where:(t,{and,eq})=>and(eq(t.userDid,userDid), eq(t.safeAddress, input.safeAddress as `0x${string}`)) });
      if (!safe) throw new TRPCError({code:'NOT_FOUND', message:'Safe not found'});

      const cfg = await db.query.autoEarnConfigs.findFirst({ where:(t,{and,eq})=>and(eq(t.userDid,userDid), eq(t.safeAddress,input.safeAddress as `0x${string}`)) });
      return {
        enabled: safe.isEarnModuleEnabled,
        allocation: cfg?.pct ?? 0,
      };
    }),

  /**
   * Get recent earn deposits for a Safe
   */
  getRecentEarnDeposits: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address format',
          })
          .transform((val) => getAddress(val)),
        limit: z.number().int().min(1).max(50).optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress, limit } = input;

      // Verify Safe belongs to user
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      // Fetch recent earn deposits
      const deposits = await db.query.earnDeposits.findMany({
        where: (tbl, { eq }) => eq(tbl.safeAddress, safeAddress as `0x${string}`),
        orderBy: (tbl, { desc }) => [desc(tbl.timestamp)],
        limit,
      });

      // Transform to match VaultTransaction interface
      // Note: For display purposes, we need to calculate the original deposit amount
      // The assetsDeposited is the amount that was saved (after percentage calculation)
      return deposits.map(deposit => {
        // Convert from smallest unit to decimal (USDC has 6 decimals)
        const savedAmountInDecimals = Number(deposit.assetsDeposited) / 1e6;
        
        // Use the percentage stored at the time of deposit, or default to 10% for historical deposits
        const percentage = deposit.depositPercentage || 10;
        const originalDepositAmount = percentage > 0 ? (savedAmountInDecimals * 100) / percentage : savedAmountInDecimals;
        
        return {
          id: deposit.id,
          type: 'deposit' as const,
          amount: originalDepositAmount, // The original deposit amount in decimal format
          skimmedAmount: savedAmountInDecimals, // The amount that was actually saved in decimal format
          timestamp: deposit.timestamp.getTime(),
          txHash: deposit.txHash,
          source: 'Bank Deposit', // More user-friendly than "Auto-Earn Sweep"
          // Additional fields that might be useful
          vaultAddress: deposit.vaultAddress,
          sharesReceived: deposit.sharesReceived.toString(),
        };
      });
    }),

  /**
   * Get recent earn withdrawals for a Safe
   */
  getRecentEarnWithdrawals: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Safe address format',
          })
          .transform((val) => getAddress(val)),
        limit: z.number().int().min(1).max(50).optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress, limit } = input;

      // Verify Safe belongs to user
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      // Fetch recent earn withdrawals
      const withdrawals = await db.query.earnWithdrawals.findMany({
        where: (tbl, { eq }) => eq(tbl.safeAddress, safeAddress as `0x${string}`),
        orderBy: (tbl, { desc }) => [desc(tbl.timestamp)],
        limit,
      });

      // Transform to match VaultTransaction interface
      return withdrawals.map(withdrawal => {
        // Convert from smallest unit to decimal (USDC has 6 decimals)
        const withdrawnAmountInDecimals = Number(withdrawal.assetsWithdrawn) / 1e6;
        
        return {
          id: withdrawal.id,
          type: 'withdrawal' as const,
          amount: withdrawnAmountInDecimals, // The amount withdrawn in decimal format
          timestamp: withdrawal.timestamp.getTime(),
          txHash: withdrawal.txHash,
          status: withdrawal.status,
          userOpHash: withdrawal.userOpHash,
          // Additional fields that might be useful
          vaultAddress: withdrawal.vaultAddress,
          sharesBurned: withdrawal.sharesBurned.toString(),
        };
      });
    }),

  /**
   * Record a withdrawal transaction
   */
  recordWithdrawal: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val)).transform(val => getAddress(val)),
        vaultAddress: z.string().refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val)).transform(val => getAddress(val)),
        tokenAddress: z.string().refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val)).transform(val => getAddress(val)),
        assetsWithdrawn: z.string().refine((val) => /^\d+$/.test(val)).transform((val) => BigInt(val)),
        sharesBurned: z.string().refine((val) => /^\d+$/.test(val)).transform((val) => BigInt(val)),
        userOpHash: z.string().optional(),
        txHash: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress, vaultAddress, tokenAddress, assetsWithdrawn, sharesBurned, userOpHash, txHash } = input;

      // Verify Safe belongs to user
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      // For now, use userOpHash as txHash if no txHash provided (AA transactions)
      const finalTxHash = txHash || userOpHash || `pending-${Date.now()}`;

      // Record the withdrawal
      await db.insert(earnWithdrawals).values({
        id: crypto.randomUUID(),
        userDid: userId,
        safeAddress: safeAddress,
        vaultAddress: vaultAddress,
        tokenAddress: tokenAddress,
        assetsWithdrawn: assetsWithdrawn,
        sharesBurned: sharesBurned,
        txHash: finalTxHash,
        userOpHash: userOpHash,
        timestamp: new Date(),
        status: userOpHash ? 'pending' : 'completed', // If we have userOpHash, it's still pending
      });

      return { success: true };
    }),

  /**
   * setAllocation – pass-through to setAutoEarnPct (for existing UI call site)
   */
  setAllocation: protectedProcedure
    .input(z.object({ safeAddress: z.string().length(42).transform(v=>getAddress(v)), percentage: z.number().int().min(0).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { safeAddress, percentage } = input;

      // verify safe ownership
      const safeRecord = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) =>
          and(eq(tbl.userDid, userId), eq(tbl.safeAddress, safeAddress as `0x${string}`)),
      });
      if (!safeRecord) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Safe not found for user' });
      }

      if (percentage === 0) {
        // Disable auto-earn: delete config and disable module flag
        await db
          .delete(autoEarnConfigs)
          .where(
            and(
              eq(autoEarnConfigs.userDid, userId),
              eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
            ),
          );

        await db
          .update(userSafes)
          .set({ isEarnModuleEnabled: false })
          .where(eq(userSafes.id, safeRecord.id));
      } else {
        // Enable auto-earn: check module initialization, set config, and enable module flag
        if (AUTO_EARN_MODULE_ADDRESS) {
          const isModuleInitializedOnChain = await publicClient.readContract({
            address: AUTO_EARN_MODULE_ADDRESS,
            abi: EARN_MODULE_IS_INITIALIZED_ABI,
            functionName: 'isInitialized',
            args: [safeAddress],
          });
          if (!isModuleInitializedOnChain) {
            throw new TRPCError({
              code: 'PRECONDITION_FAILED',
              message: 'Earn module is not yet initialized on-chain for this Safe. Please complete the on-chain installation step first.',
            });
          }
        }

        await db
          .insert(autoEarnConfigs)
          .values({ userDid: userId, safeAddress: safeAddress as `0x${string}`, pct: percentage })
          .onConflictDoUpdate({
            target: [autoEarnConfigs.userDid, autoEarnConfigs.safeAddress],
            set: { pct: percentage },
          });

        await db
          .update(userSafes)
          .set({ isEarnModuleEnabled: true })
          .where(eq(userSafes.id, safeRecord.id));
      }

      return { success: true };
    }),
});
