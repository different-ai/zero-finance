'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, AlertCircle, ArrowRight, Landmark, CircleDollarSign, Wallet } from 'lucide-react';
import { base } from 'viem/chains';
import {
    type Address,
    type Hex,
    getAddress as viemGetAddress,
    isAddress,
    parseUnits,
    formatUnits
} from 'viem';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { type AllocationStrategy } from '@/db/schema';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { type MetaTransactionData } from '@safe-global/safe-core-sdk-types';

const USDC_DECIMALS = 6;

interface AllocationStatus {
  strategy: AllocationStrategy[];
  balances: {
    [safeType: string]: { 
        address: Address;
        actualWei: string;
        targetWei: string;
        deltaWei: string;
    }
  };
  totalBalanceWei: string;
  totalUnallocatedWei: string;
}

interface AllocationFundsProps {
  primarySafeAddress?: Address;
  allocationStatus: AllocationStatus;
  onSuccess: () => void;
}

type PreparedTransaction = MetaTransactionData;

function formatBalance(weiString: string | undefined | null): string {
  if (!weiString) return '0.00';
  try {
    const formatted = formatUnits(BigInt(weiString), USDC_DECIMALS);
    const num = parseFloat(formatted);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  } catch (e) {
    console.error("Error formatting balance:", weiString, e);
    return '0.00';
  }
}

export function AllocationFunds({
  primarySafeAddress,
  allocationStatus,
  onSuccess
}: AllocationFundsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { send: sendWithRelay, ready: relayReady } = useSafeRelay(primarySafeAddress);

  const prepareAllocationMutation = api.allocations.prepareAllocation.useMutation({
      onError: (error) => {
          setError(`Failed to prepare allocation: ${error.message}`);
          toast.error(`Preparation failed: ${error.message}`);
          setMessage(null);
      },
  });

  let toastId: string | number | undefined;

  const handleAllocate = async () => {
    setError(null);
    setMessage('Starting allocation process...');
    toastId = toast.loading('Initiating allocation...');

    if (!primarySafeAddress || !isAddress(primarySafeAddress)) {
      setError('Primary safe address is missing or invalid.');
      toast.error('Primary safe address missing', { id: toastId });
      setMessage(null);
      return;
    }

    try {
        toast.loading('Preparing allocation transactions...', { id: toastId });

        const result = await prepareAllocationMutation.mutateAsync(); 
        const preparedTransactions: MetaTransactionData[] = result.transactions as MetaTransactionData[];

        if (!preparedTransactions || preparedTransactions.length === 0) {
            toast.info('Funds already properly allocated.', { id: toastId });
            setMessage('Your funds are already properly allocated according to your strategy.');
            onSuccess();
            return;
        }

        if (!relayReady) {
            throw new Error('Smart wallet relay service is not ready. Ensure your wallet is connected and configured.');
        }

        toast.loading('Relaying allocation transaction(s)...', { id: toastId });
        
        const userOpHash: Hex = await sendWithRelay(preparedTransactions);

        toast.success(`Allocation transaction(s) relayed successfully!`, { 
            id: toastId, 
            description: `UserOp Hash: ${userOpHash.substring(0, 10)}...` 
        });
        setMessage('Your allocation request has been sent and will be processed shortly.');
        onSuccess();

    } catch (err: any) {
      console.error('Error processing allocation via relay:', err);
      const prepErrorMsg = prepareAllocationMutation.error?.message;
      const relayErrorMsg = err instanceof Error ? err.message : 'An unknown error occurred during allocation relay';
      const errorMsgToShow = prepErrorMsg || relayErrorMsg;

      if (toastId) {
          if (!prepErrorMsg || prepErrorMsg !== relayErrorMsg) {
              toast.error(errorMsgToShow, { id: toastId });
          }
      } else {
          toast.error(errorMsgToShow);
      }
      
      setError(errorMsgToShow);
      setMessage(null);
    }
  };

  const { strategy, balances, totalUnallocatedWei } = allocationStatus;
  const unallocatedAmountFormatted = formatBalance(totalUnallocatedWei);
  const hasUnallocatedFunds = parseFloat(unallocatedAmountFormatted) > 0;
  
  const getPercentage = (type: string) => strategy.find(s => s.destinationSafeType === type)?.percentage ?? 0;
  const displayStrategy = strategy.filter(s => s.destinationSafeType !== 'primary');

  return (
    <div className="space-y-4">
      {message && <Alert variant="default"><AlertDescription>{message}</AlertDescription></Alert>}
      {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      
      {hasUnallocatedFunds ? (
        <div className="border rounded-lg p-4 shadow-sm bg-amber-50 border-amber-200">
          <div className="flex justify-between items-center mb-3">
              <div>
                 <h3 className="text-lg font-semibold text-amber-900">Allocate Funds</h3>
                 <p className="text-sm text-amber-700">
                    You have <span className="font-bold">${unallocatedAmountFormatted} USDC</span> ready to allocate according to your strategy.
                 </p>
              </div>
             <Button 
                onClick={handleAllocate}
                className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
                disabled={!relayReady || prepareAllocationMutation.isPending || !primarySafeAddress}
                size="sm"
             >
                {prepareAllocationMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Allocating...</>
                ) : (
                <>Allocate Now <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
             </Button>
          </div>
          
          <div className="bg-white/50 rounded p-3 mb-3 border border-amber-100">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Allocation Targets Based on Strategy:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {displayStrategy.map(rule => {
                  let IconComponent = Wallet;
                  let iconColor = 'text-gray-600';
                  let name = 'Unknown';
                  switch (rule.destinationSafeType) {
                    case 'tax': IconComponent = Landmark; iconColor = 'text-blue-600'; name = 'Tax Safe'; break;
                    case 'yield': IconComponent = CircleDollarSign; iconColor = 'text-yellow-600'; name = 'Yield Safe'; break;
                  }
                  const targetAmountDisplay = (parseFloat(unallocatedAmountFormatted) * rule.percentage / 100).toFixed(2);

                  return (
                      <React.Fragment key={rule.destinationSafeType}>
              <div className="flex items-center">
                            <IconComponent className={`h-3.5 w-3.5 mr-1.5 ${iconColor}`}/>
                            <span className="text-gray-700">{name} ({rule.percentage}%)</span>
              </div>
              <div>
                            <span className="font-medium">~${targetAmountDisplay}</span>
              </div>
                      </React.Fragment>
                  );
              })}
              <div className="flex items-center">
                <Wallet className="h-3.5 w-3.5 mr-1.5 text-green-600"/>
                 <span className="text-gray-700">Primary Safe ({getPercentage('primary')}%)</span>
              </div>
              <div>
                 <span className="font-medium">(Receives remaining)</span>
              </div>
            </div>
          </div>
          {!relayReady && primarySafeAddress &&
              <p className="text-xs text-orange-600 mt-2 text-center">Relay service not ready. Check wallet connection.</p>
          }
        </div>
      ) :
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <p className="text-green-700 text-center">
            All your funds are properly allocated according to your strategy. Great job!
          </p>
        </div>
      }
    </div>
  );
} 