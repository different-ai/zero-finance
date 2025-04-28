'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, AlertCircle, ArrowRight, Landmark, CircleDollarSign, Wallet } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import { base } from 'viem/chains';
import {
    createPublicClient,
    http,
    type Address,
    type TransactionReceipt,
    type Hex,
    getAddress as viemGetAddress,
    isAddress,
    parseUnits,
    formatUnits
} from 'viem';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { type AllocationStrategy } from '@/db/schema'; // Import AllocationStrategy type

const USDC_DECIMALS = 6;
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || base.rpcUrls.default.http[0];

// Define the structure for the allocation status passed as props
// Re-define or import if defined centrally
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

// Updated Props interface for AllocationFunds
interface AllocationFundsProps {
  primarySafeAddress?: Address;
  allocationStatus: AllocationStatus; // Receive the full status object
  onSuccess: () => void;
}

type PreparedTransaction = {
    to: Address;
    value: string;
    data: Hex;
};

// Helper to format balance strings (wei to decimal)
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
  const { wallets } = useWallets();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prepareAllocationMutation = api.allocations.prepareAllocation.useMutation({
      onError: (error) => {
          setError(`Failed to prepare allocation: ${error.message}`);
          toast.error(`Preparation failed: ${error.message}`);
          setMessage(null);
      },
      // onSuccess handled within handleAllocate
  });

  const handleAllocate = async () => {
    setError(null);
    setMessage('Starting allocation process...');
    const toastId = toast.loading('Initiating allocation...');

    if (!primarySafeAddress || !isAddress(primarySafeAddress)) {
      setError('Primary safe address is missing or invalid.');
      toast.error('Primary safe address missing', { id: toastId });
      return;
    }

    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
    if (!embeddedWallet) {
      setError('Privy wallet not connected.');
      toast.error('Privy wallet not found', { id: toastId });
      return;
    }
    
    let checksummedSafeAddress: Address;
    try {
      checksummedSafeAddress = viemGetAddress(primarySafeAddress);
    } catch (e) {
        setError('Invalid primary safe address format.');
        toast.error('Invalid safe address format', { id: toastId });
        return;
    }

    try {
        if (embeddedWallet.chainId !== `eip155:${base.id}`) {
            toast.loading("Requesting network switch to Base...", { id: toastId });
            await embeddedWallet.switchChain(base.id);
            toast.loading("Network switched. Initializing allocation...", { id: toastId });
        }

        toast.loading('Preparing allocation transactions...', { id: toastId });

        // Call prepareAllocation without input
        const result = await prepareAllocationMutation.mutateAsync(); 

        const preparedTransactions: PreparedTransaction[] = result.transactions;

        if (!preparedTransactions || preparedTransactions.length === 0) {
            toast.info('Funds already properly allocated.', { id: toastId });
            setMessage('Your funds are already properly allocated according to your strategy.');
            onSuccess(); // Call success even if no tx needed
            return;
        }

        toast.loading('Initializing Safe SDK...', { id: toastId });
        const ethereumProvider = await embeddedWallet.getEthereumProvider();
        if (!ethereumProvider) throw new Error('Could not get Ethereum provider from wallet');

        const signerAddress = embeddedWallet.address as Address;

        const publicClient = createPublicClient({
            chain: base,
            transport: http(BASE_RPC_URL)
        });

        const safeSdk = await Safe.init({
            provider: ethereumProvider as Eip1193Provider,
            signer: signerAddress,
            safeAddress: checksummedSafeAddress
        });

        toast.loading('Creating allocation transaction...', { id: toastId });
        const safeTransaction = await safeSdk.createTransaction({ transactions: preparedTransactions });

        toast.loading('Executing allocation via Safe...', { id: toastId });
        const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);

        let txHash: Hex | undefined = undefined;
        if (executeTxResponse.transactionResponse) {
            // Handle potential promise or direct object
            const txResponse = await executeTxResponse.transactionResponse;
            if (txResponse && typeof txResponse === 'object' && 'hash' in txResponse && typeof txResponse.hash === 'string') {
                txHash = txResponse.hash as Hex;
            }
        }

        if (!txHash) {
            // If no immediate hash (e.g., requires more sigs), inform user
            toast.info('Transaction proposed to Safe. Please confirm in your wallet/Safe app.', { id: toastId, duration: 5000 });
            setMessage('Transaction proposed. Check your Safe app or wallet to execute.');
            onSuccess(); // Call success as the process initiated
            return;
        }

        toast.loading(`Confirming allocation (Tx: ${txHash.substring(0,10)}...)`, { id: toastId });
        const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
          toast.success(`Allocation successful!`, { id: toastId, description: `Tx: ${receipt.transactionHash}` });
          setMessage('Your funds have been successfully allocated according to your strategy!');
          onSuccess(); // Call success handler on confirmed transaction
        } else {
          throw new Error(`Transaction reverted. Hash: ${receipt.transactionHash}`);
        }

    } catch (err: any) {
      console.error('Error processing allocation:', err);
      const errorMsg = prepareAllocationMutation.error?.message || (err instanceof Error ? err.message : 'An unknown error occurred during allocation');
      
      // Avoid duplicate toasts if preparation failed
      if (!prepareAllocationMutation.isError || prepareAllocationMutation.error?.message !== errorMsg) {
          toast.error(errorMsg, { id: toastId });
      }
      setError(errorMsg);
      setMessage(null);
    }
  };

  const { strategy, balances, totalUnallocatedWei } = allocationStatus;
  const unallocatedAmountFormatted = formatBalance(totalUnallocatedWei);
  const hasUnallocatedFunds = parseFloat(unallocatedAmountFormatted) > 0;
  
  // Get strategy percentage for a given type
  const getPercentage = (type: string) => strategy.find(s => s.destinationSafeType === type)?.percentage ?? 0;

  // Filter strategy to only include types relevant for display here (non-primary)
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
                disabled={prepareAllocationMutation.isPending || !primarySafeAddress}
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
                    // Add liquidity case if needed
                  }
                  // Calculate approximate amount based on unallocated portion for display
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
              {/* Optionally show Primary safe target percentage if desired */}
              <div className="flex items-center">
                 <Wallet className="h-3.5 w-3.5 mr-1.5 text-green-600"/>
                 <span className="text-gray-700">Primary Safe ({getPercentage('primary')}%)</span>
              </div>
              <div>
                 <span className="font-medium">(Receives remaining)</span>
              </div>
            </div>
          </div>

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