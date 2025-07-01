'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Wallet } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { toast } from '@/components/ui/use-toast';
import type { Address } from 'viem';
import { formatUnits, parseUnits } from 'viem';

interface WithdrawEarnCardProps {
  safeAddress: Address;
  vaultAddress: Address;
}

interface VaultInfo {
  shares: bigint;
  assets: bigint;
  assetDecimals: number;
  shareDecimals: number;
  assetAddress: Address;
}

export function WithdrawEarnCard({ safeAddress, vaultAddress }: WithdrawEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);

  // Fetch vault info
  const { data: vaultData, isLoading: isLoadingVault, refetch: refetchVaultInfo } = trpc.earn.getVaultInfo.useQuery(
    { safeAddress, vaultAddress },
    { 
      enabled: !!safeAddress && !!vaultAddress,
      onSuccess: (data) => {
        setVaultInfo({
          shares: BigInt(data.shares),
          assets: BigInt(data.assets),
          assetDecimals: data.decimals,
          shareDecimals: 18, // ERC4626 shares are always 18 decimals
          assetAddress: data.assetAddress as Address,
        });
      },
    }
  );

  // Withdraw mutation
  const withdrawMutation = trpc.earn.withdraw.useMutation({
    onSuccess: async (data) => {
      toast({
        title: 'Withdrawal Initiated',
        description: `Transaction hash: ${data.txHash.slice(0, 10)}...`,
      });
      setAmount('');
      // Refetch vault info after successful withdrawal
      setTimeout(() => {
        refetchVaultInfo();
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: 'Withdrawal Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleWithdraw = async () => {
    if (!amount || !vaultInfo) return;

    try {
      setIsWithdrawing(true);
      const amountInSmallestUnit = parseUnits(amount, vaultInfo.assetDecimals);
      
      await withdrawMutation.mutateAsync({
        safeAddress,
        vaultAddress,
        assets: amountInSmallestUnit.toString(),
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMax = () => {
    if (!vaultInfo) return;
    const maxAmount = formatUnits(vaultInfo.assets, vaultInfo.assetDecimals);
    setAmount(maxAmount);
  };

  if (isLoadingVault) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vaultInfo || vaultInfo.assets === 0n) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No funds available to withdraw from this vault.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const availableBalance = formatUnits(vaultInfo.assets, vaultInfo.assetDecimals);
  const displayBalance = parseFloat(availableBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>
          Withdraw your funds from the Seamless Vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance - Simplified */}
        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
          <div className="text-2xl font-bold">${displayBalance} USDC</div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to Withdraw</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-20"
              step="0.000001"
              min="0"
              max={availableBalance}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">USDC</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMax}
                className="h-7 px-2 text-xs"
              >
                Max
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the amount of USDC you want to withdraw
          </p>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance) || isWithdrawing}
          className="w-full"
          size="lg"
        >
          {isWithdrawing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Withdraw'
          )}
        </Button>

        {/* Help text */}
        <p className="text-xs text-muted-foreground text-center">
          Withdrawals are processed through your Safe wallet and may take a few moments to complete
        </p>
      </CardContent>
    </Card>
  );
} 