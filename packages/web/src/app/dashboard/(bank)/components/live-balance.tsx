'use client';

import { useEffect, useState } from 'react';
import { getSafeUsdcBalance } from '@/lib/safe-service'; // Import the service function
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card components
import { Skeleton } from "@/components/ui/skeleton"

interface LiveBalanceProps {
  testMode?: boolean;
}

export default function LiveBalance({ testMode = false }: LiveBalanceProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    console.log("0xHypr Debug: Attempting to fetch balance...");
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBalance = await getSafeUsdcBalance();
      console.log(`0xHypr Debug: Balance fetched successfully: ${fetchedBalance}`);
      setBalance(fetchedBalance);
    } catch (err) {
      console.error("0xHypr Error in LiveBalance component:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to load balance: ${errorMessage}`);
      
      // In test mode, provide a sample balance instead of erroring
      if (testMode) {
        console.log("0xHypr Debug: Using test balance due to error");
        setBalance('19.98');
        setError(null);
      } else {
        setBalance('0.00'); // Set a default or error state balance
      }
    } finally {
      setIsLoading(false);
      console.log("0xHypr Debug: Fetch balance attempt finished.");
    }
  };

  useEffect(() => {
    fetchBalance(); // Initial fetch

    // Set up polling every 30 seconds if not in test mode
    let intervalId: NodeJS.Timeout | null = null;
    if (!testMode) {
      intervalId = setInterval(fetchBalance, 30000);
    }

    // Clear interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [testMode]);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-700">Total Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && balance === null ? (
          <Skeleton className="h-8 w-3/4" />
        ) : error ? (
          <div>
            <p className="text-red-600 text-sm">{error}</p>
            {testMode && (
              <button 
                onClick={fetchBalance}
                className="text-xs mt-1 text-blue-500 hover:text-blue-700"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <p className="text-2xl font-semibold text-gray-900">
            {balance ?? '0.00'} <span className="text-lg font-normal text-gray-500">USDC</span>
          </p>
        )}
        {isLoading && balance !== null && (
          <p className="text-xs text-gray-400 mt-1">Refreshing...</p>
        )}
        {testMode && !isLoading && !error && (
          <p className="text-xs text-blue-400 mt-1">Test mode: Balance may be simulated</p>
        )}
      </CardContent>
    </Card>
  );
} 