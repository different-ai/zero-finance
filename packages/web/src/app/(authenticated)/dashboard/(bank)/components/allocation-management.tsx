'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AllocationFunds } from './allocation-funds';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { formatUnits } from 'viem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';

const USDC_DECIMALS = 6;

/**
 * Component wrapping allocation logic, fetching status and passing to AllocationFunds.
 */
export function AllocationManagement() {
  const { authenticated } = usePrivy();
  const utils = api.useUtils(); // Get tRPC utils
  
  // Use the new getStatus query
  const {
    data: allocationStatus,
    isLoading: loading,
    error: statusError,
    refetch: fetchAllocationStatus
  } = api.allocations.getStatus.useQuery(undefined, {
    enabled: authenticated,
    retry: 1,
    refetchInterval: 30000, // Refetch status periodically
  });

  // Calculate unallocated amount from status
  const unallocatedAmount = allocationStatus?.totalUnallocatedWei
    ? formatUnits(BigInt(allocationStatus.totalUnallocatedWei), USDC_DECIMALS)
    : '0.00';

  const hasUnallocatedFunds = parseFloat(unallocatedAmount) > 0;
  
  const handleAllocationSuccess = () => {
    // Refetch status after successful allocation
    fetchAllocationStatus();
    // Also refetch strategy in case defaults were created
    utils.allocationStrategy.get.invalidate();
  };

  // Error state
  if (statusError) {
    // Handle specific error if strategy is not set
    if (statusError.data?.code === 'NOT_FOUND' && statusError.message.includes('strategy not set')) {
       return (
         <Card>
           <CardHeader>
              <CardTitle>Set Your Strategy</CardTitle>
              <CardDescription>Define how you want your funds allocated.</CardDescription>
           </CardHeader>
           <CardContent>
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Allocation Strategy Needed</AlertTitle>
                <AlertDescription className="mb-3">
                  Please set up your allocation percentages in the settings before you can allocate funds.
                </AlertDescription>
                <Link href="/dashboard/settings/allocations" passHref>
                   <Button size="sm">Go to Allocation Settings</Button>
                </Link>
              </Alert>
           </CardContent>
         </Card>
       );
    }
    // Generic error
    return (
      <div className="w-full space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Allocation Status</AlertTitle>
          <AlertDescription>{statusError.message}</AlertDescription>
        </Alert>
        <Button onClick={() => fetchAllocationStatus()} variant="outline" size="sm">Try Again</Button>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
     return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading allocation status...
      </div>
    );
  }

  // Main content - Pass status data to AllocationFunds
  return (
    <div className="w-full">
      {allocationStatus ? (
        <AllocationFunds
            primarySafeAddress={allocationStatus.balances['primary']?.address}
            allocationStatus={allocationStatus} // Pass the whole status object
            onSuccess={handleAllocationSuccess} // Pass down the success handler
          />
      ) : (
         // Should not happen if loading/error handled, but as fallback:
         <div className="text-center text-muted-foreground py-4">No allocation data available.</div>
      )}
    </div>
  );
} 