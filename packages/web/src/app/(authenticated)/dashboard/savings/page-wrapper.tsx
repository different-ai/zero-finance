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
import { trpc, type RouterOutputs } from '@/utils/trpc';
import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, ExternalLink, AlertCircle, Shield } from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { formatUsd, cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Address } from 'viem';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { AnimatedYieldCounter } from '@/components/animated-yield-counter';
import { toast } from 'sonner';
import Image from 'next/image';
import { USDC_ADDRESS } from '@/lib/constants';
import { CheckingActionsCard } from './components/checking-actions-card';
import { InsuranceContactPanel } from './components/insurance-contact-panel';
import { PortfolioOverview } from './components/portfolio-overview';
import { AutoSavingsStatus } from './components/auto-savings-status';
import {
  ZERO_LOGO_SRC,
  INSURED_VAULT_IDS,
  insuredPillAnimation,
} from './demo-data';
import {
  calculateVaultViewModels,
  calculateTotalSaved,
  calculateTotalEarned,
  calculateAverageApy,
  calculateWeightedInstantApy,
} from './utils/vault-calculations';

export type SavingsPageWrapperProps = {
  mode?: SavingsExperienceMode;
  initialSafeAddress?: string | null;
  initialCheckingBalance?: RouterOutputs['safe']['getBalance'] | null;
};

export default function SavingsPageWrapper({
  mode = 'real',
  initialSafeAddress = null,
  initialCheckingBalance = null,
}: SavingsPageWrapperProps) {
  const isDemoMode = useIsDemoMode(mode);
  const {
    isActivated: isDemoActivated,
    activateSavings: persistDemoActivation,
  } = useDemoSavingsActivation(mode);
  const [isActivatingDemo, setIsActivatingDemo] = useState(false);
  const [activationStep, setActivationStep] = useState(0);
  const activationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const refetchTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
      refetchTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      refetchTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isDemoActivated) {
      setActivationStep(0);
      setIsActivatingDemo(false);
    }
  }, [isDemoActivated]);

  // Get safe data
  const safesQuery = useUserSafes();
  const safesData = safesQuery.data;
  const safesError = safesQuery.isError;
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
      initialData: initialCheckingBalance ?? undefined,
    },
  );

  const effectiveCheckingBalance = checkingBalance ?? initialCheckingBalance;
  const checkingBalanceUsd = effectiveCheckingBalance
    ? Number(effectiveCheckingBalance.balance) / 1e6
    : 0;
  const withdrawableBalanceUsd = isDemoMode ? 2500000 : checkingBalanceUsd;

  // Get user profile to check insurance status
  const { data: userProfile } = trpc.user.getProfile.useQuery(undefined, {
    enabled: !isDemoMode,
  });
  const userIsInsured = userProfile?.isInsured || false;

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
  const baseVaultAddresses = useMemo(
    () => BASE_VAULTS.map((v) => v.address),
    [BASE_VAULTS],
  );

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

  const { refetch: refetchVaultStats } = realVaultStats;
  const { refetch: refetchVaultsMany } = realVaultStatsMany;
  const { refetch: refetchUserPositions } = realUserPositions;

  // State for vault action modals with transition support
  const [selectedVault, setSelectedVault] = useState<{
    action: 'deposit' | 'withdraw' | 'insure' | null;
    vaultAddress: string | null;
    vaultName: string | null;
  }>({
    action: null,
    vaultAddress: null,
    vaultName: null,
  });

  // Track expansion state for smooth animations
  const [expandingVault, setExpandingVault] = useState<string | null>(null);
  const [collapsingVault, setCollapsingVault] = useState<string | null>(null);

  const toggleVaultAction = useCallback(
    (
      action: 'deposit' | 'withdraw' | 'insure',
      vault: { address: string; name: string },
    ) => {
      const normalizedAddress = vault.address.toLowerCase();

      setSelectedVault((prev) => {
        const isCurrentlyOpen =
          prev.action === action &&
          prev.vaultAddress?.toLowerCase() === normalizedAddress;

        if (isCurrentlyOpen) {
          // Start collapse animation
          setCollapsingVault(normalizedAddress);
          setTimeout(() => {
            setCollapsingVault(null);
          }, 300);
          return { action: null, vaultAddress: null, vaultName: null };
        }

        // Start expand animation
        if (prev.vaultAddress) {
          // If another vault is open, collapse it first
          setCollapsingVault(prev.vaultAddress.toLowerCase());
          setTimeout(() => {
            setCollapsingVault(null);
          }, 150);
        }

        setExpandingVault(normalizedAddress);
        setTimeout(() => {
          setExpandingVault(null);
        }, 300);

        return {
          action,
          vaultAddress: vault.address,
          vaultName: vault.name,
        };
      });
    },
    [],
  );

  const triggerVaultRefresh = useCallback(() => {
    if (isDemoMode || !safeAddress) {
      return;
    }

    const runRefetches = () => {
      void refetchVaultStats();
      void refetchVaultsMany();
      void refetchUserPositions();
    };

    runRefetches();

    refetchTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    refetchTimeoutsRef.current = [];

    const scheduleRefetch = (delay: number) => {
      const timeoutId = setTimeout(runRefetches, delay);
      refetchTimeoutsRef.current.push(timeoutId);
    };

    scheduleRefetch(3000);
    scheduleRefetch(7000);
  }, [
    isDemoMode,
    refetchUserPositions,
    refetchVaultStats,
    refetchVaultsMany,
    safeAddress,
  ]);

  const handleDepositSuccess = useCallback(() => {
    triggerVaultRefresh();
  }, [triggerVaultRefresh]);

  const handleWithdrawSuccess = useCallback(() => {
    triggerVaultRefresh();
  }, [triggerVaultRefresh]);

  useEffect(() => {
    setSelectedVault({
      action: null,
      vaultAddress: null,
      vaultName: null,
    });
  }, [isDemoMode, safeAddress]);

  const vaultsVM = useMemo(
    () =>
      calculateVaultViewModels(
        BASE_VAULTS,
        vaultStatsMany ?? undefined,
        userPositions ?? undefined,
        userIsInsured,
      ),
    [BASE_VAULTS, vaultStatsMany, userPositions, userIsInsured],
  );

  // Calculate totals
  const insuredVaultEntry = useMemo(
    () => ({
      id: 'insured-vault',
      name: 'Insured Vault',
      risk: 'Conservative',
      curator: '0 Finance',
      address: 'insured-contact',
      appUrl: '',
      apy: 8,
      balanceUsd: 0,
      earnedUsd: 0,
      isAuto: false,
      instantApy: 0.08,
      isInsured: true,
      isContactOnly: true,
      insuranceSummary:
        'Dedicated coverage arranged by the 0 Finance insurance desk.',
    }),
    [],
  );

  const displayVaults = useMemo(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('insured-pill-animation');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'insured-pill-animation';
        style.innerHTML = insuredPillAnimation;
        document.head.appendChild(style);
      }
    }

    // Don't show the mock insured vault if user has real insurance
    const insured = userIsInsured
      ? [...vaultsVM.filter((vault) => vault.isInsured)]
      : [insuredVaultEntry, ...vaultsVM.filter((vault) => vault.isInsured)];
    const others = vaultsVM.filter((vault) => !vault.isInsured);
    return [...insured, ...others];
  }, [insuredVaultEntry, vaultsVM, userIsInsured]);

  const hasYieldCorrection = useMemo(
    () => vaultsVM.some((vault) => Boolean(vault.yieldCorrectionReason)),
    [vaultsVM],
  );

  const hasLedgerShortfallCorrection = useMemo(
    () =>
      vaultsVM.some(
        (vault) => vault.yieldCorrectionReason === 'ledger_shortfall',
      ),
    [vaultsVM],
  );

  const showYieldCorrectionBanner = !isDemoMode && hasYieldCorrection;

  const totalSaved = calculateTotalSaved(vaultsVM);
  const totalEarned = calculateTotalEarned(vaultsVM);
  const averageApy = calculateAverageApy(vaultsVM);
  const averageInstantApy = calculateWeightedInstantApy(vaultsVM, totalSaved);

  const animatedInitialEarned = isDemoMode ? 0 : totalEarned;
  const animatedBalance = isDemoMode ? totalSaved || 2500000 : totalSaved;
  const fallbackApyPercent = Number.isFinite(averageInstantApy)
    ? averageInstantApy * 100
    : 8;

  const isInitialLoading =
    isLoadingSafes ||
    isLoadingState ||
    (!isDemoMode &&
      ((realVaultStats.isLoading && !realVaultStats.data) ||
        (realVaultStatsMany.isLoading && !realVaultStatsMany.data) ||
        (realUserPositions.isLoading && !realUserPositions.data)));

  // Loading state with skeleton
  if (isInitialLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-[#101010]/5 rounded animate-pulse" />
          <div className="h-10 w-64 bg-[#101010]/5 rounded animate-pulse" />
          <div className="h-4 w-full max-w-[440px] bg-[#101010]/5 rounded animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10 rounded-lg overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 space-y-3">
                <div className="h-3 w-20 bg-[#101010]/5 rounded animate-pulse" />
                <div className="h-8 w-28 bg-[#101010]/5 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#101010]/10 rounded-lg p-6 space-y-4">
            <div className="h-3 w-36 bg-[#101010]/5 rounded animate-pulse" />
            <div className="h-12 w-52 bg-[#101010]/5 rounded animate-pulse" />
          </div>

          <div className="bg-white border border-[#101010]/10 rounded-lg">
            <div className="p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
              <div className="h-4 w-full bg-[#101010]/5 rounded animate-pulse" />
            </div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 border-b border-[#101010]/5">
                <div className="h-6 w-full bg-[#101010]/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show activation prompt for users without a safe (new users)
  if (!safeAddress && !isDemoMode) {
    return (
      <div className="py-10 text-center">
        <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
        <h2 className="font-serif text-[32px] leading-[1.1] text-[#101010] mb-3">
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
      <Alert className="border-[#101010]/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-[#101010]/70">
          Unable to load savings data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      {/* Always show the full savings interface - auto-earn module is now optional */}
      <div className="space-y-12">
        {/* Account-Level Insurance Status Banner */}
        {userIsInsured && (
          <div className="bg-gradient-to-r from-[#1B29FF]/10 via-[#1B29FF]/5 to-transparent border-2 border-[#1B29FF]/30 rounded-[16px] p-6 shadow-[0_4px_16px_rgba(27,41,255,0.12)]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1B29FF]/15 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#1B29FF]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[18px] font-semibold text-[#101010]">
                    Insurance Protection Active
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wide">
                      Protected
                    </span>
                  </span>
                </div>
                <p className="text-[14px] text-[#101010]/70 leading-relaxed">
                  All your savings are covered by 0 Finance insurance at no
                  additional cost. Coverage applies to all vaults automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Overview - Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          <CheckingActionsCard
            balanceUsd={withdrawableBalanceUsd}
            safeAddress={safeAddress}
            isDemoMode={isDemoMode}
          />

          <PortfolioOverview
            totalSaved={totalSaved}
            isDemoMode={isDemoMode}
            safeAddress={safeAddress}
            fallbackApyPercent={fallbackApyPercent}
            averageInstantApy={averageInstantApy}
            animatedBalance={animatedBalance}
            animatedInitialEarned={animatedInitialEarned}
            vaultCount={vaultsVM.length}
          />
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
                maximumFractionDigits: 6,
              }}
            />
          </div>
        )}

        {/* Vaults Section - Editorial Table Style */}
        <div id="vaults-section">
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
              {displayVaults.map((vault, index) => {
                const normalizedAddress = vault.address.toLowerCase();
                const isSelected =
                  selectedVault.vaultAddress?.toLowerCase() ===
                  normalizedAddress;
                const expandedAction = isSelected ? selectedVault.action : null;
                const isExpanding = expandingVault === normalizedAddress;
                const isCollapsing = collapsingVault === normalizedAddress;

                return (
                  <div
                    key={vault.id}
                    className={cn(
                      'group relative overflow-hidden',
                      index !== displayVaults.length - 1 &&
                        !isSelected &&
                        'border-b border-[#101010]/10',
                    )}
                  >
                    <div
                      className={cn(
                        'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200 relative z-10',
                        vault.isInsured
                          ? 'bg-[#1B29FF]/5 hover:bg-[#1B29FF]/10 border-l-2 border-[#1B29FF]'
                          : 'hover:bg-[#F7F7F2]/30',
                        isSelected &&
                          (vault.isInsured
                            ? 'ring-1 ring-[#1B29FF]/30 bg-[#1B29FF]/12'
                            : 'bg-[#F7F7F2]/50'),
                        (isExpanding || isCollapsing) && 'transition-none',
                      )}
                    >
                      <div className="col-span-5">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {vault.isAuto && (
                                <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider shrink-0">
                                  Auto
                                </span>
                              )}
                              <p className="text-[15px] font-medium text-[#101010] truncate">
                                {vault.name}
                              </p>
                            </div>
                            <p className="text-[12px] text-[#101010]/60 truncate mt-1">
                              {vault.curator}
                              {vault.risk ? ` · ${vault.risk}` : ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-[24px] font-semibold tabular-nums text-[#1B29FF]">
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-[18px] font-medium tabular-nums text-[#101010]">
                          {vault.isContactOnly
                            ? '—'
                            : formatUsd(vault.balanceUsd)}
                        </p>
                        {vault.earnedUsd > 0 && !vault.isContactOnly && (
                          <p className="text-[13px] tabular-nums text-[#1B29FF] mt-0.5">
                            +{formatUsd(vault.earnedUsd)} earned
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 flex justify-end gap-1">
                        {vault.isContactOnly ? (
                          <button
                            onClick={() => toggleVaultAction('insure', vault)}
                            className={cn(
                              'px-3 py-2 text-[12px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
                              expandedAction === 'insure' &&
                                isSelected &&
                                'ring-2 ring-offset-1 ring-[#1B29FF]/40',
                            )}
                          >
                            Connect with coverage
                          </button>
                        ) : isDemoMode ? (
                          <>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to deposit funds from your real account.',
                                )
                              }
                              className="px-2.5 py-1 text-[12px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to withdraw from live vault positions.',
                                )
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
                                toggleVaultAction('deposit', vault)
                              }
                              className={cn(
                                'px-2.5 py-1 text-[12px] text-white transition-colors',
                                expandedAction === 'deposit' && isSelected
                                  ? 'bg-[#1420CC]'
                                  : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                              )}
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toggleVaultAction('withdraw', vault)
                              }
                              className={cn(
                                'px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 transition-colors',
                                expandedAction === 'withdraw' && isSelected
                                  ? 'bg-[#F7F7F2]'
                                  : 'bg-white hover:bg-[#F7F7F2]',
                              )}
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

                    {/* Accordion Content - Clean Integrated Design */}
                    {(expandedAction === 'insure' && isSelected) ||
                    (!isDemoMode && expandedAction && isSelected) ? (
                      <div
                        className={cn(
                          'transition-all duration-300 ease-out overflow-hidden',
                          expandedAction && isSelected
                            ? 'max-h-[800px] opacity-100'
                            : 'max-h-0 opacity-0',
                          isExpanding &&
                            'animate-in fade-in slide-in-from-top-1',
                        )}
                      >
                        <div className="px-4 pb-4 bg-[#F7F7F2]/50">
                          <div className="bg-white border border-[#101010]/10 p-5 sm:p-6">
                            {expandedAction === 'insure' && isSelected ? (
                              <InsuranceContactPanel />
                            ) : expandedAction === 'deposit' && isSelected ? (
                              <DepositEarnCard
                                key={`deposit-${vault.address}`}
                                safeAddress={safeAddress as Address}
                                vaultAddress={vault.address as Address}
                                onDepositSuccess={handleDepositSuccess}
                              />
                            ) : expandedAction === 'withdraw' && isSelected ? (
                              <WithdrawEarnCard
                                key={`withdraw-${vault.address}`}
                                safeAddress={safeAddress as Address}
                                vaultAddress={vault.address as Address}
                                onWithdrawSuccess={handleWithdrawSuccess}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {displayVaults.map((vault, index) => {
                const normalizedAddress = vault.address.toLowerCase();
                const isSelected =
                  selectedVault.vaultAddress?.toLowerCase() ===
                  normalizedAddress;
                const expandedAction = isSelected ? selectedVault.action : null;
                const isExpanding = expandingVault === normalizedAddress;
                const isCollapsing = collapsingVault === normalizedAddress;

                return (
                  <div
                    key={vault.id}
                    className={cn(
                      'relative overflow-hidden transition-all duration-200',
                      index !== displayVaults.length - 1 &&
                        !isSelected &&
                        'border-b border-[#101010]/5',
                    )}
                  >
                    <div
                      className={cn(
                        'p-4 space-y-3 transition-all duration-200',
                        vault.isInsured ? 'bg-[#1B29FF]/10' : 'bg-white',
                        isSelected &&
                          (vault.isInsured
                            ? 'ring-1 ring-[#1B29FF]/40 bg-[#1B29FF]/14'
                            : 'bg-[#F7F7F2]/40'),
                        (isExpanding || isCollapsing) && 'transition-none',
                      )}
                    >
                      {/* Vault Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {vault.isAuto && (
                                <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider">
                                  Auto
                                </span>
                              )}
                              <p className="text-[15px] font-medium text-[#101010]">
                                {vault.name}
                              </p>
                            </div>
                            <p className="text-[12px] text-[#101010]/60">
                              {vault.curator}
                              {vault.risk ? ` · ${vault.risk}` : ''}
                            </p>
                          </div>
                        </div>
                        <p className="text-[22px] font-semibold tabular-nums text-[#1B29FF]">
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      {/* Vault Stats */}
                      <div className="flex justify-between text-[14px]">
                        <span className="text-[#101010]/60">Balance</span>
                        <span className="tabular-nums text-[#101010]">
                          {vault.isContactOnly
                            ? '—'
                            : formatUsd(vault.balanceUsd)}
                        </span>
                      </div>
                      {vault.earnedUsd > 0 && !vault.isContactOnly && (
                        <div className="flex justify-between text-[14px]">
                          <span className="text-[#101010]/60">Earned</span>
                          <span className="tabular-nums text-[#1B29FF]">
                            +{formatUsd(vault.earnedUsd)}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {vault.isContactOnly ? (
                          <button
                            onClick={() => toggleVaultAction('insure', vault)}
                            className={cn(
                              'flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
                              expandedAction === 'insure' &&
                                isSelected &&
                                'ring-2 ring-offset-1 ring-[#1B29FF]/40',
                            )}
                          >
                            Connect with coverage
                          </button>
                        ) : isDemoMode ? (
                          <>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to deposit funds from your real account.',
                                )
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to withdraw from live vault positions.',
                                )
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
                                toggleVaultAction('deposit', vault)
                              }
                              className={cn(
                                'flex-1 px-3 py-2 text-[13px] text-white transition-colors',
                                expandedAction === 'deposit' && isSelected
                                  ? 'bg-[#1420CC]'
                                  : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                              )}
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toggleVaultAction('withdraw', vault)
                              }
                              className={cn(
                                'flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 transition-colors',
                                expandedAction === 'withdraw' && isSelected
                                  ? 'bg-[#F7F7F2]'
                                  : 'bg-white hover:bg-[#F7F7F2]',
                              )}
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

                      {/* Mobile Accordion Content */}
                      {(expandedAction === 'insure' && isSelected) ||
                      (!isDemoMode && expandedAction && isSelected) ? (
                        <div
                          className={cn(
                            'transition-all duration-300 ease-out overflow-hidden',
                            expandedAction && isSelected
                              ? 'max-h-[800px] opacity-100'
                              : 'max-h-0 opacity-0',
                            isExpanding &&
                              'animate-in fade-in slide-in-from-top-1',
                          )}
                        >
                          <div className="px-4 pt-3 pb-4">
                            <div className="bg-white border border-[#101010]/10 p-4">
                              {expandedAction === 'insure' && isSelected ? (
                                <InsuranceContactPanel />
                              ) : expandedAction === 'deposit' && isSelected ? (
                                <DepositEarnCard
                                  key={`deposit-mobile-${vault.address}`}
                                  safeAddress={safeAddress as Address}
                                  vaultAddress={vault.address as Address}
                                  onDepositSuccess={handleDepositSuccess}
                                />
                              ) : expandedAction === 'withdraw' &&
                                isSelected ? (
                                <WithdrawEarnCard
                                  key={`withdraw-mobile-${vault.address}`}
                                  safeAddress={safeAddress as Address}
                                  vaultAddress={vault.address as Address}
                                  onWithdrawSuccess={handleWithdrawSuccess}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <AutoSavingsStatus
          enabled={savingsState?.enabled || false}
          allocation={savingsState?.allocation || 0}
          isDemoMode={isDemoMode}
        />
      </div>
    </div>
  );
}
