'use client';

import { useMemo } from 'react';
import { DashboardSummary } from './dashboard-summary';
import { useUserSafes } from '@/hooks/use-user-safes-demo';
import { trpc } from '@/utils/trpc';
import { USDC_ADDRESS } from '@/lib/constants';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { Skeleton } from '@/components/ui/skeleton';

type DashboardSummaryWrapperProps = {
  initialSafeAddress?: string | null;
  initialCheckingBalance?: number;
  isDemoMode?: boolean;
};

export function DashboardSummaryWrapper({
  initialSafeAddress = null,
  initialCheckingBalance = 0,
  isDemoMode = false,
}: DashboardSummaryWrapperProps) {
  // Get safe data
  const safesQuery = useUserSafes();
  const safesData = safesQuery.data;
  const isLoadingSafes = safesQuery.isLoading && !initialSafeAddress;

  const primarySafe = safesData?.[0];
  const safeAddress = primarySafe?.safeAddress || initialSafeAddress || null;

  // Fetch checking account balance
  const { data: checkingBalance } = trpc.safe.getBalance.useQuery(
    {
      safeAddress: safeAddress!,
      tokenAddress: USDC_ADDRESS,
    },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const checkingBalanceUsd = checkingBalance
    ? Number(checkingBalance.balance) / 1e6
    : initialCheckingBalance;

  // Fetch vault positions for savings balance
  const baseVaultAddresses = useMemo(
    () => BASE_USDC_VAULTS.map((v) => v.address),
    [],
  );

  const { data: userPositions, isLoading: isLoadingPositions } =
    trpc.earn.userPositions.useQuery(
      { vaultAddresses: baseVaultAddresses },
      {
        enabled: !isDemoMode,
        refetchInterval: 10000,
      },
    );

  // Fetch vault stats for APY
  const { data: vaultStats } = trpc.earn.statsByVault.useQuery(
    { safeAddress: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 30000,
    },
  );

  // Calculate total savings balance from vault positions
  const savingsBalance = useMemo(() => {
    if (isDemoMode) return 901323.0;
    if (!userPositions) return 0;

    return userPositions.reduce((total, position) => {
      return total + (position.assetsUsd || 0);
    }, 0);
  }, [userPositions, isDemoMode]);

  // Calculate average APY from vaults
  const savingsApy = useMemo(() => {
    if (isDemoMode) return 8.0;
    if (!vaultStats || vaultStats.length === 0) return 8.0;

    // Weight APY by position size
    let totalWeight = 0;
    let weightedApy = 0;

    vaultStats.forEach((stat) => {
      const position = userPositions?.find(
        (p) => p.vaultAddress.toLowerCase() === stat.vaultAddress.toLowerCase(),
      );
      const balance = position?.assetsUsd || 0;
      if (balance > 0) {
        totalWeight += balance;
        weightedApy += (stat.apy || 0) * balance;
      }
    });

    if (totalWeight === 0) {
      // No positions, use simple average
      const avgApy =
        vaultStats.reduce((sum, s) => sum + (s.apy || 0), 0) /
        vaultStats.length;
      return avgApy * 100;
    }

    return (weightedApy / totalWeight) * 100;
  }, [vaultStats, userPositions, isDemoMode]);

  // Loading state
  if (isLoadingSafes || isLoadingPositions) {
    return (
      <div className="grid gap-4 p-6 grid-cols-1 md:grid-cols-3 bg-white border border-[#101010]/10 rounded-[12px]">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2 border-l border-r border-[#101010]/10 px-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <DashboardSummary
      availableBalance={checkingBalanceUsd}
      savingsBalance={savingsBalance}
      savingsApy={savingsApy}
      safeAddress={safeAddress}
      isDemoMode={isDemoMode}
    />
  );
}
