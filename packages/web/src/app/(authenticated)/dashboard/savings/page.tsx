'use client';

import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { useUserSafes } from '@/hooks/use-user-safes';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { OpenSavingsAccountButton } from '@/components/savings/components/open-savings-account-button';
import { Address } from 'viem';
import Image from 'next/image';
import BaseLogo from 'public/logos/_base-logo.svg';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';

// Seamless Vault address on Base - fallback when no vault stats available
const SEAMLESS_VAULT_ADDRESS = '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738';

export default function SavingsPage() {
  const router = useRouter();
  const {
    data: safesData,
    isLoading: isLoadingSafes,
    isError: safesError,
  } = useUserSafes();
  const primarySafe = safesData?.[0];
  const safeAddress = primarySafe?.safeAddress || null;

  const {
    savingsState,
    isLoading: isLoadingState,
  } = useRealSavingsState(safeAddress, 0);

  // Check earn module initialization status
  const {
    data: earnModuleStatus,
    isLoading: isLoadingEarnStatus,
    refetch: refetchEarnStatus,
  } = trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress },
  );

  const isEarnModuleInitialized =
    earnModuleStatus?.isInitializedOnChain || false;

  // Fetch vault stats with polling for live updates
  const {
    data: vaultStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    {
      enabled: !!safeAddress,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchIntervalInBackground: true,
    },
  );

  // Get the vault address from stats or fallback to the known Seamless vault
  const vaultAddress = vaultStats?.[0]?.vaultAddress || SEAMLESS_VAULT_ADDRESS;

  // Base vaults configuration
  const BASE_VAULTS = BASE_USDC_VAULTS;
  const baseVaultAddresses = BASE_VAULTS.map((v) => v.address);

  // Fetch live vault balance
  const { data: liveVaultData } = trpc.earn.getVaultInfo.useQuery(
    {
      safeAddress: safeAddress!,
      vaultAddress: vaultAddress as `0x${string}`,
    },
    {
      enabled: !!safeAddress && !!vaultAddress,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchIntervalInBackground: true,
    },
  );

  // Fetch multi-vault stats
  const { data: vaultStatsMany } = trpc.earn.statsByVault.useQuery(
    { safeAddress: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress,
      refetchInterval: 10000,
      refetchIntervalInBackground: true,
    },
  );

  // Fetch user positions across vaults
  const { data: userPositions } = trpc.earn.userPositions.useQuery(
    { userSafe: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress,
      refetchInterval: 10000,
      refetchIntervalInBackground: true,
    },
  );


  // State for inline expansion
  const utils = trpc.useUtils();
  const [expandedAction, setExpandedAction] = useState<{
    vaultId: string;
    vaultAddress: string;
    vaultName: string;
    action: 'deposit' | 'withdraw';
  } | null>(null);

  // Fetch recent deposits
  const { data: recentDeposits, isLoading: isLoadingDeposits } =
    trpc.earn.getRecentEarnDeposits.useQuery(
      { safeAddress: safeAddress!, limit: 10 },
      {
        enabled: !!safeAddress,
        refetchInterval: 10000, // Poll every 10 seconds
        refetchOnWindowFocus: true,
      },
    );

  // Fetch recent withdrawals
  const { data: recentWithdrawals, isLoading: isLoadingWithdrawals } =
    trpc.earn.getRecentEarnWithdrawals.useQuery(
      { safeAddress: safeAddress!, limit: 10 },
      {
        enabled: !!safeAddress,
        refetchInterval: 10000, // Poll every 10 seconds
        refetchOnWindowFocus: true,
      },
    );

  // Combine and sort transactions by timestamp
  const recentTransactions = useMemo(() => {
    const deposits = recentDeposits || [];
    const withdrawals = recentWithdrawals || [];

    // Combine both arrays
    const allTransactions = [
      ...deposits.map((d) => ({ ...d, type: 'deposit' as const })),
      ...withdrawals.map((w) => ({ ...w, type: 'withdrawal' as const })),
    ];

    // Sort by timestamp descending (most recent first)
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

      // Balance uses live assetsUsd when available
      const balanceUsd = pos?.assetsUsd ? Number(pos.assetsUsd) : 0;

      // APY calculation - prefer netApy (after fees) over apy
      const apy =
        stat?.netApy != null
          ? Number(stat.netApy)
          : stat?.apy != null
            ? Number(stat.apy)
            : 0;

      // Earned calculation
      const earnedUsd = stat?.yield ? Number(stat.yield) / 1e6 : 0;

      return {
        id: v.id,
        name: v.name,
        risk: v.risk,
        curator: v.curator,
        address: v.address,
        appUrl: v.appUrl,
        apy: apy * 100, // Convert to percentage
        balanceUsd,
        earnedUsd,
        isAuto: v.id === 'seamless', // Only Seamless can be auto-savings
      };
    });
  }, [BASE_VAULTS, vaultStatsMany, userPositions]);

  // Calculate totals - use live vault data for current balance
  const totalSaved = liveVaultData ? Number(liveVaultData.assets) / 1e6 : 0;

  const totalEarned =
    vaultStats?.reduce((sum, stat) => {
      const yieldAmount = stat['yield'] > 0n ? stat['yield'] : 0n;
      return sum + Number(yieldAmount) / 1e6;
    }, 0) || 0;

  // Debug logging
  useEffect(() => {
    if (vaultStats || liveVaultData) {
      console.log('Vault stats:', vaultStats);
      console.log('Live vault data:', liveVaultData);
      console.log('Total saved (live):', totalSaved);
      console.log('Total earned:', totalEarned);
    }
  }, [vaultStats, liveVaultData, totalSaved, totalEarned]);


  const isLoading =
    isLoadingSafes ||
    isLoadingState ||
    isLoadingStats ||
    isLoadingDeposits ||
    isLoadingWithdrawals;

  // Improved redirect logic - only redirect when we're certain there are no safes
  useEffect(() => {
    // Only redirect if:
    // 1. We're not loading safes data
    // 2. There was no error fetching safes
    // 3. The safes data has been fetched successfully (safesData is defined)
    // 4. The safes array is empty (not just the primarySafe being undefined)
    if (
      !isLoadingSafes &&
      !safesError &&
      safesData !== undefined &&
      safesData.length === 0
    ) {
      console.log('No safes found, redirecting to onboarding/create-safe');
      router.push('/onboarding/create-safe');
    }
  }, [isLoadingSafes, safesError, safesData, router]);

  if (isLoading || !savingsState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Savings
          </h1>
          <p className="text-muted-foreground">
            Grow your wealth with high-yield vaults on Base
          </p>
        </div>

        <div className="space-y-6">
          {/* Quick Actions - Simplified */}
          {savingsState.enabled && (
            // blue like border
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

          {/* Settings Panel - Only show if not enabled and not initialized */}
          {!savingsState.enabled && (
            <div className="w-full flex justify-center">
              {isLoadingEarnStatus ? (
                <LoadingSpinner />
              ) : !isEarnModuleInitialized ? (
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
                        {savingsState?.apy.toFixed(2) || '4.96'}% APY in the
                        Seamless vault
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Withdraw anytime with no penalties
                      </p>
                    </div>
                    <OpenSavingsAccountButton
                      safeAddress={safeAddress as Address}
                      onSuccess={() => {
                        // Refetch earn module status after successful setup
                        refetchEarnStatus();
                        // Small delay to ensure status is updated
                        setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                      }}
                    />
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

          {/* Vaults on Base - Always visible when earn module is initialized */}
          {isEarnModuleInitialized && (
            <div className="space-y-4">
              {/* Auto-savings info banner */}
              {!savingsState.enabled && (
                <Alert className="border-0 bg-muted/50 mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enable auto-savings to automatically save a portion of your
                    incoming deposits
                  </AlertDescription>
                </Alert>
              )}

              <div className="border-0 shadow-none bg-transparent p-0">
                <div className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg">Vaults</h3>
                      <p className="text-sm">
                        High-yield USDC vaults on Base
                      </p>
                    </div>
                    <Image
                      src={BaseLogo}
                      alt="Base"
                      width={48}
                    />
                  </div>
                </div>
                <div className="space-y-3 ">
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
                            if (
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
                              if (
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
                        <Link
                          href={v.appUrl}
                          target="_blank"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <span className="hidden sm:inline">Details</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Inline expansion for deposit/withdraw */}
                      {expandedAction?.vaultId === v.id && (
                        <div className="mt-4 pt-4 border-t">
                          {expandedAction.action === 'deposit' ? (
                            <div>
                              <DepositEarnCard
                                safeAddress={safeAddress as `0x${string}`}
                                vaultAddress={v.address as `0x${string}`}
                                onDepositSuccess={() => {
                                  setExpandedAction(null);
                                  setTimeout(() => {
                                    refetchStats();
                                    utils.earn.statsByVault.invalidate();
                                    utils.earn.userPositions.invalidate();
                                  }, 3000);
                                }}
                              />
                            </div>
                          ) : (
                            <div>
                              <WithdrawEarnCard
                                safeAddress={safeAddress as `0x${string}`}
                                vaultAddress={v.address as `0x${string}`}
                                onWithdrawSuccess={() => {
                                  setExpandedAction(null);
                                  setTimeout(() => {
                                    refetchStats();
                                    utils.earn.statsByVault.invalidate();
                                    utils.earn.userPositions.invalidate();
                                  }, 3000);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingDeposits || isLoadingWithdrawals ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : recentTransactions.length === 0 ? (
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
                                {tx.type === 'deposit'
                                  ? 'Auto-save'
                                  : 'Withdrawal'}
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
                                <p className="text-xs text-amber-600">
                                  Pending
                                </p>
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
