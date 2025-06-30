"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ALLOC_KEY, FIRST_RUN_KEY } from "../lib/local-storage-keys"

const DRAFT_KEY_SUFFIX = "-draft"

// Mock API call
const mockActivateRuleAPI = async (percentage: number) => {
  console.log(`POST /api/rules/savings { pct: ${percentage} }`)
  await new Promise((resolve) => setTimeout(resolve, 750))
  if (Math.random() > 0.95) {
    throw new Error("Failed to activate savings rule.")
  }
  return { success: true, activated_at: new Date().toISOString() }
}

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
      await mockActivateRuleAPI(percentage)
      // Write to the keys that useOptimisticSavingsState reads
      localStorage.setItem(ALLOC_KEY(safeAddress), percentage.toString())
      localStorage.setItem(FIRST_RUN_KEY(safeAddress), "1")
      localStorage.removeItem(ALLOC_KEY(safeAddress) + DRAFT_KEY_SUFFIX)

      return true
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Activation Failed",
        description: "Could not save your rule. Please try again.",
      })
      return false
    } finally {
      setIsActivating(false)
    }
  }, [percentage, safeAddress, router, toast])

  return {
    percentage,
    setPercentage,
    activateRule,
    isActivating,
  }
}
