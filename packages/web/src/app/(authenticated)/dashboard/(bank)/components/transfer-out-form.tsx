'use client';

import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { type Address } from 'viem';
import { base } from 'viem/chains';
import { createWalletClient, http, custom, publicActions, parseUnits } from 'viem';
import { erc20Abi } from 'viem'; // Import standard ERC20 ABI

// Base USDC address
const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;

export function TransferOutForm() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  const handleTransfer = useCallback(async () => {
    if (!embeddedWallet) {
      setError("Embedded wallet not available. Please ensure you are logged in.");
      return;
    }
    if (!ethers.utils.isAddress(recipientAddress)) {
        setError("Invalid recipient address.");
        return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Invalid amount.");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessTxHash(null);

    try {
      // 1. Ensure wallet is on Base
      await embeddedWallet.switchChain(base.id); 

      // 2. Prepare viem Wallet Client
      const walletClient = createWalletClient({
        account: embeddedWallet.address as Address, 
        chain: base,
        transport: custom(window.ethereum as any),
      }).extend(publicActions); 

      // 3. Prepare ERC20 Transfer Transaction Data
      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
      
      console.log(`0xHypr - Preparing transfer of ${amount} USDC (${amountInSmallestUnit}) to ${recipientAddress}`);

      // 4. Send Transaction
      console.log("0xHypr - Sending transfer transaction...");
      const { request } = await walletClient.simulateContract({
        address: BASE_USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress as Address, amountInSmallestUnit],
        account: embeddedWallet.address as Address,
      });
      const txHash = await walletClient.writeContract(request);

      console.log(`0xHypr - Transfer transaction sent: ${txHash}`);
      console.log("0xHypr - Waiting for confirmation...");

      // 5. Wait for confirmation
      const txReceipt = await walletClient.waitForTransactionReceipt({ hash: txHash });
      console.log(`0xHypr - Transfer confirmed in block: ${txReceipt.blockNumber}`);

      setSuccessTxHash(txHash);
      setRecipientAddress(''); // Clear form on success
      setAmount('');

    } catch (error: any) {
        console.error('0xHypr - Error sending transfer:', error);
        let errorMessage = 'An unknown error occurred during the transfer.';
        if (error.message?.includes('User rejected the request')) {
            errorMessage = 'Transaction rejected in wallet.';
        } else if (error.shortMessage) {
            errorMessage = error.shortMessage;
        }
         else if (error.message) {
            errorMessage = error.message;
         }
        setError(errorMessage);
    } finally {
        setIsSubmitting(false);
    }

  }, [embeddedWallet, recipientAddress, amount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Funds (Base USDC)</CardTitle>
        <CardDescription>
          Transfer USDC from your embedded wallet to another address on the Base network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input 
            id="recipient"
            placeholder="0x..." 
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USDC)</Label>
          <Input 
            id="amount" 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            step="0.01"
            min="0"
          />
        </div>
        {error && (
             <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Transfer Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
         {successTxHash && (
             <Alert variant="default" className="border-green-500/50 bg-green-50 text-green-800">
                 <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Transfer Successful!</AlertTitle>
                <AlertDescription>
                    Transaction confirmed: 
                    <a 
                        href={`https://basescan.org/tx/${successTxHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-mono text-xs break-all hover:underline ml-1"
                    >
                        {successTxHash}
                    </a>
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            onClick={handleTransfer} 
            disabled={isSubmitting || !embeddedWallet || !recipientAddress || !amount}
            className="w-full"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          Send USDC
        </Button>
      </CardFooter>
    </Card>
  );
} 