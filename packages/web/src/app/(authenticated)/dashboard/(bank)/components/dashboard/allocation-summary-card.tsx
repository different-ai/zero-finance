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
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { formatUnits } from 'viem';
import { useUserSafes } from '@/hooks/use-user-safes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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

// Internal component for the Add Funds CTA
const AddFundsCTA: React.FC<{
  safeAddress: string;
  onCopy: (text: string) => void;
  hasVirtualBankAccount?: boolean;
}> = ({ safeAddress, onCopy, hasVirtualBankAccount = false }) => {
  const { data: virtualAccountDetails } = api.align.getVirtualAccountDetails.useQuery();

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-medium">
        {hasVirtualBankAccount ? 'Add funds to your account:' : 'Add funds to start using your account:'}
      </h3>

      {/* Bank Transfer Option - Only show setup if they don't have an account */}
      <div className="p-4 border rounded-md bg-green-50 border-green-100">
        <h4 className="font-medium text-sm mb-2 flex items-center">
          <Landmark className="h-4 w-4 mr-1.5 text-green-600" /> 
          {hasVirtualBankAccount ? 'Send Payments via Bank Transfer' : 'Receive Payments via Bank Transfer'}{' '}
          <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
            Recommended
          </span>
        </h4>
        
        {hasVirtualBankAccount ? (
          // User has a bank account - Show how to use it
          <>
            <p className="text-sm text-gray-600 mb-3">
              Use your virtual bank account details to receive payments that automatically convert to digital currency in your account.
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              size="sm"
              onClick={() => window.location.href = '/settings/funding-sources/align'}
            >
              View Bank Account Details <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Share these account details with clients and payment services for fast settlements
            </p>
          </>
        ) : (
          // User doesn't have a bank account - Show setup option
          <>
            <p className="text-sm text-gray-600 mb-3">
              Set up a virtual bank account to receive traditional payments that
              automatically convert to digital currency.
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              size="sm"
              onClick={() => window.location.href = '/settings/funding-sources/align'}
            >
              Set Up Virtual Bank Account{' '}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Get your own account numbers for USD and EUR payments from clients worldwide
            </p>
          </>
        )}
      </div>

      {/* Crypto option - Now as an accordion/collapsible section */}
      <Accordion type="single" collapsible>
        <AccordionItem value="more-funding-options" className="border rounded-md bg-slate-50">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-medium text-sm flex items-center">
              <Wallet className="h-4 w-4 mr-1.5 text-primary" /> More Funding Options
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                Send Crypto (Base Network){' '}
                <span className="ml-1.5 text-xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">
                  Advanced
                </span>
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Send USDC, ETH, or other supported assets on the{' '}
                <span className="font-semibold">Base network</span> to your account
                address:
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export function AllocationSummaryCard() {
  const {
    data: allocationData,
    isLoading: allocLoading,
    isError: allocError,
    error: allocErrorMsg,
    refetch,
  } = useAllocationState();
  const { data: safesData, isLoading: safesLoading } = useUserSafes();
  const { data: virtualAccountDetails, isLoading: isVirtualAccountLoading } = api.align.getVirtualAccountDetails.useQuery();
  
  // Check if user has a virtual bank account set up
  const hasVirtualBankAccount = !!(virtualAccountDetails && virtualAccountDetails.length > 0);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [refetch]);

  const allocationState = allocationData?.allocationState;
  const primarySafe = safesData?.find((safe) => safe.safeType === 'primary');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Address copied to clipboard!');
      },
      (err) => {
        toast.error('Failed to copy address.');
        console.error('Could not copy text: ', err);
      },
    );
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
              {allocErrorMsg?.message ||
                'Could not fetch allocation details. Please try again later.'}
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
          <CardDescription>
            No allocation data found. Ensure your primary safe is set up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert
            variant="default"
            className="border-yellow-500/50 bg-yellow-50 text-yellow-800"
          >
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900">Safe Not Found</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Please set up your Primary Safe in Settings to start tracking
              allocations.
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
            <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
          </CardTitle>
          <CardDescription>
            Your account is ready to receive funds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Always show the Primary Safe with $0 */}
          <div className="grid grid-cols-1 gap-4">
            {/* Primary Safe Allocation - Always shown */}
            <div className="p-4 border rounded-md flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-foreground">Primary Account</p>
                  <p className="text-xl font-semibold text-foreground">$0.00</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your secure self-custodial bank account on Base network
                </p>
              </div>
            </div>
          </div>

          {/* Send Money Instructions - Use the component with hasVirtualBankAccount flag */}
          <AddFundsCTA
            safeAddress={primarySafe.safeAddress}
            onCopy={copyToClipboard}
            hasVirtualBankAccount={hasVirtualBankAccount}
          />
        </CardContent>
      </Card>
    );
  }

  // --- Main Content: Display Allocation Details ---

  const allocatedTax = formatBalance(allocationState?.allocatedTax);
  const allocatedLiquidity = formatBalance(allocationState?.allocatedLiquidity);
  const allocatedYield = formatBalance(allocationState?.allocatedYield);
  const lastUpdated = allocationState?.lastUpdated
    ? new Date(allocationState.lastUpdated).toLocaleString()
    : 'N/A';

  // Calculate the tax percentages
  const taxPercentage = '30%';
  const primaryPercentage = '60%';
  const yieldPercentage = '10%';

  // Check if all allocations are zero or undefined/null
  const isZeroAllocation =
    (!allocationState?.allocatedTax || allocationState.allocatedTax === '0') &&
    (!allocationState?.allocatedLiquidity ||
      allocationState.allocatedLiquidity === '0') &&
    (!allocationState?.allocatedYield ||
      allocationState.allocatedYield === '0');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-primary" /> Your Bank Account
        </CardTitle>
        <CardDescription>
          {isZeroAllocation
            ? 'Your account is ready for funding'
            : `Account balance and allocations. Last updated: ${lastUpdated}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isZeroAllocation ? (
          <>
            {/* Always show Primary Safe with $0 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-md flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground">
                      Primary Account
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      $0.00
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your secure self-custodial bank account on Base network
                  </p>
                </div>
              </div>
            </div>

            {/* Display CTA if allocation is zero, with hasVirtualBankAccount flag */}
            <AddFundsCTA
              safeAddress={primarySafe!.safeAddress}
              onCopy={copyToClipboard}
              hasVirtualBankAccount={hasVirtualBankAccount}
            />
          </>
        ) : (
          // Display Allocation Breakdown Grid if there are funds
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tax Allocation */}
            <div className="p-3 border rounded-md flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center mb-1">
                  <Landmark className="h-4 w-4 mr-1.5 text-blue-600" /> Tax
                  Reserve
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  ${allocatedTax}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {taxPercentage} of deposits
              </p>
            </div>

            {/* Primary Safe Allocation */}
            <div className="p-3 border rounded-md flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600 flex items-center mb-1">
                  <Wallet className="h-4 w-4 mr-1.5 text-green-600" /> Primary
                  Account
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  ${allocatedLiquidity}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {primaryPercentage} of deposits
              </p>
            </div>

            {/* Yield Allocation */}
            {/* <div className="p-3 border rounded-md flex flex-col justify-between">
               <div>
                 <p className="text-sm text-gray-600 flex items-center mb-1"><CircleDollarSign className="h-4 w-4 mr-1.5 text-yellow-600"/> Yield Strategies</p>
                 <p className="text-lg font-semibold text-gray-800">${allocatedYield}</p>
               </div>
               <p className="text-xs text-gray-500 mt-1">{yieldPercentage} of deposits</p> 
             </div> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}