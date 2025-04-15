'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSendTransaction, usePrivy } from '@privy-io/react-auth';
import { parseEther, isAddress, formatEther, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Define HexString type as viem doesn't export it directly
type HexString = `0x${string}`;

// Simple viem client setup - ideally move to a shared context/provider
const publicClient = createPublicClient({
  chain: baseSepolia, // TODO: Make dynamic
  transport: http(),
});

export default function ToolsPage() {
  const { user } = usePrivy();
  const wallet = user?.wallet;
  const { sendTransaction } = useSendTransaction();
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<HexString | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet?.address) {
        setBalance(null);
        return;
      }

      setBalanceLoading(true);
      setBalanceError(null);
      try {
        const fetchedBalance = await publicClient.getBalance({
          address: wallet.address as HexString,
        });
        setBalance(formatEther(fetchedBalance));
      } catch (err: any) {
        console.error('Failed to fetch balance:', err);
        setBalanceError('Could not fetch balance.');
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [wallet?.address]);

  const handleSend = useCallback(async () => {
    setError(null);
    setTxHash(null);
    setIsLoading(true);

    if (!isAddress(toAddress)) {
      setError('Invalid recipient address.');
      setIsLoading(false);
      return;
    }

    let valueBigInt: bigint;
    try {
      valueBigInt = parseEther(amount);
      if (valueBigInt <= 0n) {
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
      toast.loading('Sending transaction...');
      const result = await sendTransaction({
        to: toAddress as HexString,
        value: valueBigInt,
        // Assuming the user wants to send native currency (e.g., ETH on Base Sepolia)
        // Add chainId if needed, Privy usually handles the connected wallet's chain
      });
      setTxHash(result.hash);
      toast.success('Transaction Sent', {
        description: `Transaction hash: ${result.hash}`,
        id: 'send-tx-success',
      });
      setToAddress('');
      setAmount('');
    } catch (err: any) {
      console.error('Transaction failed:', err);
      const errorMessage = err.message || 'Could not send transaction.';
      setError(`Transaction failed: ${errorMessage}`);
      toast.error('Transaction Failed', {
        description: errorMessage,
        id: 'send-tx-error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toAddress, amount, sendTransaction]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Send Funds</CardTitle>
          <CardDescription>
            Send native currency (e.g., ETH) from your embedded wallet.
            {balanceLoading && <span className="ml-2 text-xs text-muted-foreground">Loading balance...</span>}
            {balanceError && <span className="ml-2 text-xs text-red-500">{balanceError}</span>}
            {balance !== null && !balanceLoading && !balanceError && (
              <span className="ml-2 text-xs text-muted-foreground">Your balance: {parseFloat(balance).toFixed(6)} ETH</span>
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
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button
            onClick={handleSend}
            disabled={isLoading || !toAddress || !amount}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Transaction'}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {txHash && (
            <p className="text-green-600 text-sm break-all">
              Success! Transaction Hash: {txHash}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 