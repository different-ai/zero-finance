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
  AlertCircle,
} from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatUsd, formatUsdWithPrecision, cn } from '@/lib/utils';
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
import { AnimatedTotalEarned } from '@/components/animated-total-earned';

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
    // Debug log to see what data we're getting
    if (vaultStatsMany && vaultStatsMany.length > 0) {
      console.log('Vault Stats:', vaultStatsMany);
    }
    if (userPositions && userPositions.length > 0) {
      console.log('User Positions:', userPositions);
    }

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

  const closeModal = () => {
    setSelectedVault({
      action: null,
      vaultAddress: null,
      vaultName: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header Section */}
      <div className="border-b border-[#101010]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            High-Yield Savings
          </p>
          <h1 className="mt-2 font-serif text-[32px] sm:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Earn up to 10% APY
          </h1>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-[1.5] text-[#101010]/80 max-w-[65ch]">
            Deposit your idle cash into vetted DeFi vaults. No lock-ups,
            withdraw anytime.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Not Initialized State */}
        {!isEarnModuleInitialized ? (
          <div className="bg-white border border-[#101010]/10 p-12 text-center">
            <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
            <h2 className="font-serif text-[36px] leading-[1.1] text-[#101010] mb-3">
              Activate Savings Account
            </h2>
            <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[400px] mx-auto">
              Start earning up to {averageApy.toFixed(1)}% APY on your business
              funds.
            </p>
            <OpenSavingsAccountButton />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Portfolio Overview - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#101010]/10">
              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Total Balance
                </p>
                <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#101010]">
                  {formatUsd(totalSaved)}
                </p>
              </div>

              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Total Earned
                </p>
                <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
                  +
                  <AnimatedTotalEarned
                    initialEarned={totalEarned}
                    apy={averageApy / 100}
                    balance={totalSaved}
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

              <div className="bg-white p-6">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Daily Yield
                </p>
                <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#101010]">
                  {formatUsd((totalSaved * averageApy) / 100 / 365)}
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
                  Available Vaults
                </p>
                <h2 className="mt-2 font-serif text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                  USDC Yield Opportunities
                </h2>
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
                  <Link
                    href="/dashboard/savings/settings"
                    className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
                  >
                    Configure →
                  </Link>
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

      {/* Modals - Wrap existing components in Dialog */}
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
    </div>
  );
}
