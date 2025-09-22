'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Wallet } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import type { Address } from 'viem';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  parseAbi,
  createPublicClient,
  http,
} from 'viem';
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
  'function decimals() external view returns (uint8)',
]);

export function WithdrawEarnCard({
  safeAddress,
  vaultAddress,
  onWithdrawSuccess,
}: WithdrawEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);

  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);
  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  });

  // Reset state when vault changes
  useEffect(() => {
    console.log('[WithdrawEarnCard] Vault address changed to:', vaultAddress);
    setAmount('');
    setIsWithdrawing(false);
  }, [vaultAddress]);

  // Fetch vault info
  const {
    data: vaultData,
    isLoading: isLoadingVault,
    refetch: refetchVaultInfo,
  } = trpc.earn.getVaultInfo.useQuery(
    { safeAddress, vaultAddress },
    {
      enabled: !!safeAddress && !!vaultAddress,
      staleTime: 30000, // Consider data fresh for 30s
      refetchInterval: false, // Disable automatic refetching
    },
  );

  // Add mutation for recording withdrawal
  const recordWithdrawalMutation = trpc.earn.recordWithdrawal.useMutation();

  // Cache share decimals to avoid repeated RPC calls
  const [cachedShareDecimals, setCachedShareDecimals] = useState<
    Record<string, number>
  >({});

  // Update vault info when data changes
  useEffect(() => {
    const fetchVaultInfo = async () => {
      if (vaultData) {
        console.log('Vault info fetched:', {
          safeAddress,
          vaultAddress,
          shares: vaultData.shares,
          assets: vaultData.assets,
          decimals: vaultData.decimals,
          assetAddress: vaultData.assetAddress,
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

        // Check cache first to avoid repeated RPC calls
        let shareDecimals = cachedShareDecimals[vaultAddress];

        if (shareDecimals === undefined) {
          // Only fetch if not cached
          try {
            const decimals = await publicClient.readContract({
              address: vaultAddress,
              abi: VAULT_ABI,
              functionName: 'decimals',
            });
            shareDecimals = Number(decimals);
            setCachedShareDecimals((prev) => ({
              ...prev,
              [vaultAddress]: shareDecimals,
            }));
          } catch (error) {
            console.error('Failed to fetch share decimals:', error);
            // Fallback to 18 decimals if we can't fetch
            shareDecimals = 18;
            setCachedShareDecimals((prev) => ({
              ...prev,
              [vaultAddress]: 18,
            }));
          }
        }

        setVaultInfo({
          shares: sharesBI,
          assets: assetsBI,
          assetDecimals: vaultData.decimals,
          shareDecimals,
          assetAddress: vaultData.assetAddress as Address,
        });
      }
    };

    fetchVaultInfo();
  }, [vaultData, vaultAddress, cachedShareDecimals, publicClient]); // Include necessary deps

  const handleWithdraw = async () => {
    if (!amount || !vaultInfo || !isRelayReady) return;

    try {
      setIsWithdrawing(true);
      const amountInSmallestUnit = parseUnits(amount, vaultInfo.assetDecimals);

      // Convert the asset amount to shares using the vault's conversion function
      console.log('Converting assets to shares...', {
        assets: amountInSmallestUnit.toString(),
        vaultAddress,
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
        throw new Error(
          `Insufficient shares. Required: ${formatUnits(sharesToRedeem, vaultInfo.shareDecimals)}, Available: ${formatUnits(vaultInfo.shares, vaultInfo.shareDecimals)}`,
        );
      }

      // Encode the redeem function call
      const redeemData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesToRedeem, safeAddress, safeAddress], // shares, receiver, owner
      });

      // Execute the withdrawal via Safe relay
      const transactions = [
        {
          to: vaultAddress,
          value: '0',
          data: redeemData,
          operation: 0,
        },
      ];

      const userOpHash = await sendTxViaRelay(transactions, 600_000n); // Increased gas limit

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

        toast.success('Withdrawal initiated', {
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
      toast.error(
        `Withdrawal failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      );
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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!vaultInfo || vaultInfo.assets === 0n) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No funds available to withdraw from this vault.
        </AlertDescription>
      </Alert>
    );
  }

  const availableBalance = formatUnits(
    vaultInfo.assets,
    vaultInfo.assetDecimals,
  );
  const displayBalance = parseFloat(availableBalance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    },
  );

  return (
    <div className="space-y-4">
      {/* Current Balance */}
      <div className="rounded-lg p-4 bg-white">
        <div className="text-sm text-muted-foreground mb-1 ">
          Available Balance
        </div>
        <div className="text-2xl font-bold ">
          <span className="text-[#0040FF]">${displayBalance}</span>{' '}
          <span className="text-sm">USDC</span>
        </div>
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
            className="pr-24 "
            step="0.000001"
            min="0"
            max={availableBalance}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-xs text-[#0040FF]">USDC</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMax}
              className="h-6 px-1.5 text-xs"
            >
              Max
            </Button>
          </div>
        </div>
        <p className="text-xs text-[#0040FF]">
          Enter the amount of USDC you want to withdraw
        </p>
      </div>

      {/* Withdraw Button */}
      <Button
        onClick={handleWithdraw}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > parseFloat(availableBalance) ||
          isWithdrawing ||
          !isRelayReady
        }
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
        Withdrawals are processed through your Safe wallet and may take a few
        moments to complete
      </p>
    </div>
  );
}
