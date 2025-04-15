'use client';

import { useState, useCallback } from 'react';
import { useSendTransaction } from '@privy-io/react-auth';
import { parseEther, isAddress, HexString } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function ToolsPage() {
  const { toast } = useToast();
  const { sendTransaction, state } = useSendTransaction();
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<HexString | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = useCallback(async () => {
    setError(null);
    setTxHash(null);

    if (!isAddress(toAddress)) {
      setError('Invalid recipient address.');
      return;
    }

    let valueBigInt: bigint;
    try {
      valueBigInt = parseEther(amount);
      if (valueBigInt <= 0n) {
        setError('Amount must be greater than 0.');
        return;
      }
    } catch (e) {
      setError('Invalid amount.');
      return;
    }

    try {
      const result = await sendTransaction({
        to: toAddress as HexString,
        value: valueBigInt, // Value needs to be in wei
        // Assuming the user wants to send native currency (e.g., ETH on Base Sepolia)
        // Add chainId if needed, Privy usually handles the connected wallet's chain
      });
      setTxHash(result.hash);
      toast({
        title: 'Transaction Sent',
        description: `Transaction hash: ${result.hash}`,
      });
      setToAddress('');
      setAmount('');
    } catch (err: any) {
      console.error('Transaction failed:', err);
      setError(`Transaction failed: ${err.message || 'Unknown error'}`);
      toast({
        title: 'Transaction Failed',
        description: err.message || 'Could not send transaction.',
        variant: 'destructive',
      });
    }
  }, [toAddress, amount, sendTransaction, toast]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Send Funds</CardTitle>
          <CardDescription>
            Send native currency (e.g., ETH) from your embedded wallet.
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
              disabled={state.status === 'pending'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="text" // Use text to allow decimals before parsing
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={state.status === 'pending'}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button
            onClick={handleSend}
            disabled={state.status === 'pending' || !toAddress || !amount}
            className="w-full"
          >
            {state.status === 'pending' ? 'Sending...' : 'Send Transaction'}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {txHash && (
            <p className="text-green-600 text-sm break-all">
              Success! Transaction Hash: {txHash}
            </p>
          )}
          {state.status !== 'idle' && (
             <p className="text-sm text-muted-foreground">Status: {state.status}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 