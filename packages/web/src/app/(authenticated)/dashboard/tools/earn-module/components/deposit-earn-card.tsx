'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowDownToLine, Info } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { toast } from '@/components/ui/use-toast';
import type { Address } from 'viem';
import { formatUnits, parseUnits, encodeFunctionData, parseAbi, createPublicClient, http, erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';

interface DepositEarnCardProps {
  safeAddress: Address;
  vaultAddress: Address;
  onDepositSuccess?: () => void;
}

// ERC4626 Vault ABI for deposits
const VAULT_ABI = parseAbi([
  'function deposit(uint256 assets, address receiver) external returns (uint256 shares)',
  'function previewDeposit(uint256 assets) external view returns (uint256 shares)',
  'function maxDeposit(address receiver) external view returns (uint256)',
]);

export function DepositEarnCard({ safeAddress, vaultAddress, onDepositSuccess }: DepositEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(safeAddress);
  const publicClient = createPublicClient({ chain: base, transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL) });

  // Fetch USDC balance
  const [usdcBalance, setUsdcBalance] = useState<bigint>(0n);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  
  const fetchBalance = async () => {
    if (!safeAddress) return;
    
    try {
      setIsLoadingBalance(true);
      const balance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [safeAddress],
      });
      setUsdcBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setUsdcBalance(0n);
    } finally {
      setIsLoadingBalance(false);
    }
  };
  
  // Fetch balance on mount and after transactions
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [safeAddress]);

  // Check current allowance
  const { data: allowanceData, refetch: refetchAllowance } = trpc.earn.checkAllowance.useQuery(
    {
      tokenAddress: USDC_ADDRESS,
      ownerAddress: safeAddress,
      spenderAddress: vaultAddress,
    },
    {
      enabled: !!safeAddress && !!vaultAddress,
      refetchInterval: 10000,
    }
  );

  const handleApprove = async () => {
    if (!amount || !isRelayReady) return;

    try {
      setIsApproving(true);
      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
      
      // Encode approve function
      const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [vaultAddress, amountInSmallestUnit]
      });

      // Execute approval via Safe relay
      const userOpHash = await sendTxViaRelay([{
        to: USDC_ADDRESS,
        value: '0',
        data: approveData,
      }]);

      if (userOpHash) {
        toast({
          title: "Approval initiated",
          description: `Approving ${amount} USDC for deposit. Transaction ID: ${userOpHash.slice(0, 10)}...`,
        });

        // Wait a bit and refetch allowance
        setTimeout(() => {
          refetchAllowance();
        }, 5000);
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Approval failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !isRelayReady) return;

    try {
      setIsDepositing(true);
      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
      
      // Preview deposit to see expected shares
      console.log('Previewing deposit...', {
        assets: amountInSmallestUnit.toString(),
        vaultAddress
      });
      
      const expectedShares = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'previewDeposit',
        args: [amountInSmallestUnit],
      });
      
      console.log('Expected shares:', expectedShares.toString());
      
      // Encode the deposit function call
      const depositData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountInSmallestUnit, safeAddress] // assets, receiver
      });

      // Execute the deposit via Safe relay
      const userOpHash = await sendTxViaRelay([{
        to: vaultAddress,
        value: '0',
        data: depositData,
      }]);

      if (userOpHash) {
        toast({
          title: "Deposit initiated",
          description: `Depositing ${amount} USDC. Transaction ID: ${userOpHash.slice(0, 10)}...`,
        });

        // Reset form
        setAmount('');
        
        // Refetch balances after a delay
        setTimeout(() => {
          fetchBalance();
          refetchAllowance();
          if (onDepositSuccess) {
            onDepositSuccess();
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleMax = () => {
    const maxAmount = formatUnits(usdcBalance, USDC_DECIMALS);
    setAmount(maxAmount);
  };

  if (isLoadingBalance) {
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

  const currentAllowance = allowanceData ? BigInt(allowanceData.allowance) : 0n;
  const availableBalance = formatUnits(usdcBalance, USDC_DECIMALS);
  const displayBalance = parseFloat(availableBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  // Check if we need approval
  const amountInSmallestUnit = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const needsApproval = amountInSmallestUnit > currentAllowance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownToLine className="h-5 w-5" />
          Deposit Funds
        </CardTitle>
        <CardDescription>
          Manually deposit USDC into the vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm text-muted-foreground mb-1">USDC Balance</div>
          <div className="text-2xl font-bold">${displayBalance}</div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Amount to Deposit</Label>
          <div className="relative">
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-20"
              step="0.000001"
              min="0"
              max={availableBalance}
              disabled={usdcBalance === 0n}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">USDC</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMax}
                className="h-7 px-2 text-xs"
                disabled={usdcBalance === 0n}
              >
                Max
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the amount of USDC you want to deposit into the vault
          </p>
        </div>

        {/* Approval/Deposit Button */}
        {needsApproval ? (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You need to approve the vault to spend your USDC before depositing.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleApprove}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance) || isApproving || !isRelayReady}
              className="w-full"
              size="lg"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve USDC'
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance) || isDepositing || !isRelayReady || usdcBalance === 0n}
            className="w-full"
            size="lg"
          >
            {isDepositing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Deposit'
            )}
          </Button>
        )}

        {/* No balance warning */}
        {usdcBalance === 0n && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don&apos;t have any USDC in your Safe wallet to deposit.
            </AlertDescription>
          </Alert>
        )}

        {/* Help text */}
        <p className="text-xs text-muted-foreground text-center">
          Deposits are processed through your Safe wallet and will earn yield automatically
        </p>
      </CardContent>
    </Card>
  );
} 