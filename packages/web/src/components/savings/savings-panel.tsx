"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AllocationSlider from "./components/allocation-slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatUsd, projectYield, timeAgo } from "@/lib/utils"
import { XCircle, ArrowRight, Banknote, Check, UploadCloud, TrendingUp } from "lucide-react"
import type { SavingsState, VaultTransaction } from "./lib/types"
import { useToast } from "@/components/ui/use-toast"
import { ALLOC_KEY, FIRST_RUN_KEY } from "./lib/local-storage-keys"

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
  const router = useRouter()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const [localPercentage, setLocalPercentage] = useState(() => {
    if (isInitialSetup && initialSavingsState.allocation === 0) {
      return 20 // Smart default: 20%
    }
    return initialSavingsState.allocation
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isInitialSetup || initialSavingsState.allocation !== 0) {
      setLocalPercentage(initialSavingsState.allocation)
    }
  }, [initialSavingsState.allocation, isInitialSetup])

  const exampleDepositFlowAmount = 100
  const savedFromFlowAmount = exampleDepositFlowAmount * (localPercentage / 100)
  const weeklySavedAmount = EXAMPLE_WEEKLY_DEPOSIT * (localPercentage / 100)
  const yearlySavedAmount = weeklySavedAmount * 52
  const projectedFirstYearEarnings = projectYield(yearlySavedAmount, 100, APY_RATE)

  const presetPercentages = [10, 20, 30, 50] // Keep or revise based on new design

  const confirmAndApplyRuleChange = async (percentageToApply: number) => {
    if (percentageToApply === 0 && isInitialSetup && !initialSavingsState.enabled) {
      toast({
        title: "Set a Percentage",
        description: "Please select a percentage greater than 0 to activate savings.",
        variant: "default",
        duration: 3000,
      })
      return
    }
    setIsSaving(true)
    setLocalPercentage(percentageToApply)
    await new Promise((resolve) => setTimeout(resolve, 750))

    const newState: SavingsState = {
      ...initialSavingsState,
      enabled: percentageToApply > 0,
      allocation: percentageToApply,
      firstEnabledAt: initialSavingsState.firstEnabledAt || (percentageToApply > 0 ? Date.now() : null),
    }
    localStorage.setItem(ALLOC_KEY(safeAddress), percentageToApply.toString())
    if (percentageToApply > 0 && localStorage.getItem(FIRST_RUN_KEY(safeAddress)) !== "1") {
      localStorage.setItem(FIRST_RUN_KEY(safeAddress), "1")
    }
    onStateChange(newState)
    setIsSaving(false)
    toast({
      title: percentageToApply > 0 ? "Savings Rule Activated" : "Savings Rule Disabled",
      description:
        percentageToApply > 0
          ? `Your auto-savings rule is now set to ${percentageToApply}%.`
          : "Automatic deposit skimming has been turned off.",
      duration: 4000,
    })
    router.push(percentageToApply > 0 ? "/dashboard?ruleUpdated=enabled" : "/dashboard?ruleUpdated=disabled")
  }

  const handleMainActionClick = () => {
    if (!isInitialSetup && localPercentage === initialSavingsState.allocation) {
      toast({ title: "No Changes", description: "The savings rule percentage hasn't changed.", duration: 3000 })
      return
    }
    confirmAndApplyRuleChange(localPercentage)
  }

  const handleDisableRuleClick = () => {
    if (initialSavingsState.allocation === 0 && !initialSavingsState.enabled) {
      toast({ title: "Already Disabled", description: "The savings rule is already off.", duration: 3000 })
      return
    }
    confirmAndApplyRuleChange(0)
  }

  const isRuleChanged = localPercentage !== initialSavingsState.allocation
  const mainButtonDisabled = isSaving || (isInitialSetup ? localPercentage === 0 : !isRuleChanged)

  return (
    <div
      className={cn(
        "flex flex-col items-center bg-light-bg text-deep-navy font-inter",
        isMobile ? "min-h-screen p-4 pt-8" : "w-full max-w-2xl mx-auto rounded-card-lg shadow-premium-medium my-12 p-8",
      )}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-accent/10 mb-6">
        <Banknote className="h-8 w-8 text-emerald-accent" />
      </div>

      <h1 className="font-clash-display text-3xl sm:text-4xl font-semibold text-center mb-3">
        Grow your wealth on autopilot
      </h1>
      <p className="text-base text-deep-navy/70 text-center mb-10 max-w-md leading-relaxed">
        Every deposit splits automatically into high-yield savings. You choose how much.
      </p>

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
        <p className="text-lg font-medium mb-3 text-center text-deep-navy">Set Your Savings Percentage:</p>
        <AllocationSlider
          percentage={localPercentage}
          onPercentageChange={setLocalPercentage}
          accentColor="#10B981" // Emerald
        />
        <div className="flex w-full justify-center space-x-2 sm:space-x-3 mt-6">
          {presetPercentages.map((pct) => (
            <Button
              key={pct}
              variant="outline"
              onClick={() => setLocalPercentage(pct)}
              className={cn(
                "rounded-pill px-4 py-2 text-sm h-10 shadow-sm font-medium transition-all",
                "border-subtle-lines hover:border-emerald-accent/50",
                localPercentage === pct
                  ? "bg-emerald-accent/10 border-emerald-accent text-emerald-accent ring-2 ring-emerald-accent/50"
                  : "bg-white text-deep-navy/70 hover:text-deep-navy",
              )}
            >
              {pct}%
            </Button>
          ))}
        </div>
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

      <div className="w-full max-w-lg mt-auto pt-6 grid grid-cols-1 gap-4">
        <Button
          onClick={handleMainActionClick}
          disabled={mainButtonDisabled}
          size="lg"
          className="w-full h-14 text-base font-semibold rounded-button bg-emerald-accent text-white hover:bg-emerald-accent-hover shadow-premium-cta transition-all duration-150 active:scale-[0.98]"
        >
          {isSaving
            ? "Saving..."
            : isInitialSetup
              ? "Activate Savings Rule"
              : localPercentage === 0 && initialSavingsState.allocation > 0
                ? "Confirm Disable Rule"
                : "Update Savings Rule"}
        </Button>
        {!isInitialSetup && initialSavingsState.enabled && initialSavingsState.allocation > 0 && (
          <Button
            variant="ghost"
            disabled={isSaving}
            onClick={handleDisableRuleClick}
            className="w-full h-12 rounded-button text-deep-navy/60 hover:bg-deep-navy/5 hover:text-deep-navy font-medium"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Disable Auto Savings
          </Button>
        )}
      </div>

      {/* Recent Deposit Skims - Keeping structure, applying new styles */}
      <div className="w-full max-w-lg my-10 sm:my-12">
        <h3 className="text-lg font-medium text-deep-navy mb-4 text-center">Recent Deposit Skims (Preview)</h3>
        {initialSavingsState.recentTransactions &&
        initialSavingsState.recentTransactions.length > 0 &&
        localPercentage > 0 ? (
          <ul className="space-y-3">
            {initialSavingsState.recentTransactions.slice(0, 3).map((tx: VaultTransaction) => {
              const previewSkimmedAmount =
                tx.type === "deposit" ? tx.amount * (localPercentage / 100) : tx.skimmedAmount
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
                  {tx.type === "deposit" && previewSkimmedAmount !== undefined && previewSkimmedAmount > 0 && (
                    <div className="flex items-center text-xs text-emerald-accent">
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Would auto-save {formatUsd(previewSkimmedAmount)} ({localPercentage}%)
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
