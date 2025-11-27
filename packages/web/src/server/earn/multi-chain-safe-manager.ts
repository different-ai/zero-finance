/**
 * Multi-Chain Safe Manager
 * Server-side service for managing Safes across multiple chains
 */

import { db } from '@/db';
import {
  userSafes,
  userWalletsTable,
  type UserSafe,
  type NewUserSafe,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { type Address, type Hex, createPublicClient, http } from 'viem';
import { base, arbitrum } from 'viem/chains';
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
  getChainConfig,
} from '@/lib/constants/chains';
import {
  type SafeInfo,
  type MultiChainSafeStatus,
} from '@/lib/types/multi-chain';
import {
  getSafeDeploymentTx,
  checkSafeDeployedOnChain as checkSafeDeployed,
} from '@/lib/safe-multi-chain';

/**
 * Get all Safes within a workspace across all chains.
 * In a shared workspace, all members can see the workspace's Safes.
 *
 * @param userDid - The user's Privy DID (used for orphan migration, not primary filter)
 * @param workspaceId - The workspace ID (REQUIRED - primary filter for security)
 * @param safeType - Optional filter by safe type
 * @returns Array of Safe records belonging to the workspace
 */
export async function getUserSafes(
  userDid: string,
  workspaceId: string,
  safeType?: 'primary' | 'tax' | 'liquidity' | 'yield',
): Promise<UserSafe[]> {
  // Query by workspace only - all workspace members should see workspace Safes
  const conditions = [eq(userSafes.workspaceId, workspaceId)];

  if (safeType) {
    conditions.push(eq(userSafes.safeType, safeType));
  }

  let safes = await db.query.userSafes.findMany({
    where: and(...conditions),
    orderBy: (safes, { asc }) => [asc(safes.createdAt)],
  });

  // If no workspace-scoped safes found, check for orphaned safes (null workspaceId)
  // belonging to this user and auto-associate them with the current workspace
  if (safes.length === 0) {
    const orphanConditions = [eq(userSafes.userDid, userDid)];
    if (safeType) {
      orphanConditions.push(eq(userSafes.safeType, safeType));
    }

    const orphanedSafes = await db.query.userSafes.findMany({
      where: and(...orphanConditions),
      orderBy: (safes, { asc }) => [asc(safes.createdAt)],
    });

    // Filter to only truly orphaned safes (null/undefined workspaceId)
    const trulyOrphaned = orphanedSafes.filter((s) => !s.workspaceId);

    if (trulyOrphaned.length > 0) {
      console.log(
        `[getUserSafes] Found ${trulyOrphaned.length} orphaned safes for user ${userDid}, auto-associating with workspace ${workspaceId}`,
      );

      // Auto-associate orphaned safes with current workspace
      for (const safe of trulyOrphaned) {
        await db
          .update(userSafes)
          .set({ workspaceId })
          .where(eq(userSafes.id, safe.id));
      }

      // Re-fetch workspace safes after migration
      safes = await db.query.userSafes.findMany({
        where: and(...conditions),
        orderBy: (safes, { asc }) => [asc(safes.createdAt)],
      });
    }
  }

  return safes;
}

/**
 * Get Safe on a specific chain within a workspace.
 * In a shared workspace, all members can access the workspace's Safes.
 *
 * @param userDid - The user's Privy DID (kept for API compatibility, not used in query)
 * @param workspaceId - The workspace ID (REQUIRED - primary filter for security)
 * @param chainId - The chain ID
 * @param safeType - The safe type
 * @returns Safe record if found, null otherwise
 */
export async function getSafeOnChain(
  userDid: string,
  workspaceId: string,
  chainId: SupportedChainId,
  safeType: 'primary' | 'tax' | 'liquidity' | 'yield',
): Promise<UserSafe | null> {
  // Query by workspace only - all workspace members should access workspace Safes
  const safe = await db.query.userSafes.findFirst({
    where: and(
      eq(userSafes.workspaceId, workspaceId),
      eq(userSafes.chainId, chainId),
      eq(userSafes.safeType, safeType),
    ),
  });

  return safe || null;
}

/**
 * Check if a Safe is deployed on a specific chain
 * Uses RPC to check on-chain deployment status
 * @param safeAddress - The Safe address
 * @param chainId - The chain ID
 * @returns true if deployed, false otherwise
 */
export async function checkSafeDeployedOnChain(
  safeAddress: Address,
  chainId: SupportedChainId,
): Promise<boolean> {
  // First check database for cached result
  const safe = await db.query.userSafes.findFirst({
    where: and(
      eq(userSafes.safeAddress, safeAddress),
      eq(userSafes.chainId, chainId),
    ),
  });

  if (safe) {
    return true;
  }

  // Check on-chain using RPC
  return checkSafeDeployed(safeAddress, chainId);
}

/**
 * Create a new Safe record in the database
 * @param safeData - Safe data to insert
 * @returns Created Safe record
 */
export async function createSafeRecord(
  safeData: NewUserSafe,
): Promise<UserSafe> {
  const [newSafe] = await db.insert(userSafes).values(safeData).returning();

  if (!newSafe) {
    throw new Error('Failed to create Safe record');
  }

  return newSafe;
}

/**
 * Update Safe module status
 * @param safeId - Safe record ID
 * @param isEarnModuleEnabled - Whether earn module is enabled
 * @returns Updated Safe record
 */
export async function updateSafeModuleStatus(
  safeId: string,
  isEarnModuleEnabled: boolean,
): Promise<UserSafe> {
  const [updatedSafe] = await db
    .update(userSafes)
    .set({ isEarnModuleEnabled })
    .where(eq(userSafes.id, safeId))
    .returning();

  if (!updatedSafe) {
    throw new Error('Failed to update Safe module status');
  }

  return updatedSafe;
}

/**
 * Get multi-chain deployment status for a user's Safe
 * Returns information about Safe deployment across all supported chains
 * @param userDid - The user's Privy DID
 * @param workspaceId - The workspace ID (REQUIRED for security)
 * @param safeType - The safe type to check
 * @returns Multi-chain Safe status
 */
export async function getMultiChainSafeStatus(
  userDid: string,
  workspaceId: string,
  safeType: 'primary' | 'tax' | 'liquidity' | 'yield',
): Promise<MultiChainSafeStatus> {
  const safes = await getUserSafes(userDid, workspaceId, safeType);

  const status: MultiChainSafeStatus = {
    userDid,
    safeType,
    chains: {
      [SUPPORTED_CHAINS.BASE]: null,
      [SUPPORTED_CHAINS.ARBITRUM]: null,
      [SUPPORTED_CHAINS.MAINNET]: null,
    },
  };

  // Map safes to their chains
  for (const safe of safes) {
    const safeInfo: SafeInfo = {
      safeAddress: safe.safeAddress as Address,
      chainId: safe.chainId as SupportedChainId,
      isDeployed: true, // If we have a record, it's deployed
    };

    status.chains[safe.chainId as SupportedChainId] = safeInfo;
  }

  return status;
}

/**
 * Get Safe deployment transaction data
 * Prepares transaction for deploying a Safe on a specific chain with same config as source Safe
 * @param sourceChainSafeAddress - Safe address on source chain
 * @param sourceChainId - Source chain ID
 * @param targetChainId - Target chain ID
 * @returns Transaction data for deployment
 */
export async function getSafeDeploymentTransactionFromSource(
  sourceChainSafeAddress: Address,
  sourceChainId: SupportedChainId,
  targetChainId: SupportedChainId,
): Promise<{
  to: Address;
  data: Hex;
  value: bigint;
  predictedAddress: Address;
}> {
  // Get Safe info from source chain to get owners and threshold
  const config = getChainConfig(sourceChainId);
  const rpcUrl = config.rpcUrls.alchemy || config.rpcUrls.public[0];
  const viemChain = sourceChainId === SUPPORTED_CHAINS.BASE ? base : arbitrum;

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(rpcUrl),
  });

  // Read Safe owners and threshold from source chain
  const [owners, threshold] = await Promise.all([
    publicClient.readContract({
      address: sourceChainSafeAddress,
      abi: [
        {
          inputs: [],
          name: 'getOwners',
          outputs: [{ name: '', type: 'address[]' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getOwners',
    }),
    publicClient.readContract({
      address: sourceChainSafeAddress,
      abi: [
        {
          inputs: [],
          name: 'getThreshold',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getThreshold',
    }),
  ]);

  // Use the source Safe address as salt nonce to ensure same address on target chain
  // This creates a deterministic deployment based on the source Safe
  const saltNonce = sourceChainSafeAddress.toLowerCase();

  // Get deployment transaction for target chain
  const deploymentTx = await getSafeDeploymentTx({
    owners: owners as Address[],
    threshold: Number(threshold),
    chainId: targetChainId,
    saltNonce,
  });

  return {
    to: deploymentTx.to,
    data: deploymentTx.data,
    value: deploymentTx.value,
    predictedAddress: deploymentTx.predictedAddress,
  };
}

/**
 * Get Safe deployment transaction data for user
 * Prepares transaction for deploying a Safe on a specific chain
 * @param userDid - The user's Privy DID
 * @param chainId - Target chain ID
 * @param safeType - Type of Safe to deploy
 * @returns Transaction data for deployment
 */

/**
 * Delete a user's Safe on a specific chain
 * Used for administrative cleanup or resetting state
 */
export async function deleteUserSafe(
  userDid: string,
  chainId: SupportedChainId,
): Promise<void> {
  // Normalize chainId to match DB storage (if needed, currently numbers match)
  const safes = await db.query.userSafes.findMany({
    where: (tbl, { eq, and }) =>
      and(eq(tbl.userDid, userDid), eq(tbl.chainId, chainId)),
  });

  if (safes.length === 0) return;

  // Delete all found safes for this user on this chain
  for (const safe of safes) {
    await db.delete(userSafes).where(eq(userSafes.id, safe.id));
  }

  console.log(
    `Deleted ${safes.length} safes for user ${userDid} on chain ${chainId}`,
  );
}
export async function getSafeDeploymentTransaction(
  userDid: string,
  workspaceId: string,
  chainId: SupportedChainId,
  safeType: 'primary' | 'tax' | 'liquidity' | 'yield',
): Promise<{
  to: Address;
  data: string;
  value: string;
  predictedAddress: Address;
}> {
  // Get source Safe from Base (primary chain) to use its address as salt
  const sourceSafe = await getSafeOnChain(
    userDid,
    workspaceId,
    SUPPORTED_CHAINS.BASE,
    safeType,
  );

  if (!sourceSafe) {
    throw new Error(
      `No ${safeType} Safe found on Base. Cannot deploy to ${chainId}`,
    );
  }

  // Always use source Safe's owners for consistency
  // This ensures the Smart Wallet that owns the Base Safe also owns cross-chain Safes
  const tx = await getSafeDeploymentTransactionFromSource(
    sourceSafe.safeAddress as Address,
    SUPPORTED_CHAINS.BASE,
    chainId,
  );

  // Check if Safe already exists on this chain in DB
  const existingSafe = await getSafeOnChain(
    userDid,
    workspaceId,
    chainId,
    safeType,
  );

  if (existingSafe) {
    // If it exists, verify it matches our prediction
    if (
      existingSafe.safeAddress.toLowerCase() !==
      tx.predictedAddress.toLowerCase()
    ) {
      throw new Error(
        `Safe already exists on chain ${chainId} but address mismatch. Existing: ${existingSafe.safeAddress}, Predicted: ${tx.predictedAddress}`,
      );
    }
    // If it matches, we can just return the deployment tx (idempotent behavior)
    // This helps if the FE is stale or if the user needs to re-broadcast deployment
    console.log(
      `Safe already registered on chain ${chainId}, returning deployment info idempotently.`,
    );
  }

  return {
    to: tx.to,
    data: tx.data,
    value: tx.value.toString(),
    predictedAddress: tx.predictedAddress,
  };
}

/**
 * Get all chains where a user has a Safe of a specific type
 * @param userDid - The user's Privy DID
 * @param workspaceId - The workspace ID (REQUIRED for security)
 * @param safeType - The safe type
 * @returns Array of chain IDs where Safe is deployed
 */
export async function getChainsWithSafe(
  userDid: string,
  workspaceId: string,
  safeType: 'primary' | 'tax' | 'liquidity' | 'yield',
): Promise<SupportedChainId[]> {
  const safes = await getUserSafes(userDid, workspaceId, safeType);
  return safes.map((safe) => safe.chainId as SupportedChainId);
}

/**
 * Check if user has a Safe on a specific chain
 * @param userDid - The user's Privy DID
 * @param workspaceId - The workspace ID (REQUIRED for security)
 * @param chainId - The chain ID to check
 * @param safeType - The safe type
 * @returns true if Safe exists on chain, false otherwise
 */
export async function hasSafeOnChain(
  userDid: string,
  workspaceId: string,
  chainId: SupportedChainId,
  safeType: 'primary' | 'tax' | 'liquidity' | 'yield',
): Promise<boolean> {
  const safe = await getSafeOnChain(userDid, workspaceId, chainId, safeType);
  return !!safe;
}
