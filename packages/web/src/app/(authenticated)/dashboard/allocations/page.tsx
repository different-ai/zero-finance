'use client';

import React from 'react';
import { AllocationSummaryCard } from '../(bank)/components/dashboard/allocation-summary-card';
import { AllocationFunds } from '../(bank)/components/allocation-funds';
import { SwapCard } from '../(bank)/components/dashboard/swap-card';
import { useUserSafes } from '@/hooks/use-user-safes';
import { api } from '@/trpc/react';
import { type Address, formatUnits } from 'viem';
import { Loader2, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const USDC_DECIMALS = 6;

export default function AllocationsPage() {
  const utils = api.useUtils();
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  const primarySafeAddress = userSafesData?.find(
    (s) => s.safeType === 'primary',
  )?.safeAddress as Address | undefined;

  const {
    data: allocationStatus,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = api.allocations.getStatus.useQuery(undefined, {
    enabled: !!primarySafeAddress && !isLoadingSafes,
    refetchInterval: 30000,
  });

  const isLoading = isLoadingSafes || (!!primarySafeAddress && isLoadingStatus);

  const handleAllocationSuccess = () => {
    utils.allocations.getStatus.invalidate();
  };

  const needsAllocation = allocationStatus?.totalUnallocatedWei
    ? BigInt(allocationStatus.totalUnallocatedWei) > 0n
    : false;

  if (isLoading) {
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

      <AllocationSummaryCard />

      {statusError && !isLoading && (
          <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Allocation Status</AlertTitle>
              <AlertDescription>
                  Could not load allocation details: {statusError.message}. 
                  You might need to configure your strategy in settings or try again.
                  <Button onClick={() => refetchStatus()} variant="link" size="sm">Retry</Button>
              </AlertDescription>
          </Alert>
      )}
      
      {allocationStatus && needsAllocation && (
        <AllocationFunds 
            primarySafeAddress={primarySafeAddress}
            allocationStatus={allocationStatus}
            onSuccess={handleAllocationSuccess}
        />
      )}

    </div>
  );
} 