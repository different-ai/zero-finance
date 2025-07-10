"use client"

import { useRealSavingsState } from "@/components/savings/hooks/use-real-savings-state"
import { useUserSafes } from "@/hooks/use-user-safes"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TrendingUp, Wallet, Settings, ArrowRight, Info, ArrowDownLeft, ArrowUpRight, ArrowDownToLine, AlertTriangle } from "lucide-react"
import SavingsPanel from "@/components/savings/savings-panel"
import { WithdrawEarnCard } from "@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card"
import { DepositEarnCard } from "@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card"
import { formatUsd, formatUsdWithPrecision } from "@/lib/utils"
import { trpc } from "@/utils/trpc"
import type { VaultTransaction } from "@/components/savings/lib/types"
import Link from "next/link"
import { AUTO_EARN_MODULE_ADDRESS } from '@/lib/earn-module-constants'
import { OpenSavingsAccountButton } from '@/components/savings/components/open-savings-account-button'
import { Address } from "viem"

export default function SavingsPage() {
  const router = useRouter()
  const { data: safesData, isLoading: isLoadingSafes, isError: safesError } = useUserSafes()
  const primarySafe = safesData?.[0]
  const safeAddress = primarySafe?.safeAddress || null
  const [showSettings, setShowSettings] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const {
    savingsState,
    isLoading: isLoadingState,
    updateSavingsState,
  } = useRealSavingsState(safeAddress, 0)

  // Check earn module initialization status
  const { 
    data: earnModuleStatus,
    isLoading: isLoadingEarnStatus,
    refetch: refetchEarnStatus
  } = trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress }
  )

  const isEarnModuleInitialized = earnModuleStatus?.isInitializedOnChain || false

  // Fetch vault stats with polling for live updates
  const { data: vaultStats, isLoading: isLoadingStats, refetch: refetchStats } = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    { 
      enabled: !!safeAddress,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchIntervalInBackground: true,
    }
  )

  // Fetch live vault balance
  const vaultAddress = vaultStats?.[0]?.vaultAddress;
  const { data: liveVaultData } = trpc.earn.getVaultInfo.useQuery(
    { 
      safeAddress: safeAddress!,
      vaultAddress: vaultAddress!
    },
    { 
      enabled: !!safeAddress && !!vaultAddress,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchIntervalInBackground: true,
    }
  )

  // Fetch recent deposits
  const { data: recentDeposits, isLoading: isLoadingDeposits } = trpc.earn.getRecentEarnDeposits.useQuery(
    { safeAddress: safeAddress!, limit: 10 },
    { 
      enabled: !!safeAddress,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchOnWindowFocus: true,
    }
  )

  // Fetch recent withdrawals
  const { data: recentWithdrawals, isLoading: isLoadingWithdrawals } = trpc.earn.getRecentEarnWithdrawals.useQuery(
    { safeAddress: safeAddress!, limit: 10 },
    { 
      enabled: !!safeAddress,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchOnWindowFocus: true,
    }
  )

  // Combine and sort transactions by timestamp
  const recentTransactions = useMemo(() => {
    const deposits = recentDeposits || [];
    const withdrawals = recentWithdrawals || [];
    
    // Combine both arrays
    const allTransactions = [
      ...deposits.map(d => ({ ...d, type: 'deposit' as const })),
      ...withdrawals.map(w => ({ ...w, type: 'withdrawal' as const }))
    ];
    
    // Sort by timestamp descending (most recent first)
    return allTransactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [recentDeposits, recentWithdrawals]);

  // Calculate totals - use live vault data for current balance
  const totalSaved = liveVaultData ? Number(liveVaultData.assets) / 1e6 : 0;

  const totalEarned = vaultStats?.reduce((sum, stat) => {
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

  // Check if there are any deposits (even if vault stats show 0)
  const hasDeposits = recentTransactions.length > 0 || totalSaved > 0;

  const isLoading = isLoadingSafes || isLoadingState || isLoadingStats || isLoadingDeposits || isLoadingWithdrawals

  // Improved redirect logic - only redirect when we're certain there are no safes
  useEffect(() => {
    // Only redirect if:
    // 1. We're not loading safes data
    // 2. There was no error fetching safes
    // 3. The safes data has been fetched successfully (safesData is defined)
    // 4. The safes array is empty (not just the primarySafe being undefined)
    if (!isLoadingSafes && !safesError && safesData !== undefined && safesData.length === 0) {
      console.log('No safes found, redirecting to onboarding/create-safe');
      router.push("/onboarding/create-safe");
    }
  }, [isLoadingSafes, safesError, safesData, router]);

  if (isLoading || !savingsState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Your Savings</h1>
          <p className="text-muted-foreground text-lg">
            Grow your wealth automatically with high-yield savings
          </p>
        </div>

        {/* Stats Cards - Show when auto-earn is enabled OR there are deposits */}
        {(hasDeposits || savingsState.enabled) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Vault Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">{formatUsd(totalSaved)}</p>
                {liveVaultData && (
                  <p className="text-xs text-blue-600 mt-1">Live balance</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">
                  +{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 6,
                    maximumFractionDigits: 7,
                  }).format(totalEarned)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Current APY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-900">{savingsState.apy.toFixed(2)}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-6">
          {/* Quick Actions */}
          {savingsState.enabled && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your savings with one click</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button 
                    variant={showDeposit ? "default" : "outline"}
                    onClick={() => {
                      setShowDeposit(!showDeposit)
                      setShowWithdraw(false)
                      setShowSettings(false)
                    }}
                    className={`w-full ${showDeposit ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Deposit Funds
                  </Button>
                  <Button 
                    variant={showWithdraw ? "default" : "outline"}
                    className={`w-full ${showWithdraw ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => {
                      setShowWithdraw(!showWithdraw)
                      setShowDeposit(false)
                      setShowSettings(false)
                    }}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Withdraw Funds
                  </Button>
                  <Button 
                    variant={showSettings ? "default" : "outline"}
                    onClick={() => {
                      setShowSettings(!showSettings)
                      setShowDeposit(false)
                      setShowWithdraw(false)
                    }}
                    className={`w-full ${showSettings ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Panel */}
          {(showSettings || !savingsState.enabled) && (
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
                        Your savings will earn {savingsState?.apy.toFixed(2) || '4.96'}% APY in the Seamless vault
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
                <SavingsPanel
                  initialSavingsState={savingsState}
                  onStateChange={updateSavingsState}
                  mainBalance={0}
                  safeAddress={safeAddress!}
                  isInitialSetup={!savingsState.enabled}
                />
              )}
            </div>
          )}

          {/* Deposit Card */}
          {showDeposit && vaultStats && vaultStats.length > 0 && (
            <div className="w-full max-w-2xl mx-auto">
              <DepositEarnCard 
                safeAddress={safeAddress as `0x${string}`} 
                vaultAddress={vaultStats[0].vaultAddress as `0x${string}`}
                onDepositSuccess={() => {
                  setTimeout(() => {
                    refetchStats()
                  }, 3000)
                }}
              />
            </div>
          )}

          {/* Withdraw Card */}
          {showWithdraw && vaultStats && vaultStats.length > 0 && (
            <div className="w-full max-w-2xl mx-auto">
              <WithdrawEarnCard 
                safeAddress={safeAddress as `0x${string}`} 
                vaultAddress={vaultStats[0].vaultAddress as `0x${string}`}
                onWithdrawSuccess={() => {
                  setTimeout(() => {
                    refetchStats()
                  }, 3000)
                }}
              />
            </div>
          )}

          {/* Info Card */}
          {!showSettings && !showDeposit && !showWithdraw && (
            <>
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    How Auto-Earn Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                      <ArrowRight className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Automatic Deposits</p>
                      <p className="text-sm text-muted-foreground">
                        {savingsState.enabled 
                          ? `${savingsState.allocation}% of incoming funds are automatically saved`
                          : "Enable auto-earn to start saving automatically"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                      <ArrowRight className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">High-Yield Vault</p>
                      <p className="text-sm text-muted-foreground">
                        Your funds earn {savingsState.apy.toFixed(2)}% APY in the Seamless lending protocol
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                      <ArrowRight className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Instant Access</p>
                      <p className="text-sm text-muted-foreground">
                        Withdraw your funds anytime with no penalties or lock-up periods
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
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
                        <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              tx.type === 'deposit' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
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
                            <p className={`text-sm font-medium ${
                              tx.type === 'deposit' ? 'text-green-700' : 'text-orange-700'
                            }`}>
                              {tx.type === 'deposit' ? '+' : '-'}{formatUsdWithPrecision(tx.type === 'deposit' && tx.skimmedAmount ? tx.skimmedAmount : tx.amount)}
                            </p>
                            {tx.type === 'deposit' && tx.skimmedAmount && (
                              <p className="text-xs text-muted-foreground">
                                From {formatUsd(tx.amount)} deposit
                              </p>
                            )}
                            {tx.type === 'withdrawal' && tx.status === 'pending' && (
                              <p className="text-xs text-amber-600">Pending</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
