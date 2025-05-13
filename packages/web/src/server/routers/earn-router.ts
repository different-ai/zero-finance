import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { userSafes, earnDeposits, autoEarnConfigs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
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

        // 5. Record the deposit in the database
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
        });
        console.log(`Deposit recorded in DB for tx ${txHash}.`);

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

      const statsPromises = Object.entries(byVault).map(
        async ([vaultAddressStr, data]) => {
          const vaultAddress = vaultAddressStr as Address;
          if (data.shares === 0n) {
            return {
              vaultAddress: vaultAddress,
              tokenAddress: data.tokenAddress,
              tokenDecimals: data.tokenDecimals,
              principal: data.principal,
              currentAssets: 0n,
              yield: -data.principal,
            };
          }
          try {
            const currentAssets = await publicClient.readContract({
              address: vaultAddress,
              abi: ERC4626_VAULT_ABI,
              functionName: 'convertToAssets',
              args: [data.shares],
            });
            return {
              vaultAddress: vaultAddress,
              tokenAddress: data.tokenAddress,
              tokenDecimals: data.tokenDecimals,
              principal: data.principal,
              currentAssets: currentAssets,
              yield: currentAssets - data.principal,
            };
          } catch (error: any) {
            console.error(
              `Failed to get current assets for vault ${vaultAddress} with shares ${data.shares}:`,
              error,
            );
            return {
              vaultAddress: vaultAddress,
              tokenAddress: data.tokenAddress,
              tokenDecimals: data.tokenDecimals,
              principal: data.principal,
              currentAssets: 0n,
              yield: -data.principal,
            };
          }
        },
      );

      const results = await Promise.all(statsPromises);
      return results;
    }),

  getVaultInfo: protectedProcedure
    .input(z.object({
      safeAddress: z.string().refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
        message: 'Invalid safe address format',
      }).transform(val => getAddress(val)),
      vaultAddress: z.string().refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
        message: 'Invalid vault address format',
      }).transform(val => getAddress(val)),
    }))
    .query(async ({ ctx, input }) => {
      const { safeAddress, vaultAddress } = input;
      const privyDid = ctx.userId;

      if (!privyDid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated for fetching vault info.',
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

      try {
        // Get shares balance
        const shares = await publicClient.readContract({
          address: vaultAddress,
          abi: ERC4626_VAULT_ABI_FOR_INFO,
          functionName: 'balanceOf',
          args: [safeAddress],
        });

        // Get underlying assets for these shares
        const assets = await publicClient.readContract({
          address: vaultAddress,
          abi: ERC4626_VAULT_ABI_FOR_INFO,
          functionName: 'convertToAssets',
          args: [shares],
        });

        // Get underlying asset address
        const assetAddress = await publicClient.readContract({
          address: vaultAddress,
          abi: ERC4626_VAULT_ABI_FOR_INFO,
          functionName: 'asset',
        });

        // CRITICAL FIX: Get the decimals of the UNDERLYING ASSET (e.g., USDC = 6 decimals)
        // instead of the vault's share decimals (which is usually 18)
        const assetDecimals = await publicClient.readContract({
          address: assetAddress,
          abi: parseAbi(['function decimals() view returns (uint8)']),
          functionName: 'decimals',
        });

        return {
          shares: shares.toString(),
          assets: assets.toString(),
          decimals: Number(assetDecimals), // Use asset decimals (e.g., 6 for USDC) not vault decimals
          assetAddress,
        };
      } catch (error: any) {
        console.error('Failed to fetch vault info:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch vault information: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  // ------------------------ AUTO EARN CONFIG PROCEDURES --------------------

  setAutoEarnPct: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
        pct: z.number().int().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { safeAddress, pct } = input;
      const userDid = ctx.userId;

      if (!userDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated.' });
      }

      try {
        await db
          .insert(autoEarnConfigs)
          .values({ userDid, safeAddress, pct })
          .onConflictDoUpdate({
            target: [autoEarnConfigs.userDid, autoEarnConfigs.safeAddress],
            set: { pct },
          });

        return { success: true };
      } catch (error: any) {
        console.error('Failed to set auto-earn pct:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to save auto-earn settings: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  getAutoEarnConfig: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { safeAddress } = input;
      const userDid = ctx.userId;

      if (!userDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated.' });
      }

      try {
        const cfg = await db.query.autoEarnConfigs.findFirst({
          where: (t, { and, eq }) =>
            and(eq(t.userDid, userDid), eq(t.safeAddress, safeAddress as `0x${string}`)),
        });

        return { pct: cfg?.pct ?? 0 };
      } catch (error: any) {
        console.error('Failed to fetch auto-earn config:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch auto-earn configuration: ${error.message || 'Unknown error'}`,
        });
      }
    }),
});
