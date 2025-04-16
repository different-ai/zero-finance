'use client';

import React, { useEffect } from 'react';
import { useAllocationState } from '../../hooks/use-allocation-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Wallet, CircleDollarSign, Landmark, Copy, ArrowRight, CreditCard } from 'lucide-react';
import { formatUnits } from 'viem';
import { useUserSafes } from '@/hooks/use-user-safes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Helper function to format balance strings (assuming 6 decimals for USDC)
const formatBalance = (amount: string | undefined | null, decimals: number = 6): string => {
  // Check for null, undefined, or the string '0'
  if (amount === null || amount === undefined || amount === '0') return '0.00'; 
  try {
    const formatted = formatUnits(BigInt(amount), decimals);
    // Format to 2-6 decimal places for readability
    const number = parseFloat(formatted);
    return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  } catch (error) {
    console.error("Error formatting balance:", amount, error);
    return '0.00'; // Return default on error
  }
};

// Internal component for the Add Funds CTA
const AddFundsCTA: React.FC<{ safeAddress: string; onCopy: (text: string) => void }> = ({ safeAddress, onCopy }) => (
  <div className="mt-6 space-y-4">
    <h3 className="text-sm font-medium">Add funds to start using allocations:</h3>
    
    {/* Crypto option */}
    <div className="p-4 border rounded-md bg-slate-50">
      <h4 className="font-medium text-sm mb-2 flex items-center">
        <Wallet className="h-4 w-4 mr-1.5 text-primary"/> Send Crypto (Base Network)
      </h4>
      <p className="text-sm text-gray-600 mb-3">
        Send USDC, ETH, or other supported assets on the <span className="font-semibold">Base network</span> to your safe address:
      </p>
      <div className="flex items-center">
        <div className="flex-1 bg-white p-2 rounded border font-mono text-xs truncate">
          {safeAddress}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2"
          onClick={() => onCopy(safeAddress)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    
  </div>
);

export function AllocationSummaryCard() {
  const { data: allocationData, isLoading: allocLoading, isError: allocError, error: allocErrorMsg, refetch } = useAllocationState();
  const { data: safesData, isLoading: safesLoading } = useUserSafes();
  
  // Poll for updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [refetch]);

  const allocationState = allocationData?.allocationState;
  const primarySafe = safesData?.find(safe => safe.safeType === 'primary');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Address copied to clipboard!");
    }, (err) => {
      toast.error("Failed to copy address.");
      console.error('Could not copy text: ', err);
    });
  };

  // --- Loading State --- 
  if (allocLoading || safesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary" /> Allocation Summary
          </CardTitle>
          <CardDescription>Loading your allocation details...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // --- Error State --- 
  if (allocError) {
    return (
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary" /> Allocation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Allocation</AlertTitle>
            <AlertDescription>
              {allocErrorMsg?.message || 'Could not fetch allocation details. Please try again later.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // --- No Safe Setup --- 
  if (!primarySafe) {
     return (
      <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary" /> Allocation Summary
          </CardTitle>
          <CardDescription>No allocation data found. Ensure your primary safe is set up.</CardDescription>
        </CardHeader>
        <CardContent>
           <Alert variant="default" className="border-yellow-500/50 bg-yellow-50 text-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900">Safe Not Found</AlertTitle>
            <AlertDescription className="text-yellow-700">
                Please set up your Primary Safe in Settings to start tracking allocations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // --- Safe Exists But No Allocation Data Yet ---
  if (!allocationState && primarySafe) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary" /> Allocation Summary
          </CardTitle>
          <CardDescription>Your safe is ready to receive funds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Allocation Breakdown Grid with zeros */} 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Tax Allocation */}
             <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                  <p className="text-sm text-gray-600 flex items-center mb-1"><Landmark className="h-4 w-4 mr-1.5 text-blue-600"/> Tax Reserve</p>
                  <p className="text-lg font-semibold text-gray-800">$0.00</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">30% of deposits</p> 
             </div>

            {/* Primary Safe Allocation */}
             <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                 <p className="text-sm text-gray-600 flex items-center mb-1"><Wallet className="h-4 w-4 mr-1.5 text-green-600"/> Primary Safe</p>
                 <p className="text-lg font-semibold text-gray-800">$0.00</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">60% of deposits</p> 
             </div>

            {/* Yield Allocation */}
             <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                 <p className="text-sm text-gray-600 flex items-center mb-1"><CircleDollarSign className="h-4 w-4 mr-1.5 text-yellow-600"/> Yield Strategies</p>
                 <p className="text-lg font-semibold text-gray-800">$0.00</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">10% of deposits</p> 
             </div>
          </div>
          
          {/* Send Money Instructions - Use the component */}
          <AddFundsCTA safeAddress={primarySafe.safeAddress} onCopy={copyToClipboard} />
        </CardContent>
      </Card>
    );
  }

  // --- Main Content: Display Allocation Details --- 

  const allocatedTax = formatBalance(allocationState?.allocatedTax);
  const allocatedLiquidity = formatBalance(allocationState?.allocatedLiquidity);
  const allocatedYield = formatBalance(allocationState?.allocatedYield);
  const lastUpdated = allocationState?.lastUpdated ? new Date(allocationState.lastUpdated).toLocaleString() : 'N/A';

  // Calculate the tax percentages
  const taxPercentage = '30%';
  const primaryPercentage = '60%';
  const yieldPercentage = '10%';
  
  // Check if all allocations are zero or undefined/null
  const isZeroAllocation = 
      (!allocationState?.allocatedTax || allocationState.allocatedTax === '0') &&
      (!allocationState?.allocatedLiquidity || allocationState.allocatedLiquidity === '0') &&
      (!allocationState?.allocatedYield || allocationState.allocatedYield === '0');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-primary" /> Allocation Summary
        </CardTitle>
        <CardDescription>
          {isZeroAllocation 
             ? "Add funds to start allocating" 
             : `Overview of your treasury allocations. Last updated: ${lastUpdated}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isZeroAllocation ? (
          // Display CTA if allocation is zero
          <AddFundsCTA safeAddress={primarySafe!.safeAddress} onCopy={copyToClipboard} />
        ) : (
          // Display Allocation Breakdown Grid if there are funds
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Tax Allocation */}
             <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                  <p className="text-sm text-gray-600 flex items-center mb-1"><Landmark className="h-4 w-4 mr-1.5 text-blue-600"/> Tax Reserve</p>
                  <p className="text-lg font-semibold text-gray-800">${allocatedTax}</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">{taxPercentage} of deposits</p> 
             </div>

            {/* Primary Safe Allocation */}
             <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                 <p className="text-sm text-gray-600 flex items-center mb-1"><Wallet className="h-4 w-4 mr-1.5 text-green-600"/> Primary Safe</p>
                 <p className="text-lg font-semibold text-gray-800">${allocatedLiquidity}</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">{primaryPercentage} of deposits</p> 
             </div>

            {/* Yield Allocation */}
             <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                 <p className="text-sm text-gray-600 flex items-center mb-1"><CircleDollarSign className="h-4 w-4 mr-1.5 text-yellow-600"/> Yield Strategies</p>
                 <p className="text-lg font-semibold text-gray-800">${allocatedYield}</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">{yieldPercentage} of deposits</p> 
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 