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
  TrendingUp,
  DollarSign,
  ExternalLink,
  Shield,
  ChevronRight,
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

  // Base vaults configuration
  const BASE_VAULTS = BASE_USDC_VAULTS;
  const baseVaultAddresses = BASE_VAULTS.map((v) => v.address);

  // Fetch multi-vault stats
  const realVaultStatsMany = trpc.earn.statsByVault.useQuery(
    { safeAddress: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  // Fetch user positions
  const realUserPositions = trpc.earn.userPositions.useQuery(
    { userSafe: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const vaultStatsMany = isDemoMode ? demoVaultStats : realVaultStatsMany.data;
  const userPositions = isDemoMode ? demoUserPositions : realUserPositions.data;

  // State for expanded vault actions
  const [expandedVault, setExpandedVault] = useState<string | null>(null);
  const [vaultAction, setVaultAction] = useState<'deposit' | 'withdraw' | null>(
    null,
  );
  const [selectedVaultAddress, setSelectedVaultAddress] = useState<
    string | null
  >(null);

  // Compute vault view models
  const vaultsVM = useMemo(() => {
    return BASE_VAULTS.map((v) => {
      const stat = vaultStatsMany?.find(
        (s) => s.vaultAddress.toLowerCase() === v.address.toLowerCase(),
      );
      const pos = userPositions?.find(
        (p) => p.vaultAddress.toLowerCase() === v.address.toLowerCase(),
      );

      const balanceUsd = pos?.assetsUsd ? Number(pos.assetsUsd) : 0;

      // APY is often returned as a decimal (0.0737 for 7.37%), convert to percentage
      const apyRaw =
        stat?.netApy != null
          ? Number(stat.netApy)
          : stat?.apy != null
            ? Number(stat.apy)
            : 0.08; // Default 8% as decimal

      // If APY is less than 1, it's likely a decimal representation, multiply by 100
      const apy = apyRaw < 1 ? apyRaw * 100 : apyRaw;

      const earnedUsd = stat?.yield ? Number(stat.yield) / 1e6 : 0;

      return {
        id: v.id,
        name: v.name,
        risk: v.risk,
        curator: v.curator,
        address: v.address,
        appUrl: v.appUrl,
        apy,
        balanceUsd,
        earnedUsd,
        isAuto: v.id === 'seamless',
      };
    });
  }, [BASE_VAULTS, vaultStatsMany, userPositions]);

  // Calculate totals
  const totalSaved = vaultsVM.reduce((sum, v) => sum + v.balanceUsd, 0);
  const totalEarned = vaultsVM.reduce((sum, v) => sum + v.earnedUsd, 0);
  const averageApy =
    vaultsVM.length > 0
      ? vaultsVM.reduce((sum, v) => sum + v.apy, 0) / vaultsVM.length
      : 8.0;

  const isLoading =
    isLoadingSafes ||
    isLoadingState ||
    (!isDemoMode &&
      (realVaultStats.isLoading ||
        realVaultStatsMany.isLoading ||
        realUserPositions.isLoading));

  // Redirect logic
  useEffect(() => {
    if (
      !isDemoMode &&
      !isLoadingSafes &&
      !safesError &&
      safesData !== undefined &&
      safesData.length === 0
    ) {
      router.push('/onboarding/create-safe');
    }
  }, [isDemoMode, isLoadingSafes, safesError, safesData, router]);

  // Loading state
  if (isLoading) {
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
                Earn up to 10% APY
              </h1>
            </div>
            {savingsState?.enabled && (
              <Link
                href="/dashboard/savings/settings"
                className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
              >
                Auto-Savings Settings →
              </Link>
            )}
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
              Start earning up to {averageApy.toFixed(1)}% APY on your idle
              cash. No minimum balance, no lock-ups.
            </p>
            <OpenSavingsAccountButton />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Auto-Savings Status */}
            {savingsState?.enabled && (
              <div className="border border-[#1B29FF]/20 bg-[#1B29FF]/5 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      Auto-Savings Active
                    </p>
                    <p className="text-[13px] text-[#101010]/70 mt-1">
                      Saving {savingsState.allocation}% of deposits
                      automatically
                    </p>
                  </div>
                  <Link href="/dashboard/savings/settings">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1B29FF]/30 hover:bg-[#1B29FF]/10"
                    >
                      <Settings className="mr-2 h-3 w-3" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Balance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#101010]/10">
              {/* Total Balance */}
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Total Saved
                </p>
                <p className="mt-2 text-[32px] sm:text-[40px] font-medium tabular-nums text-[#101010]">
                  {formatUsd(totalSaved)}
                </p>
                {totalSaved > 0 && (
                  <AnimatedYieldBadge
                    principal={totalSaved}
                    apy={averageApy}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Total Earned */}
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Total Earned
                </p>
                <p className="mt-2 text-[32px] sm:text-[40px] font-medium tabular-nums text-[#22C55E]">
                  +{formatUsd(totalEarned)}
                </p>
                <p className="mt-2 text-[13px] text-[#101010]/70">
                  All-time yield
                </p>
              </div>

              {/* Daily Earnings */}
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Daily Earnings
                </p>
                <p className="mt-2 text-[32px] sm:text-[40px] font-medium tabular-nums text-[#1B29FF]">
                  {formatUsd((totalSaved * averageApy) / 100 / 365)}
                </p>
                <p className="mt-2 text-[13px] text-[#101010]/70">
                  Auto-compounded
                </p>
              </div>
            </div>

            {/* Live Yield Counter */}
            {totalSaved > 0 && (
              <div className="border border-[#101010]/10 bg-white rounded-md p-6">
                <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-4">
                  Live Yield Accumulation
                </p>
                <AnimatedYieldCounter
                  principal={totalSaved}
                  apy={averageApy}
                  showDaily={true}
                  showMonthly={true}
                  showYearly={true}
                />
              </div>
            )}

            {/* Vaults Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-medium text-[#101010]">
                    Available Vaults
                  </h2>
                  <p className="text-[14px] text-[#101010]/70 mt-1">
                    High-yield USDC vaults on Base
                  </p>
                </div>
                <Image src={BaseLogo} alt="Base" width={40} height={40} />
              </div>

              {/* Vault Cards */}
              <div className="space-y-3">
                {vaultsVM.map((vault) => (
                  <div
                    key={vault.id}
                    className={`border rounded-md transition-all ${
                      vault.isAuto
                        ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
                        : 'border-[#101010]/10 bg-white'
                    }`}
                  >
                    {/* Vault Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-[16px] font-medium text-[#101010]">
                              {vault.name}
                            </h3>
                            {vault.isAuto && (
                              <span className="px-2 py-0.5 bg-[#1B29FF] text-white text-[11px] uppercase tracking-wider rounded">
                                Auto
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-[#101010]/70 mb-3">
                            Curated by {vault.curator}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                                APY
                              </p>
                              <p className="text-[18px] font-medium text-[#1B29FF]">
                                {vault.apy.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                                Your Balance
                              </p>
                              <p className="text-[18px] font-medium text-[#101010]">
                                {formatUsd(vault.balanceUsd)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                                Earned
                              </p>
                              <p className="text-[18px] font-medium text-[#22C55E]">
                                +{formatUsd(vault.earnedUsd)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                                Risk Level
                              </p>
                              <p className="text-[18px] font-medium text-[#101010]">
                                {vault.risk}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setExpandedVault(vault.id);
                            setVaultAction('deposit');
                            setSelectedVaultAddress(vault.address);
                          }}
                          className="flex-1 px-4 py-2 bg-[#1B29FF] text-white text-[14px] hover:bg-[#1B29FF]/90 transition-colors"
                        >
                          Deposit
                        </button>
                        <button
                          onClick={() => {
                            setExpandedVault(vault.id);
                            setVaultAction('withdraw');
                            setSelectedVaultAddress(vault.address);
                          }}
                          className="flex-1 px-4 py-2 border border-[#101010]/10 text-[#101010] text-[14px] hover:bg-[#F7F7F2] transition-colors"
                        >
                          Withdraw
                        </button>
                        {vault.appUrl && (
                          <a
                            href={vault.appUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-[#101010]/10 text-[#101010] text-[14px] hover:bg-[#F7F7F2] transition-colors flex items-center gap-1"
                          >
                            View
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="border border-[#101010]/10 bg-[#F6F5EF] rounded-md p-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-[#101010]/60 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-[14px] text-[#101010]/80">
                    Your funds are allocated to vetted DeFi protocols earning
                    stable yields. All vaults are audited and insured. Withdraw
                    anytime with no penalties.
                  </p>
                  <Link
                    href="/dashboard/tools/earn-module"
                    className="inline-flex items-center text-[14px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    Advanced vault management →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {expandedVault && vaultAction === 'deposit' && selectedVaultAddress && (
        <DepositEarnCard
          onDepositSuccess={() => {
            setExpandedVault(null);
            setVaultAction(null);
            setSelectedVaultAddress(null);
          }}
          safeAddress={safeAddress as Address}
          vaultAddress={selectedVaultAddress as Address}
        />
      )}
      {expandedVault && vaultAction === 'withdraw' && selectedVaultAddress && (
        <WithdrawEarnCard
          onWithdrawSuccess={() => {
            setExpandedVault(null);
            setVaultAction(null);
            setSelectedVaultAddress(null);
          }}
          safeAddress={safeAddress as Address}
          vaultAddress={selectedVaultAddress as Address}
        />
      )}
    </div>
  );
}
