'use client';

import { useState, useEffect } from 'react';
import {
  type Address,
  parseUnits,
  formatUnits,
  encodeFunctionData,
  parseAbi,
  createPublicClient,
  http,
} from 'viem';
import { base } from 'viem/chains';
import { toast } from 'sonner';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { useSafeOwnerCheck } from '@/hooks/use-safe-owner-check';
import { api } from '@/trpc/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowDown, CheckCircle, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// VAULT_ABI should contain redeem, convertToShares, and decimals (for shares)
const VAULT_ABI = parseAbi([
  'function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)',
  'function convertToShares(uint256 assets) external view returns (uint256 shares)', // Needed for asset withdrawal mode
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function decimals() external view returns (uint8)', // Vault/Share token decimals
  'function asset() external view returns (address)',
]);

interface WithdrawEarnCardProps {
  safeAddress?: Address;
  vaultAddress?: Address;
}

interface VaultInfo {
  shares: bigint;
  assets: bigint;
  assetDecimals: number;
  shareDecimals: number;
  assetAddress: Address;
}

export function WithdrawEarnCardAdvanced({
  safeAddress,
  vaultAddress,
}: WithdrawEarnCardProps) {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawType, setWithdrawType] = useState<'assets' | 'shares'>(
    'assets',
  );
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);
  const [isLoadingVaultInfo, setIsLoadingVaultInfo] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    show: boolean;
    amount: string;
    txHash: string;
  } | null>(null);

  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);
  const { isOwner, isChecking: isCheckingOwnership } =
    useSafeOwnerCheck(safeAddress);
  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  });

  const {
    data: fetchedVaultData,
    refetch: refetchVaultInfoTRPC,
    isLoading: isQueryingVaultInfoTRPC,
  } = api.earn.getVaultInfo.useQuery(
    { vaultAddress: vaultAddress || '0x' },
    {
      enabled: !!vaultAddress,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );

  // Effect to fetch full vault info including share decimals
  useEffect(() => {
    const fetchFullVaultDetails = async () => {
      if (fetchedVaultData && vaultAddress) {
        setIsLoadingVaultInfo(true);
        try {
          const shareTokenDecimals = await publicClient.readContract({
            address: vaultAddress,
            abi: VAULT_ABI,
            functionName: 'decimals',
          });
          setVaultInfo({
            shares: BigInt(fetchedVaultData.shares),
            assets: BigInt(fetchedVaultData.assets),
            assetDecimals: fetchedVaultData.decimals,
            shareDecimals: Number(shareTokenDecimals),
            assetAddress: fetchedVaultData.assetAddress as Address,
          });
          console.log('Full vault details with share decimals:', {
            ...fetchedVaultData,
            shareDecimals: Number(shareTokenDecimals),
          });
        } catch (error) {
          console.error('Failed to fetch share token decimals:', error);
          toast.error(
            'Failed to load complete vault details (share decimals).',
          );
          // Fallback if share decimals can't be fetched
          setVaultInfo({
            shares: BigInt(fetchedVaultData.shares),
            assets: BigInt(fetchedVaultData.assets),
            assetDecimals: fetchedVaultData.decimals, // Keep using the name from tRPC data here
            shareDecimals: 18,
            assetAddress: fetchedVaultData.assetAddress as Address,
          });
        } finally {
          setIsLoadingVaultInfo(false);
        }
      }
    };

    if (fetchedVaultData && !isQueryingVaultInfoTRPC) {
      fetchFullVaultDetails();
    } else if (isQueryingVaultInfoTRPC) {
      setIsLoadingVaultInfo(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedVaultData, vaultAddress, isQueryingVaultInfoTRPC]); // publicClient can be added if it's reactive

  const handleWithdraw = async () => {
    if (!safeAddress || !vaultAddress || !isRelayReady || !vaultInfo) {
      toast.error('Cannot withdraw: Missing required information.');
      return;
    }
    if (isOwner === false) {
      toast.error(
        'You are not an owner of this Safe and cannot perform withdrawals.',
      );
      return;
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    setIsProcessing(true);
    setTxHash(null);

    try {
      let sharesToRedeem: bigint;

      if (withdrawType === 'assets') {
        // User wants to withdraw a specific amount of assets (e.g., USDC)
        // Convert asset amount to shares using the vault's rate
        let assetsParsed: bigint;
        try {
          assetsParsed = parseUnits(withdrawAmount, vaultInfo.assetDecimals);
        } catch (e) {
          toast.error('Invalid withdrawal amount format for assets.');
          setIsProcessing(false);
          return;
        }

        if (assetsParsed > vaultInfo.assets) {
          toast.error('Amount exceeds available vault balance.');
          setIsProcessing(false);
          return;
        }

        const isMaxWithdrawal = assetsParsed >= vaultInfo.assets;

        toast.info('Calculating shares needed for asset amount...');

        if (isMaxWithdrawal) {
          sharesToRedeem = vaultInfo.shares;
        } else {
          sharesToRedeem = await publicClient.readContract({
            address: vaultAddress,
            abi: VAULT_ABI,
            functionName: 'convertToShares',
            args: [assetsParsed],
          });
        }

        console.log(
          `Calculated shares to redeem for ${withdrawAmount} assets: ${sharesToRedeem.toString()}`,
        );

        if (sharesToRedeem === 0n) {
          toast.error(
            'Requested amount is below the minimum withdrawable size.',
          );
          setIsProcessing(false);
          return;
        }

        // Sanity check: ensure user has enough shares
        if (sharesToRedeem > vaultInfo.shares) {
          const roundingDelta = sharesToRedeem - vaultInfo.shares;
          if (roundingDelta <= 1n) {
            sharesToRedeem = vaultInfo.shares;
          } else {
            toast.error(
              `Insufficient shares (${formatUnits(vaultInfo.shares, vaultInfo.shareDecimals)}) to withdraw ${withdrawAmount} assets. Calculated shares needed: ${formatUnits(sharesToRedeem, vaultInfo.shareDecimals)}`,
            );
            setIsProcessing(false);
            return;
          }
        }
      } else {
        // User wants to withdraw a specific amount of shares
        try {
          sharesToRedeem = parseUnits(withdrawAmount, vaultInfo.shareDecimals);
        } catch (e) {
          toast.error('Invalid withdrawal amount format for shares.');
          setIsProcessing(false);
          return;
        }
        console.log(`Redeeming specified shares: ${sharesToRedeem.toString()}`);

        // Sanity check: ensure user has enough shares
        if (sharesToRedeem > vaultInfo.shares) {
          toast.error(
            `Insufficient share balance (${formatUnits(vaultInfo.shares, vaultInfo.shareDecimals)}) to redeem ${withdrawAmount} shares.`,
          );
          setIsProcessing(false);
          return;
        }
      }

      // Always encode the redeem function call
      const txData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesToRedeem, safeAddress, safeAddress], // receiver and owner are the safe
      });

      const transactions = [
        { to: vaultAddress, value: '0', data: txData, operation: 0 },
      ];

      toast.info('Submitting redeem transaction...', { id: 'withdraw-tx' });
      const userOpHash = await sendTxViaRelay(transactions, 600_000n); // Increased gas limit
      setTxHash(userOpHash);
      toast.success('Redeem transaction submitted.', {
        id: 'withdraw-tx',
      });

      // Show success banner with the withdrawn amount
      setSuccessInfo({
        show: true,
        amount: withdrawAmount,
        txHash: userOpHash,
      });

      // Clear the input
      setWithdrawAmount('');

      // Refetch after a delay
      await new Promise((resolve) => setTimeout(resolve, 15000));
      refetchVaultInfoTRPC();
    } catch (error: any) {
      console.error('Failed to send redeem transaction:', error);
      // Try to provide a more specific error if available from simulateContract or vault revert
      let detailedMessage =
        error.shortMessage || error.message || 'Unknown error';
      if (error.cause?.toString().includes('ERC4626: redeem more than max')) {
        detailedMessage = 'Redeem amount exceeds available shares.';
      }
      toast.error(`Redeem failed: ${detailedMessage}`);
      setTxHash(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">
            No primary safe detected or selected.
          </p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure a primary safe is active to use this feature.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (!vaultAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">No vault address provided.</p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure the vault address is correctly configured.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingVaultInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  const formattedShares = vaultInfo
    ? Number(
        formatUnits(vaultInfo.shares, vaultInfo.shareDecimals),
      ).toLocaleString(undefined, { maximumFractionDigits: 8 })
    : '0';

  const formattedAssets = vaultInfo
    ? Number(
        formatUnits(vaultInfo.assets, vaultInfo.assetDecimals),
      ).toLocaleString(undefined, {
        maximumFractionDigits: vaultInfo.assetDecimals,
      })
    : '0';

  const hasAmountInput = withdrawAmount.trim().length > 0;
  let parsedAdvancedAmount: bigint | null = null;
  let advancedAmountParseFailed = false;
  let advancedAmountExceedsBalance = false;

  if (hasAmountInput && vaultInfo) {
    const decimals =
      withdrawType === 'assets'
        ? vaultInfo.assetDecimals
        : vaultInfo.shareDecimals;
    try {
      parsedAdvancedAmount = parseUnits(withdrawAmount, decimals);
    } catch {
      advancedAmountParseFailed = true;
    }

    if (parsedAdvancedAmount !== null) {
      if (withdrawType === 'assets') {
        advancedAmountExceedsBalance = parsedAdvancedAmount > vaultInfo.assets;
      } else {
        advancedAmountExceedsBalance = parsedAdvancedAmount > vaultInfo.shares;
      }
    }
  }

  const advancedAmountIsPositive =
    parsedAdvancedAmount !== null && parsedAdvancedAmount > 0n;

  const disableAdvancedWithdraw =
    !isRelayReady ||
    isProcessing ||
    isLoadingVaultInfo ||
    isCheckingOwnership ||
    isOwner === false ||
    !vaultInfo ||
    !hasAmountInput ||
    advancedAmountParseFailed ||
    !advancedAmountIsPositive ||
    advancedAmountExceedsBalance;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>
          Withdraw your funds from the Seamless Vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Success Banner */}
        {successInfo?.show && (
          <Alert className="bg-[#F0FDF4] border-[#10B981]/20 relative">
            <CheckCircle className="h-4 w-4 text-[#10B981]" />
            <button
              onClick={() => setSuccessInfo(null)}
              className="absolute top-2 right-2 text-[#101010]/40 hover:text-[#101010]/60 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertTitle className="text-[#101010]">
              Withdrawal Complete
            </AlertTitle>
            <AlertDescription className="text-[#101010]/70">
              <div className="space-y-1">
                <p>Withdrew ${successInfo.amount}</p>
                <p className="text-[12px] text-[#101010]/60">
                  Your balance may take up to 1 minute to update.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isOwner === false && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTitle className="text-red-900">Access Restricted</AlertTitle>
            <AlertDescription className="text-red-700">
              You are not an owner of this Safe. Only Safe owners can withdraw
              funds.
            </AlertDescription>
          </Alert>
        )}
        {isLoadingVaultInfo && !vaultInfo && (
          <>
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </>
        )}
        {vaultInfo && (
          <Alert className="bg-blue-50">
            <AlertTitle>Current Balance</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col space-y-1 mt-2">
                <div className="text-sm">
                  <span className="font-medium">Shares: </span>
                  {formattedShares} (Decimals: {vaultInfo.shareDecimals})
                </div>
                <div className="text-sm">
                  <span className="font-medium">Underlying Assets: </span>
                  {formattedAssets} USDC (Decimals: {vaultInfo.assetDecimals})
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col space-y-2">
          <Label htmlFor="withdraw-type">Withdraw Type</Label>
          <Select
            value={withdrawType}
            onValueChange={(value) =>
              setWithdrawType(value as 'assets' | 'shares')
            }
          >
            <SelectTrigger
              id="withdraw-type"
              disabled={isProcessing || isLoadingVaultInfo}
            >
              <SelectValue placeholder="Select withdraw type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assets">Underlying Asset (USDC)</SelectItem>
              <SelectItem value="shares">Vault Shares</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="withdraw-amount">
            Amount to Withdraw (
            {withdrawType === 'assets'
              ? `USDC (Asset Dec: ${vaultInfo?.assetDecimals || 'N/A'})`
              : `Shares (Share Dec: ${vaultInfo?.shareDecimals || 'N/A'})`}
            )
          </Label>
          <div className="relative">
            <Input
              id="withdraw-amount"
              type="text"
              placeholder="0.0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              disabled={isProcessing || isLoadingVaultInfo || !vaultInfo}
            />
            {vaultInfo && (
              <Button
                size="sm"
                variant="outline"
                className="absolute right-2 top-1.5 h-7"
                onClick={() => {
                  if (withdrawType === 'assets') {
                    setWithdrawAmount(
                      formatUnits(vaultInfo.assets, vaultInfo.assetDecimals),
                    );
                  } else {
                    setWithdrawAmount(
                      formatUnits(vaultInfo.shares, vaultInfo.shareDecimals),
                    );
                  }
                }}
                disabled={isProcessing || isLoadingVaultInfo}
              >
                Max
              </Button>
            )}
          </div>
        </div>

        {/* Transaction hash shown in success banner above */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleWithdraw}
          disabled={disableAdvancedWithdraw}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Withdraw / Redeem'
          )}
        </Button>

        {advancedAmountParseFailed && (
          <p className="text-xs text-red-500 text-center">
            Unable to parse the withdrawal amount. Please check the format.
          </p>
        )}

        {advancedAmountExceedsBalance && (
          <p className="text-xs text-red-500 text-center">
            Amount exceeds your available balance for the selected mode.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
