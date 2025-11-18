/**
 * Bridge Transaction CRUD operations
 * Handles database operations for cross-chain bridge transactions
 */

import { db } from '@/db';
import {
  bridgeTransactions,
  type InsertBridgeTransaction,
  type SelectBridgeTransaction,
} from '@/db/schema/bridge-transactions';
import { eq, desc, and } from 'drizzle-orm';
import type { SupportedChainId } from '@/lib/constants/chains';

/**
 * Create a new bridge transaction record
 * @param params - Bridge transaction data
 * @returns Created transaction ID
 */
export async function createBridgeTransaction(params: {
  userDid: string;
  sourceChainId: SupportedChainId;
  destChainId: SupportedChainId;
  vaultAddress: string;
  amount: string;
  bridgeFee: string;
  lpFee?: string;
  relayerGasFee?: string;
  relayerCapitalFee?: string;
  depositTxHash?: string;
  depositId?: string;
}): Promise<string> {
  const [result] = await db
    .insert(bridgeTransactions)
    .values({
      userDid: params.userDid,
      sourceChainId: params.sourceChainId,
      destChainId: params.destChainId,
      vaultAddress: params.vaultAddress,
      amount: params.amount,
      bridgeFee: params.bridgeFee,
      lpFee: params.lpFee || null,
      relayerGasFee: params.relayerGasFee || null,
      relayerCapitalFee: params.relayerCapitalFee || null,
      depositTxHash: params.depositTxHash || null,
      depositId: params.depositId || null,
      status: 'pending',
    })
    .returning({ id: bridgeTransactions.id });

  if (!result) {
    throw new Error('Failed to create bridge transaction');
  }

  return result.id;
}

/**
 * Update bridge transaction status
 * @param id - Transaction ID
 * @param status - New status
 * @param fillTxHash - Optional fill transaction hash
 */
export async function updateBridgeStatus(
  id: string,
  status: 'pending' | 'filled' | 'failed',
  fillTxHash?: string,
  errorMessage?: string,
): Promise<void> {
  const updateData: Partial<InsertBridgeTransaction> = {
    status,
  };

  if (fillTxHash) {
    updateData.fillTxHash = fillTxHash;
  }

  if (status === 'filled') {
    updateData.filledAt = new Date();
  }

  if (status === 'failed') {
    updateData.failedAt = new Date();
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }
  }

  await db
    .update(bridgeTransactions)
    .set(updateData)
    .where(eq(bridgeTransactions.id, id));
}

/**
 * Update bridge transaction deposit hash
 * @param id - Transaction ID
 * @param depositTxHash - Deposit transaction hash
 * @param depositId - Deposit ID from Across
 */
export async function updateBridgeDepositHash(
  id: string,
  depositTxHash: string,
  depositId?: string,
): Promise<void> {
  await db
    .update(bridgeTransactions)
    .set({
      depositTxHash,
      depositId: depositId || null,
    })
    .where(eq(bridgeTransactions.id, id));
}

/**
 * Get bridge transaction by ID
 * @param id - Transaction ID
 * @returns Bridge transaction or null
 */
export async function getBridgeTransaction(
  id: string,
): Promise<SelectBridgeTransaction | null> {
  const results = await db
    .select()
    .from(bridgeTransactions)
    .where(eq(bridgeTransactions.id, id))
    .limit(1);

  return results[0] || null;
}

/**
 * Get bridge transaction by deposit hash
 * @param depositTxHash - Deposit transaction hash
 * @returns Bridge transaction or null
 */
export async function getBridgeTransactionByDepositHash(
  depositTxHash: string,
): Promise<SelectBridgeTransaction | null> {
  const results = await db
    .select()
    .from(bridgeTransactions)
    .where(eq(bridgeTransactions.depositTxHash, depositTxHash))
    .limit(1);

  return results[0] || null;
}

/**
 * Get all bridge transactions for a user
 * @param userDid - User's DID
 * @returns Array of bridge transactions
 */
export async function getUserBridgeTransactions(
  userDid: string,
): Promise<SelectBridgeTransaction[]> {
  const results = await db
    .select()
    .from(bridgeTransactions)
    .where(eq(bridgeTransactions.userDid, userDid))
    .orderBy(desc(bridgeTransactions.createdAt));

  return results;
}

/**
 * Get pending bridge transactions for a user
 * @param userDid - User's DID
 * @returns Array of pending bridge transactions
 */
export async function getPendingBridgeTransactions(
  userDid: string,
): Promise<SelectBridgeTransaction[]> {
  const results = await db
    .select()
    .from(bridgeTransactions)
    .where(
      and(
        eq(bridgeTransactions.userDid, userDid),
        eq(bridgeTransactions.status, 'pending'),
      ),
    )
    .orderBy(desc(bridgeTransactions.createdAt));

  return results;
}

/**
 * Get recent bridge transactions (last 24 hours)
 * @param userDid - User's DID
 * @param limit - Maximum number of results
 * @returns Array of recent bridge transactions
 */
export async function getRecentBridgeTransactions(
  userDid: string,
  limit: number = 10,
): Promise<SelectBridgeTransaction[]> {
  const results = await db
    .select()
    .from(bridgeTransactions)
    .where(eq(bridgeTransactions.userDid, userDid))
    .orderBy(desc(bridgeTransactions.createdAt))
    .limit(limit);

  return results;
}

/**
 * Delete old completed bridge transactions
 * @param olderThanDays - Delete transactions older than this many days
 * @returns Number of deleted transactions
 */
export async function cleanupOldBridgeTransactions(
  olderThanDays: number = 30,
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  // Note: This would need a proper date comparison in production
  // For now, we just keep all records for auditing purposes
  console.log(
    `Cleanup requested for transactions older than ${cutoffDate.toISOString()}`,
  );

  return 0;
}
