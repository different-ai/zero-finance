'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, Circle } from 'lucide-react';
import { useUserSafes } from '@/hooks/use-user-safes';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function SafeCard() {
  const { data: safes, isLoading, isError, error: fetchError } = useUserSafes('solana');
  const { 
    data: countFundingSources, 
    refetch: refetchCountFundingSources, 
    isError: isCountFundingSourcesError,
    error: countFundingSourcesError,
    isLoading: isLoadingCountFundingSources
  } =
    api.fundingSource.countFundingSources.useQuery({
      network: 'solana',
    }, {
      enabled: !isError && !isLoading,
    });

  const [isRequestingAccount, setRequestingAccount] = useState(false);
  const [isCreatingSafe, setCreatingSafe] = useState(false);

  const solanaCreateSafeMutation = api.solana.createSafe.useMutation()
  const requestAccountMutation = api.align.requestVirtualAccount.useMutation();

  const handleCreateSafe = async () => {
    if (isCreatingSafe || !safes || safes.length > 0) return;
    setCreatingSafe(true);
    try {
      await solanaCreateSafeMutation.mutateAsync();
      await refetchCountFundingSources();
      toast.success('Solana Safe created successfully!');
    } catch (error) {
      console.error('Error creating Solana Safe:', error);
      toast.error('Failed to create Solana Safe. Please try again.');
    } finally {
      setCreatingSafe(false);
    }
  };  

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

  if (isLoading || isLoadingCountFundingSources) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  if( isError || isCountFundingSourcesError) { 
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-10">
          <p className="text-red-500">Error loading Solana Safe Data: {(fetchError || countFundingSourcesError)?.message}</p>
        </CardContent>
      </Card>
    );
  }

  const hasSafes = safes && safes.length > 0;
  const solanaBankAccountCreated = (countFundingSources || 0) >  0;

  const safeContent = {
    title: hasSafes ? 'Your Solana Safe is ready!' : 'Create your Solana Safe',
    description: hasSafes
      ? 'You can now manage your Solana assets securely.'
      : 'Set up your Solana Safe to start managing your assets securely.',
    icon: hasSafes ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400" />
    ),
    button: !hasSafes ? (
      <Button 
        size="sm" 
        onClick={handleCreateSafe}
        disabled={!safes || safes.length > 0 || isCreatingSafe}
        className="w-full sm:w-auto"
      >
        {isCreatingSafe ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Set Up Safe'
        )}
      </Button>
    ) : null,
  };

  const bankAccountContent = {
    disabled: !hasSafes,
    icon: solanaBankAccountCreated ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400" />
    ),
    title: 'Create Virtual Bank Account',
    description: solanaBankAccountCreated
        ? 'Your virtual bank accounts are set up and ready to use.'
        : 'Set up virtual bank accounts to receive USD and EUR payments that automatically convert to stablecoins.',
    button:
      hasSafes && !solanaBankAccountCreated ? (
        <Button 
          size="sm" 
          onClick={handleRequestVirtualAccount}
          disabled={!safes || safes.length === 0 || isRequestingAccount}
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
      ) : null,
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Create your solana safe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Step 1: Create Solana Safe */}
        <div
          className={'flex flex-col sm:flex-row items-start gap-3 sm:gap-4'}
        >
          <div className="flex items-start gap-3 flex-1 w-full">
            <div className="flex-shrink-0 mt-0.5">{safeContent.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{`1. ${safeContent.title}`}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {safeContent.description}
              </p>
            </div>
          </div>
          {safeContent.button && (
            <div className="flex-shrink-0 w-full sm:w-auto ml-9 sm:ml-0">
              {safeContent.button}
            </div>
          )}
        </div>

        {/* Step 2: Create Virtual Bank Account */}
        <div
          className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${
            bankAccountContent.disabled ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-start gap-3 flex-1 w-full">
            <div className="flex-shrink-0 mt-0.5">{bankAccountContent.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{`2. ${bankAccountContent.title}`}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {bankAccountContent.description}
              </p>
            </div>
          </div>
          {bankAccountContent.button && (
            <div className="flex-shrink-0 w-full sm:w-auto ml-9 sm:ml-0">
              {bankAccountContent.button}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 