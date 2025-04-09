'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import { CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
// import { ethers } from 'ethers'; // Removed
import Safe from '@safe-global/protocol-kit';
// import SafeApiKit from '@safe-global/api-kit'; // Removed
// import { ViemAdapter } from '@safe-global/safe-viem-lib'; // Not needed with Safe.init
import { base } from 'viem/chains'; 
import { 
    createPublicClient, 
    createWalletClient, 
    http, 
    custom, 
    Address, 
    TransactionReceipt, 
    Hex, 
    getAddress as viemGetAddress, // Use viem's getAddress
    isAddress
} from 'viem';
// import { getAddress } from 'ethers/lib/utils'; // Removed
import { toast } from 'sonner';

interface ManualAllocationFormProps {
  primarySafeAddress?: string; 
  taxCurrent: string;
  liquidityCurrent: string;
  yieldCurrent: string;
  onSuccess: () => void; 
}

// Structure for Safe transactions prepared by the API
interface PreparedTransaction {
  to: string;
  value: string;
  data: string;
}

// Assume Base RPC URL is available from env
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL;

export function ManualAllocationForm({ 
  primarySafeAddress,
  taxCurrent, 
  liquidityCurrent, 
  yieldCurrent, 
  onSuccess 
}: ManualAllocationFormProps) {
  const { getAccessToken } = usePrivy();
  const { wallets } = useWallets(); 
  
  const [tax, setTax] = useState(taxCurrent);
  const [liquidity, setLiquidity] = useState(liquidityCurrent);
  const [yield_, setYield] = useState(yieldCurrent);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
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
    
    const checksummedSafeAddress = viemGetAddress(primarySafeAddress); // Use viem checksum

    const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
    if (!embeddedWallet || !BASE_RPC_URL) {
        const errMsg = 'Privy embedded wallet or RPC URL not available.';
        toast.error(errMsg, { id: toastId });
        setError(errMsg);
        return;
    }

    setIsSubmitting(true);
    
    try {
        // 0. Ensure wallet is on Base
        if (embeddedWallet.chainId !== `eip155:${base.id}`) {
            toast.loading("Requesting network switch to Base...", { id: toastId });
            await embeddedWallet.switchChain(base.id);
        }

        // 1. Call API to prepare transactions
        toast.loading('Preparing allocation transactions...', { id: toastId });
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error('Authentication token required');
        }
        const response = await fetch('/api/allocations/manual', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            allocatedTax: tax,
            allocatedLiquidity: liquidity,
            allocatedYield: yield_
          })
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success || !result.transactions) {
          throw new Error(result.error || 'Failed to prepare allocation transactions');
        }

        const preparedTransactions: PreparedTransaction[] = result.transactions;

        if (preparedTransactions.length === 0) {
            toast.info('No allocation needed based on the provided amounts.', { id: toastId });
            setIsSubmitting(false);
            return;
        }

        // 2. Prepare Viem clients for Safe SDK
        toast.loading('Initializing Safe SDK...', { id: toastId });
        const ethereumProvider = await embeddedWallet.getEthereumProvider(); // Fix typo
        if (!ethereumProvider) throw new Error('Could not get Ethereum provider from wallet');
        
        // Use embedded wallet address as signer address
        const signerAddress = embeddedWallet.address as Address; 
        
        // Public client for reading data
        const publicClient = createPublicClient({ 
            chain: base, 
            transport: http(BASE_RPC_URL) 
        });
        
        // Initialize Safe SDK using the init method (like in SwapCard)
        const safeSdk = await Safe.init({ 
            provider: ethereumProvider, // Pass raw provider
            signer: signerAddress,      // Pass signer address
            safeAddress: checksummedSafeAddress 
        });

        // 3. Create and Execute Safe Transaction Batch
        toast.loading('Creating transaction batch...', { id: toastId });
        const safeTransaction = await safeSdk.createTransaction({ transactions: preparedTransactions });

        toast.loading('Executing transaction via Safe...', { id: toastId });
        const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
        
        // Extract hash carefully, checking transactionResponse exists and has a hash
        let txHash: Hex | undefined = undefined;
        if (executeTxResponse.transactionResponse) {
            const txResponse = await executeTxResponse.transactionResponse; // Await the promise
            // Check if the awaited response has a hash property
            if (txResponse && typeof txResponse === 'object' && 'hash' in txResponse && typeof txResponse.hash === 'string') {
                txHash = txResponse.hash as Hex;
            }
        }

        if (!txHash) {
            // This case might happen if execute involves off-chain signing first
            // or the SDK version behaves differently. Assume proposal occurred.
            toast.info('Transaction submitted to Safe (confirmation/execution may follow).', { id: toastId });
            setMessage('Transaction submitted. Check your Safe app or wallet.');
            onSuccess(); // Trigger refresh maybe?
            return; 
        }
        
        toast.loading(`Waiting for confirmation (Hash: ${txHash.substring(0,10)}...)`, { id: toastId });
        const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        if (receipt.status === 'success') {
          toast.success(`Allocation successful!`, { id: toastId, description: `Tx: ${receipt.transactionHash}` });
          setMessage('Allocation completed successfully!');
          onSuccess(); // Refresh data on success
        } else {
          throw new Error(`Transaction reverted. Hash: ${receipt.transactionHash}`);
        }
        
    } catch (err) {
      console.error('Error processing allocation:', err);
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred during allocation';
      toast.error(errorMsg, { id: toastId });
      setError(errorMsg);
      setMessage(null); 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const checkForDeposits = async () => { // Keep definition but maybe remove button later?
    setError(null);
    setMessage('Checking for USDC deposits...');
    setIsChecking(true);
    
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch('/api/allocations/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ checkDeposits: true })
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Failed to check for deposits');
      
      if (result.data) {
        setTax(result.data.allocatedTax || tax);
        setLiquidity(result.data.allocatedLiquidity || liquidity);
        setYield(result.data.allocatedYield || yield_);
        // Optionally update primarySafeAddress if API starts returning it on check?
      }
      setMessage(result.message || 'Deposit check complete');
      onSuccess(); // Refresh data if check was successful
      
    } catch (err) {
      console.error('Error checking deposits:', err);
      setError(err instanceof Error ? err.message : 'Failed to check deposits');
      setMessage(null);
    } finally {
      setIsChecking(false);
    }
  };
  
  const validateNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && Number(value) >= 0;
  };
  
  const isFormValid = validateNumber(tax) && validateNumber(liquidity) && validateNumber(yield_);

  
  return (
    <Card className="w-full bg-white border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-blue-800">Manual Allocation</CardTitle>
      </CardHeader>
      <CardContent>
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Tax Input */}
             <div>
               <Label htmlFor="tax" className="text-sm text-gray-600">Tax Safe (USDC)</Label>
               <Input id="tax" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Enter amount (wei)" className={!validateNumber(tax) ? "border-red-300" : ""} disabled={isSubmitting}/>
             </div>
             {/* Liquidity Input */}
             <div>
               <Label htmlFor="liquidity" className="text-sm text-gray-600">Liquidity Safe (USDC)</Label>
               <Input id="liquidity" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} placeholder="Enter amount (wei)" className={!validateNumber(liquidity) ? "border-red-300" : ""} disabled={isSubmitting}/>
             </div>
             {/* Yield Input */}
             <div>
               <Label htmlFor="yield" className="text-sm text-gray-600">Yield Safe (USDC)</Label>
               <Input id="yield" value={yield_} onChange={(e) => setYield(e.target.value)} placeholder="Enter amount (wei)" className={!validateNumber(yield_) ? "border-red-300" : ""} disabled={isSubmitting}/>
             </div>
           </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting || isChecking || !isFormValid || !primarySafeAddress}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                'Allocate Funds'
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={checkForDeposits}
              disabled={isSubmitting || isChecking}
              className="whitespace-nowrap"
            >
                 {isChecking ? (
                     <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                 ) : (
                     <><RefreshCw className="mr-2 h-4 w-4" /> Check Deposits</>
                 )}
            </Button>
          </div>
          
          {!primarySafeAddress && !isSubmitting && (
              <p className="text-xs text-orange-500 text-center">Primary Safe address not loaded. Cannot allocate funds.</p>
          )}
          <p className="text-xs text-gray-500 text-center">
            Enter the desired amounts (in wei) to allocate. Clicking 'Allocate Funds' will prepare the necessary transfers from your primary safe for you to approve and execute.
          </p>
        </form>
      </CardContent>
    </Card>
  );
} 