'use client';

import React, { useEffect } from 'react';
import { useAllocationState } from '../../hooks/use-allocation-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  Wallet,
  Landmark,
  Copy,
  ArrowRight,
  CircleDollarSign,
  Info,
} from 'lucide-react';
import { formatUnits } from 'viem';
import { useUserSafes } from '@/hooks/use-user-safes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const USDC_DECIMALS = 6;

// Helper function to format balance strings (assuming 6 decimals for USDC)
const formatBalance = (
  amount: string | undefined | null,
  decimals: number = 6,
): string => {
  // Check for null, undefined, or the string '0'
  if (amount === null || amount === undefined || amount === '0') return '0.00';
  try {
    const formatted = formatUnits(BigInt(amount), decimals);
    // Format to 2-6 decimal places for readability
    const number = parseFloat(formatted);
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  } catch (error) {
    console.error('Error formatting balance:', amount, error);
    return '0.00'; // Return default on error
  }
};

export function AllocationSummaryCard() {
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  const primarySafeAddress = userSafesData?.find((s) => s.safeType === 'primary')?.safeAddress;

  // Use the new getStatus query
  const { data: allocationStatus, isLoading: isLoadingStatus, error: statusError } = api.allocations.getStatus.useQuery(
      undefined,
      {
          enabled: !!primarySafeAddress, // Only run if primary safe exists
          refetchInterval: 30000, // Refetch every 30 seconds
      }
  );

  const isLoading = isLoadingSafes || isLoadingStatus;

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
                </CardTitle>
                <CardDescription>Loading account details...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-24">
                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
        </Card>
    );
  }

  // Handle case where primary safe doesn't exist (e.g., onboarding incomplete)
  if (!primarySafeAddress) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
          </CardTitle>
          <CardDescription>
            Set up your primary safe to manage funds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <AlertTitle>Onboarding Needed</AlertTitle>
            <AlertDescription>
              Please complete the onboarding process to create your primary account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Handle errors fetching allocation status
  if (statusError) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
                  </CardTitle>
                  <CardDescription>Error loading allocation status.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{statusError.message}</AlertDescription>
                  </Alert>
              </CardContent>
          </Card>
      );
  }
  
  // Handle case where status is loaded but no strategy/balances (should be rare)
  if (!allocationStatus) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
                  </CardTitle>
                  <CardDescription>Account ready. Add funds to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Alert variant="default">
                      <AlertTitle>Add Funds</AlertTitle>
                      <AlertDescription>
                          Send USDC to your primary safe address: {primarySafeAddress} (on Base network) or set up a virtual bank account in settings.
                      </AlertDescription>
                  </Alert>
              </CardContent>
          </Card>
      );
  }

  // --- Main Content: Display Allocation Details ---
  const { strategy, balances, totalBalanceWei } = allocationStatus;
  
  const formattedTotalBalance = formatBalance(totalBalanceWei);
  const lastUpdated = new Date().toLocaleString(); // Use current time as approximation

  // Determine description based on balance
  const isZeroBalance = totalBalanceWei === '0';
  const description = isZeroBalance
      ? 'Your account is ready for funding. Add funds to start allocating.'
      : `Total Balance: $${formattedTotalBalance}. Last checked: ${lastUpdated}`;

  // Get strategy percentage for a given type
  const getPercentage = (type: string) => strategy.find(s => s.destinationSafeType === type)?.percentage ?? 0;

  // Define which safes to display
  const displayOrder: (keyof typeof balances)[] = ['primary', 'tax', 'yield']; // Add 'liquidity' if needed

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
        </CardTitle>
        <CardDescription>{String(description)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isZeroBalance ? (
          // Show simple Add Funds message if balance is zero
          <Alert variant="default">
              <AlertTitle>Add Funds</AlertTitle>
              <AlertDescription>
                  Send USDC to your primary safe address: {primarySafeAddress} (on Base network) or set up a virtual bank account in settings.
              </AlertDescription>
          </Alert>
        ) : (
          // Display Allocation Breakdown Grid if there are funds
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayOrder.map((safeType) => {
              const balanceInfo = balances[safeType];
              const percentage = getPercentage(safeType);
              if (!balanceInfo) return null; // Skip if safe doesn't exist in balances

              const formattedActual = formatBalance(balanceInfo.actualWei);
              let IconComponent = Wallet;
              let iconColor = 'text-gray-600';
              let name = 'Unknown';

              switch (safeType) {
                case 'primary': 
                  IconComponent = Wallet; iconColor = 'text-green-600'; name = 'Primary Account'; 
                  break;
                case 'tax': 
                  IconComponent = Landmark; iconColor = 'text-blue-600'; name = 'Tax Reserve'; 
                  break;
                case 'yield': 
                  IconComponent = CircleDollarSign; iconColor = 'text-yellow-600'; name = 'Yield Strategies'; 
                  break;
                // Add case for 'liquidity' if needed
              }

              return (
                <div key={safeType} className="p-3 border rounded-md flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center mb-1">
                      <IconComponent className={`h-4 w-4 mr-1.5 ${iconColor}`} /> {name}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      ${formattedActual}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Target: {percentage}% of total
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
