'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { ManualAllocationForm } from './manual-allocation-form';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { formatUnits } from 'viem';

/**
 * Component for managing manual allocation without depending on automatic detection.
 * Simpler replacement for the AllocationDisplay component.
 */
export function AllocationManagement() {
  const { authenticated } = usePrivy();
  const [error, setError] = useState<string | null>(null);
  
  // Use tRPC query for fetching allocation data
  const {
    data: allocationData,
    isLoading: loading,
    error: trpcError,
    refetch: fetchAllocationData
  } = api.allocations.getManualAllocations.useQuery(undefined, {
    enabled: authenticated,
    retry: 1,
  });

  // Show tRPC error if any
  useEffect(() => {
    if (trpcError) {
      setError(trpcError.message);
    } else {
      setError(null);
    }
  }, [trpcError]);

  // Helper function to format numbers safely
  const formatAllocationValue = (value: string | undefined | null, decimals = 18): string => {
    if (!value || value === '0') return '0.0';
    try {
      // Assuming 18 decimals, adjust if needed
      return formatUnits(BigInt(value), decimals);
    } catch (e) {
      console.error("Error formatting value:", value, e);
      return '0.0'; // Return a default value on error
    }
  };

  // Error state
  if (error) {
    return (
      <div className="w-full space-y-4 mt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Allocation Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => fetchAllocationData()} variant="outline" size="sm">Try Again</Button>
      </div>
    );
  }
  
  // Main content
  return (
    <div className="w-full space-y-4 mt-6">
      {/* <Card className="w-full bg-white"> */}
        {/* <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span className="text-base font-medium">Allocation Management</span>
          </CardTitle>
        </CardHeader> */}
        {/* <CardContent> */}
          {loading ? (
            <div className="flex justify-center items-center py-4">
                Loading allocation data...
            </div>
          ) : (
            <ManualAllocationForm
              primarySafeAddress={allocationData?.primarySafeAddress}
              taxCurrent={formatAllocationValue(allocationData?.allocatedTax)}
              liquidityCurrent={formatAllocationValue(allocationData?.allocatedLiquidity)}
              yieldCurrent={formatAllocationValue(allocationData?.allocatedYield)}
              onSuccess={() => fetchAllocationData()}
            />
          )}
        {/* </CardContent> */}
      {/* </Card> */}
    </div>
  );
} 