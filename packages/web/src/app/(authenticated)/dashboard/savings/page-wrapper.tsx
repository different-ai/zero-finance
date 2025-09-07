'use client';

import { useUserSafes } from '@/hooks/use-user-safes-demo';
import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { useDemoMode } from '@/context/demo-mode-context';
import {
  useDemoSavingsState,
  useDemoVaultStats,
  useDemoUserPositions,
  useDemoRecentDeposits,
  useDemoRecentWithdrawals,
} from '@/hooks/use-demo-savings';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  Settings,
  ArrowRight,
  Info,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowDownToLine,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { formatUsd, formatUsdWithPrecision } from '@/lib/utils';
import Link from 'next/link';
import { OpenSavingsAccountButton } from '@/components/savings/components/open-savings-account-button';
import { Address } from 'viem';
import Image from 'next/image';
import BaseLogo from 'public/logos/_base-logo.svg';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import {
  AnimatedYieldCounter,
  AnimatedYieldBadge,
} from '@/components/animated-yield-counter';

export default function SavingsPageWrapper() {
  const router = useRouter();
  const { isDemoMode, demoStep } = useDemoMode();

  // Get safe data
  const {
    data: safesData,
    isLoading: isLoadingSafes,
    isError: safesError,
  } = useUserSafes();

  const primarySafe = safesData?.[0];
  const safeAddress = primarySafe?.safeAddress || null;

  // Get real savings state
  const { savingsState: realSavingsState, isLoading: isLoadingRealState } =
    useRealSavingsState(safeAddress, 0);

  // Apply demo overrides
  const { savingsState, isLoading: isLoadingState } = useDemoSavingsState(
    realSavingsState,
    isLoadingRealState,
  );

  // Get demo data if in demo mode
  const demoVaultStats = useDemoVaultStats();
  const demoUserPositions = useDemoUserPositions();
  const demoRecentDeposits = useDemoRecentDeposits();
  const demoRecentWithdrawals = useDemoRecentWithdrawals();

  // Check earn module initialization status
  const realEarnStatus =
    trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
      { safeAddress: safeAddress! },
      { enabled: !!safeAddress && !isDemoMode },
    );

  const isEarnModuleInitialized = isDemoMode
    ? demoStep >= 5
    : realEarnStatus.data?.isInitializedOnChain || false;

  // Fetch vault stats
  const realVaultStats = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const vaultStats = isDemoMode ? demoVaultStats : realVaultStats.data;

  // Fetch user positions
  const realUserPositions = trpc.earn.getUserPositions.useQuery(
    { safeAddress: safeAddress! },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const userPositions = isDemoMode ? demoUserPositions : realUserPositions.data;

  // Track modal states
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Get total position value
  const totalPositionValue = useMemo(() => {
    if (!userPositions) return 0;
    return userPositions.reduce((acc, pos) => acc + (pos.assetsUsd || 0), 0);
  }, [userPositions]);

  // Loading state
  if (isLoadingSafes || isLoadingState) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (safesError || !safeAddress) {
    return (
      <div className="min-h-screen bg-[#F7F7F2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Alert className="border-[#101010]/10">
            <AlertDescription className="text-[#101010]/70">
              Unable to load savings account. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header Section */}
      <div className="border-b border-[#101010]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] sm:text-[12px] text-[#101010]/60">
                High-Yield Savings
              </p>
              <h1 className="mt-2 font-serif text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Earn 8% APY
              </h1>
            </div>
            <Link
              href="/dashboard/tools/earn-module"
              className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
            >
              Advanced Settings →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Not Initialized State */}
        {!isEarnModuleInitialized ? (
          <div className="border border-[#101010]/10 bg-white rounded-md p-8 text-center">
            <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-4" />
            <h2 className="text-[20px] font-medium text-[#101010] mb-2">
              Activate Your Savings Account
            </h2>
            <p className="text-[14px] text-[#101010]/70 mb-6 max-w-[400px] mx-auto">
              Start earning 8% APY on your idle cash. No minimum balance, no
              lock-ups.
            </p>
            <OpenSavingsAccountButton />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Balance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#101010]/10">
              {/* Current Balance */}
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Total Balance
                </p>
                <p className="mt-2 text-[32px] sm:text-[40px] font-medium tabular-nums text-[#101010]">
                  {formatUsd(totalPositionValue)}
                </p>
                {totalPositionValue > 0 && (
                  <AnimatedYieldBadge
                    principal={totalPositionValue}
                    apy={8}
                    className="mt-2"
                  />
                )}
              </div>

              {/* APY */}
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Current APY
                </p>
                <p className="mt-2 text-[32px] sm:text-[40px] font-medium tabular-nums text-[#1B29FF]">
                  8.0%
                </p>
                <p className="mt-2 text-[13px] text-[#101010]/70">
                  Compounding daily
                </p>
              </div>

              {/* Daily Earnings */}
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Daily Earnings
                </p>
                <p className="mt-2 text-[32px] sm:text-[40px] font-medium tabular-nums text-[#1B29FF]">
                  {formatUsd((totalPositionValue * 0.08) / 365)}
                </p>
                <p className="mt-2 text-[13px] text-[#101010]/70">
                  Auto-compounded
                </p>
              </div>
            </div>

            {/* Live Yield Counter */}
            {totalPositionValue > 0 && (
              <div className="border border-[#101010]/10 bg-white rounded-md p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-4">
                  Live Yield Accumulation
                </p>
                <AnimatedYieldCounter
                  principal={totalPositionValue}
                  apy={8}
                  showDaily={true}
                  showMonthly={true}
                  showYearly={true}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowDeposit(true)}
                className="flex items-center justify-between p-6 border border-[#101010]/10 bg-white rounded-md hover:border-[#1B29FF]/30 transition-colors group"
              >
                <div className="text-left">
                  <p className="text-[16px] font-medium text-[#101010] group-hover:text-[#1B29FF] transition-colors">
                    Deposit Funds
                  </p>
                  <p className="text-[13px] text-[#101010]/70 mt-1">
                    Add funds to start earning
                  </p>
                </div>
                <ArrowDownLeft className="h-5 w-5 text-[#101010]/40 group-hover:text-[#1B29FF] transition-colors" />
              </button>

              <button
                onClick={() => setShowWithdraw(true)}
                className="flex items-center justify-between p-6 border border-[#101010]/10 bg-white rounded-md hover:border-[#1B29FF]/30 transition-colors group"
              >
                <div className="text-left">
                  <p className="text-[16px] font-medium text-[#101010] group-hover:text-[#1B29FF] transition-colors">
                    Withdraw Funds
                  </p>
                  <p className="text-[13px] text-[#101010]/70 mt-1">
                    Transfer back to checking
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#101010]/40 group-hover:text-[#1B29FF] transition-colors" />
              </button>
            </div>

            {/* Vault Positions */}
            {userPositions && userPositions.length > 0 && (
              <div className="border border-[#101010]/10 bg-white rounded-md">
                <div className="p-6 border-b border-[#101010]/10">
                  <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                    Active Positions
                  </p>
                  <h2 className="mt-2 text-[20px] font-medium text-[#101010]">
                    Yield Sources
                  </h2>
                </div>
                <div className="divide-y divide-[#101010]/10">
                  {userPositions.map((position, index) => (
                    <div
                      key={index}
                      className="p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-[#1B29FF]" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#101010]">
                            {position.vaultName}
                          </p>
                          <p className="text-[13px] text-[#101010]/70">
                            Earning 8% APY
                          </p>
                        </div>
                      </div>
                      <p className="text-[16px] font-medium tabular-nums text-[#101010]">
                        {formatUsd(position.assetsUsd || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="border border-[#101010]/10 bg-[#F6F5EF] rounded-md p-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-[#101010]/60 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-[14px] text-[#101010]/80">
                    Your funds are automatically allocated to vetted DeFi
                    protocols earning stable yields. Withdraw anytime with no
                    penalties.
                  </p>
                  <Link
                    href="/dashboard/tools/earn-module"
                    className="inline-flex items-center text-[14px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    Learn more about yield sources →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDeposit && (
        <DepositEarnCard
          onClose={() => setShowDeposit(false)}
          safeAddress={safeAddress as Address}
        />
      )}
      {showWithdraw && (
        <WithdrawEarnCard
          onClose={() => setShowWithdraw(false)}
          safeAddress={safeAddress as Address}
        />
      )}
    </div>
  );
}
