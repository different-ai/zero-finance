'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
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
import { base, arbitrum } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

interface WithdrawEarnCardProps {
  safeAddress: Address; // Base Safe address (used as fallback for Base chain)
  vaultAddress: Address;
  onWithdrawSuccess?: () => void;
  chainId?: number; // Target chain for the vault (default: Base)
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
  chainId = 8453, // Default to Base
}: WithdrawEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);

  // Determine if this is a cross-chain withdrawal (vault on different chain than Base)
  const isCrossChain = chainId !== SUPPORTED_CHAINS.BASE;

  // Fetch user's multi-chain positions to get the target Safe address
  const { data: multiChainPositions, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: isCrossChain,
    });

  // Find the Safe address for the target chain
  const targetSafeAddress = isCrossChain
    ? (multiChainPositions?.safes.find((s) => s.chainId === chainId)
        ?.address as Address | undefined)
    : safeAddress;

  // Use the target chain's Safe address for relay operations
  const effectiveSafeAddress = targetSafeAddress || safeAddress;

  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    effectiveSafeAddress,
    chainId,
  );

  // Select chain based on chainId
  const isArbitrum = chainId === 42161;
  const chain = isArbitrum ? arbitrum : base;
  const rpcUrl = isArbitrum
    ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
    : process.env.NEXT_PUBLIC_BASE_RPC_URL;

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  // Reset state when vault changes
  useEffect(() => {
    console.log(
      '[WithdrawEarnCard] Vault address changed to:',
      vaultAddress,
      'chainId:',
      chainId,
    );
    setAmount('');
    setIsWithdrawing(false);
  }, [vaultAddress, chainId]);

  // Fetch vault info
  const {
    data: vaultData,
    isLoading: isLoadingVault,
    refetch: refetchVaultInfo,
  } = trpc.earn.getVaultInfo.useQuery(
    { vaultAddress, chainId },
    {
      enabled: !!vaultAddress,
      staleTime: 30000, // Consider data fresh for 30s
      refetchInterval: false, // Disable automatic refetching
    },
  );

  // Add mutation for recording withdrawal
  const recordWithdrawalMutation = trpc.earn.recordWithdrawal.useMutation();

  // Cache share decimals to avoid repeated RPC calls - use ref to avoid re-renders
  const cachedShareDecimalsRef = useRef<Record<string, number>>({});
  // Track if we're currently fetching to prevent duplicate calls
  const fetchingDecimalsRef = useRef<Set<string>>(new Set());

  // Update vault info when data changes
  useEffect(() => {
    if (!vaultData) return;

    const sharesBI = BigInt(vaultData.shares);
    const assetsBI = BigInt(vaultData.assets);

    // Check cache first to avoid repeated RPC calls
    const cachedDecimals = cachedShareDecimalsRef.current[vaultAddress];

    if (cachedDecimals !== undefined) {
      // Use cached value immediately
      setVaultInfo({
        shares: sharesBI,
        assets: assetsBI,
        assetDecimals: vaultData.decimals,
        shareDecimals: cachedDecimals,
        assetAddress: vaultData.assetAddress as Address,
      });
      return;
    }

    // Set default vault info immediately with fallback decimals
    setVaultInfo({
      shares: sharesBI,
      assets: assetsBI,
      assetDecimals: vaultData.decimals,
      shareDecimals: 18, // Default to 18 decimals
      assetAddress: vaultData.assetAddress as Address,
    });

    // Fetch decimals only if not already fetching
    if (!fetchingDecimalsRef.current.has(vaultAddress)) {
      fetchingDecimalsRef.current.add(vaultAddress);

      publicClient
        .readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'decimals',
        })
        .then((decimals) => {
          const decimalsNumber = Number(decimals);
          cachedShareDecimalsRef.current[vaultAddress] = decimalsNumber;
          fetchingDecimalsRef.current.delete(vaultAddress);

          // Update only if different from default
          if (decimalsNumber !== 18) {
            setVaultInfo((prev) =>
              prev
                ? {
                    ...prev,
                    shareDecimals: decimalsNumber,
                  }
                : null,
            );
          }
        })
        .catch((error) => {
          console.error('Failed to fetch share decimals:', error);
          cachedShareDecimalsRef.current[vaultAddress] = 18;
          fetchingDecimalsRef.current.delete(vaultAddress);
        });
    }
    // Only depend on vaultData and vaultAddress, not publicClient
  }, [vaultData, vaultAddress]);

  const handleWithdraw = async () => {
    if (!amount || !vaultInfo || !isRelayReady || !effectiveSafeAddress) return;

    try {
      setIsWithdrawing(true);
      const amountInSmallestUnit = parseUnits(amount, vaultInfo.assetDecimals);

      console.log('[WithdrawEarnCard] Starting withdrawal:', {
        chainId,
        isCrossChain,
        effectiveSafeAddress,
        targetSafeAddress,
        vaultAddress,
        amount: amountInSmallestUnit.toString(),
      });

      if (amountInSmallestUnit > vaultInfo.assets) {
        throw new Error('Amount exceeds available vault balance.');
      }

      const isMaxWithdrawal = amountInSmallestUnit >= vaultInfo.assets;

      // Convert the asset amount to shares using the vault's conversion function
      console.log('[WithdrawEarnCard] Converting assets to shares...', {
        assets: amountInSmallestUnit.toString(),
        vaultAddress,
      });

      let sharesToRedeem: bigint;

      if (isMaxWithdrawal) {
        sharesToRedeem = vaultInfo.shares;
      } else {
        sharesToRedeem = await publicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'convertToShares',
          args: [amountInSmallestUnit],
        });

        if (sharesToRedeem === 0n) {
          throw new Error(
            'Requested amount is below the minimum withdrawable size.',
          );
        }

        if (sharesToRedeem > vaultInfo.shares) {
          const roundingDelta = sharesToRedeem - vaultInfo.shares;
          // Allow for a one-wei rounding discrepancy, otherwise surface the error
          if (roundingDelta <= 1n) {
            sharesToRedeem = vaultInfo.shares;
          } else {
            throw new Error(
              `Insufficient shares. Required: ${formatUnits(sharesToRedeem, vaultInfo.shareDecimals)}, Available: ${formatUnits(vaultInfo.shares, vaultInfo.shareDecimals)}`,
            );
          }
        }
      }

      console.log(
        '[WithdrawEarnCard] Shares to redeem:',
        sharesToRedeem.toString(),
      );

      // Encode the redeem function call
      const redeemData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesToRedeem, effectiveSafeAddress, effectiveSafeAddress], // shares, receiver, owner
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

      console.log('[WithdrawEarnCard] Sending withdrawal tx via relay:', {
        safeAddress: effectiveSafeAddress,
        chainId,
        vaultAddress,
        transactions,
      });

      const userOpHash = await sendTxViaRelay(transactions, 600_000n); // Increased gas limit

      console.log('[WithdrawEarnCard] Withdrawal tx hash:', userOpHash);

      if (userOpHash) {
        // Record the withdrawal in the database
        await recordWithdrawalMutation.mutateAsync({
          safeAddress: effectiveSafeAddress,
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

  if (isLoadingVault || (isCrossChain && isLoadingPositions)) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // For cross-chain vaults, we need the target Safe to exist
  if (isCrossChain && !targetSafeAddress) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No account found on this chain. Please make a deposit first to create
          your account.
        </AlertDescription>
      </Alert>
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

  const hasAmountInput = amount.trim().length > 0;
  let parsedAmount: bigint | null = null;
  let amountParseFailed = false;

  if (hasAmountInput && vaultInfo) {
    try {
      parsedAmount = parseUnits(amount, vaultInfo.assetDecimals);
    } catch {
      amountParseFailed = true;
    }
  }

  const amountIsPositive = parsedAmount !== null && parsedAmount > 0n;
  const amountExceedsBalance =
    parsedAmount !== null && parsedAmount > vaultInfo.assets;

  const disableWithdraw =
    !hasAmountInput ||
    amountParseFailed ||
    !amountIsPositive ||
    amountExceedsBalance ||
    isWithdrawing ||
    !isRelayReady ||
    !effectiveSafeAddress;

  return (
    <div className="space-y-4">
      {/* Current Balance */}
      <div className="rounded-lg p-4 bg-white">
        <div className="text-sm text-muted-foreground mb-1 ">
          Available Balance
        </div>
        <div className="text-2xl font-bold ">
          <span className="text-[#0040FF]">${displayBalance}</span>{' '}
          <span className="text-sm">USD</span>
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
            <span className="text-xs text-[#0040FF]">USD</span>
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
          Enter the amount you want to withdraw
        </p>
      </div>

      {/* Withdraw Button */}
      <Button
        onClick={handleWithdraw}
        disabled={disableWithdraw}
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

      {amountParseFailed && (
        <p className="text-xs text-red-500 text-center">
          Unable to parse the withdrawal amount. Please check the format.
        </p>
      )}

      {amountExceedsBalance && (
        <p className="text-xs text-red-500 text-center">
          Amount exceeds your available vault balance.
        </p>
      )}
    </div>
  );
}
