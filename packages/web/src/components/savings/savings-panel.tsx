"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AllocationSlider from "./components/allocation-slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatUsd, projectYield, timeAgo } from "@/lib/utils"
import { XCircle, ArrowRight, Banknote, Check, UploadCloud, TrendingUp, Wallet, Settings, Info } from "lucide-react"
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

  const exampleDepositFlowAmount = 100
  const savedFromFlowAmount = (exampleDepositFlowAmount * localPercentage) / 100

  return (
    // add a card around the content
    <div className="w-full space-y-6">
      {/*     display: flex
;
    justify-content: center; */}
      <div className="bg-white p-6 rounded-card-lg shadow-premium-subtle flex justify-center">
        <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
          <Banknote className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-deep-navy mb-3">
          {isInitialSetup ? "Set Up Auto-Earn" : "Savings Settings"}
        </h2>
        <p className="text-deep-navy/70 text-base">
          Each incoming payment will automatically save your chosen percentage
        </p>
      </div>

      {/* Large Percentage Display */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-card-lg text-center">
        <div className="text-6xl font-bold text-primary mb-2">
          {localPercentage}%
        </div>
        <p className="text-primary/80 font-medium">
          of every deposit saved automatically
        </p>
      </div>

      {/* Allocation Slider */}
      <div>
        <AllocationSlider
          percentage={localPercentage}
          onPercentageChange={handleSliderChange}
          accentColor="#0050ff"
        />
      </div>

      {/* How it works info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="text-blue-900 font-medium">
              Automatic allocation on every deposit
            </p>
            <p className="text-blue-700">
              When you receive any payment, {localPercentage > 0 ? `${localPercentage}%` : 'your chosen percentage'} will be instantly moved to your high-yield savings vault earning {APY_RATE}% APY.
            </p>
          </div>
        </div>
      </div>

      {/* Small Example */}
      <div className="text-center text-sm text-deep-navy/60">
        <p>Example: ${exampleDepositFlowAmount} deposit → <span className="font-semibold text-primary">${savedFromFlowAmount} saved</span></p>
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
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
            disabled={!isDirty || isUpdating || localPercentage === 0}
          >
            {isUpdating ? "Saving..." : isInitialSetup ? "Enable Auto-Earn" : "Save Changes"}
          </Button>
        )}
      </div>
      </div>
      </div>
    </div>
  )
}
