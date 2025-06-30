"use client"

import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SavingsPanel from "@/components/savings/savings-panel"
import { useRealSavingsState } from "@/components/savings/hooks/use-real-savings-state"
import { useIsMobile } from "@/hooks/use-mobile"
import { Skeleton } from "@/components/ui/skeleton"
import { FIRST_RUN_KEY } from "@/components/savings/lib/local-storage-keys"
import { useToast } from "@/components/ui/use-toast"
import { trpc } from "@/utils/trpc"

export default function SavingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  // Get user's primary safe
  const { data: primarySafe, isLoading: safeLoading } = trpc.user.getPrimarySafeAddress.useQuery()
  const safeAddress = primarySafe?.primarySafeAddress

  const ruleUpdatedQueryParam = searchParams.get("ruleUpdated")
  
  // Get safe balance from on-chain
  const { data: balanceData } = trpc.safe.getBalance.useQuery(
    { 
      safeAddress: safeAddress!, 
      tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" // USDC on Base
    },
    { enabled: !!safeAddress }
  )
  
  // Calculate main balance in USD
  const mainBalance = balanceData ? Number(balanceData.balance) / 1e6 : 0 // USDC has 6 decimals

  const { savingsState, isLoading, updateSavingsState } = useRealSavingsState(
    safeAddress || null,
    mainBalance,
  )

  useEffect(() => {
    if (safeAddress && !isLoading && savingsState) {
      const wizardDone = localStorage.getItem(FIRST_RUN_KEY(safeAddress)) === "1"
      if (!wizardDone && !savingsState.enabled && savingsState.allocation === 0) {
        // This condition means it's truly a first run, and no rule has ever been set.
        // No redirection, SavingsPanel will handle the "initial setup" UI.
      }
    }
  }, [safeAddress, isLoading, savingsState, router, toast])

  if (isLoading || safeLoading || !savingsState || !safeAddress) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", isMobile ? "h-screen bg-background" : "")}>
        <div
          className={cn(
            isMobile ? "w-full h-full" : "w-full max-w-[720px] bg-background rounded-xl shadow-xl p-8",
            "flex flex-col items-center justify-center",
          )}
        >
          <Skeleton className="h-14 w-14 rounded-full mb-6 bg-gray-200" />
          <Skeleton className="h-8 w-3/4 mb-3 bg-gray-200" />
          <Skeleton className="h-5 w-1/2 mb-8 bg-gray-200" />
          <Skeleton className="h-40 w-full max-w-md mb-8 bg-gray-200" />
          <Skeleton className="h-24 w-full max-w-md mb-8 bg-gray-200" />
          <div className="flex gap-4 w-full max-w-sm">
            <Skeleton className="h-12 flex-1 bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  const isWizardDone = typeof window !== "undefined" ? localStorage.getItem(FIRST_RUN_KEY(safeAddress)) === "1" : false
  const isInitialSetup = !isWizardDone

  return (
    <SavingsPanel
      initialSavingsState={savingsState}
      onStateChange={async (newState) => {
        try {
          await updateSavingsState(newState)
          if (!newState.enabled && newState.allocation === 0) {
            router.push("/dashboard?ruleUpdated=disabled")
          } else {
            if (typeof window !== "undefined" && localStorage.getItem(FIRST_RUN_KEY(safeAddress)) !== "1") {
              localStorage.setItem(FIRST_RUN_KEY(safeAddress), "1")
            }
            router.push(`/dashboard?ruleUpdated=enabled`)
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update savings rule. Please try again.",
            variant: "destructive",
          })
        }
      }}
      mainBalance={mainBalance}
      safeAddress={safeAddress}
      isInitialSetup={isInitialSetup}
    />
  )
}
