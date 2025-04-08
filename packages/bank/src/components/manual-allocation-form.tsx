'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import { CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { base } from 'viem/chains'; // Use base chain info

interface ManualAllocationFormProps {
  primarySafeAddress?: string; // Add primary safe address prop
  taxCurrent: string;
  liquidityCurrent: string;
  yieldCurrent: string;
  onSuccess: () => void; // Consider if this is still needed
}

// Structure for Safe transactions prepared by the API
interface PreparedTransaction {
  to: string;
  value: string;
  data: string;
}

export function ManualAllocationForm({ 
  primarySafeAddress,
  taxCurrent, 
  liquidityCurrent, 
  yieldCurrent, 
  onSuccess 
}: ManualAllocationFormProps) {
  const { getAccessToken } = usePrivy();
  const { wallets } = useWallets(); // Get connected wallets
  
  const [tax, setTax] = useState(taxCurrent);
  const [liquidity, setLiquidity] = useState(liquidityCurrent);
  const [yield_, setYield] = useState(yieldCurrent);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<boolean>(false); // Success state handled differently now
  const [message, setMessage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // setSuccess(false);
    setMessage(null);

    if (!primarySafeAddress) {
      setError('Primary Safe address is missing. Cannot proceed.');
      return;
    }

    // Find the connected EOA wallet (assuming it's an embedded wallet)
    const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
    if (!embeddedWallet) {
      setError('Please ensure your embedded wallet is connected.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // 1. Call API to prepare transactions
      setMessage('Preparing allocation transactions...');
      const response = await fetch('/api/allocations/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
          setMessage('No allocation needed based on the provided amounts.');
          setIsSubmitting(false);
          return;
      }

      // 2. Prepare for Safe SDK interaction
      setMessage('Preparing Safe transaction...');
      
      // Get Ethers provider and signer from Privy wallet
      await embeddedWallet.switchChain(base.id); // Ensure wallet is on Base
      const provider = await embeddedWallet.getEthersProvider();
      const signer = provider.getSigner();

      // Initialize Safe SDK components
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });

      // Use appropriate service URL for Base Mainnet
      const txServiceUrl = 'https://safe-transaction-base.safe.global/'; 
      const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

      const safeSdk = await Safe.create({ 
          ethAdapter, 
          safeAddress: primarySafeAddress 
      });

      // 3. Create and Propose Safe Transaction Batch
      setMessage('Creating transaction batch...');
      const safeTransactionData = await safeSdk.createTransaction({ safeTransactionData: preparedTransactions });
      
      const nonce = await safeService.getNextNonce(primarySafeAddress);
      const safeTxHash = await safeSdk.getTransactionHash(safeTransactionData);
      
      setMessage('Waiting for signature...');
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

      setMessage('Proposing transaction to Safe service...');
      await safeService.proposeTransaction({
        safeAddress: primarySafeAddress,
        safeTransactionData: safeTransactionData.data,
        safeTxHash,
        senderAddress: await signer.getAddress(),
        senderSignature: senderSignature.data,
        origin: 'Hypr Bank Allocation',
      });

      // --- Transaction Proposed --- 
      setMessage('Transaction proposed successfully! Please confirm in your Safe UI or via other signer wallets.');
      // Clear form or provide further user guidance
      // onSuccess(); // Trigger refresh or other action after proposal
      
    } catch (err) {
      console.error('Error processing allocation:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during allocation');
      setMessage(null); // Clear any status message on error
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
        
        {/* Removed success state alert */}
        
        {message && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">{message}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... Input fields ... */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Tax Input */}
             <div>
               <Label htmlFor="tax" className="text-sm text-gray-600">Tax Safe (USDC)</Label>
               <Input id="tax" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Enter amount" className={!validateNumber(tax) ? "border-red-300" : ""} disabled={isSubmitting}/>
             </div>
             {/* Liquidity Input */}
             <div>
               <Label htmlFor="liquidity" className="text-sm text-gray-600">Liquidity Safe (USDC)</Label>
               <Input id="liquidity" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} placeholder="Enter amount" className={!validateNumber(liquidity) ? "border-red-300" : ""} disabled={isSubmitting}/>
             </div>
             {/* Yield Input */}
             <div>
               <Label htmlFor="yield" className="text-sm text-gray-600">Yield Safe (USDC)</Label>
               <Input id="yield" value={yield_} onChange={(e) => setYield(e.target.value)} placeholder="Enter amount" className={!validateNumber(yield_) ? "border-red-300" : ""} disabled={isSubmitting}/>
             </div>
           </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              type="submit" 
              className="flex-1"
              // Disable if submitting, checking, form invalid, or safe address missing
              disabled={isSubmitting || isChecking || !isFormValid || !primarySafeAddress}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Allocate Funds'
              )}
            </Button>
            
            {/* Consider removing Check Deposits button if balances are live */}
            <Button 
              type="button"
              variant="outline"
              onClick={checkForDeposits}
              disabled={isSubmitting || isChecking}
              className="whitespace-nowrap"
            >
              {/* ... Check Deposits button content ... */}
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