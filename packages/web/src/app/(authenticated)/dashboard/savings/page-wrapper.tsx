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
import { Wallet, AlertCircle } from 'lucide-react';
import { useBimodal } from '@/components/ui/bimodal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BASE_USDC_VAULTS,
  ALL_BASE_VAULTS,
  BASE_CHAIN_ID,
} from '@/server/earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';
import { USDC_ADDRESS } from '@/lib/constants';

// Import extracted components
import {
  InsuranceBanner,
  LiveYieldCard,
  VaultsSection,
  CheckingActionsCard,
  PortfolioOverview,
  AutoSavingsStatus,
} from './components';
import type { SelectedVaultState } from './components/types';

// Import calculation utilities
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
  const activationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const refetchTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Bimodal Interface State - Technical mode shows multi-chain, ETH vaults, protocol details
  const { isTechnical } = useBimodal();

  const activationSteps = [
    'Verifying account...',
    'Setting up savings vault...',
    'Configuring auto-save...',
    'Activating yield generation...',
    'Finalizing setup...',
  ];

  const handleDemoActivate = useCallback(() => {
    if (!isDemoMode || isDemoActivated || isActivatingDemo) return;

    setIsActivatingDemo(true);

    if (activationIntervalRef.current) {
      clearInterval(activationIntervalRef.current);
    }

    let step = 0;
    activationIntervalRef.current = setInterval(() => {
      step++;
      if (step >= activationSteps.length) {
        if (activationIntervalRef.current) {
          clearInterval(activationIntervalRef.current);
          activationIntervalRef.current = null;
        }

        setTimeout(() => {
          persistDemoActivation();
          setIsActivatingDemo(false);
        }, 500);
      }
    }, 600);
  }, [
    isDemoMode,
    isDemoActivated,
    isActivatingDemo,
    activationSteps.length,
    persistDemoActivation,
  ]);

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
  const withdrawableBalanceUsd = isDemoMode ? 800000 : checkingBalanceUsd;

  // Get user profile to check insurance status
  const { data: userProfile } = trpc.user.getProfile.useQuery(undefined, {
    enabled: !isDemoMode,
  });
  const userIsInsured = isDemoMode ? true : userProfile?.isInsured || false;

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

  // Base vaults configuration - controlled by technical mode toggle
  const BASE_VAULTS = useMemo(() => {
    if (isDemoMode) {
      // Demo mode always uses base vaults for simplicity
      return BASE_USDC_VAULTS;
    }

    // Banking mode: Only USDC vaults on Base (simple view)
    // Technical mode: All vaults including ETH and cross-chain
    if (isTechnical) {
      return hasMultiChainFeature ? ALL_CROSS_CHAIN_VAULTS : ALL_BASE_VAULTS;
    }

    // Default banking mode - just USDC on Base
    return BASE_USDC_VAULTS;
  }, [isDemoMode, hasMultiChainFeature, isTechnical]);

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

  const { refetch: refetchVaultsMany } = realVaultStatsMany;
  const { refetch: refetchUserPositions } = realUserPositions;

  // State for vault action modals with transition support
  const [selectedVault, setSelectedVault] = useState<SelectedVaultState>({
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
  }, [isDemoMode, refetchUserPositions, refetchVaultsMany, safeAddress]);

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

  // Display vaults without the mock insured vault - protection is now shown as a separate banner
  const displayVaults = useMemo(() => {
    // Just return the actual vaults, sorted by balance/category
    const stableVaults = vaultsVM.filter((v) => v.category === 'stable');
    const growthVaults = vaultsVM.filter((v) => v.category === 'growth');
    return [...stableVaults, ...growthVaults];
  }, [vaultsVM]);

  const totalSaved = calculateTotalSaved(vaultsVM);
  const totalEarned = calculateTotalEarned(vaultsVM);
  const averageApy = calculateAverageApy(vaultsVM);
  const averageInstantApy = calculateWeightedInstantApy(vaultsVM, totalSaved);

  const animatedInitialEarned = isDemoMode ? 0 : totalEarned;
  const animatedBalance = isDemoMode ? totalSaved || 901323.0005 : totalSaved;
  const fallbackApyPercent = Number.isFinite(averageInstantApy)
    ? averageInstantApy * 100
    : 8;

  const isInitialLoading =
    isLoadingSafes ||
    isLoadingState ||
    (!isDemoMode &&
      ((realVaultStatsMany.isLoading && !realVaultStatsMany.data) ||
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
        <InsuranceBanner
          userIsInsured={userIsInsured}
          isTechnical={isTechnical}
          selectedVault={selectedVault}
          onToggleInsurance={toggleVaultAction}
        />

        {/* Portfolio Overview - Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          <CheckingActionsCard
            balanceUsd={withdrawableBalanceUsd}
            safeAddress={safeAddress}
            isDemoMode={isDemoMode}
            isTechnical={isTechnical}
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
            isTechnical={isTechnical}
          />
        </div>

        {/* Live Yield Counter - Premium Card */}
        <LiveYieldCard
          totalSaved={totalSaved}
          averageApy={averageApy}
          isTechnical={isTechnical}
        />

        {/* Vaults Section - Bimodal Design */}
        <VaultsSection
          vaults={displayVaults}
          safeAddress={safeAddress}
          isDemoMode={isDemoMode}
          isTechnical={isTechnical}
          selectedVault={selectedVault}
          expandingVault={expandingVault}
          collapsingVault={collapsingVault}
          onToggleAction={toggleVaultAction}
          onDepositSuccess={handleDepositSuccess}
          onWithdrawSuccess={handleWithdrawSuccess}
        />

        <AutoSavingsStatus
          enabled={savingsState?.enabled || false}
          allocation={savingsState?.allocation || 0}
          isDemoMode={isDemoMode}
        />
      </div>
    </div>
  );
}
