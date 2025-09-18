'use client';

import { useUserSafes } from '@/hooks/use-user-safes-demo';
import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import {
  useDemoSavingsState,
  useDemoVaultStats,
  useDemoUserPositions,
  useDemoSavingsActivation,
  useIsDemoMode,
  type SavingsExperienceMode,
} from '@/hooks/use-demo-savings';
import { trpc } from '@/utils/trpc';
import { useMemo, useEffect, useState, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, ExternalLink, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatUsd, cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OpenSavingsAccountButton } from '@/components/savings/components/open-savings-account-button';
import { Address } from 'viem';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { AnimatedYieldCounter } from '@/components/animated-yield-counter';
import { AnimatedTotalEarned } from '@/components/animated-total-earned';
import { toast } from 'sonner';

export type SavingsPageWrapperProps = {
  mode?: SavingsExperienceMode;
};

export default function SavingsPageWrapper({
  mode = 'real',
}: SavingsPageWrapperProps) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated: isDemoActivated, activateSavings: persistDemoActivation } =
    useDemoSavingsActivation(mode);
  const [isActivatingDemo, setIsActivatingDemo] = useState(false);
  const [activationStep, setActivationStep] = useState(0);
  const activationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const activationSteps = [
    'Verifying account...',
    'Setting up savings vault...',
    'Configuring auto-save...',
    'Activating yield generation...',
    'Finalizing setup...',
  ];

  const handleDemoActivate = () => {
    if (!isDemoMode || isDemoActivated || isActivatingDemo) return;

    setIsActivatingDemo(true);
    setActivationStep(0);

    if (activationIntervalRef.current) {
      clearInterval(activationIntervalRef.current);
    }

    activationIntervalRef.current = setInterval(() => {
      setActivationStep((prev) => {
        if (prev >= activationSteps.length - 1) {
          if (activationIntervalRef.current) {
            clearInterval(activationIntervalRef.current);
            activationIntervalRef.current = null;
          }

          setTimeout(() => {
            persistDemoActivation();
            setIsActivatingDemo(false);
          }, 500);

          return prev;
        }

        return prev + 1;
      });
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (activationIntervalRef.current) {
        clearInterval(activationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDemoActivated) {
      setActivationStep(0);
      setIsActivatingDemo(false);
    }
  }, [isDemoActivated]);

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
    mode,
  );

  // Get demo data if in demo mode
  const demoVaultStats = useDemoVaultStats(mode);
  const demoUserPositions = useDemoUserPositions(mode);

  // Check earn module initialization status
  const realEarnStatus =
    trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
      { safeAddress: safeAddress! },
      { enabled: !!safeAddress && !isDemoMode },
    );

  const isEarnModuleInitialized = isDemoMode
    ? isDemoActivated
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

  // State for vault action modals
  const [selectedVault, setSelectedVault] = useState<{
    action: 'deposit' | 'withdraw' | null;
    vaultAddress: string | null;
    vaultName: string | null;
  }>({
    action: null,
    vaultAddress: null,
    vaultName: null,
  });

  // Compute vault view models
  const vaultsVM = useMemo(() => {
    const toNumberOrFallback = (
      value: number | string | null | undefined,
      fallback: number,
    ) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    return BASE_VAULTS.map((v) => {
      const stat = vaultStatsMany?.find(
        (s) => s.vaultAddress.toLowerCase() === v.address.toLowerCase(),
      );
      const pos = userPositions?.find(
        (p) => p.vaultAddress.toLowerCase() === v.address.toLowerCase(),
      );

      const balanceUsd = pos?.assetsUsd ? Number(pos.assetsUsd) : 0;

      // APY is often returned as a decimal (0.0737 for 7.37%), convert to percentage
      const statWithApyFields = stat as
        | {
            monthlyNetApy?: number | string | null;
            monthlyApy?: number | string | null;
            netApy?: number | string | null;
            apy?: number | string | null;
          }
        | undefined;

      const displayApySource = toNumberOrFallback(
        statWithApyFields?.monthlyNetApy,
        toNumberOrFallback(
          statWithApyFields?.monthlyApy,
          toNumberOrFallback(
            statWithApyFields?.netApy,
            toNumberOrFallback(statWithApyFields?.apy, 0.08),
          ),
        ),
      );

      const netApySource = toNumberOrFallback(
        statWithApyFields?.netApy,
        toNumberOrFallback(statWithApyFields?.apy, displayApySource),
      );

      const apyDecimal =
        displayApySource > 1 ? displayApySource / 100 : displayApySource;
      const apy = apyDecimal * 100;
      const instantApy =
        netApySource > 1 ? netApySource / 100 : netApySource;

      // Try multiple fields for earned amount
      // Handle BigInt conversion for yield field
      let earnedUsd = 0;

      // Use stat?.yield which we know exists
      if (stat?.yield) {
        // Handle both BigInt and number types
        const yieldValue =
          typeof stat.yield === 'bigint'
            ? Number(stat.yield) / 1e6
            : Number(stat.yield) / 1e6;
        earnedUsd = yieldValue;
      } else if (balanceUsd > 0 && apy > 0) {
        // Estimate earned based on balance and APY (assuming 30 days)
        earnedUsd = (balanceUsd * (apy / 100) * 30) / 365;
      }

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
        instantApy,
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

  const averageInstantApy = (() => {
    if (totalSaved > 0) {
      const weightedSum = vaultsVM.reduce(
        (sum, v) => sum + v.instantApy * v.balanceUsd,
        0,
      );
      return weightedSum / totalSaved;
    }

    if (vaultsVM.length > 0) {
      return (
        vaultsVM.reduce((sum, v) => sum + v.instantApy, 0) / vaultsVM.length
      );
    }

    return 0.08;
  })();

  const animatedInitialEarned = isDemoMode ? 0 : totalEarned;
  const animatedBalance = isDemoMode
    ? totalSaved || 2500000
    : totalSaved;

  const isLoading =
    isLoadingSafes ||
    isLoadingState ||
    (!isDemoMode &&
      (realVaultStats.isLoading ||
        realVaultStatsMany.isLoading ||
        realUserPositions.isLoading));

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] animate-in fade-in duration-300">
        {/* Header Section */}
        <div className="border-b border-[#101010]/10 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="h-3 w-32 bg-[#101010]/5 rounded animate-pulse mb-3" />
            <div className="h-12 w-96 bg-[#101010]/5 rounded animate-pulse mb-3" />
            <div className="h-4 w-full max-w-[65ch] bg-[#101010]/5 rounded animate-pulse" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {/* Portfolio Overview Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6">
                  <div className="h-3 w-24 bg-[#101010]/5 rounded animate-pulse mb-2" />
                  <div className="h-8 w-32 bg-[#101010]/5 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Yield Counter Skeleton */}
            <div className="bg-white border border-[#101010]/10 p-8">
              <div className="h-3 w-48 bg-[#101010]/5 rounded animate-pulse mb-6" />
              <div className="h-16 w-64 bg-[#101010]/5 rounded animate-pulse" />
            </div>

            {/* Vaults Table Skeleton */}
            <div className="bg-white border border-[#101010]/10">
              <div className="p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
                <div className="h-4 w-full bg-[#101010]/5 rounded animate-pulse" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-b border-[#101010]/5">
                  <div className="h-6 w-full bg-[#101010]/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show activation prompt for users without a safe (new users)
  if (!safeAddress && !isDemoMode) {
    return (
      <div className="bg-white border border-[#101010]/10 p-12 text-center">
        <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
        <h2 className="font-serif text-[36px] leading-[1.1] text-[#101010] mb-3">
          Activate Your Savings Account
        </h2>
        <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[400px] mx-auto">
          Start earning 8% APY on your business funds. Complete your account
          setup to get started.
        </p>
        <Link href="/onboarding/kyc">
          <Button className="bg-[#1B29FF] hover:bg-[#1B29FF]/90">
            Complete Setup to Activate
          </Button>
        </Link>
      </div>
    );
  }

  // Error state only for actual errors
  if (safesError) {
    return (
      <div className="bg-white border border-[#101010]/10 p-8">
        <Alert className="border-[#101010]/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-[#101010]/70">
            Unable to load savings data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const closeModal = () => {
    setSelectedVault({
      action: null,
      vaultAddress: null,
      vaultName: null,
    });
  };

  return (
    <div className="bg-[#F7F7F2]">
      {/* Header Section */}
      {/* Main Content */}
      <div className="bg-white max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Not Initialized State */}
        {!isEarnModuleInitialized ? (
          isDemoMode ? (
            isActivatingDemo ? (
              <div className="bg-white border border-[#101010]/10 p-12">
                <div className="max-w-md mx-auto space-y-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#1B29FF]/20 rounded-full animate-ping" />
                      <div className="relative bg-[#1B29FF]/10 rounded-full p-4">
                        <Sparkles className="h-8 w-8 text-[#1B29FF] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif text-[24px] text-center text-[#101010]">
                      Activating Your Savings
                    </h3>

                    <div className="space-y-3">
                      {activationSteps.map((step, index) => (
                        <div
                          key={step}
                          className="flex items-center gap-3 transition-all duration-300"
                          style={{
                            opacity: index <= activationStep ? 1 : 0.3,
                            transform:
                              index <= activationStep
                                ? 'translateX(0)'
                                : 'translateX(-10px)',
                          }}
                        >
                          <div className="flex-shrink-0">
                            {index < activationStep ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : index === activationStep ? (
                              <div className="h-5 w-5 border-2 border-[#1B29FF] rounded-full border-t-transparent animate-spin" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-[#101010]/20 rounded-full" />
                            )}
                          </div>
                          <span
                            className={`text-[14px] ${index <= activationStep ? 'text-[#101010]' : 'text-[#101010]/40'}`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="relative h-2 bg-[#101010]/5 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1B29FF] to-[#1B29FF]/80 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${((activationStep + 1) / activationSteps.length) * 100}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                      </div>
                    </div>

                    <p className="text-center text-[12px] text-[#101010]/50">
                      Setting up your high-yield savings account...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#101010]/10 p-12 text-center">
                <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
                <h2 className="font-serif text-[36px] leading-[1.1] text-[#101010] mb-3">
                  Activate Savings Account
                </h2>
                <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[400px] mx-auto">
                  Start earning up to {averageApy.toFixed(1)}% APY on your business funds.
                </p>
                <Button
                  onClick={handleDemoActivate}
                  className="bg-[#1B29FF] hover:bg-[#1B29FF]/90 transition-all hover:scale-[1.02]"
                >
                  Activate Savings
                </Button>
              </div>
            )
          ) : (
            <div className="bg-white border border-[#101010]/10 p-12 text-center">
              <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
              <h2 className="font-serif text-[36px] leading-[1.1] text-[#101010] mb-3">
                Activate Savings Account
              </h2>
              <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[400px] mx-auto">
                Start earning up to {averageApy.toFixed(1)}% APY on your business
                funds.
              </p>
              <OpenSavingsAccountButton safeAddress={safeAddress || undefined} />
            </div>
          )
        ) : (
          <div className="space-y-12">
            {/* Portfolio Overview - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10">
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Savings Balance
                </p>
                <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#101010]">
                  {formatUsd(totalSaved)}
                </p>
              </div>

              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Earnings (Live)
                </p>
                <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
                  +
                  <AnimatedTotalEarned
                    initialEarned={animatedInitialEarned}
                    apy={averageInstantApy}
                    balance={animatedBalance}
                  />
                </p>
              </div>

              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Average APY
                </p>
                <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
                  {averageApy.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Live Yield Counter - Premium Card */}
            {totalSaved > 0 && (
              <div className="bg-white border border-[#101010]/10 p-8">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-6">
                  Real-Time Yield Accumulation
                </p>
                <AnimatedYieldCounter
                  principal={totalSaved}
                  apy={averageApy}
                  showDaily={true}
                  showMonthly={true}
                  showYearly={true}
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits:
                      totalSaved < 1000 ? 8 : totalSaved < 10000 ? 6 : 4,
                  }}
                />
              </div>
            )}

            {/* Vaults Section - Editorial Table Style */}
            <div>
              <div className="mb-8">
                <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60">
                  Available Strategies
                </p>
              </div>

              {/* Vault Table - Responsive */}
              <div className="bg-white border border-[#101010]/10 overflow-x-auto">
                {/* Desktop Table View */}
                <div className="hidden lg:block min-w-[800px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
                    <div className="col-span-5">
                      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                        Vault Name
                      </p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                        APY
                      </p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                        Balance
                      </p>
                    </div>
                    <div className="col-span-3 text-right">
                      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                        Actions
                      </p>
                    </div>
                  </div>

                  {/* Vault Rows */}
                  {vaultsVM.map((vault, index) => (
                    <div
                      key={vault.id}
                      className={cn(
                        'grid grid-cols-12 gap-3 p-4 items-center transition-colors hover:bg-[#F7F7F2]/50',
                        index !== vaultsVM.length - 1 &&
                          'border-b border-[#101010]/5',
                      )}
                    >
                      <div className="col-span-5">
                        <div className="flex items-start gap-2">
                          {vault.isAuto && (
                            <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider shrink-0">
                              Auto
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="text-[15px] font-medium text-[#101010] truncate">
                              {vault.name}
                            </p>
                            <p className="text-[12px] text-[#101010]/60 truncate">
                              {vault.curator} · {vault.risk}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-[16px] tabular-nums text-[#101010]">
                          {formatUsd(vault.balanceUsd)}
                        </p>
                        {vault.earnedUsd > 0 && (
                          <p className="text-[12px] tabular-nums text-[#1B29FF]">
                            +{formatUsd(vault.earnedUsd)}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 flex justify-end gap-1">
                        {isDemoMode ? (
                          <>
                            <button
                              onClick={() =>
                                toast('Sign in to deposit funds from your real account.')
                              }
                              className="px-2.5 py-1 text-[12px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toast('Sign in to withdraw from live vault positions.')
                              }
                              className="px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setSelectedVault({
                                  action: 'deposit',
                                  vaultAddress: vault.address,
                                  vaultName: vault.name,
                                })
                              }
                              className="px-2.5 py-1 text-[12px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                setSelectedVault({
                                  action: 'withdraw',
                                  vaultAddress: vault.address,
                                  vaultName: vault.name,
                                })
                              }
                              className="px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                  {vaultsVM.map((vault, index) => (
                    <div
                      key={vault.id}
                      className={cn(
                        'p-4 space-y-3',
                        index !== vaultsVM.length - 1 &&
                          'border-b border-[#101010]/5',
                      )}
                    >
                      {/* Vault Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {vault.isAuto && (
                            <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider">
                              Auto
                            </span>
                          )}
                          <div>
                            <p className="text-[15px] font-medium text-[#101010]">
                              {vault.name}
                            </p>
                            <p className="text-[12px] text-[#101010]/60">
                              {vault.curator} · {vault.risk}
                            </p>
                          </div>
                        </div>
                        <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      {/* Vault Stats */}
                      <div className="flex justify-between text-[14px]">
                        <span className="text-[#101010]/60">Balance</span>
                        <span className="tabular-nums text-[#101010]">
                          {formatUsd(vault.balanceUsd)}
                        </span>
                      </div>
                      {vault.earnedUsd > 0 && (
                        <div className="flex justify-between text-[14px]">
                          <span className="text-[#101010]/60">Earned</span>
                          <span className="tabular-nums text-[#1B29FF]">
                            +{formatUsd(vault.earnedUsd)}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {isDemoMode ? (
                          <>
                            <button
                              onClick={() =>
                                toast('Sign in to deposit funds from your real account.')
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toast('Sign in to withdraw from live vault positions.')
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors flex items-center justify-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setSelectedVault({
                                  action: 'deposit',
                                  vaultAddress: vault.address,
                                  vaultName: vault.name,
                                })
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                setSelectedVault({
                                  action: 'withdraw',
                                  vaultAddress: vault.address,
                                  vaultName: vault.name,
                                })
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors flex items-center justify-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-Savings Status - Minimal Card */}
            {savingsState?.enabled && (
              <div className="bg-[#F6F5EF] border border-[#101010]/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                      Auto-Savings Active
                    </p>
                    <p className="text-[16px] text-[#101010]">
                      Automatically saving {savingsState.allocation}% of
                      incoming deposits
                    </p>
                  </div>
                  {isDemoMode ? (
                    <button
                      onClick={() =>
                        toast('Configure auto-savings once your live account is activated.')
                      }
                      className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
                    >
                      Configure →
                    </button>
                  ) : (
                    <Link
                      href="/dashboard/savings/settings"
                      className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
                    >
                      Configure →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Risk Disclosure - Clean Alert */}
            <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-6">
              <div className="flex gap-4">
                <AlertCircle className="h-5 w-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-[#101010] mb-2">
                    Risk Disclosure
                  </p>
                  <p className="text-[13px] text-[#101010]/70 leading-relaxed">
                    All DeFi protocols carry inherent risks. Vaults are audited
                    and insured where possible, but past performance does not
                    guarantee future returns. APY rates are variable and subject
                    to market conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isDemoMode && (
        <>
          <Dialog
            open={
              selectedVault.action === 'deposit' && !!selectedVault.vaultAddress
            }
            onOpenChange={(open) => !open && closeModal()}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-[24px] text-[#101010]">
                  Deposit to {selectedVault.vaultName}
                </DialogTitle>
              </DialogHeader>
              {selectedVault.vaultAddress && (
                <DepositEarnCard
                  safeAddress={safeAddress as Address}
                  vaultAddress={selectedVault.vaultAddress as Address}
                  onDepositSuccess={closeModal}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={
              selectedVault.action === 'withdraw' && !!selectedVault.vaultAddress
            }
            onOpenChange={(open) => !open && closeModal()}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-[24px] text-[#101010]">
                  Withdraw from {selectedVault.vaultName}
                </DialogTitle>
              </DialogHeader>
              {selectedVault.vaultAddress && (
                <WithdrawEarnCard
                  safeAddress={safeAddress as Address}
                  vaultAddress={selectedVault.vaultAddress as Address}
                  onWithdrawSuccess={closeModal}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
