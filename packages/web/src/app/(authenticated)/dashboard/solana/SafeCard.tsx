'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useUserSafes } from '@/hooks/use-user-safes';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function SafeCard() {
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes();
  const { data: countFundingSources, refetch: refetchCountFundingSources,  isLoading: isLoadingCountFundingSources } =
    api.fundingSource.countFundingSources.useQuery({
      network: 'solana',
    }, {
      enabled: !isError && !isLoading,
    });

  const [isRequestingAccount, setRequestingAccount] = useState(false);

  const requestAccountMutation = api.align.requestVirtualAccount.useMutation();
  
  const handleRequestVirtualAccount = async () => {
    const safeAddress = safes?.[0]?.safeAddress;
    if (!safeAddress) {
      toast.error('No safe address found. Please create a Solana Safe first.');
      return;
    }
    setRequestingAccount(true);
    try {
      await requestAccountMutation.mutateAsync({
        sourceCurrency: 'usd',
        destinationToken: 'usdc',
        destinationNetwork: 'solana',
        destinationAddress: safeAddress,
      });
      await refetchCountFundingSources();
    } catch (error) {
      console.error('Error creating virtual account:', error);
      toast.error('Failed to create virtual account. Please try again.');
    } finally {
      setRequestingAccount(false);
    }
  };

  const solanaSafeCreated = (countFundingSources || 0) >  0;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-10">
        {
          isLoading || isLoadingCountFundingSources ? (
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-lg">Loading your Solana Safe...</span>
            </div>
          ) : isError ? (
            <p className="text-red-500">Error loading Solana Safe: {fetchError.message}</p>
          ) : solanaSafeCreated ? (
            <p className="text-green-500">Your Solana Safe is ready!</p>
          ) : (
            <div
              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4"
            >
            <div className="flex items-start gap-3 flex-1 w-full">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  Create Virtual Bank Account
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Set up virtual bank accounts to receive USD and EUR payments that automatically convert to stablecoins.
                </p>
              </div>
            </div>
              <Button 
                size="sm" 
                onClick={handleRequestVirtualAccount}
                disabled={isRequestingAccount}
                className="w-full sm:w-auto"
              >
                {isRequestingAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Set Up Account'
                )}
              </Button>
            </div>
          )
        }
      </CardContent>
    </Card>
  );
} 