'use client';

import React, { useState } from 'react';
import { AllocationManagement } from '../(bank)/components/allocation-management';
import { SwapCard } from '../(bank)/components/dashboard/swap-card';
import { useUserSafes } from '@/hooks/use-user-safes';
import { type Address } from 'viem';
import { Loader2, TrendingUp, SlidersHorizontal, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock Component - Replace with actual implementation later
function AllocationOverview() {
  // Mock data - replace with actual data fetching
  const currentAllocation = {
    tax: 30, // percentage
    yield: 70, // percentage
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Current Allocation Rules
        </CardTitle>
        <CardDescription>
          This is how incoming funds are currently being split between your Tax and Yield safes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Tax Safe:</span>
          <span className="text-primary font-semibold">{currentAllocation.tax}%</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Yield Safe:</span>
          <span className="text-primary font-semibold">{currentAllocation.yield}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock Component - Replace with actual implementation later
function SuggestAllocationForm() {
  const [taxPercent, setTaxPercent] = useState(30);
  const [yieldPercent, setYieldPercent] = useState(70);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTaxSliderChange = (value: number[]) => {
    const newTax = value[0];
    setTaxPercent(newTax);
    setYieldPercent(100 - newTax);
  };

  // Mock submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting allocation suggestion:', { tax: taxPercent, yield: yieldPercent });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Allocation suggestion submitted!', {
        description: `Tax: ${taxPercent}%, Yield: ${yieldPercent}%`,
    });
    setIsSubmitting(false);
    // TODO: Integrate with backend API - see memory file
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Suggest Allocation Change
        </CardTitle>
        <CardDescription>
            Propose new percentages for how future incoming funds should be allocated between Tax and Yield safes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="tax-slider" className="flex justify-between">
                    <span>Tax Safe Allocation</span>
                    <span className="text-lg font-semibold text-primary">{taxPercent}%</span>
                </Label>
                <Slider
                    id="tax-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={[taxPercent]}
                    onValueChange={handleTaxSliderChange}
                    disabled={isSubmitting}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-blue-200 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="yield-percent" className="flex justify-between">
                     <span>Yield Safe Allocation</span>
                     <span className="text-lg font-semibold text-primary">{yieldPercent}%</span>
                 </Label>
                 {/* Display Yield as calculated, maybe read-only input or just text */}
                 <Input id="yield-percent" type="number" value={yieldPercent} readOnly className="bg-muted text-muted-foreground" />
            </div>

            <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Suggestion Only</AlertTitle>
                <AlertDescription>
                    This form submits a suggestion. The final allocation rules may be adjusted based on automated strategies or further review.
                </AlertDescription>
            </Alert>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Suggestion
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AllocationsPage() {
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  const primarySafeAddress = userSafesData?.find(
    (s) => s.safeType === 'primary',
  )?.safeAddress as Address | undefined;

  if (isLoadingSafes) {
    return (
      <div className="flex justify-center items-center h-full py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Allocations & Swaps</h1>

        {/* Allocation Overview */}
        <AllocationOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggest Allocation Form */}
            <SuggestAllocationForm />

            {/* Swap Section - Removed outer Card */}
            <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6"> {/* Added styling to replace Card */}
                <div className="flex flex-col space-y-1.5"> {/* Replaced CardHeader */}
                    <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2"> {/* Replaced CardTitle */}
                      Swap ETH to USDC
                       <TooltipProvider>
                           <Tooltip>
                               <TooltipTrigger asChild>
                                   <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                               </TooltipTrigger>
                               <TooltipContent>
                                   <p>Exchange ETH from your Privy embedded wallet <br/> for USDC, deposited into your Primary Safe.</p>
                               </TooltipContent>
                           </Tooltip>
                       </TooltipProvider>
                    </h3>
                    <p className="text-sm text-muted-foreground"> {/* Replaced CardDescription */}
                       Requires ETH in your connected Privy wallet.
                    </p>
                </div>
                <div> {/* Replaced CardContent */}
                    {primarySafeAddress ? (
                        <SwapCard primarySafeAddress={primarySafeAddress} />
                    ) : (
                        <Alert variant="default">
                        <AlertTitle>Primary Safe Needed</AlertTitle>
                        <AlertDescription>
                            Please complete onboarding and set up your primary Safe to use the swap feature.
                        </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>

      {/* Existing Manual Allocation Management - Removed outer Card */}
      <div className="space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6"> {/* Added styling to replace Card */}
        <div className="flex flex-col space-y-1.5"> {/* Replaced CardHeader */}
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2"> {/* Replaced CardTitle */}
            Manual Allocation Execution
            <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                     <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                 </TooltipTrigger>
                 <TooltipContent>
                     <p>Directly set the current allocation percentages for funds already <br/> present in your safes. This does NOT change future allocation rules.</p>
                 </TooltipContent>
               </Tooltip>
           </TooltipProvider>
          </h3>
          <p className="text-sm text-muted-foreground"> {/* Replaced CardDescription */}
            Manually distribute funds currently held across your safes. (Functionality verification pending - See Issue #50)
          </p>
        </div>
        <div> {/* Replaced CardContent */}
          <AllocationManagement />
        </div>
      </div>

    </div>
  );
} 