/**
 * Safe Multi-Chain Service
 *
 * Manages Safe deployment and tracking across multiple chains:
 * - Base chain (8453) is the primary Safe - source of truth for owners
 * - Other chains have Safes deployed lazily on first use
 * - All Safes share the same address via CREATE2 deterministic deployment
 * - Owner changes on Base propagate to all other chains via sync operations
 */

import { db } from '@/db';
import { safes, safeOwnerSyncOperations } from '@/db/schema/safes';
import { eq, and } from 'drizzle-orm';
import type { Address, Hex } from 'viem';
import {
  checkSafeExists,
  getSafeConfiguration,
  BASE_CHAIN_ID,
} from '@/lib/safe-multi-chain';

/**
 * Get Safe record from database
 */
export async function getSafeRecord(
  workspaceId: string,
  chainId: number,
): Promise<typeof safes.$inferSelect | undefined> {
  const [safe] = await db
    .select()
    .from(safes)
    .where(and(eq(safes.workspaceId, workspaceId), eq(safes.chainId, chainId)))
    .limit(1);

  return safe;
}

/**
 * Get all Safe records for a workspace across all chains
 */
export async function getAllSafesForWorkspace(
  workspaceId: string,
): Promise<(typeof safes.$inferSelect)[]> {
  return db.select().from(safes).where(eq(safes.workspaceId, workspaceId));
}

/**
 * Get primary Safe (Base chain) for workspace
 */
export async function getPrimarySafe(
  workspaceId: string,
): Promise<typeof safes.$inferSelect | undefined> {
  const [safe] = await db
    .select()
    .from(safes)
    .where(and(eq(safes.workspaceId, workspaceId), eq(safes.isPrimary, true)))
    .limit(1);

  return safe;
}

/**
 * Create or update Safe record in database
 */
export async function upsertSafeRecord({
  workspaceId,
  address,
  chainId,
  owners,
  threshold,
  salt,
  isPrimary = false,
  deploymentTx,
  deployedAt,
  deployedBy,
}: {
  workspaceId: string;
  address: Address;
  chainId: number;
  owners: Address[];
  threshold: number;
  salt: string;
  isPrimary?: boolean;
  deploymentTx?: Hex;
  deployedAt?: Date;
  deployedBy?: Address;
}): Promise<typeof safes.$inferSelect> {
  const now = new Date();

  // Check if record exists
  const existing = await getSafeRecord(workspaceId, chainId);

  if (existing) {
    // Update existing record
    const [updated] = await db
      .update(safes)
      .set({
        owners,
        threshold,
        salt,
        deploymentTx: deploymentTx ?? existing.deploymentTx,
        deployedAt: deployedAt ?? existing.deployedAt,
        deployedBy: deployedBy ?? existing.deployedBy,
        syncStatus: 'synced',
        syncedAt: now,
        updatedAt: now,
      })
      .where(
        and(eq(safes.workspaceId, workspaceId), eq(safes.chainId, chainId)),
      )
      .returning();

    return updated!;
  }

  // Create new record
  const [created] = await db
    .insert(safes)
    .values({
      workspaceId,
      address,
      chainId,
      owners,
      threshold,
      salt,
      isPrimary,
      deploymentTx,
      deployedAt,
      deployedBy,
      syncStatus: 'synced',
      syncedAt: now,
    })
    .returning();

  return created!;
}

/**
 * Ensure Safe exists on destination chain (lazy deployment)
 * 1. Check database for existing record
 * 2. Check on-chain if Safe exists
 * 3. Deploy if needed
 * 4. Persist to database
 */
export async function ensureSafeOnChain({
  workspaceId,
  safeAddress,
  sourceChainId = BASE_CHAIN_ID,
  destinationChainId,
  saltNonce = 0n,
}: {
  workspaceId: string;
  safeAddress: Address;
  sourceChainId?: number;
  destinationChainId: number;
  saltNonce?: bigint;
}): Promise<{
  exists: boolean;
  deployed: boolean;
  hash?: Hex;
  safeRecord: typeof safes.$inferSelect;
}> {
  console.log(
    `[Safe Multi-Chain Service] Ensuring Safe ${safeAddress} exists on chain ${destinationChainId} for workspace ${workspaceId}...`,
  );

  // 1. Check database first
  let safeRecord = await getSafeRecord(workspaceId, destinationChainId);

  if (safeRecord && safeRecord.deploymentTx) {
    console.log(
      `[Safe Multi-Chain Service] Safe already tracked in database for chain ${destinationChainId}`,
    );
    return {
      exists: true,
      deployed: false,
      safeRecord,
    };
  }

  // 2. Check on-chain
  const existsOnChain = await checkSafeExists(safeAddress, destinationChainId);

  if (existsOnChain && !safeRecord) {
    // Safe exists on-chain but not in database - sync it
    console.log(
      `[Safe Multi-Chain Service] Safe exists on-chain but not in database, syncing...`,
    );

    const config = await getSafeConfiguration(safeAddress, destinationChainId);

    safeRecord = await upsertSafeRecord({
      workspaceId,
      address: safeAddress,
      chainId: destinationChainId,
      owners: config.owners,
      threshold: config.threshold,
      salt: `0x${saltNonce.toString(16).padStart(64, '0')}`,
      isPrimary: destinationChainId === BASE_CHAIN_ID,
    });

    return {
      exists: true,
      deployed: false,
      safeRecord,
    };
  }

  if (existsOnChain && safeRecord) {
    // Safe exists both on-chain and in database
    return {
      exists: true,
      deployed: false,
      safeRecord,
    };
  }

  // 3. Safe doesn't exist - return error indicating client-side deployment needed
  console.log(
    `[Safe Multi-Chain Service] Safe doesn't exist on chain ${destinationChainId}. Client must deploy it.`,
  );

  // Throw error telling client to deploy the Safe themselves
  throw new Error(
    `SAFE_NOT_DEPLOYED: Safe ${safeAddress} needs to be deployed on chain ${destinationChainId}. Please deploy using your wallet first.`,
  );
}

/**
 * Initialize primary Safe (Base chain) in database
 * Call this when a new workspace's Safe is first created
 */
export async function initializePrimarySafe({
  workspaceId,
  safeAddress,
  owners,
  threshold,
  saltNonce = 0n,
}: {
  workspaceId: string;
  safeAddress: Address;
  owners: Address[];
  threshold: number;
  saltNonce?: bigint;
}): Promise<typeof safes.$inferSelect> {
  console.log(
    `[Safe Multi-Chain Service] Initializing primary Safe for workspace ${workspaceId}...`,
  );

  // Verify Safe exists on Base chain
  const exists = await checkSafeExists(safeAddress, BASE_CHAIN_ID);
  if (!exists) {
    throw new Error(
      `Safe ${safeAddress} does not exist on Base chain (${BASE_CHAIN_ID})`,
    );
  }

  // Create or update primary Safe record
  const safeRecord = await upsertSafeRecord({
    workspaceId,
    address: safeAddress,
    chainId: BASE_CHAIN_ID,
    owners,
    threshold,
    salt: `0x${saltNonce.toString(16).padStart(64, '0')}`,
    isPrimary: true,
  });

  console.log(
    `[Safe Multi-Chain Service] ✅ Primary Safe initialized in database`,
  );

  return safeRecord;
}

/**
 * Queue owner sync operation
 * When owners change on Base Safe, queue sync to other chains
 */
export async function queueOwnerSync({
  workspaceId,
  operationType,
  ownerAddress,
  threshold,
  baseTxHash,
  chainsToSync,
}: {
  workspaceId: string;
  operationType: 'add_owner' | 'remove_owner' | 'change_threshold';
  ownerAddress?: Address;
  threshold?: number;
  baseTxHash?: Hex;
  chainsToSync: string[];
}): Promise<typeof safeOwnerSyncOperations.$inferSelect> {
  console.log(
    `[Safe Multi-Chain Service] Queueing owner sync operation: ${operationType}`,
  );

  const [operation] = await db
    .insert(safeOwnerSyncOperations)
    .values({
      workspaceId,
      operationType,
      ownerAddress,
      threshold,
      baseTxHash,
      baseExecutedAt: new Date(),
      chainsToSync,
      status: 'pending',
      syncResults: {},
    })
    .returning();

  console.log(
    `[Safe Multi-Chain Service] ✅ Sync operation queued with ID ${operation!.id}`,
  );

  return operation!;
}

/**
 * Get pending sync operations for a workspace
 */
export async function getPendingSyncOperations(
  workspaceId: string,
): Promise<(typeof safeOwnerSyncOperations.$inferSelect)[]> {
  return db
    .select()
    .from(safeOwnerSyncOperations)
    .where(
      and(
        eq(safeOwnerSyncOperations.workspaceId, workspaceId),
        eq(safeOwnerSyncOperations.status, 'pending'),
      ),
    );
}

/**
 * Update sync operation status
 */
export async function updateSyncOperationStatus({
  operationId,
  status,
  syncResults,
}: {
  operationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  syncResults?: Record<
    string,
    {
      status: 'pending' | 'success' | 'failed';
      txHash?: string;
      error?: string;
      executedAt?: string;
    }
  >;
}): Promise<typeof safeOwnerSyncOperations.$inferSelect> {
  const [updated] = await db
    .update(safeOwnerSyncOperations)
    .set({
      status,
      syncResults,
      updatedAt: new Date(),
    })
    .where(eq(safeOwnerSyncOperations.id, operationId))
    .returning();

  return updated!;
}
