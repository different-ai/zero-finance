/**
 * Multi-Chain Balance Service
 *
 * Provides unified balance view across all chains:
 * - a) Single total number (all Safe values)
 * - b) Total savings value across all chains
 * - c) Per-chain breakdown
 * - d) Smart withdrawal planning
 */

import { type Address } from 'viem';
import { getAllSafesForWorkspace } from './safe-multi-chain.service';
import { getBatchSafeBalances, getSafeBalance } from './safe.service';
import { USDC_ADDRESS } from '@/lib/constants';
import { getPublicClient } from '@/lib/multi-chain-clients';
import { BASE_CHAIN_ID, ARBITRUM_CHAIN_ID } from '@/lib/safe-multi-chain';
import { CROSS_CHAIN_VAULTS } from '../earn/cross-chain-vaults';
import { parseAbi, formatUnits } from 'viem';

// ERC-4626 Vault ABI for balance queries
const ERC4626_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

export interface ChainBalance {
  chainId: number;
  chainName: string;
  safeAddress: Address;

  // Liquid balance (USDC in Safe)
  liquidBalance: {
    raw: bigint;
    formatted: string;
    usdValue: number;
  };

  // Vault positions
  vaultBalances: {
    vaultAddress: Address;
    vaultName: string;
    shares: bigint;
    underlyingAssets: bigint;
    formatted: string;
    usdValue: number;
  }[];

  // Total for this chain
  totalBalance: {
    raw: bigint;
    formatted: string;
    usdValue: number;
  };
}

export interface UnifiedBalance {
  // a) Single total across all chains
  grandTotal: {
    raw: bigint;
    formatted: string;
    usdValue: number;
  };

  // b) Total savings (vault positions only)
  totalSavings: {
    raw: bigint;
    formatted: string;
    usdValue: number;
  };

  // Total liquid (non-vault USDC)
  totalLiquid: {
    raw: bigint;
    formatted: string;
    usdValue: number;
  };

  // c) Per-chain breakdown
  chains: ChainBalance[];

  // Metadata
  lastUpdated: Date;
  workspaceId: string;
}

/**
 * Get chain name from chain ID
 */
function getChainName(chainId: number): string {
  const chainNames: Record<number, string> = {
    [BASE_CHAIN_ID]: 'Base',
    [ARBITRUM_CHAIN_ID]: 'Arbitrum',
  };
  return chainNames[chainId] || `Chain ${chainId}`;
}

/**
 * Get vault balances for a Safe on a specific chain
 */
async function getVaultBalancesForChain(
  safeAddress: Address,
  chainId: number,
): Promise<ChainBalance['vaultBalances']> {
  const vaultsOnChain = CROSS_CHAIN_VAULTS.filter(
    (vault) => vault.chainId === chainId,
  );

  if (vaultsOnChain.length === 0) {
    return [];
  }

  const client = getPublicClient(chainId);
  const vaultBalances: ChainBalance['vaultBalances'] = [];

  for (const vault of vaultsOnChain) {
    try {
      // Get vault shares owned by Safe
      const shares = await client.readContract({
        address: vault.address as Address,
        abi: ERC4626_ABI,
        functionName: 'balanceOf',
        args: [safeAddress],
      });

      // If no shares, skip
      if (shares === 0n) {
        continue;
      }

      // Convert shares to underlying assets
      const underlyingAssets = await client.readContract({
        address: vault.address as Address,
        abi: ERC4626_ABI,
        functionName: 'convertToAssets',
        args: [shares],
      });

      // Get decimals (usually 6 for USDC vaults)
      const decimals = await client.readContract({
        address: vault.address as Address,
        abi: ERC4626_ABI,
        functionName: 'decimals',
      });

      const formatted = formatUnits(underlyingAssets, decimals);
      const usdValue = parseFloat(formatted); // Assuming 1:1 with USD for USDC

      vaultBalances.push({
        vaultAddress: vault.address as Address,
        vaultName: vault.name,
        shares,
        underlyingAssets,
        formatted,
        usdValue,
      });
    } catch (error) {
      console.error(
        `[Multi-Chain Balance] Error fetching vault balance for ${vault.name}:`,
        error,
      );
      // Continue with other vaults
    }
  }

  return vaultBalances;
}

/**
 * Get balance for a single chain
 */
async function getChainBalance(
  safeAddress: Address,
  chainId: number,
): Promise<ChainBalance> {
  console.log(
    `[Multi-Chain Balance] Fetching balance for Safe ${safeAddress} on chain ${chainId}...`,
  );

  // Get liquid balance (USDC in Safe)
  const liquidBalanceResult = await getSafeBalance({
    safeAddress,
    tokenAddress: USDC_ADDRESS as Address,
  });

  const liquidBalance = liquidBalanceResult
    ? {
        raw: liquidBalanceResult.raw,
        formatted: liquidBalanceResult.formatted,
        usdValue: parseFloat(liquidBalanceResult.formatted),
      }
    : { raw: 0n, formatted: '0', usdValue: 0 };

  // Get vault balances
  const vaultBalances = await getVaultBalancesForChain(safeAddress, chainId);

  // Calculate total vault value
  const totalVaultValue = vaultBalances.reduce(
    (sum, vault) => sum + vault.underlyingAssets,
    0n,
  );

  // Calculate total for this chain
  const totalRaw = liquidBalance.raw + totalVaultValue;
  const totalFormatted = formatUnits(totalRaw, 6); // USDC has 6 decimals
  const totalUsdValue = parseFloat(totalFormatted);

  return {
    chainId,
    chainName: getChainName(chainId),
    safeAddress,
    liquidBalance,
    vaultBalances,
    totalBalance: {
      raw: totalRaw,
      formatted: totalFormatted,
      usdValue: totalUsdValue,
    },
  };
}

/**
 * Get unified balance view across all chains
 * This is the main function that implements requirements a, b, c
 */
export async function getUnifiedBalance(
  workspaceId: string,
): Promise<UnifiedBalance> {
  console.log(
    `[Multi-Chain Balance] Fetching unified balance for workspace ${workspaceId}...`,
  );

  // Get all Safes for this workspace
  const safes = await getAllSafesForWorkspace(workspaceId);

  if (safes.length === 0) {
    console.log(`[Multi-Chain Balance] No Safes found for workspace ${workspaceId}`);
    return {
      grandTotal: { raw: 0n, formatted: '0', usdValue: 0 },
      totalSavings: { raw: 0n, formatted: '0', usdValue: 0 },
      totalLiquid: { raw: 0n, formatted: '0', usdValue: 0 },
      chains: [],
      lastUpdated: new Date(),
      workspaceId,
    };
  }

  // Get balance for each chain
  const chainBalances: ChainBalance[] = [];

  for (const safe of safes) {
    try {
      const chainBalance = await getChainBalance(
        safe.address as Address,
        safe.chainId,
      );
      chainBalances.push(chainBalance);
    } catch (error) {
      console.error(
        `[Multi-Chain Balance] Error fetching balance for chain ${safe.chainId}:`,
        error,
      );
      // Continue with other chains
    }
  }

  // Calculate totals
  let totalLiquidRaw = 0n;
  let totalSavingsRaw = 0n;

  for (const chain of chainBalances) {
    totalLiquidRaw += chain.liquidBalance.raw;
    totalSavingsRaw += chain.vaultBalances.reduce(
      (sum, vault) => sum + vault.underlyingAssets,
      0n,
    );
  }

  const grandTotalRaw = totalLiquidRaw + totalSavingsRaw;

  return {
    grandTotal: {
      raw: grandTotalRaw,
      formatted: formatUnits(grandTotalRaw, 6),
      usdValue: parseFloat(formatUnits(grandTotalRaw, 6)),
    },
    totalSavings: {
      raw: totalSavingsRaw,
      formatted: formatUnits(totalSavingsRaw, 6),
      usdValue: parseFloat(formatUnits(totalSavingsRaw, 6)),
    },
    totalLiquid: {
      raw: totalLiquidRaw,
      formatted: formatUnits(totalLiquidRaw, 6),
      usdValue: parseFloat(formatUnits(totalLiquidRaw, 6)),
    },
    chains: chainBalances,
    lastUpdated: new Date(),
    workspaceId,
  };
}

/**
 * Smart withdrawal planner (requirement d)
 * Given a desired withdrawal amount, determines optimal withdrawal across chains
 */
export interface WithdrawalPlan {
  totalRequested: number;
  totalAvailable: number;
  canFulfill: boolean;

  steps: {
    chainId: number;
    chainName: string;
    safeAddress: Address;

    // Withdraw from liquid first
    withdrawLiquid: {
      amount: bigint;
      formatted: string;
      usdValue: number;
    };

    // Then redeem from vaults
    redeemVaults: {
      vaultAddress: Address;
      vaultName: string;
      shares: bigint;
      underlyingAssets: bigint;
      formatted: string;
      usdValue: number;
    }[];

    // Total from this chain
    totalFromChain: {
      raw: bigint;
      formatted: string;
      usdValue: number;
    };
  }[];
}

/**
 * Plan optimal withdrawal across multiple chains
 * Strategy:
 * 1. Prefer withdrawing from liquid balances first (no vault redemption needed)
 * 2. If more needed, redeem from vaults on the chain with most liquid balance
 * 3. Minimize number of chains involved
 */
export async function planWithdrawal(
  workspaceId: string,
  requestedAmount: number, // In USD
): Promise<WithdrawalPlan> {
  console.log(
    `[Multi-Chain Balance] Planning withdrawal of $${requestedAmount} for workspace ${workspaceId}...`,
  );

  const unifiedBalance = await getUnifiedBalance(workspaceId);

  // Check if we have enough
  if (unifiedBalance.grandTotal.usdValue < requestedAmount) {
    console.warn(
      `[Multi-Chain Balance] Insufficient funds: requested $${requestedAmount}, available $${unifiedBalance.grandTotal.usdValue}`,
    );
  }

  // Sort chains by liquid balance (prefer chains with most liquid)
  const sortedChains = [...unifiedBalance.chains].sort(
    (a, b) => b.liquidBalance.usdValue - a.liquidBalance.usdValue,
  );

  const steps: WithdrawalPlan['steps'] = [];
  let remaining = requestedAmount;

  for (const chain of sortedChains) {
    if (remaining <= 0) break;

    const step: WithdrawalPlan['steps'][0] = {
      chainId: chain.chainId,
      chainName: chain.chainName,
      safeAddress: chain.safeAddress,
      withdrawLiquid: { amount: 0n, formatted: '0', usdValue: 0 },
      redeemVaults: [],
      totalFromChain: { raw: 0n, formatted: '0', usdValue: 0 },
    };

    // Step 1: Withdraw liquid balance
    const liquidAvailable = chain.liquidBalance.usdValue;
    const liquidToWithdraw = Math.min(liquidAvailable, remaining);

    if (liquidToWithdraw > 0) {
      const liquidAmount = BigInt(Math.floor(liquidToWithdraw * 1e6)); // Convert to 6 decimals
      step.withdrawLiquid = {
        amount: liquidAmount,
        formatted: formatUnits(liquidAmount, 6),
        usdValue: liquidToWithdraw,
      };
      remaining -= liquidToWithdraw;
    }

    // Step 2: If still need more, redeem from vaults
    if (remaining > 0 && chain.vaultBalances.length > 0) {
      // Sort vaults by size (largest first for efficiency)
      const sortedVaults = [...chain.vaultBalances].sort(
        (a, b) => b.usdValue - a.usdValue,
      );

      for (const vault of sortedVaults) {
        if (remaining <= 0) break;

        const vaultAvailable = vault.usdValue;
        const vaultToRedeem = Math.min(vaultAvailable, remaining);

        if (vaultToRedeem > 0) {
          // Calculate proportional shares to redeem
          const redeemRatio = vaultToRedeem / vaultAvailable;
          const sharesToRedeem = BigInt(
            Math.floor(Number(vault.shares) * redeemRatio),
          );
          const assetsToReceive = BigInt(
            Math.floor(Number(vault.underlyingAssets) * redeemRatio),
          );

          step.redeemVaults.push({
            vaultAddress: vault.vaultAddress,
            vaultName: vault.vaultName,
            shares: sharesToRedeem,
            underlyingAssets: assetsToReceive,
            formatted: formatUnits(assetsToReceive, 6),
            usdValue: vaultToRedeem,
          });

          remaining -= vaultToRedeem;
        }
      }
    }

    // Calculate total from this chain
    const totalFromChainRaw =
      step.withdrawLiquid.amount +
      step.redeemVaults.reduce((sum, v) => sum + v.underlyingAssets, 0n);

    step.totalFromChain = {
      raw: totalFromChainRaw,
      formatted: formatUnits(totalFromChainRaw, 6),
      usdValue: parseFloat(formatUnits(totalFromChainRaw, 6)),
    };

    // Only add step if we're actually withdrawing something
    if (totalFromChainRaw > 0n) {
      steps.push(step);
    }
  }

  const totalPlanned = steps.reduce(
    (sum, step) => sum + step.totalFromChain.usdValue,
    0,
  );

  return {
    totalRequested: requestedAmount,
    totalAvailable: unifiedBalance.grandTotal.usdValue,
    canFulfill: totalPlanned >= requestedAmount,
    steps,
  };
}
