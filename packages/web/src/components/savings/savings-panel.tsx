"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AllocationSlider from "./components/allocation-slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatUsd, projectYield, timeAgo } from "@/lib/utils"
import { XCircle, ArrowRight, Banknote, Check, UploadCloud, TrendingUp, Wallet, Settings } from "lucide-react"
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
      toast({
        title: "Success",
        description: localPercentage > 0 
          ? `Auto-earn updated to ${localPercentage}%` 
          : "Auto-earn disabled",
      })
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
      toast({
        title: "Success",
        description: "Auto-earn has been disabled",
      })
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

  const projectedFirstYearEarnings = projectYield(0, EXAMPLE_WEEKLY_DEPOSIT * (localPercentage / 100), APY_RATE)
  const exampleDepositFlowAmount = 100
  const savedFromFlowAmount = (exampleDepositFlowAmount * localPercentage) / 100

  return (
    // add a card around the content
    <div className="w-full max-w-lg space-y-6">
      <div className="bg-white p-6 rounded-card-lg shadow-premium-subtle">
        <div className="w-full max-w-lg space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-accent/10 rounded-full mb-4">
          <Banknote className="h-7 w-7 text-emerald-accent" />
        </div>
        <h2 className="text-2xl font-bold text-deep-navy mb-3">
          {isInitialSetup ? "Set Up Auto-Earn" : "Savings Settings"}
        </h2>
        <p className="text-deep-navy/70 text-base">
          {isInitialSetup
            ? "Choose how much of your incoming funds should automatically earn yield."
            : "Adjust how much of your incoming funds are automatically saved."}
        </p>
      </div>

      {/* Example Flow */}
      <div className="bg-white p-6 rounded-card-lg shadow-premium-subtle">
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

      {/* Allocation Slider */}
      <div>
        <AllocationSlider
          percentage={localPercentage}
          onPercentageChange={handleSliderChange}
          accentColor="#10B981"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {initialSavingsState.enabled && !isDirty ? (
          <Button
            onClick={handleDisableRule}
            variant="outline"
            size="lg"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            disabled={isUpdating}
          >
            <XCircle className="mr-2 h-5 w-5" />
            Disable Auto-Earn
          </Button>
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

      {/* Projected Earnings */}
      {localPercentage > 0 && (
        <div className="p-6 rounded-card-lg bg-emerald-accent/5 border border-emerald-accent/20 shadow-premium-subtle">
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
      </div>
      </div>
    </div>
  )
}
