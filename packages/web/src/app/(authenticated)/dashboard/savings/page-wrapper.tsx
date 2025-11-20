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
import {
  Wallet,
  ExternalLink,
  AlertCircle,
  Shield,
  TrendingUp,
  Coins,
} from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { formatUsd, cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Address } from 'viem';
import {
  BASE_USDC_VAULTS,
  ALL_BASE_VAULTS,
  BASE_CHAIN_ID,
} from '@/server/earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';
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

  // Check workspace features
  const workspaceId = primarySafe?.workspaceId;

  const { data: workspaceFeatures } = trpc.workspace.getFeatures.useQuery(
    { workspaceId: workspaceId! },
    {
      enabled: !!workspaceId && !isDemoMode,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    },
  );

  const hasMultiChainFeature =
    workspaceFeatures?.includes('multi_chain') || false;

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
  const BASE_VAULTS = useMemo(() => {
    if (isDemoMode) {
      // Demo mode always uses base vaults for simplicity unless we want to demo multi-chain
      return BASE_USDC_VAULTS;
    }
    // Include all Base vaults (USDC + ETH) by default, or cross-chain vaults if enabled
    return hasMultiChainFeature ? ALL_CROSS_CHAIN_VAULTS : ALL_BASE_VAULTS;
  }, [isDemoMode, hasMultiChainFeature]);

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
    { vaultAddresses: baseVaultAddresses },
    {
      enabled: !isDemoMode,
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
      displayName: 'Insured Vault',
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
      // New required properties
      principalUsd: 0,
      recordedPrincipalUsd: 0,
      rawEarnedUsd: null,
      yieldCorrectionReason: null,
      chainId: BASE_CHAIN_ID,
      asset: {
        symbol: 'USDC',
        decimals: 6,
        isNative: false,
      },
      category: 'stable' as const,
      balanceNative: undefined,
      earnedNative: undefined,
    }),
    [],
  );

  // Display vaults without the mock insured vault - protection is now shown as a separate banner
  const displayVaults = useMemo(() => {
    // Just return the actual vaults, sorted by balance/category
    const stableVaults = vaultsVM.filter((v) => v.category === 'stable');
    const growthVaults = vaultsVM.filter((v) => v.category === 'growth');
    return [...stableVaults, ...growthVaults];
  }, [vaultsVM]);

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
        {/* Protection Banner - Active Insurance or CTA */}
        {userIsInsured ? (
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
        ) : (
          <div
            className={cn(
              'relative overflow-hidden bg-white border rounded-[16px] shadow-[0_2px_12px_rgba(27,41,255,0.08)] transition-all duration-300',
              selectedVault.vaultAddress === 'insured-contact'
                ? 'border-[#1B29FF]/40'
                : 'border-[#1B29FF]/20',
            )}
          >
            {/* Blueprint Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(27,41,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,41,255,0.05) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-[#1B29FF]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#101010] mb-1">
                      Protect Your Savings
                    </h3>
                    <p className="text-[14px] text-[#101010]/70 leading-relaxed max-w-[400px]">
                      Get institutional-grade insurance coverage for all your
                      deposits. Sleep easy knowing your funds are protected.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleVaultAction('insure', {
                      address: 'insured-contact',
                      name: 'Get Protection',
                    })
                  }
                  className={cn(
                    'group relative flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 font-medium text-[14px] rounded-lg transition-all duration-300',
                    selectedVault.vaultAddress === 'insured-contact'
                      ? 'bg-[#F7F7F2] text-[#101010] border border-[#101010]/10'
                      : 'bg-[#1B29FF] hover:bg-[#1420CC] text-white shadow-primary hover:shadow-[0_6px_20px_rgba(27,41,255,0.35)]',
                  )}
                >
                  <span>
                    {selectedVault.vaultAddress === 'insured-contact'
                      ? 'Close'
                      : 'Get Protected'}
                  </span>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      selectedVault.vaultAddress === 'insured-contact'
                        ? 'rotate-90'
                        : 'group-hover:translate-x-1',
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        selectedVault.vaultAddress === 'insured-contact'
                          ? 'M6 18L18 6M6 6l12 12'
                          : 'M13 7l5 5m0 0l-5 5m5-5H6'
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Accordion Content - Insurance Contact Panel */}
            <div
              className={cn(
                'transition-all duration-300 ease-out overflow-hidden',
                selectedVault.vaultAddress === 'insured-contact'
                  ? 'max-h-[800px] opacity-100'
                  : 'max-h-0 opacity-0',
              )}
            >
              <div className="px-6 pb-6">
                <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-5 sm:p-6">
                  <InsuranceContactPanel />
                </div>
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
                <div className="col-span-4">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    Strategy
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    APY
                  </p>
                </div>
                <div className="col-span-3 text-right">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    Your Position
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
                          : vault.category === 'growth'
                            ? 'bg-gradient-to-r from-[#10b981]/5 to-transparent hover:from-[#10b981]/10 border-l-2 border-[#10b981]'
                            : 'hover:bg-[#F7F7F2]/30',
                        isSelected &&
                          (vault.isInsured
                            ? 'ring-1 ring-[#1B29FF]/30 bg-[#1B29FF]/12'
                            : vault.category === 'growth'
                              ? 'ring-1 ring-[#10b981]/30 bg-[#10b981]/8'
                              : 'bg-[#F7F7F2]/50'),
                        (isExpanding || isCollapsing) && 'transition-none',
                      )}
                    >
                      <div className="col-span-4">
                        <div className="flex items-start gap-3">
                          {/* Asset Icon */}
                          <div
                            className={cn(
                              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                              vault.category === 'growth'
                                ? 'bg-[#10b981]/10'
                                : 'bg-[#1B29FF]/10',
                            )}
                          >
                            {vault.category === 'growth' ? (
                              <TrendingUp
                                className={cn(
                                  'h-5 w-5',
                                  vault.category === 'growth'
                                    ? 'text-[#10b981]'
                                    : 'text-[#1B29FF]',
                                )}
                              />
                            ) : (
                              <Coins className="h-5 w-5 text-[#1B29FF]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[15px] font-medium text-[#101010] truncate">
                                {vault.displayName || vault.name}
                              </p>
                              {/* Asset Badge */}
                              <span
                                className={cn(
                                  'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
                                  vault.asset.symbol === 'WETH' ||
                                    vault.asset.symbol === 'ETH'
                                    ? 'bg-[#627eea]/10 text-[#627eea]'
                                    : 'bg-[#2775ca]/10 text-[#2775ca]',
                                )}
                              >
                                {vault.asset.isNative
                                  ? 'ETH'
                                  : vault.asset.symbol}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#101010]/60 truncate mt-1">
                              {vault.curator}
                              {vault.risk ? ` · ${vault.risk}` : ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <p
                          className={cn(
                            'text-[24px] font-semibold tabular-nums',
                            vault.category === 'growth'
                              ? 'text-[#10b981]'
                              : 'text-[#1B29FF]',
                          )}
                        >
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      <div className="col-span-3 text-right">
                        {vault.isContactOnly ? (
                          <p className="text-[16px] text-[#101010]/40">—</p>
                        ) : vault.balanceUsd > 0 ? (
                          <div>
                            {/* Show native amount for ETH vaults */}
                            {vault.balanceNative !== undefined && (
                              <p className="text-[18px] font-semibold tabular-nums text-[#101010]">
                                {vault.balanceNative.toFixed(6)} ETH
                              </p>
                            )}
                            <p
                              className={cn(
                                'tabular-nums',
                                vault.balanceNative !== undefined
                                  ? 'text-[13px] text-[#101010]/60'
                                  : 'text-[18px] font-semibold text-[#101010]',
                              )}
                            >
                              {formatUsd(vault.balanceUsd)}
                            </p>
                            {vault.earnedUsd > 0 && (
                              <p
                                className={cn(
                                  'text-[12px] tabular-nums mt-0.5',
                                  vault.category === 'growth'
                                    ? 'text-[#10b981]'
                                    : 'text-[#1B29FF]',
                                )}
                              >
                                +
                                {vault.earnedNative !== undefined
                                  ? `${vault.earnedNative.toFixed(6)} ETH`
                                  : formatUsd(vault.earnedUsd)}{' '}
                                earned
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[14px] text-[#101010]/40">
                            No position
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
                                chainId={vault.chainId}
                              />
                            ) : expandedAction === 'withdraw' && isSelected ? (
                              <WithdrawEarnCard
                                key={`withdraw-${vault.address}`}
                                safeAddress={safeAddress as Address}
                                vaultAddress={vault.address as Address}
                                onWithdrawSuccess={handleWithdrawSuccess}
                                chainId={vault.chainId}
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
                        vault.isInsured
                          ? 'bg-[#1B29FF]/10'
                          : vault.category === 'growth'
                            ? 'bg-gradient-to-r from-[#10b981]/5 to-transparent'
                            : 'bg-white',
                        isSelected &&
                          (vault.isInsured
                            ? 'ring-1 ring-[#1B29FF]/40 bg-[#1B29FF]/14'
                            : vault.category === 'growth'
                              ? 'ring-1 ring-[#10b981]/30 bg-[#10b981]/8'
                              : 'bg-[#F7F7F2]/40'),
                        (isExpanding || isCollapsing) && 'transition-none',
                      )}
                    >
                      {/* Vault Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {/* Asset Icon */}
                          <div
                            className={cn(
                              'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
                              vault.category === 'growth'
                                ? 'bg-[#10b981]/10'
                                : 'bg-[#1B29FF]/10',
                            )}
                          >
                            {vault.category === 'growth' ? (
                              <TrendingUp
                                className={cn(
                                  'h-4 w-4',
                                  vault.category === 'growth'
                                    ? 'text-[#10b981]'
                                    : 'text-[#1B29FF]',
                                )}
                              />
                            ) : (
                              <Coins className="h-4 w-4 text-[#1B29FF]" />
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[15px] font-medium text-[#101010]">
                                {vault.displayName || vault.name}
                              </p>
                              {/* Asset Badge */}
                              <span
                                className={cn(
                                  'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide',
                                  vault.asset.symbol === 'WETH' ||
                                    vault.asset.symbol === 'ETH'
                                    ? 'bg-[#627eea]/10 text-[#627eea]'
                                    : 'bg-[#2775ca]/10 text-[#2775ca]',
                                )}
                              >
                                {vault.asset.isNative
                                  ? 'ETH'
                                  : vault.asset.symbol}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#101010]/60">
                              {vault.curator}
                              {vault.risk ? ` · ${vault.risk}` : ''}
                            </p>
                          </div>
                        </div>
                        <p
                          className={cn(
                            'text-[22px] font-semibold tabular-nums',
                            vault.category === 'growth'
                              ? 'text-[#10b981]'
                              : 'text-[#1B29FF]',
                          )}
                        >
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      {/* Vault Stats */}
                      {vault.isContactOnly ? (
                        <div className="flex justify-between text-[14px]">
                          <span className="text-[#101010]/60">Position</span>
                          <span className="text-[#101010]/40">—</span>
                        </div>
                      ) : vault.balanceUsd > 0 ? (
                        <>
                          {/* Show native amount for ETH vaults */}
                          {vault.balanceNative !== undefined && (
                            <div className="flex justify-between text-[14px]">
                              <span className="text-[#101010]/60">Balance</span>
                              <span className="tabular-nums font-medium text-[#101010]">
                                {vault.balanceNative.toFixed(6)} ETH
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-[14px]">
                            <span className="text-[#101010]/60">
                              {vault.balanceNative !== undefined
                                ? 'Value'
                                : 'Balance'}
                            </span>
                            <span className="tabular-nums text-[#101010]">
                              {formatUsd(vault.balanceUsd)}
                            </span>
                          </div>
                          {vault.earnedUsd > 0 && (
                            <div className="flex justify-between text-[14px]">
                              <span className="text-[#101010]/60">Earned</span>
                              <span
                                className={cn(
                                  'tabular-nums',
                                  vault.category === 'growth'
                                    ? 'text-[#10b981]'
                                    : 'text-[#1B29FF]',
                                )}
                              >
                                +
                                {vault.earnedNative !== undefined
                                  ? `${vault.earnedNative.toFixed(6)} ETH`
                                  : formatUsd(vault.earnedUsd)}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-between text-[14px]">
                          <span className="text-[#101010]/60">Position</span>
                          <span className="text-[#101010]/40">No position</span>
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
                                  chainId={vault.chainId}
                                />
                              ) : expandedAction === 'withdraw' &&
                                isSelected ? (
                                <WithdrawEarnCard
                                  key={`withdraw-mobile-${vault.address}`}
                                  safeAddress={safeAddress as Address}
                                  vaultAddress={vault.address as Address}
                                  onWithdrawSuccess={handleWithdrawSuccess}
                                  chainId={vault.chainId}
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
