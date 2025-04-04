'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { formatUnits, parseUnits, type Address } from 'viem';
import { ExternalLink } from 'lucide-react';

// Allocation percentages (mirroring backend)
const TAX_PERCENTAGE = 0.3;
const LIQUIDITY_PERCENTAGE = 0.2;
const YIELD_PERCENTAGE = 0.5;
const USDC_DECIMALS = 6;

interface AllocationData {
  totalDeposited: string;
  allocatedTax: string;
  allocatedLiquidity: string;
  allocatedYield: string;
  pendingDepositAmount: string;
  rawPendingDepositAmount: string;
  lastUpdated: Date;
  primarySafeAddress: Address | null;
  taxSafeAddress: Address | null;
  liquiditySafeAddress: Address | null;
  yieldSafeAddress: Address | null;
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

  // Fetch current allocations (including pending and addresses)
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
      
      // Ensure all fields, including addresses, are set
      setAllocationData({
        totalDeposited: result.data.totalDeposited || '0',
        allocatedTax: result.data.allocatedTax || '0',
        allocatedLiquidity: result.data.allocatedLiquidity || '0',
        allocatedYield: result.data.allocatedYield || '0',
        pendingDepositAmount: result.data.pendingDepositAmount || '0',
        rawPendingDepositAmount: result.data.rawPendingDepositAmount || '0',
        lastUpdated: result.data.lastUpdated ? new Date(result.data.lastUpdated) : new Date(),
        primarySafeAddress: result.data.primarySafeAddress || null,
        taxSafeAddress: result.data.taxSafeAddress || null,
        liquiditySafeAddress: result.data.liquiditySafeAddress || null,
        yieldSafeAddress: result.data.yieldSafeAddress || null,
      });

    } catch (err) {
      console.error('Error loading allocations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load allocations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for new deposits (POST request)
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

      setAllocationData({
        totalDeposited: result.data.totalDeposited || '0',
        allocatedTax: result.data.allocatedTax || '0',
        allocatedLiquidity: result.data.allocatedLiquidity || '0',
        allocatedYield: result.data.allocatedYield || '0',
        pendingDepositAmount: result.data.pendingDepositAmount || '0',
        rawPendingDepositAmount: result.data.rawPendingDepositAmount || '0',
        lastUpdated: result.data.lastUpdated ? new Date(result.data.lastUpdated) : new Date(),
        primarySafeAddress: result.data.primarySafeAddress || null,
        taxSafeAddress: result.data.taxSafeAddress || null,
        liquiditySafeAddress: result.data.liquiditySafeAddress || null,
        yieldSafeAddress: result.data.yieldSafeAddress || null,
      });
      setApiMessage(result.message || 'Check complete.');

    } catch (err) {
      console.error('Error checking for deposits:', err);
      setError(err instanceof Error ? err.message : 'Failed to check deposits');
      setApiMessage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirm pending allocation
  const confirmAllocation = async () => {
    const pendingRaw = allocationData?.rawPendingDepositAmount;
    if (!pendingRaw || pendingRaw === '0') return;

    setIsConfirming(true);
    setError(null);
    setApiMessage('Confirming allocation...');
    try {
      const response = await fetch('/api/allocations/confirm', { method: 'POST' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to confirm allocation');
      }
      
      // Calculate breakdown for the message using the raw value BEFORE confirmation
      const pendingAmountBigInt = BigInt(pendingRaw); // Use the value that WAS pending
      const taxAmount = formatUnits(pendingAmountBigInt * BigInt(Math.floor(TAX_PERCENTAGE * 100)) / 100n, USDC_DECIMALS);
      const liquidityAmount = formatUnits(pendingAmountBigInt * BigInt(Math.floor(LIQUIDITY_PERCENTAGE * 100)) / 100n, USDC_DECIMALS);
      // Calculate yield based on the other two to avoid rounding errors
      const taxBigInt = parseUnits(taxAmount, USDC_DECIMALS);
      const liquidityBigInt = parseUnits(liquidityAmount, USDC_DECIMALS);
      const yieldAmount = formatUnits(pendingAmountBigInt - taxBigInt - liquidityBigInt, USDC_DECIMALS);

      // Update state with new data including addresses
      setAllocationData({
        totalDeposited: result.data.totalDeposited || '0',
        allocatedTax: result.data.allocatedTax || '0',
        allocatedLiquidity: result.data.allocatedLiquidity || '0',
        allocatedYield: result.data.allocatedYield || '0',
        pendingDepositAmount: result.data.pendingDepositAmount || '0',
        rawPendingDepositAmount: result.data.rawPendingDepositAmount || '0',
        lastUpdated: result.data.lastUpdated ? new Date(result.data.lastUpdated) : new Date(),
        primarySafeAddress: result.data.primarySafeAddress || null,
        taxSafeAddress: result.data.taxSafeAddress || null,
        liquiditySafeAddress: result.data.liquiditySafeAddress || null,
        yieldSafeAddress: result.data.yieldSafeAddress || null,
      }); 
      
      // Use the specific message from the API response (which mentions execution disabled)
      setApiMessage(result.message || 'Allocation confirmed.'); 

    } catch (err) {
      console.error('Error confirming allocation:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm allocation');
      setApiMessage(null);
    } finally {
      setIsConfirming(false);
    }
  };

  // Initial fetch and set up interval for checking deposits
  useEffect(() => {
    fetchAllocations();
    
    const checkIntervalId = setInterval(() => {
       checkForNewDeposits();
    }, 60000);

    return () => clearInterval(checkIntervalId);
  }, [fetchAllocations, checkForNewDeposits]);

  // Calculate pending breakdown
  const getPendingBreakdown = () => {
    const pendingRaw = allocationData?.rawPendingDepositAmount;
    if (!pendingRaw || pendingRaw === '0') return null;

    try {
      const pendingAmountBigInt = BigInt(pendingRaw);
      const taxAmount = formatUnits(pendingAmountBigInt * BigInt(Math.floor(TAX_PERCENTAGE * 100)) / 100n, USDC_DECIMALS);
      const liquidityAmount = formatUnits(pendingAmountBigInt * BigInt(Math.floor(LIQUIDITY_PERCENTAGE * 100)) / 100n, USDC_DECIMALS);
      const taxBigInt = parseUnits(taxAmount, USDC_DECIMALS);
      const liquidityBigInt = parseUnits(liquidityAmount, USDC_DECIMALS);
      const yieldAmt = formatUnits(pendingAmountBigInt - taxBigInt - liquidityBigInt, USDC_DECIMALS);
      return { tax: taxAmount, liquidity: liquidityAmount, yield: yieldAmt };
    } catch (e) {
      console.error("Error calculating breakdown:", e);
      return null;
    }
  };

  const pendingBreakdown = getPendingBreakdown();
  const hasPendingDeposit = !!pendingBreakdown;

  // Loading state
  if (loading && !allocationData) {
    // Skeleton remains the same
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

  // Error state
  if (error) {
    // Error display remains the same
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
  
  // API Message display remains the same
  const renderApiMessage = () => {
    if (!apiMessage) return null;
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-700 text-sm">{apiMessage}</AlertDescription>
      </Alert>
    );
  };

  // Helper to create the Safe{Wallet} URL
  const createSafeLink = (address: Address | null) => {
    if (!address) return null;
    // Use 'base:' prefix for Base chain
    return `https://app.safe.global/home?safe=base:${address}`;
  };

  // Loaded data state
  return (
    <div className="w-full space-y-4 mt-6">
      {renderApiMessage()}
      
      {/* Pending Deposit Section */}
      {hasPendingDeposit && allocationData && (
        <Card className="w-full bg-yellow-50 border-yellow-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-yellow-800">Pending Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xl font-semibold text-yellow-900">
                  ${allocationData.pendingDepositAmount} <span className="text-sm font-normal">USDC</span>
                </p>
                <p className="text-xs text-yellow-700 mt-1">Ready to be allocated (30/20/50)</p>
              </div>
              <Button 
                onClick={confirmAllocation} 
                disabled={isConfirming || loading}
                size="sm"
                // Using darker green with white text for better contrast
                className=""
              >
                {isConfirming ? 'Confirming...' : 'Confirm Allocation'}
              </Button>
            </div>
            {/* Allocation Breakdown */}
            {pendingBreakdown && (
              <div className="text-xs text-yellow-800 border-t border-yellow-200 pt-2 mt-2">
                <p>• Tax (30%): ${pendingBreakdown.tax} USDC</p>
                <p>• Liquidity (20%): ${pendingBreakdown.liquidity} USDC</p>
                <p>• Yield (50%): ${pendingBreakdown.yield} USDC</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmed Allocation Sections - Render inline with links */}
      {allocationData && (
        <>
          {/* Tax Reserve Section */}
          <Card className="w-full bg-white border-gray-200 shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium text-gray-700">Tax Reserve (Confirmed)</CardTitle>
              {allocationData.taxSafeAddress && (
                <a 
                  href={createSafeLink(allocationData.taxSafeAddress)!}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Open Tax Safe in Safe{Wallet}"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-gray-800">
                ${allocationData.allocatedTax} <span className="text-sm font-normal">USDC</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">30% of confirmed deposits</p>
            </CardContent>
          </Card>

          {/* Liquidity Pool Section */}
          <Card className="w-full bg-white border-gray-200 shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium text-gray-700">Liquidity Pool (Confirmed)</CardTitle>
              {allocationData.liquiditySafeAddress && (
                 <a 
                  href={createSafeLink(allocationData.liquiditySafeAddress)!}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Open Liquidity Safe in Safe{Wallet}"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                 >
                  <ExternalLink size={16} />
                </a>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-gray-800">
                ${allocationData.allocatedLiquidity} <span className="text-sm font-normal">USDC</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">20% of confirmed deposits</p>
            </CardContent>
          </Card>

          {/* Yield Strategies Section */}
          <Card className="w-full bg-white border-gray-200 shadow-sm hover:shadow transition-shadow">
             <CardHeader className="pb-2 flex flex-row items-center justify-between">
               <CardTitle className="text-base font-medium text-gray-700">Yield Strategies (Confirmed)</CardTitle>
               {allocationData.yieldSafeAddress && (
                 <a 
                  href={createSafeLink(allocationData.yieldSafeAddress)!}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Open Yield Safe in Safe{Wallet}"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                 >
                  <ExternalLink size={16} />
                 </a>
              )}
             </CardHeader>
             <CardContent>
                <p className="text-xl font-semibold text-gray-800">
                  ${allocationData.allocatedYield} <span className="text-sm font-normal">USDC</span>
                </p>
               <p className="text-xs text-gray-500 mt-1">50% of confirmed deposits</p>
             </CardContent>
           </Card>

          {/* Total Confirmed Display */}
          <div className="text-center text-sm text-gray-600 mt-4">
              Total Confirmed Deposits: ${allocationData.totalDeposited} USDC
              <span className="mx-2">|</span>
              Last updated: {allocationData.lastUpdated ? allocationData.lastUpdated.toLocaleString() : 'N/A'}
              {allocationData.primarySafeAddress && (
                <a 
                  href={createSafeLink(allocationData.primarySafeAddress)!}
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Open Primary Safe in Safe{Wallet}"
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors inline-block align-middle"
                >
                  <ExternalLink size={14} />
                </a>
              )}
          </div>
        </>
      )}

      {/* Spacer and Check Deposits Button */}
      <div className="pt-4">
        <Button 
          onClick={checkForNewDeposits} 
          variant="outline"
          disabled={loading} 
          className="w-full"
        >
          {loading && !isConfirming ? 'Checking...' : 'Check for New Deposits'}
        </Button>
      </div>

    </div>
  );
} 