'use client';

import React from 'react';
// import { AllocationManagement } from '../(bank)/components/allocation-management'; // Removed import
import { SwapCard } from '../(bank)/components/dashboard/swap-card';
import { AllocationSummaryCard } from '../(bank)/components/dashboard/allocation-summary-card';
import { useUserSafes } from '@/hooks/use-user-safes';
import { type Address } from 'viem';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button';

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Allocations & Swaps</h1>
        <Link href="/dashboard/settings/allocations" passHref>
           <Button variant="outline">Allocation Strategy Settings</Button>
        </Link>
      </div>

      {/* Allocation Summary Card (now handles status display) */}
      <AllocationSummaryCard />

      {/* Remove the dedicated AllocationManagement card */}
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Complete Your Allocation
              ...
            </CardTitle>
            <CardDescription>
              You have unallocated funds in your primary safe. Allocate them now to follow your strategy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationManagement />
          </CardContent>
        </Card>
      </div>
      */}

      {/* Keep Swap Section */}
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
            </CardTitle>
            <CardDescription>
              Requires ETH in your connected Privy wallet.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
    </div>
  );
} 