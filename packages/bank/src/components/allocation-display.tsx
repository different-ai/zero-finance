'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AllocationSectionProps {
  title: string;
  amount: string;
  description: string;
}

interface AllocationData {
  totalDeposited: string;
  allocatedTax: string;
  allocatedLiquidity: string;
  allocatedYield: string;
  pendingDepositAmount: string;
  lastUpdated: number;
}

function AllocationSection({ title, amount, description }: AllocationSectionProps) {
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
 * Component to display dynamic allocation data from the backend,
 * including pending deposits and a confirmation mechanism.
 */
export default function AllocationDisplay() {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const fetchAllocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setApiMessage(null);
      
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
  }, []);

  const checkForNewDeposits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setApiMessage('Checking for new deposits...');

      const response = await fetch('/api/allocations', { method: 'POST' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to check for deposits');
      }

      setAllocationData(result.data);
      setApiMessage(result.message || 'Check complete.');

    } catch (err) {
      console.error('Error checking for deposits:', err);
      setError(err instanceof Error ? err.message : 'Failed to check deposits');
      setApiMessage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmAllocation = async () => {
    setIsConfirming(true);
    setError(null);
    setApiMessage('Confirming allocation...');
    try {
      const response = await fetch('/api/allocations/confirm', { method: 'POST' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to confirm allocation');
      }
      
      setAllocationData(result.data);
      setApiMessage(result.message || 'Allocation confirmed!');

    } catch (err) {
      console.error('Error confirming allocation:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm allocation');
      setApiMessage(null);
    } finally {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
    
    const checkIntervalId = setInterval(() => {
       checkForNewDeposits();
    }, 60000);

    return () => clearInterval(checkIntervalId);
  }, [fetchAllocations, checkForNewDeposits]);

  const hasPendingDeposit = allocationData?.pendingDepositAmount && parseFloat(allocationData.pendingDepositAmount) > 0;

  if (loading && !allocationData) {
    return (
      <div className="w-full space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full bg-white">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-4 mt-6">
        <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchAllocations} variant="outline" size="sm">Try Again</Button>
      </div>
    );
  }
  
  const renderApiMessage = () => {
    if (!apiMessage) return null;
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-700 text-sm">{apiMessage}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="w-full space-y-4 mt-6">
      {renderApiMessage()}
      
      {hasPendingDeposit && (
        <Card className="w-full bg-yellow-50 border-yellow-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-yellow-800">Pending Deposit</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-yellow-900">
                ${allocationData?.pendingDepositAmount} <span className="text-sm font-normal">USDC</span>
              </p>
              <p className="text-xs text-yellow-700 mt-1">Ready to be allocated (30/20/50)</p>
            </div>
            <Button 
              onClick={confirmAllocation} 
              disabled={isConfirming || loading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isConfirming ? 'Confirming...' : 'Confirm Allocation'}
            </Button>
          </CardContent>
        </Card>
      )}

      <AllocationSection 
        title="Tax Reserve (Confirmed)" 
        amount={allocationData?.allocatedTax || "0.00"} 
        description="30% of confirmed deposits"
      />
      <AllocationSection 
        title="Liquidity Pool (Confirmed)" 
        amount={allocationData?.allocatedLiquidity || "0.00"} 
        description="20% of confirmed deposits"
      />
      <AllocationSection 
        title="Yield Strategies (Confirmed)" 
        amount={allocationData?.allocatedYield || "0.00"} 
        description="50% of confirmed deposits"
      />
      
      {allocationData && (
        <div className="text-xs text-right text-gray-500 pt-1 flex justify-between items-center">
          <span>Total Confirmed Deposits: ${allocationData.totalDeposited} USDC</span>
          <div>
            Last updated: {new Date(allocationData.lastUpdated).toLocaleString()}
            <Button
              variant="ghost"
              size="sm"
              onClick={checkForNewDeposits}
              disabled={loading}
              className="ml-2 text-blue-600 hover:text-blue-800 px-1"
            >
              {loading && apiMessage?.includes('Checking') ? 'Checking...' : 'Check for New Deposits'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 