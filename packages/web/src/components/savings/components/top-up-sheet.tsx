"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { DollarSign, UploadCloud } from "lucide-react"
import { formatUsd } from "@/lib/utils"

interface TopUpSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  safeAddress: string
  onTopUpSuccess: (amount: number) => void
  currentApy: number
}

const useMockDepositMutation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const mutateAsync = async (params: { tokenAddress: string; amount: string; safeAddress: string }) => {
    setIsLoading(true)
    console.log("Mock API: Depositing...", params)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    return { txHash: `0x${Math.random().toString(16).slice(2, 12)}...${Math.random().toString(16).slice(2, 12)}` }
  }
  return { mutateAsync, isLoading: isLoading }
}

export default function TopUpSheet({ open, onOpenChange, safeAddress, onTopUpSuccess, currentApy }: TopUpSheetProps) {
  const isMobile = useIsMobile()
  const [amountInput, setAmountInput] = useState("")
  const [error, setError] = useState("")
  const { mutateAsync: depositMutation, isLoading: isDepositing } = useMockDepositMutation()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountInput(value)
      setError("")
    }
  }

  const handleTopUp = async () => {
    const amount = Number.parseFloat(amountInput)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.")
      return
    }
    setError("")

    try {
      const { txHash } = await depositMutation({
        tokenAddress: "USDC_BASE_ADDRESS",
        amount: (amount * 10 ** 6).toString(),
        safeAddress,
      })
      console.log(`Deposit tx submitted: ${txHash}`)
      onTopUpSuccess(amount)
      onOpenChange(false)
      setAmountInput("")
    } catch (e) {
      console.error("Deposit failed", e)
      setError("Deposit failed. Please try again.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="p-0 flex flex-col">
        <SheetHeader className="p-4 sm:p-6 text-center border-b">
          <div className="flex justify-center mb-2">
            <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 text-gray-800" />
          </div>
          <SheetTitle className="text-xl sm:text-2xl">Add Extra to Savings</SheetTitle>
          <SheetDescription className="text-xs sm:text-sm">
            One-off deposit, stays on top of your nightly sweeps. Funds will earn {currentApy.toFixed(2)}% APY.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="top-up-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="top-up-amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amountInput}
                onChange={handleAmountChange}
                className="pl-10 h-12 text-lg"
                disabled={isDepositing}
              />
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>
          <p className="text-xs text-gray-500">This amount will be deposited directly into your savings vault.</p>
        </div>
        <SheetFooter className="p-4 sm:p-6 border-t mt-auto">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent" disabled={isDepositing}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleTopUp}
            disabled={isDepositing || !amountInput || Number.parseFloat(amountInput) <= 0}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isDepositing ? "Depositing..." : `Deposit ${amountInput ? formatUsd(Number.parseFloat(amountInput)) : ""}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
