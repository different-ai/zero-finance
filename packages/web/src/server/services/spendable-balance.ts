/**
 * Spendable Balance Service
 *
 * Shared service for calculating user's spendable balance across:
 * - Idle balance: USDC in Safe (ready to spend now)
 * - Earning balance: USDC in vaults (earning yield)
 * - Spendable balance: Total = idle + earning
 *
 * Used by:
 * - MCP server (get_balance tool)
 * - AI Email agent (balance queries)
 * - Dashboard summary
 */

import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { userSafes } from '@/db/schema/user-safes';
import { eq, and } from 'drizzle-orm';
import {
  createPublicClient,
  http,
  formatUnits,
  parseAbi,
  type Address,
} from 'viem';
import { base } from 'viem/chains';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';

// USDC on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;
const USDC_DECIMALS = 6;

const ERC20_BALANCE_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
]);

const VAULT_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
]);

const publicClient = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl(), {
    batch: {
      batchSize: 100,
      wait: 16,
    },
  }),
  batch: {
    multicall: true,
  },
});

type SpendableBalanceCacheEntry = {
  data: SpendableBalanceResult;
  expiresAt: number;
};

const spendableBalanceCache = new Map<string, SpendableBalanceCacheEntry>();
const SPENDABLE_BALANCE_CACHE_TTL_MS = 15_000;

export type SpendableBalanceResult = {
  idle_balance: string;
  earning_balance: string;
  spendable_balance: string;
  safe_address: string;
  chain: 'base';
  vault_positions?: {
    vault_address: string;
    vault_name: string;
    balance_usd: number;
  }[];
};

export type BalanceError = {
  error: string;
  idle_balance?: string;
  earning_balance?: string;
  spendable_balance?: string;
};

/**
 * Get spendable balance for a user by their Privy DID.
 * Fetches both idle USDC and vault positions.
 */
export async function getSpendableBalanceByUserDid(
  userDid: string,
): Promise<SpendableBalanceResult | BalanceError> {
  try {
    // Find primary safe on Base (chainId 8453)
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userDid),
        eq(userSafes.chainId, SUPPORTED_CHAINS.BASE),
        eq(userSafes.safeType, 'primary'),
      ),
    });

    if (!primarySafe) {
      return {
        error: 'No primary Safe found on Base',
        idle_balance: '0',
        earning_balance: '0',
        spendable_balance: '0',
      };
    }

    return getSpendableBalanceBySafeAddress(primarySafe.safeAddress);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get spendable balance for a workspace.
 * Looks up the workspace creator's Safe.
 */
export async function getSpendableBalanceByWorkspace(
  workspaceId: string,
): Promise<SpendableBalanceResult | BalanceError> {
  try {
    // Get workspace to find owner
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return { error: 'Workspace not found' };
    }

    return getSpendableBalanceByUserDid(workspace.createdBy);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get spendable balance for a specific Safe address.
 * Core function that fetches on-chain balances.
 */
export async function getSpendableBalanceBySafeAddress(
  safeAddress: string,
): Promise<SpendableBalanceResult | BalanceError> {
  const cacheKey = safeAddress.toLowerCase();
  const cached = spendableBalanceCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const safe = safeAddress as Address;

    // 1) Fetch USDC balance and vault shares in a single multicall
    const shareCalls = BASE_USDC_VAULTS.map((vault) => ({
      address: vault.address,
      abi: VAULT_ABI,
      functionName: 'balanceOf' as const,
      args: [safe],
    }));

    // viem's multicall types don't handle mixed ABI arrays well; each call
    // still includes its own ABI+args, so casting here is safe.
    const firstBatch = await publicClient.multicall({
      contracts: [
        {
          address: USDC_ADDRESS,
          abi: ERC20_BALANCE_ABI,
          functionName: 'balanceOf' as const,
          args: [safe],
        },
        ...shareCalls,
      ] as any,
    });

    const usdcBalanceResult = firstBatch[0];
    const usdcBalance =
      usdcBalanceResult?.status === 'success' &&
      typeof usdcBalanceResult.result === 'bigint'
        ? usdcBalanceResult.result
        : 0n;

    const idleBalance = Number(formatUnits(usdcBalance, USDC_DECIMALS));

    // 2) Convert only non-zero shares to assets (second multicall)
    const vaultShares = firstBatch.slice(1);
    const convertCalls: Array<{
      vaultAddress: Address;
      vaultName: string;
      shares: bigint;
      call: {
        address: Address;
        abi: typeof VAULT_ABI;
        functionName: 'convertToAssets';
        args: [bigint];
      };
    }> = [];

    vaultShares.forEach((result, idx) => {
      if (result.status !== 'success') return;
      if (typeof result.result !== 'bigint') return;
      if (result.result <= 0n) return;

      const vault = BASE_USDC_VAULTS[idx];
      convertCalls.push({
        vaultAddress: vault.address,
        vaultName: vault.displayName || vault.name,
        shares: result.result,
        call: {
          address: vault.address,
          abi: VAULT_ABI,
          functionName: 'convertToAssets',
          args: [result.result],
        },
      });
    });

    const assetsResults =
      convertCalls.length > 0
        ? await publicClient.multicall({
            contracts: convertCalls.map((c) => c.call),
          })
        : [];

    const vaultPositions: SpendableBalanceResult['vault_positions'] = [];
    let earningBalance = 0;

    assetsResults.forEach((result, idx) => {
      if (result.status !== 'success') return;
      if (typeof result.result !== 'bigint') return;
      if (result.result <= 0n) return;

      const meta = convertCalls[idx];
      const balanceUsd = Number(formatUnits(result.result, USDC_DECIMALS));

      if (balanceUsd > 0) {
        vaultPositions.push({
          vault_address: meta.vaultAddress,
          vault_name: meta.vaultName,
          balance_usd: balanceUsd,
        });
        earningBalance += balanceUsd;
      }
    });

    const spendableBalance = idleBalance + earningBalance;

    const result: SpendableBalanceResult = {
      idle_balance: idleBalance.toFixed(2),
      earning_balance: earningBalance.toFixed(2),
      spendable_balance: spendableBalance.toFixed(2),
      safe_address: safeAddress,
      chain: 'base',
      vault_positions: vaultPositions.length > 0 ? vaultPositions : undefined,
    };

    spendableBalanceCache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + SPENDABLE_BALANCE_CACHE_TTL_MS,
    });

    return result;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
