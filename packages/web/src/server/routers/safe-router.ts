import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
// import axios from 'axios'; // Use fetch instead
import { type Address } from 'viem';
import {
  createPublicClient,
  http,
  isAddress,
  erc20Abi,
  getAddress,
} from 'viem';
import { base } from 'viem/chains';
import { db } from '@/db';
import { incomingDeposits, userSafes, earnDeposits } from '@/db/schema';
import type { UserSafe } from '@/db/schema';
import { eq, and, desc, or, isNull } from 'drizzle-orm';
import { formatUnits } from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';

// Base Sepolia URL (Use Base Mainnet URL for production)
// const BASE_TRANSACTION_SERVICE_URL = 'https://safe-transaction-base-sepolia.safe.global/api';
const BASE_TRANSACTION_SERVICE_URL =
  'https://safe-transaction-base.safe.global/api'; // PRODUCTION

// Define structure for a transaction item (matching the frontend component)
// Simplified version based on Safe Service response structure
interface TransactionItemFromService {
  type: 'ETHEREUM_TRANSACTION' | 'MODULE_TRANSACTION' | 'MULTISIG_TRANSACTION';
  txHash?: string;
  transactionHash?: string;
  executionDate: string; // ISO 8601 date string
  from?: string;
  to?: string;
  value?: string; // String number
  data?: string | null;
  tokenInfo?: {
    address: string;
    symbol: string;
    decimals: number;
  } | null;
  dataDecoded?: {
    method: string;
    parameters?: any[];
  } | null;
  safeTxHash?: string; // Present for multisig transactions
  isExecuted?: boolean; // For multisig
  transfers?: Array<{
    type: string;
    value?: string;
    to?: string;
    from?: string;
    tokenInfo?: {
      address: string;
      symbol: string;
      decimals: number;
    };
  }>;
  // ... other fields available in the API response
}

// Function to map API response to our simplified TransactionItem
function mapTxItem(
  tx: TransactionItemFromService,
  safeAddress?: string,
): TransactionItem | null {
  const timestamp = new Date(tx.executionDate).getTime();
  let type: TransactionItem['type'] = 'module'; // Default guess
  let value: string | undefined;
  let tokenInfo:
    | { address: string; symbol: string; decimals: number }
    | undefined;

  // Skip unexecuted multisig for now
  if (tx.type === 'MULTISIG_TRANSACTION' && !tx.isExecuted) {
    return null;
  }

  // Check transfers array first - this is the most reliable way to identify token transfers
  if (tx.transfers && tx.transfers.length > 0) {
    const transfer = tx.transfers[0]; // Use the first transfer for simplicity

    // Check if this is an ERC20 transfer
    if (transfer.type === 'ERC20_TRANSFER' && transfer.tokenInfo) {
      tokenInfo = {
        address: transfer.tokenInfo.address,
        symbol: transfer.tokenInfo.symbol,
        decimals: transfer.tokenInfo.decimals || 18,
      };
      value = transfer.value || '0';

      // Determine if incoming or outgoing based on the to/from addresses
      if (safeAddress) {
        const safeAddrLower = safeAddress.toLowerCase();
        if (transfer.to?.toLowerCase() === safeAddrLower) {
          type = 'incoming';
        } else if (transfer.from?.toLowerCase() === safeAddrLower) {
          type = 'outgoing';
        }
      }
    }
  }

  // If no transfers found, try to determine type from transaction type
  if (type === 'module') {
    if (tx.type === 'ETHEREUM_TRANSACTION') {
      // Check if this is an incoming ETH transfer to the safe
      if (
        safeAddress &&
        tx.to?.toLowerCase() === safeAddress.toLowerCase() &&
        tx.value &&
        tx.value !== '0'
      ) {
        type = 'incoming';
        value = tx.value;
      }
    } else if (tx.type === 'MULTISIG_TRANSACTION') {
      // For multisig transactions, check the decoded data
      if (
        tx.dataDecoded?.method === 'transfer' ||
        tx.dataDecoded?.method === 'transferFrom'
      ) {
        type = 'outgoing';
        // Try to get value from parameters if not already set
        if (!value && tx.dataDecoded.parameters) {
          const valueParam = tx.dataDecoded.parameters.find(
            (p) => p.name === 'value' || p.name === 'amount',
          );
          if (valueParam) {
            value = valueParam.value;
          }
        }
      }
    }
  }

  // Handle creation transactions
  if (!tx.to && tx.type === 'ETHEREUM_TRANSACTION') {
    type = 'creation';
  }

  return {
    type: type,
    hash: tx.txHash || tx.transactionHash || tx.safeTxHash || '', // Use available hash
    timestamp: timestamp,
    from: tx.from,
    to: tx.to,
    value: value,
    tokenAddress: tokenInfo?.address,
    tokenSymbol: tokenInfo?.symbol,
    tokenDecimals: tokenInfo?.decimals,
    methodName: tx.dataDecoded?.method,
    transfers: tx.transfers,
  };
}

// Define and EXPORT our simplified TransactionItem
export interface TransactionItem {
  type: 'incoming' | 'outgoing' | 'module' | 'creation';
  hash: string;
  timestamp: number;
  from?: string;
  to?: string;
  value?: string;
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  methodName?: string;
  transfers?: Array<{
    type: string;
    value?: string;
    to?: string;
    from?: string;
    tokenInfo?: {
      address: string;
      symbol: string;
      decimals: number;
    };
  }>;
  // New fields for enriched data
  swept?: boolean;
  sweptAmount?: string;
  sweptPercentage?: number;
  sweptTxHash?: string;
  sweptAt?: number;
}

// Zod schema for input validation
const balanceInputSchema = z.object({
  safeAddress: z
    .string()
    .refine(isAddress, { message: 'Invalid Safe address' }),
  tokenAddress: z
    .string()
    .refine(isAddress, { message: 'Invalid Token address' }),
});

export const safeRouter = router({
  getTransactions: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Ethereum address',
          }),
        // Default to 100 if not provided
        limit: z.number().optional().default(100),
      }),
    )
    .query(async ({ input }): Promise<TransactionItem[]> => {
      const { safeAddress, limit = 100 } = input;
      // Construct URL with query parameters
      const url = new URL(
        `${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/all-transactions/`,
      );
      url.searchParams.append('executed', 'true');
      url.searchParams.append('queued', 'false');
      url.searchParams.append('trusted', 'true');
      const apiUrl = url.toString();

      try {
        console.log(
          `0xHypr - Fetching transactions for ${safeAddress} from ${apiUrl}`,
        );
        // Use fetch API
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Error response from Safe Service (${response.status}): ${errorBody}`,
          );
          throw new Error(
            `Failed to fetch data from Safe Transaction Service: ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (data && data.results) {
          const transactions: TransactionItem[] = data.results
            .map((tx: TransactionItemFromService) => mapTxItem(tx, safeAddress))
            .filter(
              (tx: TransactionItem | null): tx is TransactionItem =>
                tx !== null && tx.tokenSymbol === 'USDC',
            )
            .sort(
              (a: TransactionItem, b: TransactionItem) =>
                b.timestamp - a.timestamp,
            );

          console.log(
            `0xHypr - Found ${transactions.length} executed transactions for ${safeAddress}`,
          );
          return transactions.slice(0, limit);
        } else {
          console.error(
            'Unexpected response structure from Safe Transaction Service',
            data,
          );
          return [];
        }
      } catch (error: any) {
        // Log fetch-specific errors or re-throw as TRPCError
        console.error(
          `Error fetching transactions for Safe ${safeAddress}:`,
          error.message,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch transaction history from Safe service.',
          cause: error,
        });
      }
    }),

  /**
   * Fetches enriched transaction history with sweep information
   */
  getEnrichedTransactions: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Ethereum address',
          }),
        limit: z.number().optional().default(100),
        syncFromBlockchain: z.boolean().optional().default(true),
      }),
    )
    .query(async ({ input, ctx }): Promise<TransactionItem[]> => {
      const { safeAddress, limit = 100, syncFromBlockchain = true } = input;
      const safeRecord = await getSafeForWorkspace(ctx, safeAddress);
      const userId = safeRecord.userDid;
      const workspaceId = safeRecord.workspaceId;

      console.log(
        `[getEnrichedTransactions] Querying for safe address: ${safeAddress} (user: ${userId}, workspace: ${workspaceId})`,
      );

      // Step 1: Sync incoming deposits to our database (only if needed)
      if (syncFromBlockchain) {
        try {
          // Fetch incoming transfers from Safe Transaction Service
          const url = new URL(
            `${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/incoming-transfers/`,
          );
          url.searchParams.append('limit', '100');
          const apiUrl = url.toString();

          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            const transfers = data.results || [];

            // Get all vault addresses for this user to filter out withdrawals
            const userVaults = await db.query.earnDeposits.findMany({
              where: and(
                eq(earnDeposits.userDid, userId),
                eq(earnDeposits.safeAddress, safeAddress),
                or(
                  eq(earnDeposits.workspaceId, workspaceId),
                  isNull(earnDeposits.workspaceId),
                ),
              ),
              columns: { vaultAddress: true },
            });

            const vaultAddresses = new Set(
              userVaults.map((v) => v.vaultAddress.toLowerCase()),
            );
            console.log(
              `[getEnrichedTransactions] Found ${vaultAddresses.size} vault addresses for filtering`,
            );

            // Filter for USDC transfers that are NOT from vault addresses and store new ones
            for (const transfer of transfers) {
              if (
                transfer.type === 'ERC20_TRANSFER' &&
                transfer.tokenAddress?.toLowerCase() ===
                  USDC_ADDRESS.toLowerCase() &&
                transfer.to?.toLowerCase() === safeAddress.toLowerCase()
              ) {
                // Check if this is a vault withdrawal (should be filtered out)
                const isFromVault = vaultAddresses.has(
                  transfer.from.toLowerCase(),
                );
                if (isFromVault) {
                  console.log(
                    `[getEnrichedTransactions] Filtering out vault withdrawal: ${formatUnits(BigInt(transfer.value), USDC_DECIMALS)} USDC from vault ${transfer.from}`,
                  );
                  continue;
                }

                // Check if we already have this transaction
                const existing = await db.query.incomingDeposits.findFirst({
                  where: eq(incomingDeposits.txHash, transfer.transactionHash),
                });

                if (!existing) {
                  await db.insert(incomingDeposits).values({
                    userDid: userId,
                    workspaceId,
                    safeAddress: safeAddress as `0x${string}`,
                    txHash: transfer.transactionHash as `0x${string}`,
                    fromAddress: transfer.from as `0x${string}`,
                    tokenAddress: USDC_ADDRESS as `0x${string}`,
                    amount: BigInt(transfer.value).toString(),
                    blockNumber: BigInt(transfer.blockNumber),
                    timestamp: new Date(transfer.executionDate),
                    swept: false,
                    metadata: {
                      tokenInfo: transfer.tokenInfo,
                      source: 'safe-transaction-service',
                      isVaultWithdrawal: false, // Explicitly mark as not a vault withdrawal
                    },
                  });
                  console.log(
                    `[getEnrichedTransactions] Stored new deposit: ${formatUnits(
                      BigInt(transfer.value),
                      USDC_DECIMALS,
                    )} USDC from ${transfer.from} (workspace: ${workspaceId})`,
                  );
                } else if (!existing.workspaceId) {
                  await db
                    .update(incomingDeposits)
                    .set({ workspaceId })
                    .where(eq(incomingDeposits.id, existing.id));
                }
              }
            }
          }
        } catch (error) {
          console.error('Error syncing incoming deposits:', error);
          // Continue even if sync fails
        }
      }

      // Step 2: Fetch ALL transactions from Safe Transaction Service
      const allTxUrl = new URL(
        `${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/all-transactions/`,
      );
      allTxUrl.searchParams.append('executed', 'true');
      allTxUrl.searchParams.append('queued', 'false');
      allTxUrl.searchParams.append('trusted', 'true');
      allTxUrl.searchParams.append('limit', limit.toString());

      try {
        console.log(
          `[getEnrichedTransactions] Fetching all transactions for ${safeAddress}`,
        );
        const response = await fetch(allTxUrl.toString());

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Error response from Safe Service (${response.status}): ${errorBody}`,
          );
          throw new Error(
            `Failed to fetch data from Safe Transaction Service: ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (!data || !data.results) {
          console.error(
            'Unexpected response structure from Safe Transaction Service',
            data,
          );
          return [];
        }

        // Step 3: Get sweep data for incoming USDC deposits
        const sweepDataMap = new Map<
          string,
          {
            swept: boolean;
            sweptAmount?: string;
            sweptPercentage?: number;
            sweptTxHash?: string;
            sweptAt?: number;
          }
        >();

        // Fetch all sweep data at once
        const deposits = await db.query.incomingDeposits.findMany({
          where: and(
            eq(incomingDeposits.safeAddress, safeAddress),
            eq(incomingDeposits.tokenAddress, USDC_ADDRESS),
            or(
              eq(incomingDeposits.workspaceId, workspaceId),
              isNull(incomingDeposits.workspaceId),
            ),
          ),
        });

        // Create a map for quick lookup
        deposits.forEach((deposit) => {
          sweepDataMap.set(deposit.txHash.toLowerCase(), {
            swept: deposit.swept,
            sweptAmount: deposit.sweptAmount?.toString(),
            sweptPercentage: deposit.sweptPercentage ?? undefined,
            sweptTxHash: deposit.sweptTxHash ?? undefined,
            sweptAt: deposit.sweptAt?.getTime(),
          });
        });

        // Step 4: Map and enrich transactions
        const transactions: TransactionItem[] = data.results
          .map((tx: TransactionItemFromService) => {
            const mappedTx = mapTxItem(tx, safeAddress);
            if (!mappedTx) return null;

            // Check if this is an incoming USDC transfer and enrich with sweep data
            const txHashLower = mappedTx.hash.toLowerCase();
            if (
              mappedTx.type === 'incoming' &&
              mappedTx.tokenSymbol === 'USDC' &&
              sweepDataMap.has(txHashLower)
            ) {
              const sweepData = sweepDataMap.get(txHashLower)!;
              return {
                ...mappedTx,
                ...sweepData,
              };
            }

            return mappedTx;
          })
          .filter(
            (tx: TransactionItem | null): tx is TransactionItem => tx !== null,
          )
          .sort(
            (a: TransactionItem, b: TransactionItem) =>
              b.timestamp - a.timestamp,
          );

        console.log(
          `[getEnrichedTransactions] Found ${transactions.length} transactions for ${safeAddress}`,
        );
        return transactions.slice(0, limit);
      } catch (error: any) {
        console.error(
          `Error fetching enriched transactions for Safe ${safeAddress}:`,
          error.message,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch enriched transaction history.',
          cause: error,
        });
      }
    }),

  /**
   * Fetches the ERC20 token balance for a given Safe address.
   */
  getBalance: protectedProcedure
    .input(balanceInputSchema)
    .query(async ({ input }) => {
      const { safeAddress, tokenAddress } = input;

      const publicClient = createPublicClient({
        chain: base,
        transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
      });

      try {
        const balance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [safeAddress as Address],
        });

        return {
          safeAddress,
          tokenAddress,
          balance, // Returns BigInt
        };
      } catch (error: any) {
        console.error(
          `Error fetching balance for ${tokenAddress} at ${safeAddress} on ${base.name}:`,
          error,
        );
        // Consider re-throwing a TRPCError for client handling
        throw new Error(
          `Failed to fetch balance: ${error.shortMessage || error.message}`,
        );
      }
    }),

  getSafeOwners: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine(isAddress, { message: 'Invalid Safe address' }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { safeAddress } = input;

      try {
        // Use Safe Transaction Service API to get Safe info including owners
        const url = `${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/`;
        console.log(`Fetching Safe owners for ${safeAddress} from ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Error response from Safe Service (${response.status}): ${errorBody}`,
          );
          throw new Error(`Failed to fetch Safe info: ${response.statusText}`);
        }

        const safeInfo = await response.json();

        return {
          owners: safeInfo.owners || [],
          threshold: safeInfo.threshold || 0,
          address: safeInfo.address || safeAddress,
        };
      } catch (error: any) {
        console.error(
          `Error fetching Safe owners for ${safeAddress}:`,
          error.message,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch Safe owners.',
        });
      }
    }),
});

// export type SafeRouter = typeof safeRouter; // Removed type export
type SafeWithWorkspace = Omit<UserSafe, 'workspaceId'> & {
  workspaceId: string;
};

function requireWorkspaceId(workspaceId: string | null | undefined): string {
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is required.',
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
      message: 'User context missing.',
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

  const safeRecord = await db.query.userSafes.findFirst({
    where: (tbl, helpers) =>
      helpers.and(
        helpers.eq(tbl.userDid, privyDid),
        helpers.eq(tbl.safeAddress, normalizedSafeAddress as `0x${string}`),
        helpers.or(
          helpers.eq(tbl.workspaceId, workspaceId),
          helpers.isNull(tbl.workspaceId),
        ),
      ),
  });

  if (!safeRecord) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Safe not found for the active workspace.',
    });
  }

  if (!safeRecord.workspaceId) {
    await db
      .update(userSafes)
      .set({ workspaceId })
      .where(eq(userSafes.id, safeRecord.id));
  }

  return { ...safeRecord, workspaceId } as SafeWithWorkspace;
}
