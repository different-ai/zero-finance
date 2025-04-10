'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
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
    parseUnits
} from 'viem';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

const USDC_DECIMALS = 6;

interface ManualAllocationFormProps {
  primarySafeAddress?: string;
  initialTaxAmount: string;
  initialYieldAmount: string;
  onSuccess: () => void;
}

interface PreparedTransaction {
  to: string;
  value: string;
  data: string;
}

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL;

export function ManualAllocationForm({
  primarySafeAddress,
  initialTaxAmount,
  initialYieldAmount,
  onSuccess
}: ManualAllocationFormProps) {
  const { wallets } = useWallets();

  const [targetTaxAmount, setTargetTaxAmount] = useState(initialTaxAmount);
  const [targetYieldAmount, setTargetYieldAmount] = useState(initialYieldAmount);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const toastId = toast.loading("Starting allocation...");

    if (!primarySafeAddress || !isAddress(primarySafeAddress)) {
      const errMsg = 'Primary Safe address is missing or invalid.';
      toast.error(errMsg, { id: toastId });
      setError(errMsg);
      return;
    }

    if (!validateNumber(targetTaxAmount) || !validateNumber(targetYieldAmount)) {
      const errMsg = 'Invalid input amounts. Please enter valid numbers.';
      toast.error(errMsg, { id: toastId });
      setError(errMsg);
      return;
    }

    let taxWei: string;
    let yieldWei: string;
    try {
        taxWei = parseUnits(targetTaxAmount, USDC_DECIMALS).toString();
        yieldWei = parseUnits(targetYieldAmount, USDC_DECIMALS).toString();
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
            toast.info('No allocation transfer needed based on the provided amounts.', { id: toastId });
            setMessage('Current allocations match target amounts. No transaction required.');
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

        toast.loading('Creating transaction batch...', { id: toastId });
        const safeTransaction = await safeSdk.createTransaction({ transactions: preparedTransactions });

        toast.loading('Executing transaction via Safe...', { id: toastId });
        const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);

        let txHash: Hex | undefined = undefined;
        if (executeTxResponse.transactionResponse) {
            const txResponse = await executeTxResponse.transactionResponse;
            if (txResponse && typeof txResponse === 'object' && 'hash' in txResponse && typeof txResponse.hash === 'string') {
                txHash = txResponse.hash as Hex;
            }
        }

        if (!txHash) {
            toast.info('Transaction proposed to Safe. Please confirm in your Safe app.', { id: toastId });
            setMessage('Transaction proposed. Check your Safe app or wallet to execute.');
            onSuccess();
            return;
        }

        toast.loading(`Waiting for confirmation (Hash: ${txHash.substring(0,10)}...)`, { id: toastId });
        const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
          toast.success(`Allocation successful!`, { id: toastId, description: `Tx: ${receipt.transactionHash}` });
          setMessage('Allocation completed successfully!');
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

  const validateNumber = (value: string): boolean => {
    if (value === '') return true;
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  };

  const isTaxValid = validateNumber(targetTaxAmount);
  const isYieldValid = validateNumber(targetYieldAmount);
  const isFormValidForSubmission = targetTaxAmount !== '' && isTaxValid &&
                                   targetYieldAmount !== '' && isYieldValid;

  const isSubmitting = prepareAllocationMutation.isPending;

  return (
    <div className="w-full space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && !error && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <Label htmlFor="tax" className="text-sm text-gray-600">Target Tax Allocation (USDC)</Label>
               <Input
                 id="tax"
                 value={targetTaxAmount}
                 onChange={(e) => setTargetTaxAmount(e.target.value)}
                 placeholder="Enter amount (USD)"
                 type="number"
                 step="0.01"
                 min="0"
                 className={!isTaxValid && targetTaxAmount !== '' ? "border-red-500" : ""}
                 disabled={isSubmitting}
                />
                {!isTaxValid && targetTaxAmount !== '' && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid non-negative number.</p>
                )}
             </div>

             <div>
               <Label htmlFor="yield" className="text-sm text-gray-600">Target Yield Allocation (USDC)</Label>
               <Input
                  id="yield"
                  value={targetYieldAmount}
                  onChange={(e) => setTargetYieldAmount(e.target.value)}
                  placeholder="Enter amount (USD)"
                  type="number"
                  step="0.01"
                  min="0"
                  className={!isYieldValid && targetYieldAmount !== '' ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                 {!isYieldValid && targetYieldAmount !== '' && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid non-negative number.</p>
                )}
             </div>
           </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1 text-black"
              disabled={isSubmitting || !isFormValidForSubmission || !primarySafeAddress}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                'Prepare Allocation'
              )}
            </Button>
          </div>

          {!primarySafeAddress && !isSubmitting && (
              <p className="text-xs text-orange-500 text-center">Primary Safe address not loaded. Cannot prepare allocation.</p>
          )}
          <p className="text-xs text-gray-500 text-center">
            Enter the target total USD amounts for each safe. Clicking &apos;Prepare Allocation&apos; will calculate the required transfers from your primary safe and propose a transaction for you to approve and execute via your Safe app.
          </p>
        </form>
    </div>
  );
} 