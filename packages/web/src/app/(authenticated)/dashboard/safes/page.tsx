'use client';

import React from 'react';
import { useUserSafes } from '@/hooks/use-user-safes';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Building, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatUnits } from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants'; // Corrected path assumed
import { type Address } from 'viem';
import { shortenAddress } from '@/lib/utils/formatters';

// Component to display balance, handling loading/error states
function SafeBalance({ safeAddress }: { safeAddress: Address }) {
  const { data, isLoading, isError, error } = trpc.safe.getBalance.useQuery(
    {
      safeAddress: safeAddress,
      tokenAddress: USDC_ADDRESS,
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Don't retry aggressively on error
    },
  );

  if (isLoading) {
    return <span className="text-xs text-gray-500">(Loading balance...)</span>;
  }
  if (isError) {
    console.error(`Balance fetch error for ${safeAddress}:`, error);
    return <span className="text-xs text-red-500">(Error)</span>;
  }
  if (data) {
    return (
      <span className="font-mono text-sm">
        {formatUnits(data.balance, USDC_DECIMALS)} USDC
      </span>
    );
  }
  return <span className="text-xs text-gray-500">(N/A)</span>;
}

export default function SafesListPage() {
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading your accounts...</span>
      </div>
    );
  }

  if (isError || !safes) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Accounts</AlertTitle>
        <AlertDescription>
          {fetchError?.message ||
            'Could not fetch your account details. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your Fund Accounts</h1>
      <CardDescription>View balances and manage funds in your Zero Finance accounts.</CardDescription>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safes.map((safe) => (
          <Card key={safe.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <span className="capitalize">{safe.safeType} Account</span>
              </CardTitle>
              <CardDescription className="font-mono text-xs pt-1 break-all">
                {shortenAddress(safe.safeAddress)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">Balance:</p>
                <SafeBalance safeAddress={safe.safeAddress as Address} />
              </div>
              <Link href={`/dashboard/safes/${safe.safeAddress}`} passHref legacyBehavior>
                <Button variant="outline" size="sm" className="w-full">
                  Manage & Transfer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {safes.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No accounts found for your account.
        </p>
      )}
    </div>
  );
} 