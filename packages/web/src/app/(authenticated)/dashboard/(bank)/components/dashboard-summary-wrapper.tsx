'use client';

import { useMemo } from 'react';
import { DashboardSummary } from './dashboard-summary';
import { useUserSafes } from '@/hooks/use-user-safes-demo';
import { trpc } from '@/utils/trpc';
import { USDC_ADDRESS } from '@/lib/constants';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { Skeleton } from '@/components/ui/skeleton';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

// Vault position type for transfer flow
export type VaultPosition = {
  vaultAddress: string;
  shares: string;
  assets: string;
  assetsUsd: number;
  chainId: number;
  apy?: number;
};

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

  // Calculate total savings balance from vault positions (earning balance)
  const earningBalance = useMemo(() => {
    if (isDemoMode) return 1000000.0; // $1M earning in demo mode
    if (!userPositions) return 0;

    return userPositions.reduce((total, position) => {
      return total + (position.assetsUsd || 0);
    }, 0);
  }, [userPositions, isDemoMode]);

  // Idle balance = USDC in Safe (not earning)
  // In demo mode, show $200k idle for total of $1.2M spendable
  const idleBalance = isDemoMode ? 200000.0 : checkingBalanceUsd;

  // Spendable = Total (Earning + Idle)
  const spendableBalance = earningBalance + idleBalance;

  // Build vault positions with APY for transfer flow (Base chain only)
  // Note: vaultStats is optional - we can still withdraw without APY data
  const vaultPositions: VaultPosition[] = useMemo(() => {
    if (isDemoMode || !userPositions) return [];

    // Only include Base chain vaults with non-zero balance
    return userPositions
      .filter((p) => p.chainId === SUPPORTED_CHAINS.BASE && p.assetsUsd > 0)
      .map((position) => {
        const stat = vaultStats?.find(
          (s) =>
            s.vaultAddress.toLowerCase() ===
            position.vaultAddress.toLowerCase(),
        );
        return {
          ...position,
          apy: stat?.apy ? stat.apy * 100 : 0, // Convert to percentage (0 if stats not loaded)
        };
      });
  }, [userPositions, vaultStats, isDemoMode]);

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
      spendableBalance={spendableBalance}
      earningBalance={earningBalance}
      idleBalance={idleBalance}
      vaultPositions={vaultPositions}
      savingsApy={savingsApy}
      safeAddress={safeAddress}
      isDemoMode={isDemoMode}
    />
  );
}
