"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ALLOC_KEY, FIRST_RUN_KEY } from "../lib/local-storage-keys"
import { trpc } from "@/utils/trpc"

const DRAFT_KEY_SUFFIX = "-draft"

export function useSavingsRule(safeAddress: string, initialPercentage = 0) {
  const [percentage, setPercentageState] = useState(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem(ALLOC_KEY(safeAddress) + DRAFT_KEY_SUFFIX)
      return draft ? Number.parseInt(draft, 10) : initialPercentage
    }
    return initialPercentage
  })
  const [isActivating, setIsActivating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Use real tRPC mutations
  const setAutoEarnPct = trpc.earn.setAutoEarnPct.useMutation()
  const disableAutoEarn = trpc.earn.disableAutoEarn.useMutation()

  const setPercentage = useCallback(
    (newPercentage: number) => {
      setPercentageState(newPercentage)
      localStorage.setItem(ALLOC_KEY(safeAddress) + DRAFT_KEY_SUFFIX, newPercentage.toString())
    },
    [safeAddress],
  )

  const activateRule = useCallback(async () => {
    setIsActivating(true)
    try {
      if (percentage === 0) {
        // Disable auto-earn
        await disableAutoEarn.mutateAsync({ safeAddress })
      } else {
        // Set new percentage
        await setAutoEarnPct.mutateAsync({ 
          safeAddress, 
          pct: percentage 
        })
      }
      
      // Write to the keys that useOptimisticSavingsState reads
      localStorage.setItem(ALLOC_KEY(safeAddress), percentage.toString())
      localStorage.setItem(FIRST_RUN_KEY(safeAddress), "1")
      localStorage.removeItem(ALLOC_KEY(safeAddress) + DRAFT_KEY_SUFFIX)

      return true
    } catch (error: any) {
      console.error(error)
      
      // Check if it's the earn module initialization error
      if (error.message?.includes("Earn module is not yet initialized on-chain")) {
        toast({
          variant: "destructive",
          title: "Earn Module Not Set Up",
          description: "Please enable the Auto-Earn module first in the dashboard settings.",
        })
        // Redirect to earn module setup page
        router.push("/dashboard/tools/earn-module")
      } else {
        toast({
          variant: "destructive",
          title: "Activation Failed",
          description: error.message || "Could not save your rule. Please try again.",
        })
      }
      return false
    } finally {
      setIsActivating(false)
    }
  }, [percentage, safeAddress, router, toast, setAutoEarnPct, disableAutoEarn])

  return {
    percentage,
    setPercentage,
    activateRule,
    isActivating,
  }
}
