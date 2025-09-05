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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  // State for inline expansion
  const [expandedAction, setExpandedAction] = useState<{
    vaultId: string;
    vaultAddress: string;
    vaultName: string;
    action: 'deposit' | 'withdraw';
  } | null>(null);

  // Fetch recent deposits
  const realDeposits = trpc.earn.getRecentEarnDeposits.useQuery(
    { safeAddress: safeAddress!, limit: 10 },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  // Fetch recent withdrawals
  const realWithdrawals = trpc.earn.getRecentEarnWithdrawals.useQuery(
    { safeAddress: safeAddress!, limit: 10 },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const recentDeposits = isDemoMode ? demoRecentDeposits : realDeposits.data;
  const recentWithdrawals = isDemoMode
    ? demoRecentWithdrawals
    : realWithdrawals.data;

  // Combine and sort transactions
  const recentTransactions = useMemo(() => {
    const deposits = recentDeposits || [];
    const withdrawals = recentWithdrawals || [];

    const allTransactions = [
      ...deposits.map((d) => ({ ...d, type: 'deposit' as const })),
      ...withdrawals.map((w) => ({ ...w, type: 'withdrawal' as const })),
    ];

    return allTransactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }, [recentDeposits, recentWithdrawals]);

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
      const apy =
        stat?.netApy != null
          ? Number(stat.netApy)
          : stat?.apy != null
            ? Number(stat.apy)
            : 8.0; // Default APY

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

  const isLoading =
    isLoadingSafes ||
    isLoadingState ||
    (!isDemoMode &&
      (realVaultStats.isLoading ||
        realDeposits.isLoading ||
        realWithdrawals.isLoading));

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

  if (isLoading || !savingsState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Savings
          </h1>
          <p className="text-muted-foreground">
            Grow your wealth with high-yield vaults on Base
          </p>
        </div>

        <div className="space-y-6">
          {savingsState.enabled && (
            <Card className="rounded-lg border p-5 transition-all hover:shadow-md border-primary/20 bg-primary/5 p-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Auto-Savings</h3>
                    <p className="text-sm text-muted-foreground">
                      Saving {savingsState.allocation}% of deposits
                      automatically
                    </p>
                  </div>
                  <Link href="/dashboard/savings/settings">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-3 w-3" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {!savingsState.enabled && (
            <div className="w-full flex justify-center">
              {!isEarnModuleInitialized ? (
                <Card className="max-w-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Set Up Your Savings Account</CardTitle>
                    <CardDescription>
                      Enable automatic savings with high-yield returns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Your savings will earn{' '}
                        {savingsState?.apy?.toFixed(2) || '8.00'}% APY in the
                        Seamless vault
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Withdraw anytime with no penalties
                      </p>
                    </div>
                    {isDemoMode ? (
                      <Button
                        className="w-full"
                        onClick={() =>
                          alert('Demo: Savings account would be opened here')
                        }
                      >
                        Open Savings Account
                      </Button>
                    ) : (
                      <OpenSavingsAccountButton
                        safeAddress={safeAddress as Address}
                        onSuccess={() => {
                          setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="max-w-md">
                  <CardHeader className="text-center">
                    <CardTitle>Enable Auto-Savings</CardTitle>
                    <CardDescription>
                      Set up automatic savings to grow your wealth
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure your auto-savings preferences in settings
                    </p>
                    <Link href="/dashboard/savings/settings">
                      <Button>
                        <Settings className="mr-2 h-4 w-4" />
                        Go to Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {isEarnModuleInitialized && (
            <div className="space-y-4">
              {!savingsState.enabled && (
                <Alert className="border-0 bg-muted/50 mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enable auto-savings to automatically save a portion of your
                    deposits
                  </AlertDescription>
                </Alert>
              )}

              {/* Animated Yield Counter Card */}
              {totalSaved > 0 && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Your Yield Performance</span>
                      <AnimatedYieldBadge
                        principal={totalSaved}
                        apy={vaultsVM[0]?.apy || 8.0}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatedYieldCounter
                      principal={totalSaved}
                      apy={vaultsVM[0]?.apy || 8.0}
                      showDaily={true}
                      showMonthly={true}
                      showYearly={true}
                      startDate={
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      } // Start 30 days ago for demo
                    />
                  </CardContent>
                </Card>
              )}

              <div className="border-0 shadow-none bg-transparent p-0">
                <div className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg">Vaults</h3>
                      <p className="text-sm">High-yield USDC vaults on Base</p>
                    </div>
                    <Image src={BaseLogo} alt="Base" width={48} />
                  </div>
                </div>
                <div className="space-y-3">
                  {vaultsVM.map((v) => (
                    <div
                      key={v.id}
                      className={`rounded-lg border bg-card p-5 transition-all hover:shadow-md ${
                        v.isAuto
                          ? 'border-primary/20 bg-primary/5'
                          : 'border-border'
                      } ${
                        expandedAction?.vaultId === v.id
                          ? 'ring-2 ring-primary/50 shadow-md'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-base">{v.name}</h3>
                            {v.isAuto && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                AUTO
                              </span>
                            )}
                            {v.balanceUsd > 0 && (
                              <AnimatedYieldBadge
                                principal={v.balanceUsd}
                                apy={v.apy}
                                className="scale-90"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{v.curator}</span>
                            <span>•</span>
                            <span
                              className={`font-medium ${
                                v.risk === 'Conservative'
                                  ? 'text-green-600'
                                  : v.risk === 'Balanced'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                              }`}
                            >
                              {v.risk}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Balance
                          </p>
                          <p className="font-semibold text-sm">
                            {formatUsd(v.balanceUsd)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            APY
                          </p>
                          <p className="font-semibold text-sm">
                            {v.apy.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Earned
                          </p>
                          <p className="font-semibold text-sm text-green-600">
                            +{formatUsdWithPrecision(v.earnedUsd, 6)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={
                            expandedAction?.vaultId === v.id &&
                            expandedAction.action === 'deposit'
                              ? 'default'
                              : 'outline'
                          }
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            if (isDemoMode) {
                              alert('Demo: Deposit interface would open here');
                            } else if (
                              expandedAction?.vaultId === v.id &&
                              expandedAction.action === 'deposit'
                            ) {
                              setExpandedAction(null);
                            } else {
                              setExpandedAction({
                                vaultId: v.id,
                                vaultAddress: v.address,
                                vaultName: v.name,
                                action: 'deposit',
                              });
                            }
                          }}
                        >
                          <ArrowDownToLine className="h-3 w-3 mr-1" />
                          Deposit
                        </Button>
                        {v.balanceUsd > 0 && (
                          <Button
                            variant={
                              expandedAction?.vaultId === v.id &&
                              expandedAction.action === 'withdraw'
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              if (isDemoMode) {
                                alert(
                                  'Demo: Withdraw interface would open here',
                                );
                              } else if (
                                expandedAction?.vaultId === v.id &&
                                expandedAction.action === 'withdraw'
                              ) {
                                setExpandedAction(null);
                              } else {
                                setExpandedAction({
                                  vaultId: v.id,
                                  vaultAddress: v.address,
                                  vaultName: v.name,
                                  action: 'withdraw',
                                });
                              }
                            }}
                          >
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Withdraw
                          </Button>
                        )}
                      </div>

                      {!isDemoMode && expandedAction?.vaultId === v.id && (
                        <div className="mt-4 pt-4 border-t">
                          {expandedAction.action === 'deposit' ? (
                            <DepositEarnCard
                              safeAddress={safeAddress as `0x${string}`}
                              vaultAddress={v.address as `0x${string}`}
                              onDepositSuccess={() => {
                                setExpandedAction(null);
                              }}
                            />
                          ) : (
                            <WithdrawEarnCard
                              safeAddress={safeAddress as `0x${string}`}
                              vaultAddress={v.address as `0x${string}`}
                              onWithdrawSuccess={() => {
                                setExpandedAction(null);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            tx.type === 'deposit'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {tx.type === 'deposit' ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {tx.type === 'deposit' ? 'Auto-save' : 'Withdrawal'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            tx.type === 'deposit'
                              ? 'text-green-700'
                              : 'text-orange-700'
                          }`}
                        >
                          {tx.type === 'deposit' ? '+' : '-'}
                          {formatUsdWithPrecision(
                            tx.type === 'deposit' && tx.skimmedAmount
                              ? tx.skimmedAmount
                              : tx.amount,
                          )}
                        </p>
                        {tx.type === 'deposit' && tx.skimmedAmount && (
                          <p className="text-xs text-muted-foreground">
                            From {formatUsd(tx.amount)} deposit
                          </p>
                        )}
                        {tx.type === 'withdrawal' &&
                          tx.status === 'pending' && (
                            <p className="text-xs text-amber-600">Pending</p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
