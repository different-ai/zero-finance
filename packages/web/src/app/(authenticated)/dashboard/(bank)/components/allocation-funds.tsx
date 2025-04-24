'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, AlertCircle, ArrowRight, Landmark, CircleDollarSign, Wallet } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import { base } from 'viem/chains';
import {
    createPublicClient,
    http,
    Address,
    TransactionReceipt,
    Hex,
    getAddress as viemGetAddress,
    isAddress,
    parseUnits,
    formatUnits
} from 'viem';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

const USDC_DECIMALS = 6;

interface AllocationFundsProps {
  primarySafeAddress?: string;
  initialTaxAmount: string;
  initialYieldAmount: string;
  unallocatedAmount: string; // New prop for showing unallocated amount
  onSuccess: () => void;
}

interface PreparedTransaction {
  to: string;
  value: string;
  data: string;
}

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL;

export function AllocationFunds({
  primarySafeAddress,
  initialTaxAmount,
  initialYieldAmount,
  unallocatedAmount,
  onSuccess
}: AllocationFundsProps) {
  const { wallets } = useWallets();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const prepareAllocationMutation = api.allocations.prepareAllocation.useMutation({
    onError: (err) => {
      console.error('Error preparing allocation:', err);
      const message = err.message ?? 'Failed to prepare allocation.';
      setError(message);
      toast.error(message);
    }
  });

  const handleAllocate = async () => {
    setError(null);
    setMessage(null);
    const toastId = toast.loading("Starting allocation...");

    if (!primarySafeAddress || !isAddress(primarySafeAddress)) {
      const errMsg = 'Primary Safe address is missing or invalid.';
      toast.error(errMsg, { id: toastId });
      setError(errMsg);
      return;
    }

    // Use the initialTaxAmount and initialYieldAmount directly
    let taxWei: string;
    let yieldWei: string;
    try {
        taxWei = parseUnits(initialTaxAmount, USDC_DECIMALS).toString();
        yieldWei = parseUnits(initialYieldAmount, USDC_DECIMALS).toString();
    } catch (parseError) {
        const errMsg = 'Invalid number format for amount.';
        toast.error(errMsg, { id: toastId });
        setError(errMsg);
        return;
    }

    const checksummedSafeAddress = viemGetAddress(primarySafeAddress);

    const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
    if (!embeddedWallet || !BASE_RPC_URL) {
        const errMsg = 'Privy embedded wallet or RPC URL not available.';
        toast.error(errMsg, { id: toastId });
        setError(errMsg);
        return;
    }

    try {
        if (embeddedWallet.chainId !== `eip155:${base.id}`) {
            toast.loading("Requesting network switch to Base...", { id: toastId });
            await embeddedWallet.switchChain(base.id);
            toast.loading("Network switched. Initializing allocation...", { id: toastId });
        }

        toast.loading('Preparing allocation transactions...', { id: toastId });

        const result = await prepareAllocationMutation.mutateAsync({
          allocatedTax: taxWei,
          allocatedYield: yieldWei,
          allocatedLiquidity: '0',
        });

        const preparedTransactions: PreparedTransaction[] = result.transactions;

        if (!preparedTransactions || preparedTransactions.length === 0) {
            toast.info('Funds already properly allocated.', { id: toastId });
            setMessage('Your funds are already properly allocated according to your strategy.');
            onSuccess();
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
            const txResponse = await executeTxResponse.transactionResponse;
            if (txResponse && typeof txResponse === 'object' && 'hash' in txResponse && typeof txResponse.hash === 'string') {
                txHash = txResponse.hash as Hex;
            }
        }

        if (!txHash) {
            toast.info('Transaction proposed to Safe. Please confirm in your wallet.', { id: toastId });
            setMessage('Transaction proposed. Check your Safe app or wallet to execute.');
            onSuccess();
            return;
        }

        toast.loading(`Confirming allocation (Hash: ${txHash.substring(0,10)}...)`, { id: toastId });
        const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
          toast.success(`Allocation successful!`, { id: toastId, description: `Tx: ${receipt.transactionHash}` });
          setMessage('Your funds have been successfully allocated according to your strategy!');
          onSuccess();
        } else {
          throw new Error(`Transaction reverted. Hash: ${receipt.transactionHash}`);
        }

    } catch (err: any) {
      console.error('Error processing allocation:', err);
      const errorMsg = prepareAllocationMutation.error?.message || (err instanceof Error ? err.message : 'An unknown error occurred during allocation');

      if (!prepareAllocationMutation.isError || prepareAllocationMutation.error?.message !== errorMsg) {
        toast.error(errorMsg, { id: toastId });
      }
      setError(errorMsg);
      setMessage(null);
    }
  };

  // Format the unallocated amount for display
  const formattedUnallocated = parseFloat(unallocatedAmount || '0').toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Determine if we have unallocated funds to show the button
  const hasUnallocatedFunds = unallocatedAmount && parseFloat(unallocatedAmount) > 0;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {message && !error && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-700 text-sm">{message}</AlertDescription>
        </Alert>
      )}
      
      {hasUnallocatedFunds ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium text-amber-800">Unallocated Funds Detected</h3>
          </div>
          <p className="text-amber-700 mb-2">
            You have <span className="font-bold">${formattedUnallocated}</span> USDC in your primary safe that hasn&apos;t been allocated according to your strategy.
          </p>
          
          <div className="bg-white/50 rounded p-3 mb-3 border border-amber-100">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Where Funds Will Go:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Landmark className="h-3.5 w-3.5 mr-1.5 text-blue-600"/>
                <span className="text-gray-700">Tax Safe (30%)</span>
              </div>
              <div>
                <span className="font-medium">${(parseFloat(formattedUnallocated) * 0.3).toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <CircleDollarSign className="h-3.5 w-3.5 mr-1.5 text-yellow-600"/>
                <span className="text-gray-700">Yield Safe (10%)</span>
              </div>
              <div>
                <span className="font-medium">${(parseFloat(formattedUnallocated) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="h-3.5 w-3.5 mr-1.5 text-green-600"/>
                <span className="text-gray-700">Primary Safe (60%)</span>
              </div>
              <div>
                <span className="font-medium">${(parseFloat(formattedUnallocated) * 0.6).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleAllocate}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            disabled={prepareAllocationMutation.isPending || !primarySafeAddress}
          >
            {prepareAllocationMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Allocating Funds...</>
            ) : (
              <>Allocate Funds Now <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <p className="text-green-700 text-center">
            All your funds are properly allocated according to your strategy. Great job!
          </p>
        </div>
      )}
    </div>
  );
} 