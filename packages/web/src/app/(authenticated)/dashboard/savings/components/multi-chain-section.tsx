'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { featureConfig } from '@/lib/feature-config';
import {
  TotalBalanceCard,
  TotalBalanceCardSkeleton,
  UnifiedVaultList,
  CollectFromVaultsModal,
  CollectToBaseModal,
} from '@/components/savings/multi-chain-components';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';
import type { CrossChainVault, SafeInfo } from '@/lib/types/multi-chain';
import { formatUnits } from 'viem';

interface MultiChainSectionProps {
  userDid: string;
}

export function MultiChainSection({ userDid }: MultiChainSectionProps) {
  // Check if multi-chain feature is enabled
  if (!featureConfig.multiChain.enabled) {
    return null;
  }

  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showBridgeModal, setShowBridgeModal] = useState(false);

  // Fetch multi-chain positions
  const {
    data: multiChainData,
    isLoading,
    refetch,
  } = trpc.earn.getMultiChainPositions.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30s
  });

  // Handle deposit to vault (with bridge if cross-chain)
  const depositMutation = trpc.earn.depositToVaultWithBridge.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60">
            Multi-Chain Vaults
          </p>
        </div>
        <TotalBalanceCardSkeleton />
      </div>
    );
  }

  // No data yet
  if (!multiChainData) {
    return null;
  }

  // Transform data for components
  const safes: SafeInfo[] = multiChainData.safes.map((safe) => ({
    safeAddress: safe.safeAddress as `0x${string}`,
    chainId: safe.chainId as 8453 | 42161,
    isDeployed: true,
    balance: BigInt(safe.balance || '0'),
  }));

  // Calculate total balance across all chains
  const totalBalance = safes.reduce((acc, safe) => {
    return acc + (safe.balance || 0n);
  }, 0n);

  const totalBalanceFormatted = `$${Number(
    formatUnits(totalBalance, 6),
  ).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Get positions as a map for the vault list
  const positionsMap = new Map<
    string,
    {
      shares: bigint;
      value: string;
      apy: number;
    }
  >();

  multiChainData.positions.forEach((position) => {
    positionsMap.set(position.vaultId, {
      shares: BigInt(position.shares || '0'),
      value: `$${Number(position.valueUsd).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      apy: position.apy || 0,
    });
  });

  // Calculate weekly gain (estimate based on APY)
  const avgApy =
    multiChainData.positions.length > 0
      ? multiChainData.positions.reduce((acc, p) => acc + (p.apy || 0), 0) /
        multiChainData.positions.length
      : 8;
  const weeklyGain =
    (Number(formatUnits(totalBalance, 6)) * (avgApy / 100)) / 52;
  const weeklyGainFormatted = `$${weeklyGain.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Handle deposit
  const handleDeposit = async (vault: CrossChainVault) => {
    // For now, open a modal or redirect to deposit flow
    // This would need to be integrated with the existing deposit modal
    console.log('Deposit to vault:', vault);
  };

  // Handle withdraw
  const handleWithdraw = async (vault: CrossChainVault) => {
    // For now, open a modal or redirect to withdraw flow
    console.log('Withdraw from vault:', vault);
  };

  // Handle collect from vaults
  const handleCollectFromVaults = async () => {
    // Withdraw from all vaults to respective Safe addresses
    console.log('Collecting from all vaults');
    setShowCollectModal(false);
    refetch();
  };

  // Handle collect to Base
  const handleCollectToBase = async () => {
    // Bridge all non-Base funds to Base
    console.log('Bridging all to Base');
    setShowBridgeModal(false);
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="mb-4">
        <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60">
          Multi-Chain Vaults
        </p>
        <p className="text-[13px] text-[#101010]/60 mt-1">
          Earn yield across Base and Arbitrum with automatic bridging
        </p>
      </div>

      {/* Total Balance Card */}
      <TotalBalanceCard
        totalBalance={totalBalanceFormatted}
        weeklyGain={weeklyGainFormatted}
        safes={safes}
        onCollectFromVaults={() => setShowCollectModal(true)}
        onCollectToBase={() => setShowBridgeModal(true)}
      />

      {/* Vault List */}
      <UnifiedVaultList
        vaults={ALL_CROSS_CHAIN_VAULTS}
        positions={positionsMap}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />

      {/* Collect Modals */}
      <CollectFromVaultsModal
        open={showCollectModal}
        onOpenChange={setShowCollectModal}
        positions={multiChainData.positions.map((p) => ({
          vaultId: p.vaultId,
          vaultName:
            ALL_CROSS_CHAIN_VAULTS.find((v) => v.id === p.vaultId)
              ?.displayName || p.vaultId,
          chainId: p.chainId as 8453 | 42161,
          shares: BigInt(p.shares || '0'),
          value: `$${Number(p.valueUsd).toLocaleString()}`,
        }))}
        onConfirm={handleCollectFromVaults}
      />

      <CollectToBaseModal
        open={showBridgeModal}
        onOpenChange={setShowBridgeModal}
        safes={safes}
        onConfirm={handleCollectToBase}
      />
    </div>
  );
}

export default MultiChainSection;
