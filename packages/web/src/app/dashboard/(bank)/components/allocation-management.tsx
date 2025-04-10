'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AllocationFunds } from './allocation-funds';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { formatUnits } from 'viem';

// Define the expected shape of allocation data from API
interface AllocationData {
  primarySafeAddress: string;
  allocatedTax: string;
  allocatedLiquidity: string;
  allocatedYield: string;
  totalDeposited: string;
  primarySafeBalance?: string; // Added this field
  lastUpdated?: string;
}

/**
 * Component for managing allocation of funds
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
  const formatAllocationValue = (value: string | undefined | null, decimals = 6): string => {
    if (!value || value === '0') return '0.0';
    try {
      return formatUnits(BigInt(value), decimals);
    } catch (e) {
      console.error("Error formatting value:", value, e);
      return '0.0'; // Return a default value on error
    }
  };

  // Calculate unallocated amount
  // For now we'll use a simple mock value since the actual API doesn't expose primarySafeBalance
  // This will be updated once the API provides the relevant info
  const calculateUnallocatedAmount = (): string => {
    if (!allocationData || !allocationData.totalDeposited) return '0';
    
    // Temporary: using 20% of total deposits as "unallocated" for demo purposes
    // This should be replaced with actual balance calculation when API supports it
    const totalDepositedBigInt = BigInt(allocationData.totalDeposited);
    const mockedUnallocated = totalDepositedBigInt / BigInt(5); // 20% of total
    
    return formatUnits(mockedUnallocated, 6);
  };

  // Error state
  if (error) {
    return (
      <div className="w-full space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Allocation Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => fetchAllocationData()} variant="outline" size="sm">Try Again</Button>
      </div>
    );
  }
  
  // Loading or Main content
  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center py-4">
          Loading allocation data...
        </div>
      ) : (
        <AllocationFunds
          primarySafeAddress={allocationData?.primarySafeAddress}
          initialTaxAmount={formatAllocationValue(allocationData?.allocatedTax)}
          initialYieldAmount={formatAllocationValue(allocationData?.allocatedYield)}
          unallocatedAmount={calculateUnallocatedAmount()}
          onSuccess={() => fetchAllocationData()}
        />
      )}
    </div>
  );
} 