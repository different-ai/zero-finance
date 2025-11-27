import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import {
  userSafes,
  earnDeposits,
  earnWithdrawals,
  autoEarnConfigs,
} from '@/db/schema';
import type { UserSafe } from '@/db/schema';
import { eq, and, or, isNull, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { USDC_ADDRESS } from '@/lib/constants';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import {
  BASE_USDC_VAULTS,
  ALL_BASE_VAULTS,
  BASE_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
} from '../earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '../earn/cross-chain-vaults';
import {
  getVaultApyBasisPoints,
  resolveVaultDecimals,
} from '../earn/vault-apy-service';
import {
  createWalletClient,
  http,
  parseAbi,
  Hex,
  getAddress,
  createPublicClient,
  decodeEventLog,
  formatUnits,
  parseUnits,
  type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base, mainnet, arbitrum } from 'viem/chains';
import crypto from 'crypto';

// Multi-chain imports
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
  getUSDCAddress,
} from '@/lib/constants/chains';
import {
  getUserSafes as getMultiChainUserSafes,
  getSafeOnChain,
  getSafeDeploymentTransaction,
  createSafeRecord,
} from '../earn/multi-chain-safe-manager';
import {
  getBridgeQuoteForVault,
  encodeBridgeWithVaultDeposit,
  encodeBridgeTransfer,
  trackBridgeDeposit,
} from '../earn/across-bridge-service';
import {
  createBridgeTransaction,
  updateBridgeStatus,
  updateBridgeDepositHash,
  getUserBridgeTransactions,
  getPendingBridgeTransactions,
} from '../earn/bridge-transaction-crud';
import { predictSafeAddress } from '@/lib/safe-multi-chain';
import { getRPCManager } from '@/lib/multi-chain-rpc';
import { hasMultiChainFeature } from '@/lib/workspace-features';

type EarningsEventPayload = {
  id: string;
  type: 'deposit' | 'withdrawal';
  timestamp: string;
  amount: string;
  shares?: string;
  vaultAddress: string;
  apy: number;
  decimals: number;
};

type EarningsEventsCacheEntry = {
  data: EarningsEventPayload[];
  expiresAt: number;
};

const earningsEventsCache = new Map<string, EarningsEventsCacheEntry>();
const EARNINGS_EVENTS_CACHE_TTL_MS = 5 * 60 * 1000;

const AUTO_EARN_MODULE_ADDRESS = process.env.AUTO_EARN_MODULE_ADDRESS as
  | Hex
  | undefined;
const RELAYER_PK = process.env.RELAYER_PK as Hex | undefined;
const BASE_RPC_URL = getBaseRpcUrl();

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

let ethereumPublicClient: ReturnType<typeof createPublicClient> | null = null;

const toLowerAddress = (value: string) => value.toLowerCase();

function getVaultConfig(vaultAddress: string) {
  // First check all Base vaults (USDC + ETH)
  const baseVault = ALL_BASE_VAULTS.find(
    (vault) => toLowerAddress(vault.address) === toLowerAddress(vaultAddress),
  );
  if (baseVault) return baseVault;

  // Then check cross-chain vaults (includes Base + Arbitrum)
  const crossChainVault = ALL_CROSS_CHAIN_VAULTS.find(
    (vault) => toLowerAddress(vault.address) === toLowerAddress(vaultAddress),
  );
  if (crossChainVault) return crossChainVault;

  // Fall back to legacy Base USDC vaults for backwards compatibility
  return BASE_USDC_VAULTS.find(
    (vault) => toLowerAddress(vault.address) === toLowerAddress(vaultAddress),
  );
}

function getChainIdForVault(vaultAddress: string) {
  return getVaultConfig(vaultAddress)?.chainId ?? BASE_CHAIN_ID;
}

// Helper to get asset config from vault (handles type differences)
function getVaultAssetConfig(vaultAddress: string): {
  decimals: number;
  isNative: boolean;
} {
  const vaultConfig = getVaultConfig(vaultAddress);
  if (vaultConfig && 'asset' in vaultConfig) {
    const asset = (
      vaultConfig as { asset?: { decimals?: number; isNative?: boolean } }
    ).asset;
    return {
      decimals: asset?.decimals ?? 6,
      isNative: asset?.isNative ?? false,
    };
  }
  return { decimals: 6, isNative: false };
}

// Cached ETH price (refreshes every 5 minutes)
let cachedEthPrice: { price: number; timestamp: number } | null = null;
const ETH_PRICE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getEthPriceUsd(): Promise<number> {
  const now = Date.now();

  // Return cached price if still valid
  if (cachedEthPrice && now - cachedEthPrice.timestamp < ETH_PRICE_CACHE_TTL) {
    return cachedEthPrice.price;
  }

  try {
    // Use CoinGecko simple price API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    );

    if (response.ok) {
      const data = await response.json();
      const price = data.ethereum?.usd ?? 3000;
      cachedEthPrice = { price, timestamp: now };
      return price;
    }
  } catch (e) {
    console.warn('Failed to fetch ETH price from CoinGecko:', e);
  }

  // Fallback to cached price or default
  return cachedEthPrice?.price ?? 3000;
}

// Arbitrum public client singleton
let arbitrumPublicClient: ReturnType<typeof createPublicClient> | null = null;

function getPublicClientForChain(chainId: number) {
  if (chainId === BASE_CHAIN_ID) {
    return publicClient;
  }

  if (chainId === ETHEREUM_CHAIN_ID) {
    if (!ethereumPublicClient) {
      const rpcUrl =
        process.env.ETHEREUM_RPC_URL ??
        process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;

      if (!rpcUrl) {
        throw new Error(
          'Missing RPC URL for Ethereum vaults. Set ETHEREUM_RPC_URL or NEXT_PUBLIC_ETHEREUM_RPC_URL.',
        );
      }

      ethereumPublicClient = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
      });
    }

    return ethereumPublicClient;
  }

  if (chainId === SUPPORTED_CHAINS.ARBITRUM) {
    if (!arbitrumPublicClient) {
      const rpcUrl =
        process.env.ARBITRUM_RPC_URL ??
        process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ??
        'https://arb1.arbitrum.io/rpc';

      arbitrumPublicClient = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
      });
    }

    return arbitrumPublicClient;
  }

  throw new Error(`Unsupported chain id ${chainId} for public client`);
}

function getPublicClientForVault(vaultAddress: string) {
  const chainId = getChainIdForVault(vaultAddress);
  return getPublicClientForChain(chainId);
}

type SafeWithWorkspace = Omit<UserSafe, 'workspaceId'> & {
  workspaceId: string;
};

function requireWorkspaceId(workspaceId: string | null | undefined): string {
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is required for earn operations.',
    });
  }
  return workspaceId;
}

function requirePrivyDid(ctx: {
  user?: { id?: string | null };
  userId?: string | null;
}): string {
  const privyDid = ctx.user?.id ?? ctx.userId;
  if (!privyDid) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User context missing for earn operations.',
    });
  }
  return privyDid;
}

async function getSafeForWorkspace(
  ctx: {
    user?: { id?: string | null };
    userId?: string | null;
    workspaceId?: string | null;
  },
  safeAddress: string,
): Promise<SafeWithWorkspace> {
  const privyDid = requirePrivyDid(ctx);
  const workspaceId = requireWorkspaceId(ctx.workspaceId);
  const normalizedSafeAddress = getAddress(safeAddress);

  // First: Check if Safe exists in current workspace (regardless of owner)
  let safeRecord = await db.query.userSafes.findFirst({
    where: (tbl, helpers) =>
      helpers.and(
        helpers.eq(tbl.safeAddress, normalizedSafeAddress as `0x${string}`),
        helpers.eq(tbl.workspaceId, workspaceId),
      ),
  });

  // Second: Legacy safe without workspaceId owned by current user (backfill it)
  if (!safeRecord) {
    safeRecord = await db.query.userSafes.findFirst({
      where: (tbl, helpers) =>
        helpers.and(
          helpers.eq(tbl.userDid, privyDid),
          helpers.eq(tbl.safeAddress, normalizedSafeAddress as `0x${string}`),
          helpers.isNull(tbl.workspaceId),
        ),
    });

    if (safeRecord) {
      // Backfill the workspace ID for legacy safe
      await db
        .update(userSafes)
        .set({ workspaceId })
        .where(eq(userSafes.id, safeRecord.id));

      console.log(
        `Backfilled workspaceId ${workspaceId} for safe ${normalizedSafeAddress}`,
      );
    }
  }

  // Third: Safe exists in a different workspace that user has access to
  if (!safeRecord) {
    safeRecord = await db.query.userSafes.findFirst({
      where: (tbl, helpers) =>
        helpers.and(
          helpers.eq(tbl.userDid, privyDid),
          helpers.eq(tbl.safeAddress, normalizedSafeAddress as `0x${string}`),
        ),
    });

    if (safeRecord) {
      console.log(
        `Safe ${normalizedSafeAddress} found in different workspace (${safeRecord.workspaceId}), allowing cross-workspace access`,
      );
    }
  }

  if (!safeRecord) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Safe ${normalizedSafeAddress} not found in workspace ${workspaceId}. You may need to register this safe first.`,
    });
  }

  // Use the safe's actual workspaceId, or current context if null
  const effectiveWorkspaceId = safeRecord.workspaceId || workspaceId;
  return {
    ...safeRecord,
    workspaceId: effectiveWorkspaceId,
  } as SafeWithWorkspace;
}

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
  'function isModuleEnabled(address module) external view returns (bool)',
]);

const EARN_MODULE_IS_INITIALIZED_ABI = parseAbi([
  'function isInitialized(address smartAccount) public view returns (bool)',
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
  'function asset() external view returns (address)',
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

      const safe = await getSafeForWorkspace(ctx, safeAddress);

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
            message:
              'Earn module is not yet initialized on-chain for this Safe. Please complete the on-chain installation step.',
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
        .set({ isEarnModuleEnabled: true, workspaceId: safe.workspaceId })
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
      const safeUserLink = await getSafeForWorkspace(ctx, safeAddress);
      const workspaceId = safeUserLink.workspaceId;
      // Check DB flag first as a quick check
      if (!safeUserLink.isEarnModuleEnabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Auto-earn is not enabled (recorded in DB) for this Safe. Please use the "Enable Earn Module" steps first.',
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
          message:
            'Auto-earn module is not initialized on-chain for this Safe. Please complete the full installation process.',
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
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status !== 'success') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Transaction ${txHash} failed or was reverted. Status: ${receipt.status}`,
          });
        }

        console.log(
          `Transaction ${txHash} confirmed. Status: ${receipt.status}. Fetching vault and parsing logs...`,
        );

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
        if (
          tokenAddress.toLowerCase() ===
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'.toLowerCase()
        ) {
          effectiveTokenAddress = await publicClient.readContract({
            address: AUTO_EARN_MODULE_ADDRESS,
            abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
            functionName: 'wrappedNative',
            args: [],
          });
          console.log(
            `Native token detected, using wrapped native: ${effectiveTokenAddress}`,
          );
        }

        // 3. Get vaultAddress for the token and current chainId from the module's config
        const vaultAddress = await publicClient.readContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: FLUIDKEY_EARN_MODULE_VIEW_ABI,
          functionName: 'config',
          args: [configHash, currentChainId, effectiveTokenAddress],
        });

        if (
          !vaultAddress ||
          vaultAddress === '0x0000000000000000000000000000000000000000'
        ) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Could not find vault address for token ${effectiveTokenAddress} (original: ${tokenAddress}) with config hash ${configHash} on chain ${currentChainId}.`,
          });
        }
        console.log(
          `Vault address for token ${effectiveTokenAddress} on chain ${currentChainId} with hash ${configHash}: ${vaultAddress}`,
        );

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
                const {
                  owner,
                  assets: depositedAssets,
                  shares,
                } = decodedEvent.args as {
                  caller: Address;
                  owner: Address;
                  assets: bigint;
                  shares: bigint;
                };
                // Ensure the deposit was for the correct safe and amount.
                // The module executes `deposit(amountToSave, safe)` so `owner` should be `safeAddress`.
                // `caller` will be the module itself.
                if (
                  owner.toLowerCase() === safeAddress.toLowerCase() &&
                  depositedAssets === amount
                ) {
                  sharesReceived = shares;
                  foundDepositEvent = true;
                  console.log(
                    `Deposit event found for vault ${vaultAddress}: owner ${owner}, assets ${depositedAssets}, shares ${sharesReceived}`,
                  );
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
          console.error(
            `Could not find or verify Deposit event for tx ${txHash} from vault ${vaultAddress} for safe ${safeAddress} and amount ${amount}. Shares received will be 0.`,
          );
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to parse Deposit event from vault ${vaultAddress} for tx ${txHash}. Cannot determine shares received.`,
          });
        }

        // 5. Get the current auto-earn percentage for this safe
        const autoEarnConfig = await db.query.autoEarnConfigs.findFirst({
          where: (tbl, { and, eq, or, isNull }) =>
            and(
              eq(tbl.userDid, privyDid),
              eq(tbl.safeAddress, safeAddress as `0x${string}`),
              or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
            ),
        });
        if (autoEarnConfig && !autoEarnConfig.workspaceId) {
          await db
            .update(autoEarnConfigs)
            .set({ workspaceId })
            .where(
              and(
                eq(autoEarnConfigs.userDid, privyDid),
                eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
              ),
            );
        }
        const depositPercentage = autoEarnConfig?.pct || null;
        const { apyBasisPoints } = await getVaultApyBasisPoints(vaultAddress);
        const assetDecimals = resolveVaultDecimals(vaultAddress);

        // 6. Record the deposit in the database with the percentage used
        await db.insert(earnDeposits).values({
          id: crypto.randomUUID(),
          userDid: privyDid,
          workspaceId,
          safeAddress: safeAddress,
          vaultAddress: vaultAddress,
          tokenAddress: effectiveTokenAddress,
          assetsDeposited: amount.toString(),
          sharesReceived: sharesReceived.toString(),
          txHash: txHash,
          timestamp: new Date(),
          depositPercentage: depositPercentage, // Store the percentage used at deposit time
          apyBasisPoints,
          assetDecimals,
        });
        console.log(
          `Deposit recorded in DB for tx ${txHash} with percentage ${depositPercentage}.`,
        );

        return {
          success: true,
          txHash,
          sharesReceived: sharesReceived.toString(),
        };
      } catch (error: any) {
        console.error('Failed to trigger auto-earn:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to trigger auto-earn: ${error.shortMessage || error.message || 'Unknown error'}`,
        });
      }
    }),

  isSafeModuleActivelyEnabled: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
        moduleAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
      }),
    )
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
        console.error(
          `Failed to check if module ${moduleAddress} is enabled for safe ${safeAddress}:`,
          error,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to query module status on-chain: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  getEarnModuleOnChainInitializationStatus: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
        // moduleAddress is implicitly AUTO_EARN_MODULE_ADDRESS for this specific check
      }),
    )
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
        console.error(
          `Failed to check if earn module is initialized for safe ${safeAddress} on module ${AUTO_EARN_MODULE_ADDRESS}:`,
          error,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to query earn module initialization status on-chain: ${error.message || 'Unknown error'}`,
        });
      }
    }),

  // NEW: Get earnings events for event-based calculation
  getEarningsEvents: protectedProcedure
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
      const safeUserLink = await getSafeForWorkspace(ctx, safeAddress);
      const workspaceId = safeUserLink.workspaceId;
      const cacheKey = safeAddress.toLowerCase();
      const cached = earningsEventsCache.get(cacheKey);

      if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
      }

      // Fetch deposits
      const deposits = await db.query.earnDeposits.findMany({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.safeAddress, safeAddress),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
        orderBy: (tbl, { asc }) => [asc(tbl.timestamp)],
      });

      // Fetch withdrawals
      const withdrawals = await db.query.earnWithdrawals.findMany({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.safeAddress, safeAddress),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
        orderBy: (tbl, { asc }) => [asc(tbl.timestamp)],
      });

      const vaultApyCache = new Map<string, number>();
      const vaultDecimalsCache = new Map<string, number>();

      const ensureVaultApy = async (
        vaultAddress: string,
        existingBasisPoints?: number | null,
      ) => {
        const key = vaultAddress.toLowerCase();
        if (existingBasisPoints !== undefined && existingBasisPoints !== null) {
          vaultApyCache.set(key, existingBasisPoints);
          return existingBasisPoints;
        }
        if (vaultApyCache.has(key)) {
          return vaultApyCache.get(key)!;
        }
        const { apyBasisPoints } = await getVaultApyBasisPoints(vaultAddress);
        vaultApyCache.set(key, apyBasisPoints);
        return apyBasisPoints;
      };

      const events: EarningsEventPayload[] = [];

      for (const deposit of deposits) {
        const decimals =
          deposit.assetDecimals ?? resolveVaultDecimals(deposit.vaultAddress);
        vaultDecimalsCache.set(deposit.vaultAddress.toLowerCase(), decimals);

        let apyBasisPoints = deposit.apyBasisPoints ?? null;
        if (apyBasisPoints === null) {
          apyBasisPoints = await ensureVaultApy(deposit.vaultAddress, null);
          await db
            .update(earnDeposits)
            .set({ apyBasisPoints })
            .where(eq(earnDeposits.id, deposit.id));
        } else {
          await ensureVaultApy(deposit.vaultAddress, apyBasisPoints);
        }

        events.push({
          id: deposit.txHash,
          type: 'deposit',
          timestamp: deposit.timestamp.toISOString(),
          amount: deposit.assetsDeposited.toString(),
          shares: deposit.sharesReceived.toString(),
          vaultAddress: deposit.vaultAddress,
          apy: Number(apyBasisPoints) / 100,
          decimals,
        });
      }

      for (const withdrawal of withdrawals) {
        const key = withdrawal.vaultAddress.toLowerCase();
        const decimals =
          vaultDecimalsCache.get(key) ??
          resolveVaultDecimals(withdrawal.vaultAddress);
        const apyBasisPoints =
          vaultApyCache.get(key) ??
          (await ensureVaultApy(withdrawal.vaultAddress));

        events.push({
          id: withdrawal.txHash || withdrawal.userOpHash || withdrawal.id,
          type: 'withdrawal',
          timestamp: withdrawal.timestamp.toISOString(),
          amount: withdrawal.assetsWithdrawn.toString(),
          shares: withdrawal.sharesBurned.toString(),
          vaultAddress: withdrawal.vaultAddress,
          apy: Number(apyBasisPoints) / 100,
          decimals,
        });
      }

      // Transform to event format
      events.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      earningsEventsCache.set(cacheKey, {
        data: events,
        expiresAt: Date.now() + EARNINGS_EVENTS_CACHE_TTL_MS,
      });

      return events;
    }),

  // New 'stats' query
  stats: protectedProcedure
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
      const privyDid = ctx.userId;

      if (!privyDid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated.',
        });
      }

      // Verify the safe belongs to the user
      const safeUserLink = await getSafeForWorkspace(ctx, safeAddress);
      const workspaceId = safeUserLink.workspaceId;

      const deposits = await db.query.earnDeposits.findMany({
        where: (earnDepositsTable, { and, eq, or, isNull }) =>
          and(
            eq(earnDepositsTable.safeAddress, safeAddress),
            or(
              eq(earnDepositsTable.workspaceId, workspaceId),
              isNull(earnDepositsTable.workspaceId),
            ),
          ),
      });

      console.log('deposits', deposits);

      if (!deposits.length) {
        return []; // No deposits yet for this safe
      }

      // Group deposits by vault
      const byVault: Record<
        string,
        {
          principal: bigint;
          shares: bigint;
          tokenAddress: Address;
          tokenDecimals: number;
        }
      > = {};

      for (const dep of deposits) {
        const key = dep.vaultAddress.toLowerCase();
        if (!byVault[key]) {
          let underlyingAssetAddress = dep.tokenAddress as Address;
          let tokenDecimals = 6;
          const client = getPublicClientForVault(dep.vaultAddress);
          try {
            underlyingAssetAddress = await client.readContract({
              address: dep.vaultAddress as Address,
              abi: ERC4626_VAULT_ABI,
              functionName: 'asset',
            });
            tokenDecimals = await client.readContract({
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
        const depositAssets = BigInt(dep.assetsDeposited);
        const depositShares = BigInt(dep.sharesReceived);
        byVault[key].principal += depositAssets;
        byVault[key].shares += depositShares;
      }

      console.log('byVault', byVault);
      const statsPromises = Object.entries(byVault).map(
        async ([vaultAddressStr, data]) => {
          const vaultAddress = vaultAddressStr as Address;

          // APY is fetched separately via GraphQL in the statsByVault endpoint
          // We don't need to fetch it here
          let supplyApyPct = 0;

          // If shares are 0 in the database (due to failed event parsing),
          // try to get the actual balance from the vault
          let actualShares = data.shares;
          if (actualShares === 0n && data.principal > 0n) {
            try {
              const client = getPublicClientForVault(vaultAddress);
              actualShares = await client.readContract({
                address: vaultAddress,
                abi: ERC4626_VAULT_ABI_FOR_INFO,
                functionName: 'balanceOf',
                args: [safeAddress],
              });
              console.log(
                `Fetched actual shares from vault for ${safeAddress}: ${actualShares}`,
              );
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
              monthlyApy: 0,
              monthlyNetApy: 0,
              weeklyNetApy: 0,
            };
          }
          try {
            const client = getPublicClientForVault(vaultAddress);
            const currentAssets = await client.readContract({
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
              monthlyApy: 0,
              monthlyNetApy: 0,
              weeklyNetApy: 0,
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
              monthlyApy: 0,
              monthlyNetApy: 0,
              weeklyNetApy: 0,
            };
          }
        },
      );

      const results = await Promise.all(statsPromises);
      return results;
    }),

  apy: protectedProcedure
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
          console.warn(
            `No configHash found for safe ${safeAddress}. Module might not be installed or configured for this safe.`,
          );
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

        if (
          !vaultAddress ||
          vaultAddress === '0x0000000000000000000000000000000000000000'
        ) {
          console.warn(
            `No vault address configured for USDC token (${USDC_BASE_ADDRESS}) with config hash ${configHash} on chain ${currentChainId} for safe ${safeAddress}.`,
          );
          return { apy: null };
        }

        console.log(
          `Target vault for APY for safe ${safeAddress} is ${vaultAddress}`,
        );

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
              variables: {
                address: vaultAddress.toLowerCase(),
                chainId: base.id,
              },
            }),
          });
          if (!response.ok) {
            throw new Error(
              `GraphQL API request failed with status ${response.status}`,
            );
          }
          const result = await response.json();
          if (result.errors) {
            console.error('Morpho GraphQL API errors:', result.errors);
            throw new Error(
              `GraphQL API returned errors: ${JSON.stringify(result.errors)}`,
            );
          }

          if (result.data?.vaultByAddress?.state?.apy !== undefined) {
            supplyApyPct = Number(result.data.vaultByAddress.state.apy);
          } else {
            console.warn(
              `APY missing from GraphQL response for vault ${vaultAddress}.`,
            );
            supplyApyPct = null;
          }
        } catch (graphQlError: any) {
          console.error(
            `Morpho GraphQL API call failed for vault ${vaultAddress} in apy resolver: ${graphQlError.message}`,
          );
          supplyApyPct = null; // Ensure APY is null if GraphQL also fails
        }

        return {
          apy: supplyApyPct !== null ? Number(supplyApyPct) * 100 : null,
        };
      } catch (error: any) {
        console.error(`Failed to fetch APY for safe ${safeAddress}:`, error);
        // Log more specific errors if possible
        if (error.message?.includes('configHash')) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to retrieve module config hash for safe: ${error.message}`,
          });
        }
        if (error.message?.includes('vaultAddress')) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to retrieve vault address from module config: ${error.message}`,
          });
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
        vaultAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid vault address format',
          })
          .transform((val) => getAddress(val)),
        chainId: z.number().optional().default(8453), // Default to Base
      }),
    )
    .query(async ({ ctx, input }) => {
      const { vaultAddress, chainId } = input;

      // Select chain and RPC based on chainId
      const isArbitrum = chainId === 42161;
      const chain = isArbitrum ? arbitrum : base;
      const rpcUrl = isArbitrum
        ? (process.env.ARBITRUM_RPC_URL ??
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ??
          'https://arb1.arbitrum.io/rpc')
        : BASE_RPC_URL;

      // Get the user's Safe on the target chain (user-scoped, not workspace-scoped)
      // IMPORTANT: Use privyDid to get the correct Safe address
      // Using workspaceId can return a different Safe if workspace membership changed
      const privyDid = requirePrivyDid(ctx);

      const userSafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.chainId, chainId),
        ),
      });

      if (!userSafe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No Safe found for user on chain ${chainId}`,
        });
      }

      const targetSafeAddress = userSafe.safeAddress as `0x${string}`;

      const publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
      });

      try {
        // Get vault balances
        const [shares, assetAddress] = await Promise.all([
          publicClient.readContract({
            address: vaultAddress,
            abi: parseAbi([
              'function balanceOf(address owner) external view returns (uint256)',
            ]),
            functionName: 'balanceOf',
            args: [targetSafeAddress],
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
          abi: parseAbi([
            'function convertToAssets(uint256 shares) external view returns (uint256)',
          ]),
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
          safeAddress: targetSafeAddress, // Return the actual Safe address used for the query
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
      const { tokenAddress, ownerAddress, spenderAddress } = input;

      // Verify the user owns this Safe (user-scoped, not workspace-scoped)
      // This is a read-only operation so we just need to confirm ownership
      const privyDid = requirePrivyDid(ctx);
      const safeRecord = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.safeAddress, ownerAddress),
        ),
      });

      if (!safeRecord) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Safe ${ownerAddress} not found for user`,
        });
      }

      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL),
      });

      try {
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: parseAbi([
            'function allowance(address owner, address spender) external view returns (uint256)',
          ]),
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
      const { safeAddress } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = requirePrivyDid(ctx);
      const workspaceId = safeRecord.workspaceId;

      const config = await db.query.autoEarnConfigs.findFirst({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.userDid, userId),
            eq(tbl.safeAddress, safeAddress as `0x${string}`),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
      });

      if (config && !config.workspaceId) {
        await db
          .update(autoEarnConfigs)
          .set({ workspaceId })
          .where(
            and(
              eq(autoEarnConfigs.userDid, userId),
              eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
            ),
          );
      }

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
      const { safeAddress, pct } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = requirePrivyDid(ctx);
      const workspaceId = safeRecord.workspaceId;

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
            message:
              'Earn module is not yet initialized on-chain for this Safe. Please complete the on-chain installation step first.',
          });
        }
      }

      // upsert auto-earn config
      await db
        .insert(autoEarnConfigs)
        .values({
          userDid: userId,
          workspaceId,
          safeAddress: safeAddress as `0x${string}`,
          pct,
        })
        .onConflictDoUpdate({
          target: [autoEarnConfigs.userDid, autoEarnConfigs.safeAddress],
          set: { pct, workspaceId },
        });

      // Enable the earn module flag so the worker will process this Safe
      await db
        .update(userSafes)
        .set({ isEarnModuleEnabled: true, workspaceId })
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
      const { safeAddress } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = requirePrivyDid(ctx);
      const workspaceId = safeRecord.workspaceId;

      // Delete the auto-earn config
      await db
        .delete(autoEarnConfigs)
        .where(
          and(
            eq(autoEarnConfigs.userDid, userId),
            eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
            or(
              eq(autoEarnConfigs.workspaceId, workspaceId),
              isNull(autoEarnConfigs.workspaceId),
            ),
          ),
        );

      // Disable the earn module flag so the worker will skip this Safe
      await db
        .update(userSafes)
        .set({ isEarnModuleEnabled: false, workspaceId })
        .where(eq(userSafes.id, safeRecord.id));

      return { success: true };
    }),

  // ---------------- Legacy UI compatibility helpers -----------------
  /**
   * getState – lightweight summary used by FE settings page
   */
  getState: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((v) => getAddress(v)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const safe = await getSafeForWorkspace(ctx, input.safeAddress);
      const userDid = requirePrivyDid(ctx);
      const workspaceId = safe.workspaceId;

      const cfg = await db.query.autoEarnConfigs.findFirst({
        where: (t, { and, eq, or, isNull }) =>
          and(
            eq(t.userDid, userDid),
            eq(t.safeAddress, input.safeAddress as `0x${string}`),
            or(eq(t.workspaceId, workspaceId), isNull(t.workspaceId)),
          ),
      });

      if (cfg && !cfg.workspaceId) {
        await db
          .update(autoEarnConfigs)
          .set({ workspaceId })
          .where(
            and(
              eq(autoEarnConfigs.userDid, userDid),
              eq(
                autoEarnConfigs.safeAddress,
                input.safeAddress as `0x${string}`,
              ),
            ),
          );
      }
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
      const { safeAddress, limit } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const workspaceId = safeRecord.workspaceId;

      // Fetch recent earn deposits
      const deposits = await db.query.earnDeposits.findMany({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.safeAddress, safeAddress as `0x${string}`),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
        orderBy: (tbl, { desc }) => [desc(tbl.timestamp)],
        limit,
      });

      // Transform to match VaultTransaction interface
      // Note: For display purposes, we need to calculate the original deposit amount
      // The assetsDeposited is the amount that was saved (after percentage calculation)
      return deposits.map((deposit) => {
        // Convert from smallest unit to decimal (USDC has 6 decimals)
        const savedAmountInDecimals = Number(
          formatUnits(BigInt(deposit.assetsDeposited), 6),
        );

        // Use the percentage stored at the time of deposit, or default to 10% for historical deposits
        const percentage = deposit.depositPercentage || 10;
        const originalDepositAmount =
          percentage > 0
            ? (savedAmountInDecimals * 100) / percentage
            : savedAmountInDecimals;

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
      const { safeAddress, limit } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const workspaceId = safeRecord.workspaceId;

      // Fetch recent earn withdrawals
      const withdrawals = await db.query.earnWithdrawals.findMany({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.safeAddress, safeAddress as `0x${string}`),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
        orderBy: (tbl, { desc }) => [desc(tbl.timestamp)],
        limit,
      });

      // Transform to match VaultTransaction interface
      return withdrawals.map((withdrawal) => {
        // Convert from smallest unit to decimal (USDC has 6 decimals)
        const withdrawnAmountInDecimals = Number(
          formatUnits(BigInt(withdrawal.assetsWithdrawn), 6),
        );

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
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val))
          .transform((val) => getAddress(val)),
        vaultAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val))
          .transform((val) => getAddress(val)),
        tokenAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val))
          .transform((val) => getAddress(val)),
        assetsWithdrawn: z
          .string()
          .refine((val) => /^\d+$/.test(val))
          .transform((val) => BigInt(val)),
        sharesBurned: z
          .string()
          .refine((val) => /^\d+$/.test(val))
          .transform((val) => BigInt(val)),
        userOpHash: z.string().optional(),
        txHash: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        safeAddress,
        vaultAddress,
        tokenAddress,
        assetsWithdrawn,
        sharesBurned,
        userOpHash,
        txHash,
      } = input;

      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = safeRecord.userDid;
      const workspaceId = safeRecord.workspaceId;

      // For now, use userOpHash as txHash if no txHash provided (AA transactions)
      const finalTxHash = txHash || userOpHash || `pending-${Date.now()}`;

      // Record the withdrawal
      await db.insert(earnWithdrawals).values({
        id: crypto.randomUUID(),
        userDid: userId,
        workspaceId,
        safeAddress: safeAddress,
        vaultAddress: vaultAddress,
        tokenAddress: tokenAddress,
        assetsWithdrawn: assetsWithdrawn.toString(),
        sharesBurned: sharesBurned.toString(),
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
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((v) => getAddress(v)),
        percentage: z.number().int().min(0).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { safeAddress, percentage } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = safeRecord.userDid;
      const workspaceId = safeRecord.workspaceId;

      if (percentage === 0) {
        // Disable auto-earn: delete config and disable module flag
        await db
          .delete(autoEarnConfigs)
          .where(
            and(
              eq(autoEarnConfigs.userDid, userId),
              eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
              or(
                eq(autoEarnConfigs.workspaceId, workspaceId),
                isNull(autoEarnConfigs.workspaceId),
              ),
            ),
          );

        await db
          .update(userSafes)
          .set({ isEarnModuleEnabled: false, workspaceId })
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
              message:
                'Earn module is not yet initialized on-chain for this Safe. Please complete the on-chain installation step first.',
            });
          }
        }

        await db
          .insert(autoEarnConfigs)
          .values({
            userDid: userId,
            workspaceId,
            safeAddress: safeAddress as `0x${string}`,
            pct: percentage,
          })
          .onConflictDoUpdate({
            target: [autoEarnConfigs.userDid, autoEarnConfigs.safeAddress],
            set: { pct: percentage, workspaceId },
          });

        await db
          .update(userSafes)
          .set({ isEarnModuleEnabled: true, workspaceId })
          .where(eq(userSafes.id, safeRecord.id));
      }

      return { success: true };
    }),

  // Multi-vault stats endpoint
  statsByVault: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
        vaultAddresses: z.array(
          z
            .string()
            .length(42)
            .transform((val) => getAddress(val)),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { safeAddress, vaultAddresses } = input;
      const safeUserLink = await getSafeForWorkspace(ctx, safeAddress);
      const workspaceId = safeUserLink.workspaceId;

      // Fetch stats for each vault
      const statsPromises = vaultAddresses.map(async (vaultAddress) => {
        try {
          const vaultConfig = getVaultConfig(vaultAddress);
          const chainId = vaultConfig?.chainId ?? BASE_CHAIN_ID;
          const client = getPublicClientForChain(chainId);

          // Try to get APY based on vault type
          let apy = 0;
          let netApy = 0;
          let monthlyApy = 0;
          let monthlyNetApy = 0;
          let weeklyNetApy = 0;

          // Check if this is an Origin Protocol vault
          const isOriginVault = vaultConfig?.id === 'originSuperOeth';

          if (isOriginVault) {
            // Fetch APY from Origin Protocol API
            try {
              const response = await fetch(
                `https://api.originprotocol.com/api/v2/superoethb/apr/trailing/7?chainId=${chainId}`,
              );

              if (response.ok) {
                const result = await response.json();
                // Origin API returns APY as a string like "8.43"
                const apyValue = parseFloat(result.apy || '0');
                apy = apyValue / 100; // Convert to decimal (e.g., 8.43% -> 0.0843)
                netApy = apy;
                monthlyApy = apy;
                monthlyNetApy = apy;
                weeklyNetApy = apy;
              }
            } catch (e) {
              console.warn(
                `Failed to fetch APY for Origin vault ${vaultAddress}:`,
                e,
              );
            }
          } else {
            // Fetch APY from Morpho GraphQL for other vaults
            try {
              const response = await fetch(
                'https://blue-api.morpho.org/graphql',
                {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({
                    query: `
                    query ($address: String!, $chainId: Int!) {
                      vaultByAddress(address: $address, chainId: $chainId) {
                        address
                        state {
                          apy
                          netApy
                          monthlyApy
                          monthlyNetApy
                          weeklyNetApy
                        }
                      }
                    }`,
                    variables: {
                      address: vaultAddress.toLowerCase(),
                      chainId,
                    },
                  }),
                },
              );

              if (response.ok) {
                const result = await response.json();
                if (result.data?.vaultByAddress?.state) {
                  apy = result.data.vaultByAddress.state.apy || 0;
                  netApy = result.data.vaultByAddress.state.netApy || 0;
                  monthlyApy = result.data.vaultByAddress.state.monthlyApy || 0;
                  monthlyNetApy =
                    result.data.vaultByAddress.state.monthlyNetApy || 0;
                  weeklyNetApy =
                    result.data.vaultByAddress.state.weeklyNetApy || 0;
                }
              }
            } catch (e) {
              console.warn(`Failed to fetch APY for vault ${vaultAddress}:`, e);
            }
          }

          // Get deposits for this vault
          const deposits = await db.query.earnDeposits.findMany({
            where: (earnDepositsTable, { and, eq, or, isNull }) =>
              and(
                eq(earnDepositsTable.safeAddress, safeAddress),
                eq(earnDepositsTable.vaultAddress, vaultAddress),
                or(
                  eq(earnDepositsTable.workspaceId, workspaceId),
                  isNull(earnDepositsTable.workspaceId),
                ),
              ),
          });

          let totalDeposited = 0n;
          let shares = 0n;

          for (const dep of deposits) {
            const depositedAssets = BigInt(dep.assetsDeposited);
            const depositedShares = BigInt(dep.sharesReceived);
            totalDeposited += depositedAssets;
            shares += depositedShares;
          }

          // Get withdrawals for this vault
          const withdrawals = await db.query.earnWithdrawals.findMany({
            where: (earnWithdrawalsTable, { and, eq, or, isNull }) =>
              and(
                eq(earnWithdrawalsTable.safeAddress, safeAddress),
                eq(earnWithdrawalsTable.vaultAddress, vaultAddress),
                or(
                  eq(earnWithdrawalsTable.workspaceId, workspaceId),
                  isNull(earnWithdrawalsTable.workspaceId),
                ),
              ),
          });

          let totalWithdrawn = 0n;
          for (const withdrawal of withdrawals) {
            const withdrawnAssets = BigInt(withdrawal.assetsWithdrawn);
            const burnedShares = BigInt(withdrawal.sharesBurned);
            totalWithdrawn += withdrawnAssets;
            shares -= burnedShares;
          }

          // Get current value if there are shares
          let currentAssets = 0n;
          let yieldAmount = totalWithdrawn - totalDeposited;

          if (shares > 0n) {
            try {
              currentAssets = await client.readContract({
                address: vaultAddress as Address,
                abi: ERC4626_VAULT_ABI,
                functionName: 'convertToAssets',
                args: [shares],
              });
              // Correct yield calculation: (current value + withdrawn) - deposited
              yieldAmount = currentAssets + totalWithdrawn - totalDeposited;
            } catch (e) {
              console.warn(
                `Failed to get current assets for vault ${vaultAddress}:`,
                e,
              );
            }
          }

          const ledgerPrincipal = totalDeposited - totalWithdrawn;
          const rawYieldAmount = yieldAmount;
          const YIELD_TOLERANCE = 1000n; // $0.001 in 6 decimal USDC units
          let correctedPrincipal = ledgerPrincipal;
          let correctionReason: 'ledger_shortfall' | 'rounding' | null = null;

          if (yieldAmount < 0n) {
            const shortfall = ledgerPrincipal - currentAssets;

            if (ledgerPrincipal > 0n && shortfall > YIELD_TOLERANCE) {
              // The ledger thinks we have more principal than assets on-chain.
              // Clamp principal to what actually exists and reset unrealized yield.
              correctedPrincipal = currentAssets;
              yieldAmount = 0n;
              correctionReason = 'ledger_shortfall';
              console.warn(
                `Corrected negative yield for ${vaultAddress} / ${safeAddress}. Ledger principal ${ledgerPrincipal} > current assets ${currentAssets}.`,
              );
            } else if (yieldAmount > -YIELD_TOLERANCE) {
              // Small negative due to rounding – treat as zero.
              yieldAmount = 0n;
              correctionReason = 'rounding';
            }
          }

          return {
            vaultAddress,
            apy,
            netApy,
            monthlyApy,
            monthlyNetApy,
            weeklyNetApy,
            principal: correctedPrincipal, // Net principal after corrections
            principalRecorded: ledgerPrincipal,
            currentAssets,
            yield: yieldAmount,
            yieldRecorded: rawYieldAmount,
            yieldCorrectionApplied: correctionReason,
          };
        } catch (error) {
          console.error(
            `Error fetching stats for vault ${vaultAddress}:`,
            error,
          );
          return {
            vaultAddress,
            apy: 0,
            netApy: 0,
            principal: 0n,
            currentAssets: 0n,
            yield: 0n,
          };
        }
      });

      const results = await Promise.all(statsPromises);
      return results;
    }),

  // User positions across vaults - using on-chain data directly
  userPositions: protectedProcedure
    .input(
      z.object({
        vaultAddresses: z.array(
          z
            .string()
            .length(42)
            .transform((val) => getAddress(val)),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { vaultAddresses } = input;

      // Get user's Privy DID and workspace ID for workspace-scoped Safe lookup
      const privyDid = requirePrivyDid(ctx);
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      // Get all safes for this user within the workspace
      const userSafesList = await getMultiChainUserSafes(privyDid, workspaceId);

      // Create a map of chainId -> safeAddress for quick lookup
      const safesByChain = new Map<number, string>();
      for (const safe of userSafesList) {
        safesByChain.set(safe.chainId, safe.safeAddress);
      }

      // Fetch positions directly from on-chain
      // This is more reliable than GraphQL and gives us real-time data
      const positions = await Promise.all(
        vaultAddresses.map(async (vaultAddress) => {
          const chainId = getChainIdForVault(vaultAddress);
          const client = getPublicClientForChain(chainId);
          const { decimals: assetDecimals, isNative: isNativeAsset } =
            getVaultAssetConfig(vaultAddress);

          // Get the Safe address for this vault's chain
          const safeAddress = safesByChain.get(chainId);
          if (!safeAddress) {
            // No Safe on this chain, return zero balance
            return {
              vaultAddress,
              shares: '0',
              assets: '0',
              assetsUsd: 0,
              chainId,
            };
          }

          try {
            // Get shares balance
            const shares = await client.readContract({
              address: vaultAddress as Address,
              abi: parseAbi([
                'function balanceOf(address) view returns (uint256)',
              ]),
              functionName: 'balanceOf',
              args: [safeAddress as Address],
            });

            if (shares > 0n) {
              // Convert shares to assets
              const assets = await client.readContract({
                address: vaultAddress as Address,
                abi: parseAbi([
                  'function convertToAssets(uint256) view returns (uint256)',
                ]),
                functionName: 'convertToAssets',
                args: [shares],
              });

              // Convert to USD based on asset type
              let assetsUsd: number;
              if (isNativeAsset) {
                // For ETH-based vaults, convert ETH to USD
                const ethPrice = await getEthPriceUsd();
                const assetsEth = Number(assets) / Math.pow(10, assetDecimals);
                assetsUsd = assetsEth * ethPrice;
              } else {
                // For stablecoins, assets = USD value
                assetsUsd = Number(assets) / Math.pow(10, assetDecimals);
              }

              return {
                vaultAddress,
                shares: shares.toString(),
                assets: assets.toString(),
                assetsUsd,
                chainId,
              };
            }

            return {
              vaultAddress,
              shares: '0',
              assets: '0',
              assetsUsd: 0,
              chainId,
            };
          } catch (error) {
            console.error(
              `Error fetching position for vault ${vaultAddress}:`,
              error,
            );
            return {
              vaultAddress,
              shares: '0',
              assets: '0',
              assetsUsd: 0,
              chainId,
            };
          }
        }),
      );

      return positions;
    }),

  // Set auto-vault selection
  setAutoVault: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
        autoVaultAddress: z
          .string()
          .length(42)
          .transform((val) => getAddress(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { safeAddress, autoVaultAddress } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = safeRecord.userDid;
      const workspaceId = safeRecord.workspaceId;

      // Verify the vault address is one of the allowed Base vaults
      const isValidVault = BASE_USDC_VAULTS.some(
        (v) => v.address.toLowerCase() === autoVaultAddress.toLowerCase(),
      );

      if (!isValidVault) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Invalid vault address. Must be one of the supported Base USDC vaults.',
        });
      }

      // Check if config exists
      const existingConfig = await db.query.autoEarnConfigs.findFirst({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.userDid, userId),
            eq(tbl.safeAddress, safeAddress as `0x${string}`),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
      });

      if (existingConfig) {
        // Update existing config
        await db
          .update(autoEarnConfigs)
          .set({
            autoVaultAddress: autoVaultAddress as `0x${string}`,
            workspaceId,
          })
          .where(
            and(
              eq(autoEarnConfigs.userDid, userId),
              eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
            ),
          );
      } else {
        // Create new config with default 10% and the selected vault
        await db.insert(autoEarnConfigs).values({
          userDid: userId,
          workspaceId,
          safeAddress: safeAddress as `0x${string}`,
          pct: 10, // Default to 10%
          autoVaultAddress: autoVaultAddress as `0x${string}`,
        });
      }

      return { success: true };
    }),

  // Get auto-vault config including the selected vault
  getAutoVaultConfig: protectedProcedure
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
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = safeRecord.userDid;
      const workspaceId = safeRecord.workspaceId;

      const config = await db.query.autoEarnConfigs.findFirst({
        where: (tbl, { and, eq, or, isNull }) =>
          and(
            eq(tbl.userDid, userId),
            eq(tbl.safeAddress, safeAddress as `0x${string}`),
            or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
          ),
      });

      if (config && !config.workspaceId) {
        await db
          .update(autoEarnConfigs)
          .set({ workspaceId })
          .where(
            and(
              eq(autoEarnConfigs.userDid, userId),
              eq(autoEarnConfigs.safeAddress, safeAddress as `0x${string}`),
            ),
          );
      }

      return {
        pct: config?.pct ?? 0,
        autoVaultAddress: config?.autoVaultAddress ?? null,
        lastTrigger: config?.lastTrigger ?? null,
      };
    }),

  // ============================================
  // Multi-Chain Endpoints
  // ============================================

  /**
   * Get multi-chain vault positions
   * Returns all vault positions across all chains for the user
   */
  getMultiChainPositions: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = requirePrivyDid(ctx);
    const workspaceId = requireWorkspaceId(ctx.workspaceId);

    // Get user's Safes across all chains within this workspace
    const safes = await getMultiChainUserSafes(privyDid, workspaceId);

    // Get RPC manager for balance queries
    const rpcManager = getRPCManager();

    // Get positions for each Safe
    const positions = await Promise.all(
      safes.map(async (safe) => {
        const chainId = safe.chainId as SupportedChainId;
        const safeAddress = safe.safeAddress as Address;

        // Get USDC balance
        const usdcAddress = getUSDCAddress(chainId);
        const balance = await rpcManager.getBalance(
          chainId,
          usdcAddress,
          safeAddress,
        );

        return {
          safeId: safe.id,
          safeAddress,
          chainId,
          safeType: safe.safeType,
          usdcBalance: balance?.formatted || '0',
          usdcBalanceRaw: balance?.raw.toString() || '0',
        };
      }),
    );

    // Calculate total balance across all chains
    const totalBalance = positions.reduce((sum, pos) => {
      return sum + parseFloat(pos.usdcBalance);
    }, 0);

    return {
      safes: safes.map((s) => ({
        id: s.id,
        address: s.safeAddress,
        chainId: s.chainId as SupportedChainId,
        type: s.safeType,
      })),
      positions,
      totalBalance: totalBalance.toFixed(2),
    };
  }),

  /**
   * Get bridge quote for vault deposit
   * Returns fee breakdown and estimated time
   */
  getBridgeQuote: protectedProcedure
    .input(
      z.object({
        amount: z.string(),
        sourceChainId: z.number(),
        destChainId: z.number(),
        vaultAddress: z.string().length(42).optional(),
      }),
    )
    .query(async ({ input }) => {
      const quote = await getBridgeQuoteForVault({
        amount: input.amount,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
        vaultAddress: input.vaultAddress as Address | undefined,
        destinationSafeAddress:
          '0x0000000000000000000000000000000000000000' as Address, // Placeholder
      });

      return {
        inputAmount: quote.inputAmount.toString(),
        outputAmount: quote.outputAmount.toString(),
        bridgeFee: quote.bridgeFee.toString(),
        lpFee: quote.lpFee.toString(),
        relayerGasFee: quote.relayerGasFee.toString(),
        totalFee: quote.totalFee.toString(),
        estimatedFillTime: quote.estimatedFillTime,
      };
    }),

  /**
   * Deposit to vault on another chain (with bridge)
   * Returns transaction data for user to sign
   */
  depositToVaultWithBridge: protectedProcedure
    .input(
      z.object({
        vaultAddress: z.string().length(42),
        amount: z.string(),
        sourceChainId: z.number(),
        destChainId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = requirePrivyDid(ctx);
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      // Get source Safe
      const sourceSafe = await getSafeOnChain(
        privyDid,
        workspaceId,
        input.sourceChainId as SupportedChainId,
        'primary',
      );

      if (!sourceSafe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No Safe found on source chain ${input.sourceChainId}`,
        });
      }

      // Check if destination Safe exists in database
      const destSafe = await getSafeOnChain(
        privyDid,
        workspaceId,
        input.destChainId as SupportedChainId,
        'primary',
      );

      // If no destination Safe exists, return deployment info instead of predicting
      if (!destSafe) {
        // Get deployment transaction data for the destination chain
        const deploymentTx = await getSafeDeploymentTransaction(
          privyDid,
          workspaceId,
          input.destChainId as SupportedChainId,
          'primary',
        );

        return {
          needsDeployment: true,
          destinationChainId: input.destChainId,
          deploymentTransaction: {
            to: deploymentTx.to,
            data: deploymentTx.data,
            value: deploymentTx.value,
            chainId: input.destChainId,
          },
          predictedSafeAddress: deploymentTx.predictedAddress,
          message: `You need to deploy a Safe on chain ${input.destChainId} before you can bridge funds there.`,
        };
      }

      const destSafeAddress = destSafe.safeAddress as Address;

      // Get bridge quote
      const quote = await getBridgeQuoteForVault({
        amount: input.amount,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
        vaultAddress: input.vaultAddress as Address,
        destinationSafeAddress: destSafeAddress,
      });

      // Create bridge transaction record
      const bridgeTxId = await createBridgeTransaction({
        userDid: privyDid,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
        vaultAddress: input.vaultAddress,
        amount: input.amount,
        bridgeFee: quote.totalFee.toString(),
        lpFee: quote.lpFee.toString(),
        relayerGasFee: quote.relayerGasFee.toString(),
        relayerCapitalFee: quote.relayerCapitalFee.toString(),
      });

      // Encode bridge transaction (returns array of [Approve, Deposit])
      const bridgeTx = await encodeBridgeWithVaultDeposit({
        depositor: sourceSafe.safeAddress as Address,
        vaultAddress: input.vaultAddress as Address,
        destinationSafeAddress: destSafeAddress,
        amount: input.amount,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
      });

      return {
        needsDeployment: false,
        bridgeTransactionId: bridgeTxId,
        transaction: bridgeTx.map((tx) => ({
          to: tx.to,
          data: tx.data,
          value: tx.value.toString(),
          chainId: tx.chainId,
        })),
        destinationSafeAddress: destSafeAddress,
        quote: {
          inputAmount: quote.inputAmount.toString(),
          outputAmount: quote.outputAmount.toString(),
          totalFee: quote.totalFee.toString(),
          estimatedFillTime: quote.estimatedFillTime,
        },
      };
    }),

  /**
   * Bridge funds to another chain (without vault deposit)
   */
  bridgeFunds: protectedProcedure
    .input(
      z.object({
        amount: z.string(),
        sourceChainId: z.number(),
        destChainId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = requirePrivyDid(ctx);
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      // Get source Safe
      const sourceSafe = await getSafeOnChain(
        privyDid,
        workspaceId,
        input.sourceChainId as SupportedChainId,
        'primary',
      );

      if (!sourceSafe) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No Safe found on source chain ${input.sourceChainId}`,
        });
      }

      // Check if destination Safe exists in database
      const destSafe = await getSafeOnChain(
        privyDid,
        workspaceId,
        input.destChainId as SupportedChainId,
        'primary',
      );

      // If no destination Safe exists, return deployment info instead of predicting
      if (!destSafe) {
        // Get deployment transaction data for the destination chain
        const deploymentTx = await getSafeDeploymentTransaction(
          privyDid,
          workspaceId,
          input.destChainId as SupportedChainId,
          'primary',
        );

        return {
          needsDeployment: true,
          destinationChainId: input.destChainId,
          deploymentTransaction: {
            to: deploymentTx.to,
            data: deploymentTx.data,
            value: deploymentTx.value,
            chainId: input.destChainId,
          },
          predictedSafeAddress: deploymentTx.predictedAddress,
          message: `You need to deploy a Safe on chain ${input.destChainId} before you can bridge funds there.`,
        };
      }

      const destSafeAddress = destSafe.safeAddress as Address;

      // Get bridge quote
      const quote = await getBridgeQuoteForVault({
        amount: input.amount,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
        vaultAddress: '0x0000000000000000000000000000000000000000', // Not used for simple transfer
        destinationSafeAddress: destSafeAddress,
      });

      // Create bridge transaction record
      const bridgeTxId = await createBridgeTransaction({
        userDid: privyDid,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
        vaultAddress: '0x0000000000000000000000000000000000000000', // Placeholder
        amount: input.amount,
        bridgeFee: quote.totalFee.toString(),
        lpFee: quote.lpFee.toString(),
        relayerGasFee: quote.relayerGasFee.toString(),
        relayerCapitalFee: quote.relayerCapitalFee.toString(),
      });

      // Encode bridge transaction (returns array of [Approve, Deposit])
      const bridgeTx = await encodeBridgeTransfer({
        depositor: sourceSafe.safeAddress as Address,
        destinationSafeAddress: destSafeAddress,
        amount: input.amount,
        sourceChainId: input.sourceChainId as SupportedChainId,
        destChainId: input.destChainId as SupportedChainId,
        vaultAddress: '0x0000000000000000000000000000000000000000', // Placeholder
      });

      return {
        needsDeployment: false,
        bridgeTransactionId: bridgeTxId,
        transaction: bridgeTx.map((tx) => ({
          to: tx.to,
          data: tx.data,
          value: tx.value.toString(),
          chainId: tx.chainId,
        })),
        destinationSafeAddress: destSafeAddress,
        quote: {
          inputAmount: quote.inputAmount.toString(),
          outputAmount: quote.outputAmount.toString(),
          totalFee: quote.totalFee.toString(),
          estimatedFillTime: quote.estimatedFillTime,
        },
      };
    }),

  /**
   * Get Safe balance on a specific chain
   */
  getSafeBalanceOnChain: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().length(42),
        chainId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const rpcManager = getRPCManager();
      const usdcAddress = getUSDCAddress(input.chainId as SupportedChainId);

      const balance = await rpcManager.getBalance(
        input.chainId as SupportedChainId,
        usdcAddress,
        input.safeAddress as Address,
      );

      return {
        balance: balance?.raw.toString() || '0',
        formatted: balance?.formatted || '0',
      };
    }),

  /**
   * Get native ETH balance for a Safe on a specific chain
   */
  getNativeBalance: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().length(42),
        chainId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const rpcManager = getRPCManager();
      const client = rpcManager.getClient(input.chainId as SupportedChainId);

      const balance = await client.getBalance({
        address: input.safeAddress as Address,
      });

      return {
        balance: balance.toString(),
        formatted: (Number(balance) / 1e18).toFixed(6),
      };
    }),

  /**
   * Get WETH balance for a Safe on a specific chain
   */
  getWethBalance: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().length(42),
        chainId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const rpcManager = getRPCManager();
      // WETH addresses per chain
      const wethAddresses: Record<number, Address> = {
        8453: '0x4200000000000000000000000000000000000006', // Base
        42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // Arbitrum
        1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Mainnet
      };

      const wethAddress = wethAddresses[input.chainId];
      if (!wethAddress) {
        return { balance: '0', formatted: '0' };
      }

      const balance = await rpcManager.getBalance(
        input.chainId as SupportedChainId,
        wethAddress,
        input.safeAddress as Address,
      );

      return {
        balance: balance?.raw.toString() || '0',
        formatted: balance?.formatted || '0',
      };
    }),

  /**
   * Get Super OETH balance for a Safe on Base
   */
  getSuperOethBalance: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().length(42),
      }),
    )
    .query(async ({ input }) => {
      const rpcManager = getRPCManager();
      // Super OETH address on Base
      const superOethAddress: Address =
        '0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3';

      const balance = await rpcManager.getBalance(
        SUPPORTED_CHAINS.BASE as SupportedChainId,
        superOethAddress,
        input.safeAddress as Address,
      );

      return {
        balance: balance?.raw.toString() || '0',
        formatted: balance?.formatted || '0',
      };
    }),

  /**
   * Update bridge transaction after deposit is sent
   */
  updateBridgeDeposit: protectedProcedure
    .input(
      z.object({
        bridgeTransactionId: z.string(),
        depositTxHash: z.string().length(66),
        depositId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await updateBridgeDepositHash(
        input.bridgeTransactionId,
        input.depositTxHash,
        input.depositId,
      );

      return { success: true };
    }),

  /**
   * Get bridge transaction status
   */
  getBridgeStatus: protectedProcedure
    .input(
      z.object({
        bridgeTransactionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const privyDid = requirePrivyDid(ctx);

      const transactions = await getUserBridgeTransactions(privyDid);
      const tx = transactions.find((t) => t.id === input.bridgeTransactionId);

      if (!tx) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Bridge transaction not found',
        });
      }

      // If pending and has deposit hash, check status
      if (tx.status === 'pending' && tx.depositTxHash) {
        try {
          const status = await trackBridgeDeposit(
            tx.depositTxHash,
            tx.sourceChainId as SupportedChainId,
          );

          if (status === 'filled') {
            await updateBridgeStatus(tx.id, 'filled');
            return { status: 'filled' };
          }
        } catch (error) {
          console.error('Error tracking bridge deposit:', error);
        }
      }

      return { status: tx.status };
    }),

  /**
   * Get user's bridge transaction history
   */
  getBridgeHistory: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = requirePrivyDid(ctx);

    const transactions = await getUserBridgeTransactions(privyDid);

    return transactions.map((tx) => ({
      id: tx.id,
      sourceChainId: tx.sourceChainId,
      destChainId: tx.destChainId,
      vaultAddress: tx.vaultAddress,
      amount: tx.amount,
      bridgeFee: tx.bridgeFee,
      status: tx.status,
      depositTxHash: tx.depositTxHash,
      fillTxHash: tx.fillTxHash,
      createdAt: tx.createdAt?.toISOString(),
      filledAt: tx.filledAt?.toISOString(),
    }));
  }),

  /**
   * Get pending bridge transactions
   */
  getPendingBridges: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = requirePrivyDid(ctx);

    const transactions = await getPendingBridgeTransactions(privyDid);

    return transactions.map((tx) => ({
      id: tx.id,
      sourceChainId: tx.sourceChainId,
      destChainId: tx.destChainId,
      amount: tx.amount,
      depositTxHash: tx.depositTxHash,
      createdAt: tx.createdAt?.toISOString(),
    }));
  }),

  /**
   * Get Safe deployment transaction for new chain
   */
  getSafeDeploymentTx: protectedProcedure
    .input(
      z.object({
        targetChainId: z.number(),
        safeType: z.enum(['primary', 'tax', 'liquidity', 'yield']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = requirePrivyDid(ctx);
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const deploymentTx = await getSafeDeploymentTransaction(
        privyDid,
        workspaceId,
        input.targetChainId as SupportedChainId,
        input.safeType,
      );

      return {
        to: deploymentTx.to,
        data: deploymentTx.data,
        value: deploymentTx.value,
        predictedAddress: deploymentTx.predictedAddress,
      };
    }),

  /**
   * Register a deployed Safe on a specific chain
   * Called after Safe deployment is confirmed
   */
  registerDeployedSafe: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().length(42),
        chainId: z.number(),
        safeType: z.enum(['primary', 'tax', 'liquidity', 'yield']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = requirePrivyDid(ctx);
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      // Check if Safe already exists
      const existingSafe = await getSafeOnChain(
        privyDid,
        workspaceId,
        input.chainId as SupportedChainId,
        input.safeType,
      );

      if (existingSafe) {
        // Already registered, just return success
        return {
          success: true,
          safeId: existingSafe.id,
          safeAddress: existingSafe.safeAddress,
        };
      }

      // Create new Safe record
      const newSafe = await createSafeRecord({
        userDid: privyDid,
        workspaceId,
        safeAddress: input.safeAddress,
        chainId: input.chainId,
        safeType: input.safeType,
        isEarnModuleEnabled: false,
      });

      return {
        success: true,
        safeId: newSafe.id,
        safeAddress: newSafe.safeAddress,
      };
    }),

  /**
   * Check if multi-chain feature is enabled for the current workspace
   */
  isMultiChainEnabled: protectedProcedure.query(async ({ ctx }) => {
    const workspaceId = requireWorkspaceId(ctx.workspaceId);

    // Check if the workspace has the multi-chain feature enabled
    const hasFeature = await hasMultiChainFeature(workspaceId);

    return {
      enabled: hasFeature,
    };
  }),
});
