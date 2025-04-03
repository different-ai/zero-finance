'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrivy } from '@privy-io/react-auth';

interface SwapFormProps {
  onInitiateSwap: (ethAmount: string) => Promise<void>; // Callback to handle the swap logic
  safeBalance?: string | null; // ETH balance of the Safe (optional)
}

export default function SwapForm({ onInitiateSwap, safeBalance }: SwapFormProps) {
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

    // Check if trying to swap more than the available balance
    if (safeBalance && parseFloat(ethAmount) > parseFloat(safeBalance)) {
      setError(`Insufficient ETH balance. Available: ${safeBalance} ETH`);
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

  // Function to set max amount from balance
  const handleSetMaxAmount = () => {
    if (safeBalance) {
      // If balance is less than 0.01 ETH, use full balance
      // Otherwise, leave 0.01 ETH for gas fees (rough estimate)
      const balanceNum = parseFloat(safeBalance);
      const maxAmount = balanceNum > 0.01 ? (balanceNum - 0.01).toFixed(4) : balanceNum.toFixed(4);
      setEthAmount(maxAmount);
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
          <div className="flex justify-between items-center">
            <Label htmlFor="ethAmount">ETH Amount</Label>
            {safeBalance && (
              <div className="text-sm text-gray-500 flex items-center">
                <span>Available: {safeBalance} ETH</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 ml-1 text-xs text-blue-600 hover:text-blue-800"
                  onClick={handleSetMaxAmount}
                >
                  MAX
                </Button>
              </div>
            )}
          </div>
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