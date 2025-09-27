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
import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  ExternalLink,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Mail,
  CalendarDays,
} from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { formatUsd, cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OpenSavingsAccountButton } from '@/components/savings/components/open-savings-account-button';
import { Address } from 'viem';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { AnimatedYieldCounter } from '@/components/animated-yield-counter';
import { AnimatedTotalEarned } from '@/components/animated-total-earned';
import { AnimatedTotalEarnedV2 } from '@/components/animated-total-earned-v2';
import { toast } from 'sonner';
import Image from 'next/image';
import { USDC_ADDRESS } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ZERO_LOGO_SRC = '/images/new-logo-bluer.png';
const INSURANCE_CONTACT = {
  email: 'raghav@0.finance',
  scheduleUrl: 'https://cal.com/team/0finance/30',
};
const INSURED_VAULT_IDS = new Set<string>();

const insuredPillAnimation = `
  @keyframes insuredShine {
    0%, 55% {
      transform: translateX(-160%);
      opacity: 0;
    }
    60% {
      opacity: 0.85;
    }
    64% {
      transform: translateX(160%);
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .insured-pill {
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }

  .insured-pill::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-160%);
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%);
    mix-blend-mode: screen;
    opacity: 0;
    pointer-events: none;
    animation: insuredShine 6s ease-in-out infinite;
  }
`;

export type SavingsPageWrapperProps = {
  mode?: SavingsExperienceMode;
};

export default function SavingsPageWrapper({
  mode = 'real',
}: SavingsPageWrapperProps) {
  const isDemoMode = useIsDemoMode(mode);
  const router = useRouter();
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
  const {
    data: safesData,
    isLoading: isLoadingSafes,
    isError: safesError,
  } = useUserSafes();

  const primarySafe = safesData?.[0];
  const safeAddress = primarySafe?.safeAddress || null;

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
    : 0;

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

      const extendedStat =
        stat && typeof stat === 'object' && 'principal' in stat
          ? (stat as {
              principal: bigint;
              principalRecorded?: bigint | null;
              yieldRecorded?: bigint | null;
              yieldCorrectionApplied?: 'ledger_shortfall' | 'rounding' | null;
            })
          : null;

      const principalUsd = extendedStat
        ? Number(extendedStat.principal) / 1e6
        : balanceUsd;

      const recordedPrincipalUsd =
        extendedStat?.principalRecorded !== undefined &&
        extendedStat?.principalRecorded !== null
          ? Number(extendedStat.principalRecorded) / 1e6
          : principalUsd;

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
      const instantApy = netApySource > 1 ? netApySource / 100 : netApySource;

      // Try multiple fields for earned amount
      // Handle BigInt conversion for yield field
      const rawEarnedUsd =
        extendedStat?.yieldRecorded !== undefined &&
        extendedStat?.yieldRecorded !== null
          ? Number(extendedStat.yieldRecorded) / 1e6
          : null;

      const correctionReason = extendedStat?.yieldCorrectionApplied ?? null;

      const ledgerEarnedUsd =
        stat?.yield !== undefined && stat?.yield !== null
          ? Number(stat.yield) / 1e6
          : null;

      const fallbackEarnedUsd = balanceUsd - principalUsd;

      let earnedUsd = 0;

      // First priority: Use actual yield from ledger
      if (
        ledgerEarnedUsd !== null &&
        Number.isFinite(ledgerEarnedUsd) &&
        ledgerEarnedUsd >= 0
      ) {
        earnedUsd = ledgerEarnedUsd;
      }
      // Second priority: Use the difference between balance and principal if both are available
      else if (fallbackEarnedUsd > 0 && principalUsd > 0) {
        earnedUsd = fallbackEarnedUsd;
      }
      // Last resort: Estimate based on current balance and APY
      else if (balanceUsd > 0 && apy > 0) {
        // Use a more reasonable estimate - 14 days of earnings instead of 1
        // This prevents the animation from appearing to start from near 0
        // Most users have funds in the vault for at least 2 weeks
        earnedUsd = ((balanceUsd * (apy / 100)) / 365) * 14;
      }

      // Ensure non-negative earnings
      if (earnedUsd < 0) {
        earnedUsd = 0;
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
        principalUsd,
        recordedPrincipalUsd,
        rawEarnedUsd,
        yieldCorrectionReason: correctionReason,
        isAuto: v.id === 'morphoGauntlet',
        instantApy,
        isInsured:
          INSURED_VAULT_IDS.has(v.id) ||
          (userIsInsured && v.id === 'morphoGauntlet'),
        isContactOnly: false,
      };
    });
  }, [BASE_VAULTS, vaultStatsMany, userPositions]);

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

  const InsuranceContactPanel = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={ZERO_LOGO_SRC}
            alt="0 Finance logo"
            width={42}
            height={42}
            className="h-10 w-10 rounded-md"
          />
          <div>
            <p className="text-[15px] font-medium text-[#101010]">
              Speak with our coverage team
            </p>
            <p className="text-[13px] text-[#101010]/70 max-w-[420px]">
              We arrange bespoke insurance policies for treasury deposits. Reach
              out to secure coverage on this 8% vault.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`mailto:${INSURANCE_CONTACT.email}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
          >
            <Mail className="h-4 w-4" /> Email {INSURANCE_CONTACT.email}
          </a>
          <a
            href={INSURANCE_CONTACT.scheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-[#101010] border border-[#101010]/15 hover:bg-[#F7F7F2] transition-colors"
          >
            <CalendarDays className="h-4 w-4" /> Schedule a call
          </a>
        </div>
      </div>
      <div className="border border-dashed border-[#1B29FF]/30 rounded-lg p-4 bg-[#1B29FF]/5">
        <p className="text-[13px] text-[#1B29FF]">
          Coverage is issued through our underwriting partners after a short
          call. We’ll validate treasury size, coverage needs, and onboard you
          end-to-end.
        </p>
      </div>
    </div>
  );

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

  return (
    <div className="">
      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Start earning up to 8% APY on your business funds.
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
                Start earning up to 8% APY on your business funds.
              </p>
              <OpenSavingsAccountButton
                safeAddress={safeAddress || undefined}
              />
            </div>
          )
        ) : (
          <div className="space-y-12">
            {/* Portfolio Overview - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10">
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
                  {isDemoMode ? (
                    <AnimatedTotalEarned
                      initialEarned={animatedInitialEarned}
                      apy={averageInstantApy}
                      balance={animatedBalance}
                    />
                  ) : safeAddress ? (
                    <AnimatedTotalEarnedV2
                      safeAddress={safeAddress}
                      fallbackApy={fallbackApyPercent}
                      fallbackBalance={totalSaved}
                      className="inline-block"
                    />
                  ) : (
                    <span className="text-[#101010]/40">Calculating...</span>
                  )}
                </p>
              </div>
            </div>

            {showYieldCorrectionBanner && (
              <div className="bg-[#1B29FF]/5 border border-[#1B29FF]/40 rounded-lg p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-[14px] font-medium text-[#101010]">
                    Earnings counter resynced
                  </p>
                  <p className="text-[13px] text-[#101010]/70">
                    {hasLedgerShortfallCorrection
                      ? 'We detected an out-of-sync ledger entry and reset live earnings to match your on-chain balance.'
                      : 'We resolved a rounding mismatch on your live earnings counter.'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={triggerVaultRefresh}
                    className="bg-[#1B29FF] hover:bg-[#1B29FF]/90 text-white"
                  >
                    Refresh now
                  </Button>
                </div>
              </div>
            )}

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
                    const expandedAction = isSelected
                      ? selectedVault.action
                      : null;
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
                                  {vault.isInsured && (
                                    <span className="insured-pill animate-glow inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#1B29FF]/15 text-[#1B29FF] text-[10px] font-semibold uppercase tracking-[0.18em]">
                                      <Image
                                        src={ZERO_LOGO_SRC}
                                        alt="0 Finance insured"
                                        width={14}
                                        height={14}
                                        className="h-3.5 w-3.5"
                                      />
                                      Insured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-[#101010]/60 truncate mt-1">
                                  {vault.curator}
                                  {vault.risk ? ` · ${vault.risk}` : ''}
                                  {vault.isContactOnly &&
                                    ' · Coverage arranged via 0 Finance'}
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
                              {vault.isContactOnly
                                ? '—'
                                : formatUsd(vault.balanceUsd)}
                            </p>
                            {vault.earnedUsd > 0 && !vault.isContactOnly && (
                              <p className="text-[12px] tabular-nums text-[#1B29FF]">
                                +{formatUsd(vault.earnedUsd)}
                              </p>
                            )}
                          </div>

                          <div className="col-span-3 flex justify-end gap-1">
                            {vault.isContactOnly ? (
                              <button
                                onClick={() =>
                                  toggleVaultAction('insure', vault)
                                }
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
                                ) : expandedAction === 'deposit' &&
                                  isSelected ? (
                                  <DepositEarnCard
                                    key={`deposit-${vault.address}`}
                                    safeAddress={safeAddress as Address}
                                    vaultAddress={vault.address as Address}
                                    onDepositSuccess={handleDepositSuccess}
                                  />
                                ) : expandedAction === 'withdraw' &&
                                  isSelected ? (
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
                    const expandedAction = isSelected
                      ? selectedVault.action
                      : null;
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
                                  {vault.isInsured && (
                                    <span className="insured-pill animate-glow inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1B29FF]/15 text-[#1B29FF] text-[10px] font-semibold uppercase tracking-[0.18em]">
                                      <Image
                                        src={ZERO_LOGO_SRC}
                                        alt="0 Finance insured"
                                        width={14}
                                        height={14}
                                        className="h-3.5 w-3.5"
                                      />
                                      Insured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-[#101010]/60">
                                  {vault.curator}
                                  {vault.risk ? ` · ${vault.risk}` : ''}
                                  {vault.isContactOnly &&
                                    ' · Coverage arranged via 0 Finance'}
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
                                onClick={() =>
                                  toggleVaultAction('insure', vault)
                                }
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
                                  ) : expandedAction === 'deposit' &&
                                    isSelected ? (
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
                        toast(
                          'Configure auto-savings once your live account is activated.',
                        )
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
    </div>
  );
}
