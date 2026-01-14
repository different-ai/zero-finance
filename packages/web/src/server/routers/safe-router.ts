import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
// import axios from 'axios'; // Use fetch instead
import { isAddress, erc20Abi, getAddress } from 'viem';
import { db } from '@/db';
import {
  incomingDeposits,
  outgoingTransfers,
  userSafes,
  workspaceMembers,
} from '@/db/schema';
import type { UserSafe } from '@/db/schema';
import { eq, and, desc, or, isNull, sql } from 'drizzle-orm';
import { formatUnits } from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import { getSafeBalance } from '@/server/services/safe.service';
import { ALL_VAULT_ADDRESSES } from '../earn/all-vault-addresses';

// Base Sepolia URL (Use Base Mainnet URL for production)
// const BASE_TRANSACTION_SERVICE_URL = 'https://safe-transaction-base-sepolia.safe.global/api';
const BASE_TRANSACTION_SERVICE_URL =
  'https://safe-transaction-base.safe.global/api'; // PRODUCTION

// Define structure for a transaction item (matching the frontend component)
// Simplified version based on Safe Service response structure
// NOTE: The Safe Transaction Service API returns `txType` for /all-transactions/ endpoint
// but some endpoints may use `type`. We support both for compatibility.
interface TransactionItemFromService {
  type?: 'ETHEREUM_TRANSACTION' | 'MODULE_TRANSACTION' | 'MULTISIG_TRANSACTION';
  txType?:
    | 'ETHEREUM_TRANSACTION'
    | 'MODULE_TRANSACTION'
    | 'MULTISIG_TRANSACTION';
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

  // Handle both 'type' and 'txType' field names from the API
  // The /all-transactions/ endpoint returns 'txType', while other endpoints may use 'type'
  const txType = tx.type || tx.txType;

  // Skip unexecuted multisig for now
  if (txType === 'MULTISIG_TRANSACTION' && !tx.isExecuted) {
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
    if (txType === 'ETHEREUM_TRANSACTION') {
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
    } else if (txType === 'MULTISIG_TRANSACTION') {
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
  if (!tx.to && txType === 'ETHEREUM_TRANSACTION') {
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
   * Fetches enriched transaction history from our database.
   * Call syncSafeTransactions first to ensure DB is up-to-date.
   */
  getEnrichedTransactions: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Ethereum address',
          }),
        workspaceId: z.string().uuid(),
        limit: z.number().optional().default(100),
        // Keep for backwards compatibility but ignored - use syncSafeTransactions instead
        syncFromBlockchain: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ input, ctx }): Promise<TransactionItem[]> => {
      const { safeAddress, workspaceId, limit = 100 } = input;
      const safeRecord = await getSafeForWorkspace(
        ctx,
        safeAddress,
        workspaceId,
      );

      console.log(
        `[getEnrichedTransactions] Querying DB for safe: ${safeAddress} (workspace: ${workspaceId})`,
      );

      const transactions: TransactionItem[] = [];

      // Step 1: Fetch incoming deposits from our DB
      // Use case-insensitive comparison since addresses may be stored with different casing
      const deposits = await db.query.incomingDeposits.findMany({
        where: and(
          sql`lower(${incomingDeposits.safeAddress}) = ${safeAddress.toLowerCase()}`,
          or(
            eq(incomingDeposits.workspaceId, workspaceId),
            isNull(incomingDeposits.workspaceId),
          ),
        ),
        orderBy: (d, { desc: descFn }) => [descFn(d.timestamp)],
        limit: limit,
      });

      for (const deposit of deposits) {
        transactions.push({
          type: 'incoming',
          hash: deposit.txHash,
          timestamp: deposit.timestamp.getTime(),
          from: deposit.fromAddress,
          to: safeAddress,
          value: deposit.amount?.toString(),
          tokenAddress: deposit.tokenAddress,
          tokenSymbol: 'USDC',
          tokenDecimals: USDC_DECIMALS,
          // Sweep data
          swept: deposit.swept,
          sweptAmount: deposit.sweptAmount?.toString(),
          sweptPercentage: deposit.sweptPercentage ?? undefined,
          sweptTxHash: deposit.sweptTxHash ?? undefined,
          sweptAt: deposit.sweptAt?.getTime(),
        });
      }

      // Step 2: Fetch outgoing transfers from our DB
      // Use case-insensitive comparison since addresses may be stored with different casing
      const outgoing = await db.query.outgoingTransfers.findMany({
        where: and(
          sql`lower(${outgoingTransfers.safeAddress}) = ${safeAddress.toLowerCase()}`,
          or(
            eq(outgoingTransfers.workspaceId, workspaceId),
            isNull(outgoingTransfers.workspaceId),
          ),
        ),
        orderBy: (t, { desc: descFn }) => [descFn(t.timestamp)],
        limit: limit,
      });

      for (const tx of outgoing) {
        transactions.push({
          type: 'outgoing',
          hash: tx.txHash,
          timestamp: tx.timestamp.getTime(),
          from: safeAddress,
          to: tx.toAddress,
          value: tx.amount?.toString(),
          tokenAddress: tx.tokenAddress ?? undefined,
          tokenSymbol: tx.tokenSymbol ?? undefined,
          tokenDecimals: tx.tokenDecimals ?? undefined,
          methodName: tx.methodName ?? undefined,
        });
      }

      // Sort by timestamp descending
      transactions.sort((a, b) => b.timestamp - a.timestamp);

      console.log(
        `[getEnrichedTransactions] Found ${deposits.length} incoming, ${outgoing.length} outgoing for ${safeAddress}`,
      );

      return transactions.slice(0, limit);
    }),

  /**
   * Syncs Safe transactions from the Safe Transaction Service to our database.
   * Uses batch upserts for performance (no N+1 queries).
   * Should be called on component mount to ensure the DB is up-to-date.
   */
  syncSafeTransactions: protectedProcedure
    .input(
      z.object({
        safeAddress: z
          .string()
          .refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Ethereum address',
          }),
        workspaceId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { safeAddress, workspaceId } = input;
      const safeRecord = await getSafeForWorkspace(
        ctx,
        safeAddress,
        workspaceId,
      );
      const userId = safeRecord.userDid;

      console.log(
        `[syncSafeTransactions] Syncing for safe: ${safeAddress} (workspace: ${workspaceId})`,
      );

      let incomingSynced = 0;
      let outgoingSynced = 0;

      // Use the global set of ALL known vault addresses to filter out vault withdrawals.
      // This includes all vaults from base-vaults, arbitrum-vaults, optimism-vaults, gnosis-vaults.
      // Transfers FROM these addresses are vault redemptions, not regular "Received" transactions.
      const vaultAddresses = ALL_VAULT_ADDRESSES;

      // Step 1: Sync incoming transfers (batch upsert)
      try {
        const incomingUrl = new URL(
          `${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/incoming-transfers/`,
        );
        incomingUrl.searchParams.append('limit', '100');

        const response = await fetch(incomingUrl.toString());
        if (response.ok) {
          const data = await response.json();
          const transfers = data.results || [];

          // Build batch of records to insert
          const incomingRecords: Array<{
            userDid: string;
            workspaceId: string;
            safeAddress: `0x${string}`;
            txHash: `0x${string}`;
            fromAddress: `0x${string}`;
            tokenAddress: `0x${string}`;
            amount: string;
            blockNumber: bigint;
            timestamp: Date;
            swept: boolean;
            metadata: Record<string, unknown>;
          }> = [];

          for (const transfer of transfers) {
            if (
              transfer.type === 'ERC20_TRANSFER' &&
              transfer.tokenAddress?.toLowerCase() ===
                USDC_ADDRESS.toLowerCase() &&
              transfer.to?.toLowerCase() === safeAddress.toLowerCase() &&
              !vaultAddresses.has(transfer.from.toLowerCase())
            ) {
              incomingRecords.push({
                userDid: userId,
                workspaceId,
                safeAddress: safeAddress.toLowerCase() as `0x${string}`,
                txHash: transfer.transactionHash as `0x${string}`,
                fromAddress: transfer.from.toLowerCase() as `0x${string}`,
                tokenAddress: USDC_ADDRESS.toLowerCase() as `0x${string}`,
                amount: BigInt(transfer.value).toString(),
                blockNumber: BigInt(transfer.blockNumber),
                timestamp: new Date(transfer.executionDate),
                swept: false,
                metadata: {
                  tokenInfo: transfer.tokenInfo,
                  source: 'safe-transaction-service',
                },
              });
            }
          }

          // Batch insert with ON CONFLICT DO NOTHING
          if (incomingRecords.length > 0) {
            const result = await db
              .insert(incomingDeposits)
              .values(incomingRecords)
              .onConflictDoNothing({ target: incomingDeposits.txHash });
            incomingSynced = incomingRecords.length;
          }
        }
      } catch (error) {
        console.error('[syncSafeTransactions] Error syncing incoming:', error);
      }

      // Step 2: Sync outgoing transfers (batch upsert)
      try {
        const outgoingUrl = new URL(
          `${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/multisig-transactions/`,
        );
        outgoingUrl.searchParams.append('executed', 'true');
        outgoingUrl.searchParams.append('limit', '100');

        const response = await fetch(outgoingUrl.toString());
        if (response.ok) {
          const data = await response.json();
          const transactions = data.results || [];

          // Build batch of records to insert
          const outgoingRecords: Array<{
            userDid: string;
            workspaceId: string;
            safeAddress: `0x${string}`;
            txHash: `0x${string}`;
            toAddress: `0x${string}`;
            tokenAddress: string | null;
            tokenSymbol: string | null;
            tokenDecimals: number | null;
            amount: string;
            blockNumber: bigint;
            timestamp: Date;
            txType: string;
            methodName: string | null;
            metadata: Record<string, unknown>;
          }> = [];

          for (const tx of transactions) {
            if (!tx.transactionHash) continue;

            let tokenAddress: string | null = null;
            let tokenSymbol: string | null = null;
            let tokenDecimals: number | null = null;
            let amount = '0';
            let toAddress = tx.to || '';

            // Check transfers array for ERC20 transfers
            if (tx.transfers && tx.transfers.length > 0) {
              const erc20Transfer = tx.transfers.find(
                (t: any) =>
                  t.type === 'ERC20_TRANSFER' &&
                  t.from?.toLowerCase() === safeAddress.toLowerCase(),
              );
              if (erc20Transfer) {
                tokenAddress = erc20Transfer.tokenInfo?.address || null;
                tokenSymbol = erc20Transfer.tokenInfo?.symbol || null;
                tokenDecimals = erc20Transfer.tokenInfo?.decimals || null;
                amount = erc20Transfer.value || '0';
                toAddress = erc20Transfer.to || tx.to || '';
              }
            }

            // Fall back to decoded data for transfers
            if (
              amount === '0' &&
              tx.dataDecoded?.method === 'transfer' &&
              tx.dataDecoded.parameters
            ) {
              const valueParam = tx.dataDecoded.parameters.find(
                (p: any) => p.name === 'value' || p.name === 'amount',
              );
              const toParam = tx.dataDecoded.parameters.find(
                (p: any) => p.name === 'to' || p.name === 'recipient',
              );
              if (valueParam) amount = valueParam.value;
              if (toParam) toAddress = toParam.value;
              tokenAddress = tx.to;
            }

            outgoingRecords.push({
              userDid: userId,
              workspaceId,
              safeAddress: safeAddress.toLowerCase() as `0x${string}`,
              txHash: tx.transactionHash as `0x${string}`,
              toAddress: toAddress.toLowerCase() as `0x${string}`,
              tokenAddress: tokenAddress?.toLowerCase() || null,
              tokenSymbol,
              tokenDecimals,
              amount,
              blockNumber: BigInt(tx.blockNumber || 0),
              timestamp: new Date(tx.executionDate),
              txType: tx.dataDecoded?.method || 'unknown',
              methodName: tx.dataDecoded?.method || null,
              metadata: {
                dataDecoded: tx.dataDecoded,
                transfers: tx.transfers,
                value: tx.value,
              },
            });
          }

          // Batch insert with ON CONFLICT DO NOTHING
          if (outgoingRecords.length > 0) {
            await db
              .insert(outgoingTransfers)
              .values(outgoingRecords)
              .onConflictDoNothing({ target: outgoingTransfers.txHash });
            outgoingSynced = outgoingRecords.length;
          }
        }
      } catch (error) {
        console.error('[syncSafeTransactions] Error syncing outgoing:', error);
      }

      console.log(
        `[syncSafeTransactions] Synced ${incomingSynced} incoming, ${outgoingSynced} outgoing for ${safeAddress}`,
      );

      return { incomingSynced, outgoingSynced };
    }),

  /**
   * Fetches the ERC20 token balance for a given Safe address.
   */
  getBalance: protectedProcedure
    .input(balanceInputSchema)
    .query(async ({ input }) => {
      const { safeAddress, tokenAddress } = input;

      try {
        const result = await getSafeBalance({
          safeAddress: safeAddress as `0x${string}`,
          tokenAddress: tokenAddress as `0x${string}`,
        });

        if (!result) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch balance',
          });
        }

        return {
          safeAddress,
          tokenAddress,
          balance: result.raw,
        };
      } catch (error: any) {
        console.error(
          `Error fetching balance for ${tokenAddress} at ${safeAddress} on Base:`,
          error,
        );

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch balance: ${error.shortMessage || error.message}`,
        });
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

/**
 * Verifies that a user is a member of the specified workspace.
 * Throws FORBIDDEN if the user is not a member.
 */
async function verifyWorkspaceMembership(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const membership = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.userId, userId),
      eq(workspaceMembers.workspaceId, workspaceId),
    ),
  });

  if (!membership) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this workspace.',
    });
  }
}

/**
 * Gets a Safe record after verifying workspace membership.
 * The workspaceId is passed explicitly from the client (not from ctx).
 */
async function getSafeForWorkspace(
  ctx: {
    user?: { id?: string | null };
    userId?: string | null;
  },
  safeAddress: string,
  workspaceId: string,
): Promise<SafeWithWorkspace> {
  const privyDid = requirePrivyDid(ctx);
  const normalizedSafeAddress = getAddress(safeAddress);

  // Step 1: Verify user is a member of this workspace
  await verifyWorkspaceMembership(privyDid, workspaceId);

  // Step 2: Find the Safe in this workspace
  const safeRecord = await db.query.userSafes.findFirst({
    where: (tbl, helpers) =>
      helpers.and(
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
      message: 'Safe not found for this workspace.',
    });
  }

  // Step 3: Backfill workspaceId if missing
  if (!safeRecord.workspaceId) {
    await db
      .update(userSafes)
      .set({ workspaceId })
      .where(eq(userSafes.id, safeRecord.id));
  }

  return { ...safeRecord, workspaceId } as SafeWithWorkspace;
}
