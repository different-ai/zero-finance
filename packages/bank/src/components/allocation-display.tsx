'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AllocationSection {
  title: string;
  amount: string;
  description: string;
}

interface AllocationData {
  totalDeposited: string;
  allocatedTax: string;
  allocatedLiquidity: string;
  allocatedYield: string;
  lastUpdated: number;
}

function AllocationSection({ title, amount, description }: AllocationSection) {
  return (
    <Card className="w-full bg-white border-gray-200 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-gray-800">
          ${amount} <span className="text-sm font-normal">USDC</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Component to display dynamic allocation data from the backend
 */
export default function AllocationDisplay() {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/allocations');
      
      if (!response.ok) {
        throw new Error(`Error fetching allocations: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load allocation data');
      }
      
      setAllocationData(result.data);
    } catch (err) {
      console.error('Error loading allocations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load allocations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchAllocations();
    
    // Optional: Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchAllocations();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Loading state
  if (loading && !allocationData) {
    return (
      <div className="w-full space-y-4 mt-6">
        <Card className="w-full bg-white">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
        <Card className="w-full bg-white">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
        <Card className="w-full bg-white">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full space-y-4 mt-6">
        <Card className="w-full bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <p className="text-red-600">Error loading allocation data</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
            <button 
              onClick={fetchAllocations} 
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loaded data state
  return (
    <div className="w-full space-y-4 mt-6">
      <AllocationSection 
        title="Tax Reserve" 
        amount={allocationData?.allocatedTax || "0.00"} 
        description="30% allocation for tax reserves"
      />
      <AllocationSection 
        title="Liquidity Pool" 
        amount={allocationData?.allocatedLiquidity || "0.00"} 
        description="20% allocation for liquidity provision"
      />
      <AllocationSection 
        title="Yield Strategies" 
        amount={allocationData?.allocatedYield || "0.00"} 
        description="50% allocation for yield-generating strategies"
      />
      
      {allocationData && (
        <div className="text-xs text-right text-gray-500 pt-1">
          Last updated: {new Date(allocationData.lastUpdated).toLocaleString()}
          <button
            onClick={fetchAllocations}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            ↻ Refresh
          </button>
        </div>
      )}
    </div>
  );
} 