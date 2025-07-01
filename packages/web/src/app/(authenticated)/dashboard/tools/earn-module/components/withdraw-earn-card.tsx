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
import { formatUnits, parseUnits, encodeFunctionData, parseAbi, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';

interface WithdrawEarnCardProps {
  safeAddress: Address;
  vaultAddress: Address;
  onWithdrawSuccess?: () => void;
}

interface VaultInfo {
  shares: bigint;
  assets: bigint;
  assetDecimals: number;
  shareDecimals: number;
  assetAddress: Address;
}

// ERC4626 Vault ABI for withdrawal
const VAULT_ABI = parseAbi([
  'function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)',
  'function convertToShares(uint256 assets) external view returns (uint256 shares)',
]);

export function WithdrawEarnCard({ safeAddress, vaultAddress, onWithdrawSuccess }: WithdrawEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);
  
  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(safeAddress);
  const publicClient = createPublicClient({ chain: base, transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL) });

  // Fetch vault info
  const { data: vaultData, isLoading: isLoadingVault, refetch: refetchVaultInfo } = trpc.earn.getVaultInfo.useQuery(
    { safeAddress, vaultAddress },
    { 
      enabled: !!safeAddress && !!vaultAddress,
    }
  );

  // Add mutation for recording withdrawal
  const recordWithdrawalMutation = trpc.earn.recordWithdrawal.useMutation();

  // Update vault info when data changes
  useEffect(() => {
    if (vaultData) {
      console.log('Vault info fetched:', {
        safeAddress,
        vaultAddress,
        shares: vaultData.shares,
        assets: vaultData.assets,
        decimals: vaultData.decimals,
        assetAddress: vaultData.assetAddress
      });
      
      // Additional debugging
      const sharesBI = BigInt(vaultData.shares);
      const assetsBI = BigInt(vaultData.assets);
      console.log('Parsed values:', {
        sharesBigInt: sharesBI.toString(),
        assetsBigInt: assetsBI.toString(),
        hasShares: sharesBI > 0n,
        hasAssets: assetsBI > 0n,
      });
      
      setVaultInfo({
        shares: sharesBI,
        assets: assetsBI,
        assetDecimals: vaultData.decimals,
        shareDecimals: 18, // ERC4626 shares are always 18 decimals
        assetAddress: vaultData.assetAddress as Address,
      });
    }
  }, [vaultData, safeAddress, vaultAddress]);

  const handleWithdraw = async () => {
    if (!amount || !vaultInfo || !isRelayReady) return;

    try {
      setIsWithdrawing(true);
      const amountInSmallestUnit = parseUnits(amount, vaultInfo.assetDecimals);
      
      // Convert the asset amount to shares using the vault's conversion function
      console.log('Converting assets to shares...', {
        assets: amountInSmallestUnit.toString(),
        vaultAddress
      });
      
      const sharesToRedeem = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'convertToShares',
        args: [amountInSmallestUnit],
      });
      
      console.log('Shares to redeem:', sharesToRedeem.toString());
      
      // Check if user has enough shares
      if (sharesToRedeem > vaultInfo.shares) {
        throw new Error(`Insufficient shares. Required: ${formatUnits(sharesToRedeem, 18)}, Available: ${formatUnits(vaultInfo.shares, 18)}`);
      }
      
      // Encode the redeem function call
      const redeemData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesToRedeem, safeAddress, safeAddress] // shares, receiver, owner
      });

      // Execute the withdrawal via Safe relay
      const userOpHash = await sendTxViaRelay([{
        to: vaultAddress,
        value: '0',
        data: redeemData,
      }]);

      if (userOpHash) {
        // Record the withdrawal in the database
        await recordWithdrawalMutation.mutateAsync({
          safeAddress: safeAddress,
          vaultAddress: vaultAddress,
          tokenAddress: vaultInfo.assetAddress,
          assetsWithdrawn: amountInSmallestUnit.toString(),
          sharesBurned: sharesToRedeem.toString(),
          userOpHash: userOpHash,
        });

        toast({
          title: "Withdrawal initiated",
          description: `Withdrawing ${amount} USDC. Transaction ID: ${userOpHash.slice(0, 10)}...`,
        });

        // Reset form
        setAmount('');
        
        // Refetch vault info after a delay
        setTimeout(() => {
          refetchVaultInfo();
          if (onWithdrawSuccess) {
            onWithdrawSuccess();
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
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
          Withdraw your funds from the vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
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
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance) || isWithdrawing || !isRelayReady}
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