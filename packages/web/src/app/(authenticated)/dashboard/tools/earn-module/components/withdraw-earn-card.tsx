'use client';

import { useState, useEffect } from 'react';
import { type Address, parseUnits, formatUnits, encodeFunctionData, parseAbi } from 'viem';
import { toast } from 'sonner';
import { useSafeRelay } from '@/hooks/use-safe-relay';
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
import { Loader2, ArrowDown } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ERC4626 Vault ABI for withdraw and redeem functions
const VAULT_ABI = parseAbi([
  'function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)',
  'function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)',
  'function balanceOf(address owner) external view returns (uint256 shares)',
  'function convertToAssets(uint256 shares) external view returns (uint256 assets)',
  'function convertToShares(uint256 assets) external view returns (uint256 shares)',
  'function decimals() external view returns (uint8)',
  'function asset() external view returns (address)'
]);

interface WithdrawEarnCardProps {
  safeAddress?: Address;
  vaultAddress?: Address;
}

export function WithdrawEarnCard({ safeAddress, vaultAddress }: WithdrawEarnCardProps) {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawType, setWithdrawType] = useState<'assets' | 'shares'>('assets');
  const [vaultInfo, setVaultInfo] = useState<{
    shares: bigint;
    assets: bigint;
    decimals: number;
    assetAddress: Address;
  } | null>(null);
  const [isLoadingVaultInfo, setIsLoadingVaultInfo] = useState(false);
  
  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(safeAddress);

  // Use useQuery instead of direct API calls
  const { data: vaultData, refetch: refetchVaultInfo, isLoading: isQueryingVaultInfo } = 
    api.earn.getVaultInfo.useQuery(
      { safeAddress: safeAddress || '0x', vaultAddress: vaultAddress || '0x' },
      { 
        enabled: !!safeAddress && !!vaultAddress,
        retry: 1,
        onError: (error) => {
          console.error('Failed to fetch vault info:', error);
          toast.error(`Failed to load vault information: ${error.message || 'Unknown error'}`);
        },
        refetchOnWindowFocus: false
      }
    );

  // Update useEffect to use query data
  useEffect(() => {
    if (vaultData && !isQueryingVaultInfo) {
      setVaultInfo({
        shares: BigInt(vaultData.shares),
        assets: BigInt(vaultData.assets),
        decimals: vaultData.decimals,
        assetAddress: vaultData.assetAddress as Address
      });
      setIsLoadingVaultInfo(false);
    } else if (isQueryingVaultInfo) {
      setIsLoadingVaultInfo(true);
    }
  }, [vaultData, isQueryingVaultInfo]);

  const handleWithdraw = async () => {
    if (!safeAddress || !vaultAddress || !isRelayReady || !vaultInfo) {
      toast.error('Cannot withdraw: Missing required information or relay not ready.');
      return;
    }
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    setIsProcessing(true);
    setTxHash(null);
    
    try {
      // Parse the amount based on decimals - use appropriate decimals for the type
      // For assets, use asset decimals (likely 6 for USDC)
      // For shares, use 18 decimals (standard for ERC4626 shares)
      const amount = withdrawType === 'assets'
        ? parseUnits(withdrawAmount, vaultInfo.decimals)
        : parseUnits(withdrawAmount, 18); // Shares are always 18 decimals in ERC4626
      
      // Prepare transaction data
      let txData;
      if (withdrawType === 'assets') {
        // Withdraw specific amount of underlying assets
        txData = encodeFunctionData({
          abi: VAULT_ABI,
          functionName: 'withdraw',
          args: [amount, safeAddress, safeAddress]
        });
      } else {
        // Redeem specific amount of shares
        txData = encodeFunctionData({
          abi: VAULT_ABI,
          functionName: 'redeem',
          args: [amount, safeAddress, safeAddress]
        });
      }

      const transactions = [
        {
          to: vaultAddress,
          value: '0',
          data: txData,
          operation: 0, // CALL
        },
      ];

      toast.info('Submitting withdrawal transaction...', {
        id: 'withdraw-tx',
      });
      
      const userOpHash = await sendTxViaRelay(transactions, 300_000n);
      setTxHash(userOpHash);
      
      toast.success(
        'Withdrawal transaction submitted. Waiting for confirmation...',
        {
          description: `UserOp: ${userOpHash}`,
          id: 'withdraw-tx',
        },
      );
      
      // Wait for a bit then reload vault info
      await new Promise((resolve) => setTimeout(resolve, 15000));
      
      // Refetch vault info
      await refetchVaultInfo();
      
      toast.success('Vault balances updated');
    } catch (error: any) {
      console.error('Failed to send withdrawal transaction:', error);
      toast.error(
        `Transaction failed: ${error.shortMessage || error.message || 'Unknown error'}`,
      );
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
          <p className="text-orange-500">
            No vault address provided.
          </p>
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
    ? Number(formatUnits(vaultInfo.shares, 18)).toLocaleString(undefined, { maximumFractionDigits: 8 })
    : '0';
  
  const formattedAssets = vaultInfo 
    ? Number(formatUnits(vaultInfo.assets, vaultInfo.decimals)).toLocaleString(undefined, { maximumFractionDigits: vaultInfo.decimals })
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>
          Withdraw your funds from the Seamless Vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Alert className="bg-blue-50">
            <AlertTitle>Current Balance</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col space-y-1 mt-2">
                <div className="text-sm">
                  <span className="font-medium">Shares: </span>
                  {formattedShares}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Underlying Assets: </span>
                  {formattedAssets} USDC
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="withdraw-type">Withdraw Type</Label>
          <Select 
            value={withdrawType} 
            onValueChange={(value) => setWithdrawType(value as 'assets' | 'shares')}
          >
            <SelectTrigger id="withdraw-type">
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
            Amount to Withdraw ({withdrawType === 'assets' ? 'USDC' : 'Shares'})
          </Label>
          <div className="relative">
            <Input
              id="withdraw-amount"
              type="text"
              placeholder="0.0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              disabled={isProcessing}
            />
            {withdrawType === 'assets' && vaultInfo && (
              <Button
                size="sm"
                variant="outline"
                className="absolute right-2 top-1.5 h-7"
                onClick={() => setWithdrawAmount(formatUnits(vaultInfo.assets, vaultInfo.decimals))}
                disabled={isProcessing}
              >
                Max
              </Button>
            )}
            {withdrawType === 'shares' && vaultInfo && (
              <Button
                size="sm"
                variant="outline"
                className="absolute right-2 top-1.5 h-7"
                onClick={() => setWithdrawAmount(formatUnits(vaultInfo.shares, 18))}
                disabled={isProcessing}
              >
                Max
              </Button>
            )}
          </div>
        </div>

        {txHash && (
          <div className="mt-2">
            <p className="text-sm">Transaction submitted:</p>
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              {txHash} (View on Basescan)
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleWithdraw}
          disabled={
            !isRelayReady || 
            isProcessing || 
            !vaultInfo || 
            !withdrawAmount ||
            parseFloat(withdrawAmount) <= 0
          }
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Withdraw <ArrowDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 