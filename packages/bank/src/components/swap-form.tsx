'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrivy } from '@privy-io/react-auth';

interface SwapFormProps {
  onInitiateSwap: (ethAmount: string) => Promise<void>; // Callback to handle the swap logic
}

export default function SwapForm({ onInitiateSwap }: SwapFormProps) {
  const [ethAmount, setEthAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = usePrivy();

  const safeAddress = user?.wallet?.address; // Get the signer address

  const handleSwap = async () => {
    if (!ethAmount || isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0) {
      setError('Please enter a valid amount of ETH.');
      return;
    }
    if (!safeAddress) {
        setError('Wallet not connected or available.');
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onInitiateSwap(ethAmount);
      setEthAmount(''); // Clear input on success
    } catch (err) {
      console.error("0xHypr Swap Error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during swap.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-t pt-4">
      <CardHeader>
        <CardTitle className="text-xl">Swap ETH for USDC</CardTitle>
        <CardDescription>Swap Base ETH held by your wallet for USDC, sent to your Safe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ethAmount">ETH Amount</Label>
          <Input
            id="ethAmount"
            type="number"
            placeholder="0.01"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            disabled={isLoading}
            step="any"
          />
        </div>
        {/* Placeholder for estimated USDC output - requires price feed integration */} 
        {/* <p className="text-sm text-muted-foreground">Estimated USDC received: ...</p> */}
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Button onClick={handleSwap} disabled={isLoading || !safeAddress}>
          {isLoading ? 'Swapping...' : 'Initiate Swap'}
        </Button>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        {!safeAddress && <p className="text-xs text-orange-500 mt-2">Connect wallet to swap.</p>}
      </CardFooter>
    </Card>
  );
} 