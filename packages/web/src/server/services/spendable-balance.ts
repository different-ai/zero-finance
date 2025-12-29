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
  try {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    });

    // 1. Fetch idle USDC balance in Safe
    const usdcBalance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: ERC20_BALANCE_ABI,
      functionName: 'balanceOf',
      args: [safeAddress as Address],
    });

    const idleBalance = Number(formatUnits(usdcBalance, USDC_DECIMALS));

    // 2. Fetch vault positions (only USDC vaults for now)
    const vaultPositions: SpendableBalanceResult['vault_positions'] = [];
    let earningBalance = 0;

    // Query each USDC vault in parallel
    const vaultResults = await Promise.all(
      BASE_USDC_VAULTS.map(async (vault) => {
        try {
          // Get shares balance
          const shares = await publicClient.readContract({
            address: vault.address,
            abi: VAULT_ABI,
            functionName: 'balanceOf',
            args: [safeAddress as Address],
          });

          if (shares > 0n) {
            // Convert shares to assets (USDC)
            const assets = await publicClient.readContract({
              address: vault.address,
              abi: VAULT_ABI,
              functionName: 'convertToAssets',
              args: [shares],
            });

            const balanceUsd = Number(formatUnits(assets, USDC_DECIMALS));

            return {
              vault_address: vault.address,
              vault_name: vault.displayName || vault.name,
              balance_usd: balanceUsd,
            };
          }
          return null;
        } catch (error) {
          console.error(
            `[SpendableBalance] Error fetching vault ${vault.address}:`,
            error,
          );
          return null;
        }
      }),
    );

    // Aggregate vault results
    for (const result of vaultResults) {
      if (result && result.balance_usd > 0) {
        vaultPositions.push(result);
        earningBalance += result.balance_usd;
      }
    }

    const spendableBalance = idleBalance + earningBalance;

    return {
      idle_balance: idleBalance.toFixed(2),
      earning_balance: earningBalance.toFixed(2),
      spendable_balance: spendableBalance.toFixed(2),
      safe_address: safeAddress,
      chain: 'base',
      vault_positions: vaultPositions.length > 0 ? vaultPositions : undefined,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
