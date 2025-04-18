'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { isAddress, formatUnits, parseUnits, createPublicClient, http, type Address, encodeFunctionData } from 'viem';
import { erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { Safe4337Pack } from '@safe-global/relay-kit';
import { api } from '@/trpc/react';

// Use the Base USDC address
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;

// Simple viem client setup for reading chain data
const publicClient = createPublicClient({
  chain: base, 
  transport: http(),
});

export default function SendUsdcPage() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
  
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [step, setStep] = useState<string>('');
  
  // Get the list of user's Safe addresses
  const { data: safesList } = api.settings.userSafes.list.useQuery();
  const primarySafe = safesList?.find(safe => safe.safeType === 'primary');

  // Fetch USDC balance when the primary Safe address is available
  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (!primarySafe?.safeAddress) {
        setBalance(null);
        return;
      }

      setBalanceLoading(true);
      setBalanceError(null);
      
      try {
        const fetchedBalance = await publicClient.readContract({
          address: USDC_ADDRESS as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [primarySafe.safeAddress as Address],
        }) as bigint;
        
        setBalance(formatUnits(fetchedBalance, USDC_DECIMALS));
      } catch (err: any) {
        console.error('Failed to fetch USDC balance:', err);
        setBalanceError('Could not fetch USDC balance.');
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchUsdcBalance();
  }, [primarySafe?.safeAddress]);

  const handleSendUsdc = useCallback(async () => {
    setError(null);
    setTxHash(null);
    setIsLoading(true);
    setStep('Initializing');

    if (!embeddedWallet) {
      setError('Embedded wallet not available. Please ensure you are logged in.');
      setIsLoading(false);
      return;
    }

    if (!primarySafe?.safeAddress) {
      setError('Primary Safe not found. Please complete onboarding first.');
      setIsLoading(false);
      return;
    }

    if (!isAddress(toAddress)) {
      setError('Invalid recipient address.');
      setIsLoading(false);
      return;
    }

    let valueInUnits: bigint;
    try {
      valueInUnits = parseUnits(amount, USDC_DECIMALS);
      if (valueInUnits <= 0n) {
        setError('Amount must be greater than 0.');
        setIsLoading(false);
        return;
      }
    } catch (e) {
      setError('Invalid amount.');
      setIsLoading(false);
      return;
    }

    try {
      toast.loading('Preparing transaction...');
      
      // Step 1: Get the embedded wallet's provider and signer
      setStep('Getting wallet provider');
      const provider = await embeddedWallet.getEthereumProvider();
      await embeddedWallet.switchChain(base.id);
      
      // Create ethers provider and signer for compatibility with Safe kit
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      
      // Step 2: Encode the ERC20 transfer function
      setStep('Encoding transaction');
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress as Address, valueInUnits],
      });
      
      // Create transaction object
      const transaction = {
        to: USDC_ADDRESS as string,
        data: data,
        value: '0',
      };
      
      // Step 3: Initialize Safe4337Pack
      setStep('Initializing Safe relay kit');
      const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
      if (!apiKey) {
        throw new Error('Pimlico API key not found');
      }
      
      console.log('Initializing Safe4337Pack for safe:', primarySafe.safeAddress);
      const safe4337Pack = await Safe4337Pack.init({
        provider: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
        signer: embeddedWallet.address as string,
        bundlerUrl: `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${apiKey}`,
        // safeModulesVersion: '0.3.0', // EntryPoint v0.7
        paymasterOptions: {
          paymasterUrl: `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${apiKey}`,
          paymasterAddress: '0x0000000000000000000000000000000000000000',
          paymasterTokenAddress: '0x0000000000000000000000000000000000000000',
        },
        options: {
          safeAddress: primarySafe.safeAddress as string,
        },
      });
      
      // Step 4: Create Safe operation
      setStep('Creating Safe operation');
      const safeOperation = await safe4337Pack.createTransaction({
        transactions: [transaction],
      });
      
      // Step 5: Sign the operation
      setStep('Signing transaction');
      const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation);
      
      // Step 6: Execute the transaction
      setStep('Submitting transaction');
      toast.loading('Submitting transaction via relay...');
      const userOpHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation,
      });
      
      console.log('User operation hash:', userOpHash);
      setTxHash(userOpHash);
      
      // Step 7: Wait for confirmation
      setStep('Waiting for confirmation');
      toast.loading('Waiting for confirmation...');
      
      // Poll for the receipt
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds max
      
      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await safe4337Pack.getUserOperationReceipt(userOpHash);
          if (receipt) break;
        } catch (error) {
          console.log('Waiting for receipt...', error);
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts
      }
      
      if (receipt) {
        console.log('Transaction confirmed:', receipt);
        toast.success('Transaction Confirmed', {
          description: `Transaction successful!`,
          id: 'send-usdc-success',
        });
      } else {
        console.log('Transaction submitted but confirmation timed out');
        toast.success('Transaction Submitted', {
          description: `Transaction was submitted to the network. Check explorer for status.`,
          id: 'send-usdc-pending',
        });
      }
      
      // Reset form on success
      setToAddress('');
      setAmount('');
      
      // Refresh balance after successful transaction
      setStep('Refreshing balance');
      if (primarySafe?.safeAddress) {
        try {
          const newBalance = await publicClient.readContract({
            address: USDC_ADDRESS as Address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [primarySafe.safeAddress as Address],
          }) as bigint;
          
          setBalance(formatUnits(newBalance, USDC_DECIMALS));
        } catch (error) {
          console.error('Failed to refresh balance', error);
        }
      }
      
      setStep('');
    } catch (err: any) {
      console.error('Transaction failed:', err);
      let errorMessage = 'Could not send transaction.';
      
      if (err.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected by the user.';
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`Transaction failed: ${errorMessage}`);
      toast.error('Transaction Failed', {
        description: errorMessage,
        id: 'send-usdc-error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toAddress, amount, embeddedWallet, primarySafe?.safeAddress]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Send USDC (via Safe Relay)</CardTitle>
          <CardDescription>
            Send USDC tokens from your Safe wallet on the Base network using gas-less transactions.
            {balanceLoading && <span className="ml-2 text-xs text-muted-foreground">Loading balance...</span>}
            {balanceError && <span className="ml-2 text-xs text-red-500">{balanceError}</span>}
            {balance !== null && !balanceLoading && !balanceError && (
              <span className="ml-2 text-xs text-muted-foreground">Your Safe balance: {parseFloat(balance).toFixed(6)} USDC</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              type="text"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {txHash && (
            <Alert className="border-green-500/50 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Transaction Submitted</AlertTitle>
              <AlertDescription>
                User operation hash: {txHash}
                <br />
                <span className="text-xs text-green-700">The transaction has been submitted to the bundler. Check BaseScan for confirmation.</span>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button
            onClick={handleSendUsdc}
            disabled={isLoading || !embeddedWallet || !primarySafe?.safeAddress || !toAddress || !amount}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step || 'Sending...'}
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Send USDC
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 