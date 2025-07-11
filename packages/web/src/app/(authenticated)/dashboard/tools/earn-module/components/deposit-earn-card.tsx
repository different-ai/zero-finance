'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowDownToLine, Info, CheckCircle } from 'lucide-react';
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
  'function deposit(uint256 assets, address receiver) public returns (uint256 shares)',
  'function previewDeposit(uint256 assets) public view returns (uint256 shares)',
  'function maxDeposit(address receiver) public view returns (uint256)',
  'function asset() public view returns (address)',
  'function allowance(address owner, address spender) public view returns (uint256)',
]);

export function DepositEarnCard({ safeAddress, vaultAddress, onDepositSuccess }: DepositEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'approving' | 'depositing' | 'success' | 'error'>('idle');
  
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

  // Reset transaction status after a delay
  useEffect(() => {
    if (transactionStatus === 'success') {
      const timer = setTimeout(() => {
        setTransactionStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transactionStatus]);

  const handleApprove = async () => {
    if (!amount || !isRelayReady) return;

    try {
      setIsApproving(true);
      setTransactionStatus('approving');
      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
      
      console.log('Approving vault to spend USDC:', {
        amount: amountInSmallestUnit.toString(),
        vaultAddress,
        tokenAddress: USDC_ADDRESS,
      });

      // Encode approve function
      const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [vaultAddress, amountInSmallestUnit]
      });

      // Execute approval via Safe relay with higher gas limit
      const userOpHash = await sendTxViaRelay([{
        to: USDC_ADDRESS,
        value: '0',
        data: approveData,
      }], 300_000n); // Increase gas limit

      if (userOpHash) {
        console.log('Approval transaction sent:', userOpHash);
        
        toast({
          title: "Approval initiated",
          description: `Approving ${amount} USDC for deposit. Transaction ID: ${userOpHash.slice(0, 10)}...`,
        });

        // Wait a bit for the transaction to be mined
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        // Refetch allowance
        await refetchAllowance();
        
        setTransactionStatus('idle');
      }
    } catch (error) {
      console.error('Approval error:', error);
      setTransactionStatus('error');
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
      setTransactionStatus('depositing');
      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
      
      // Double-check allowance before deposit
      const currentAllowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [safeAddress, vaultAddress],
      });
      
      console.log('Current allowance:', formatUnits(currentAllowance, USDC_DECIMALS), 'USDC');
      
      if (currentAllowance < amountInSmallestUnit) {
        throw new Error(`Insufficient allowance. Please approve ${amount} USDC first.`);
      }
      
      // Verify the vault's underlying asset is USDC
      console.log('Verifying vault asset...');
      const vaultAsset = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'asset',
        args: [],
      });
      
      if (vaultAsset.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
        throw new Error(`Vault asset mismatch. Expected ${USDC_ADDRESS}, got ${vaultAsset}`);
      }
      
      // Preview deposit to see expected shares
      console.log('Previewing deposit...', {
        assets: amountInSmallestUnit.toString(),
        vaultAddress,
        safeAddress,
      });
      
      const expectedShares = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'previewDeposit',
        args: [amountInSmallestUnit],
      });
      
      console.log('Expected shares:', expectedShares.toString());
      
      // Check max deposit
      const maxDeposit = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'maxDeposit',
        args: [safeAddress],
      });
      
      console.log('Max deposit allowed:', formatUnits(maxDeposit, USDC_DECIMALS));
      
      if (amountInSmallestUnit > maxDeposit) {
        throw new Error(`Amount exceeds maximum deposit limit of ${formatUnits(maxDeposit, USDC_DECIMALS)} USDC`);
      }
      
      // Encode the deposit function call
      const depositData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountInSmallestUnit, safeAddress] // assets, receiver
      });

      console.log('Executing deposit transaction...', {
        to: vaultAddress,
        data: depositData,
        amount: formatUnits(amountInSmallestUnit, USDC_DECIMALS),
      });

      // Execute the deposit via Safe relay with higher gas limit
      const userOpHash = await sendTxViaRelay([{
        to: vaultAddress,
        value: '0',
        data: depositData,
      }], 500_000n); // Increase gas limit for deposit

      if (userOpHash) {
        console.log('Deposit transaction sent:', userOpHash);
        
        toast({
          title: "Deposit initiated",
          description: `Depositing ${amount} USDC. Transaction ID: ${userOpHash.slice(0, 10)}...`,
        });

        // Reset form
        setAmount('');
        setTransactionStatus('success');
        
        // Wait for transaction to be mined
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        // Refetch balances
        await fetchBalance();
        await refetchAllowance();
        
        if (onDepositSuccess) {
          onDepositSuccess();
        }
        
        toast({
          title: "Deposit successful",
          description: `Successfully deposited ${amount} USDC into the vault.`,
        });
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setTransactionStatus('error');
      
      // Provide more specific error messages
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for common error patterns
        if (error.message.includes('insufficient allowance')) {
          errorMessage = "Please approve the vault to spend your USDC first";
        } else if (error.message.includes('execution reverted')) {
          errorMessage = "Transaction failed. Please check your balance and try again";
        }
      }
      
      toast({
        title: "Deposit failed",
        description: errorMessage,
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
        {/* Transaction Status */}
        {transactionStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Deposit successful! Your funds are now earning yield.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Balance */}
        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm text-muted-foreground mb-1">USDC Balance</div>
          <div className="text-2xl font-bold">${displayBalance}</div>
          {currentAllowance > 0n && (
            <div className="text-xs text-muted-foreground mt-1">
              Approved: {formatUnits(currentAllowance, USDC_DECIMALS)} USDC
            </div>
          )}
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
              className="pr-24"
              step="0.000001"
              min="0"
              max={availableBalance}
              disabled={usdcBalance === 0n || isDepositing || isApproving}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-xs text-muted-foreground">USDC</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMax}
                className="h-6 px-1.5 text-xs"
                disabled={usdcBalance === 0n || isDepositing || isApproving}
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