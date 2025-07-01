"use client"

import { useRealSavingsState } from "@/components/savings/hooks/use-real-savings-state"
import { useUserSafes } from "@/hooks/use-user-safes"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Wallet, Settings, ArrowRight, Info, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import SavingsPanel from "@/components/savings/savings-panel"
import { WithdrawEarnCard } from "@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card"
import { formatUsd, formatUsdWithPrecision } from "@/lib/utils"
import { trpc } from "@/utils/trpc"
import type { VaultTransaction } from "@/components/savings/lib/types"

export default function SavingsPage() {
  const router = useRouter()
  const { data: safesData, isLoading: isLoadingSafes } = useUserSafes()
  const primarySafe = safesData?.[0]
  const safeAddress = primarySafe?.safeAddress || null
  const [activeTab, setActiveTab] = useState("overview")

  const {
    savingsState,
    isLoading: isLoadingState,
    updateSavingsState,
  } = useRealSavingsState(safeAddress, 0)

  // Fetch vault stats with polling for live updates
  const { data: vaultStats, isLoading: isLoadingStats, refetch: refetchStats } = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    { 
      enabled: !!safeAddress,
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

  // Calculate totals
  const totalSaved = vaultStats?.reduce((sum, stat) => {
    return sum + Number(stat.currentAssets) / 1e6;
  }, 0) || 0;

  const totalEarned = vaultStats?.reduce((sum, stat) => {
    const yieldAmount = stat['yield'] > 0n ? stat['yield'] : 0n;
    return sum + Number(yieldAmount) / 1e6;
  }, 0) || 0;

  // Debug logging
  useEffect(() => {
    if (vaultStats) {
      console.log('Vault stats:', vaultStats);
      console.log('Total saved:', totalSaved);
      console.log('Total earned:', totalEarned);
      if (vaultStats.length > 0) {
        console.log('First vault address:', vaultStats[0].vaultAddress);
      }
    }
  }, [vaultStats, totalSaved, totalEarned]);

  // Check if there are any deposits (even if vault stats show 0)
  const hasDeposits = recentTransactions.length > 0 || totalSaved > 0;

  const isLoading = isLoadingSafes || isLoadingState || isLoadingStats || isLoadingDeposits || isLoadingWithdrawals

  useEffect(() => {
    if (!isLoadingSafes && !primarySafe) {
      router.push("/onboarding/create-safe")
    }
  }, [isLoadingSafes, primarySafe, router])

  // Refetch data when tab changes or after withdrawal
  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'withdraw') {
      refetchStats()
    }
  }, [activeTab, refetchStats])

  if (isLoading || !savingsState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
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
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">Total Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-900">{formatUsd(totalSaved)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">+{formatUsdWithPrecision(totalEarned)}</p>
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            {savingsState.enabled && hasDeposits && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your savings with one click</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Adjust Settings
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setActiveTab("withdraw")}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Withdraw Funds
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
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
                            {tx.type === 'deposit' ? '+' : '-'}{formatUsdWithPrecision(tx.amount)}
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
          </TabsContent>

          <TabsContent value="settings">
            <div className="flex justify-center">
              <SavingsPanel
                initialSavingsState={savingsState}
                onStateChange={updateSavingsState}
                mainBalance={0}
                safeAddress={safeAddress!}
                isInitialSetup={!savingsState.enabled}
              />
            </div>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            {hasDeposits ? (
              <>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Withdrawal Information</AlertTitle>
                  <AlertDescription>
                    You can withdraw your funds at any time. The transaction will be processed through your Safe wallet.
                    {totalSaved === 0 && " Note: Your vault balance might still be updating."}
                  </AlertDescription>
                </Alert>
                <div className="max-w-2xl mx-auto">
                  {vaultStats && vaultStats.length > 0 ? (
                    <WithdrawEarnCard 
                      safeAddress={safeAddress as `0x${string}`} 
                      vaultAddress={vaultStats[0].vaultAddress as `0x${string}`}
                      onWithdrawSuccess={() => {
                        // Refetch data after successful withdrawal
                        setTimeout(() => {
                          refetchStats()
                        }, 3000)
                      }}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Loading Vault Information</h3>
                        <p className="text-muted-foreground">
                          Please wait while we fetch your vault details...
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Funds to Withdraw</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to save some funds before you can withdraw.
                  </p>
                  <Button onClick={() => setActiveTab("settings")}>
                    Configure Auto-Earn
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
