"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AllocationSlider from "./components/allocation-slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatUsd, projectYield, timeAgo } from "@/lib/utils"
import { XCircle, ArrowRight, Banknote, Check, UploadCloud, TrendingUp, Wallet } from "lucide-react"
import type { SavingsState, VaultTransaction } from "./lib/types"
import { useToast } from "@/components/ui/use-toast"
import { ALLOC_KEY, FIRST_RUN_KEY } from "./lib/local-storage-keys"
import { trpc } from "@/utils/trpc"

const APY_RATE = 8
const EXAMPLE_WEEKLY_DEPOSIT = 100

interface SavingsPanelProps {
  initialSavingsState: SavingsState
  onStateChange: (newState: SavingsState) => void
  mainBalance: number
  safeAddress: string
  isInitialSetup: boolean
}

export default function SavingsPanel({
  initialSavingsState,
  onStateChange,
  mainBalance,
  safeAddress,
  isInitialSetup,
}: SavingsPanelProps) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { toast } = useToast()
  const [localPercentage, setLocalPercentage] = useState(initialSavingsState.allocation)
  const [isDirty, setIsDirty] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch vault stats to calculate earnings
  const { data: vaultStats, refetch: refetchStats } = trpc.earn.stats.useQuery(
    { safeAddress },
    { enabled: !!safeAddress }
  )

  // Calculate total earnings
  const totalEarnings = vaultStats?.reduce((sum, stat) => {
    const yieldAmount = stat['yield'] > 0n ? stat['yield'] : 0n;
    return sum + Number(yieldAmount) / 1e6; // Convert from USDC smallest unit
  }, 0) || 0;

  // Calculate total vault balance
  const totalVaultBalance = vaultStats?.reduce((sum, stat) => {
    return sum + Number(stat.currentAssets) / 1e6; // Convert from USDC smallest unit
  }, 0) || 0;

  const handleSliderChange = (value: number) => {
    setLocalPercentage(value)
    setIsDirty(value !== initialSavingsState.allocation)
  }

  const handleSaveRule = async () => {
    if (localPercentage === initialSavingsState.allocation) return

    setIsUpdating(true)
    try {
      await onStateChange({
        ...initialSavingsState,
        allocation: localPercentage,
        enabled: localPercentage > 0,
      })
      setIsDirty(false)
    } catch (error) {
      console.error("Failed to save rule:", error)
      toast({
        title: "Error",
        description: "Failed to save your savings rule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDisableRule = async () => {
    setIsUpdating(true)
    try {
      await onStateChange({
        ...initialSavingsState,
        allocation: 0,
        enabled: false,
      })
      setLocalPercentage(0)
      setIsDirty(false)
    } catch (error) {
      console.error("Failed to disable rule:", error)
      toast({
        title: "Error",
        description: "Failed to disable your savings rule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleWithdraw = () => {
    router.push('/dashboard/tools/earn-module')
  }

  const projectedFirstYearEarnings = projectYield(0, EXAMPLE_WEEKLY_DEPOSIT * (localPercentage / 100), APY_RATE)
  const exampleDepositFlowAmount = 100
  const savedFromFlowAmount = (exampleDepositFlowAmount * localPercentage) / 100

  return (
    <div
      className={cn(
        isMobile ? "min-h-screen w-full" : "min-h-[600px] w-full max-w-[720px] bg-background rounded-xl shadow-xl p-8",
        "flex flex-col items-center justify-center",
      )}
    >
      <div className="w-full max-w-lg space-y-6 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-accent/10 rounded-full mb-4">
            <Banknote className="h-7 w-7 text-emerald-accent" />
          </div>
          <h1 className="text-3xl font-bold text-deep-navy mb-3 font-clash-display">
            {isInitialSetup ? "Set Up Auto-Earn" : "Manage Your Savings"}
          </h1>
          <p className="text-deep-navy/70 text-base">
            {isInitialSetup
              ? "Choose how much of your incoming funds should automatically earn yield."
              : "Adjust your savings rule or view your earnings."}
          </p>
        </div>
      </div>

      {/* Earnings Display */}
      {totalVaultBalance > 0 && (
        <div className="w-full max-w-lg grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-white rounded-lg shadow-premium-subtle border border-subtle-lines">
            <p className="text-sm text-deep-navy/60 mb-1">Total Saved</p>
            <p className="text-2xl font-semibold text-deep-navy">{formatUsd(totalVaultBalance)}</p>
          </div>
          <div className="p-4 bg-emerald-accent/5 rounded-lg shadow-premium-subtle border border-emerald-accent/20">
            <p className="text-sm text-deep-navy/60 mb-1">Total Earned</p>
            <p className="text-2xl font-semibold text-emerald-accent">+{formatUsd(totalEarnings)}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-card-lg shadow-premium-subtle mb-10">
        <div className="flex items-center justify-between text-center">
          <div className="flex-1">
            <p className="text-xs uppercase text-deep-navy/60 tracking-wider mb-1">Incoming Deposit</p>
            <p className="text-2xl font-semibold text-deep-navy">{formatUsd(exampleDepositFlowAmount)}</p>
          </div>
          <ArrowRight className="h-6 w-6 text-deep-navy/40 mx-4" />
          <div className="flex-1">
            <p className="text-xs uppercase text-emerald-accent tracking-wider mb-1">To Savings Vault</p>
            <p className="text-2xl font-semibold text-emerald-accent">{formatUsd(savedFromFlowAmount)}</p>
          </div>
        </div>
        <p className="text-xs text-center mt-4 text-deep-navy/50">Example based on your selected percentage below.</p>
      </div>

      <div className="w-full max-w-lg mb-10">
        <AllocationSlider
          percentage={localPercentage}
          onPercentageChange={handleSliderChange}
          accentColor="#10B981"
        />
      </div>

      <div className="w-full max-w-lg flex gap-4 mb-10">
        {initialSavingsState.enabled && !isDirty ? (
          <>
            <Button
              onClick={handleDisableRule}
              variant="outline"
              size="lg"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              disabled={isUpdating}
            >
              <XCircle className="mr-2 h-5 w-5" />
              Disable Rule
            </Button>
            {totalVaultBalance > 0 && (
              <Button
                onClick={handleWithdraw}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={isUpdating}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Withdraw
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={handleSaveRule}
            size="lg"
            className="flex-1 bg-emerald-accent hover:bg-emerald-accent/90 text-white"
            disabled={!isDirty || isUpdating || localPercentage === 0}
          >
            {isUpdating ? "Saving..." : isInitialSetup ? "Enable Auto-Earn" : "Save Changes"}
          </Button>
        )}
      </div>

      {localPercentage > 0 && (
        <div className="w-full max-w-lg p-6 rounded-card-lg bg-emerald-accent/5 border border-emerald-accent/20 mb-10 shadow-premium-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-deep-navy mb-1">Projected First Year Earnings</p>
              <p className="font-clash-display text-4xl font-semibold text-emerald-accent">
                {formatUsd(projectedFirstYearEarnings)}
              </p>
              <p className="text-xs text-deep-navy/60 mt-1">
                Based on {formatUsd(EXAMPLE_WEEKLY_DEPOSIT)}/week deposits at {APY_RATE}% APY.
              </p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-accent/10">
              <TrendingUp className="h-6 w-6 text-emerald-accent" />
            </div>
          </div>
        </div>
      )}

      {(initialSavingsState.enabled || localPercentage > 0) &&
        initialSavingsState.currentVaultBalance !== undefined &&
        initialSavingsState.currentVaultBalance > 0 && (
          <div className="w-full max-w-lg p-4 rounded-xl bg-deep-navy/5 mb-10 text-center">
            <p className="text-sm text-deep-navy/80">
              Current Vault Balance:{" "}
              <span className="font-semibold text-deep-navy">
                {formatUsd(initialSavingsState.currentVaultBalance || 0)}
              </span>
            </p>
            <p className="text-sm text-emerald-accent font-medium">Earning {initialSavingsState.apy.toFixed(2)}% APY</p>
          </div>
        )}

      <div className="w-full max-w-lg my-10 sm:my-12">
        <h3 className="text-lg font-medium text-deep-navy mb-4 text-center">Recent Deposit Skims (Preview)</h3>
        {initialSavingsState.recentTransactions &&
        initialSavingsState.recentTransactions.length > 0 &&
        localPercentage > 0 ? (
          <ul className="space-y-3">
            {initialSavingsState.recentTransactions.slice(0, 3).map((tx: VaultTransaction) => {
              // If skimmedAmount exists, this is a real transaction, not a preview
              const isRealTransaction = tx.skimmedAmount !== undefined
              const displaySkimmedAmount = isRealTransaction 
                ? tx.skimmedAmount 
                : tx.amount * (localPercentage / 100)
              const displayPercentage = isRealTransaction && tx.amount > 0
                ? Math.round((tx.skimmedAmount! / tx.amount) * 100)
                : localPercentage
                
              return (
                <li
                  key={tx.id}
                  className="text-sm p-4 bg-white border border-subtle-lines rounded-lg shadow-premium-subtle"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-deep-navy/80 font-medium">
                      {tx.source || (tx.type === "manual_deposit" ? "Manual Deposit" : "Deposit")} of{" "}
                      {formatUsd(tx.amount)}
                    </span>
                    <span className="text-xs text-deep-navy/50">{timeAgo(tx.timestamp)}</span>
                  </div>
                  {tx.type === "deposit" && displaySkimmedAmount !== undefined && displaySkimmedAmount > 0 && (
                    <div className="flex items-center text-xs text-emerald-accent">
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      {isRealTransaction ? "Auto-saved" : "Would auto-save"} {formatUsd(displaySkimmedAmount)} ({displayPercentage}%)
                    </div>
                  )}
                  {tx.type === "manual_deposit" && (
                    <div className="flex items-center text-xs text-deep-navy/70">
                      <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                      Manual top-up of {formatUsd(tx.amount)} (Not skimmed)
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-deep-navy/50 italic text-center py-4">
            {localPercentage > 0 ? "No recent deposits to preview skims from." : "Enable the rule to see previews."}
          </p>
        )}
      </div>
    </div>
  )
}
