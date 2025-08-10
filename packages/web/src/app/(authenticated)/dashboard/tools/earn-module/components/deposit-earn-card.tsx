'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, ArrowDownToLine, Info, CheckCircle, ExternalLink, Clock } from 'lucide-react';
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

type TransactionStep = 'idle' | 'checking' | 'approving' | 'waiting-approval' | 'depositing' | 'waiting-deposit' | 'success' | 'error';

interface TransactionState {
  step: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  depositedAmount?: string;
}

export function DepositEarnCard({ safeAddress, vaultAddress, onDepositSuccess }: DepositEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [transactionState, setTransactionState] = useState<TransactionState>({ step: 'idle' });
  
  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(safeAddress);
  const publicClient = createPublicClient({ chain: base, transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL) });

  // Reset state when vault changes
  useEffect(() => {
    console.log('[DepositEarnCard] Vault address changed to:', vaultAddress);
    setAmount('');
    setTransactionState({ step: 'idle' });
  }, [vaultAddress]);

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
  const { data: allowanceData, refetch: refetchAllowance, isLoading: isLoadingAllowance } = trpc.earn.checkAllowance.useQuery(
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

  // Single flow deposit handler
  const handleDeposit = async () => {
    if (!amount || !isRelayReady) return;

    const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
    const currentAllowance = allowanceData ? BigInt(allowanceData.allowance) : 0n;
    const needsApproval = amountInSmallestUnit > currentAllowance;

    try {
      // Step 1: Check requirements
      setTransactionState({ step: 'checking' });
      
      // Check balance
      if (amountInSmallestUnit > usdcBalance) {
        throw new Error(`Insufficient balance. You have ${formatUnits(usdcBalance, USDC_DECIMALS)} USDC`);
      }

      // Step 2: Approve if needed
      if (needsApproval) {
        setTransactionState({ step: 'approving' });
        
        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [vaultAddress, amountInSmallestUnit]
        });

        const approvalTxHash = await sendTxViaRelay([{
          to: USDC_ADDRESS,
          value: '0',
          data: approveData,
        }], 300_000n);

        if (!approvalTxHash) throw new Error('Approval transaction failed');

        setTransactionState({ 
          step: 'waiting-approval', 
          txHash: approvalTxHash 
        });

        // Wait for approval to be mined
        await new Promise(resolve => setTimeout(resolve, 7000));
        await refetchAllowance();
      }

      // Step 3: Execute deposit
      setTransactionState({ step: 'depositing' });

      // Verify vault asset
      const vaultAsset = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'asset',
        args: [],
      });
      
      if (vaultAsset.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
        throw new Error('Invalid vault asset configuration');
      }

      // Preview deposit
      const expectedShares = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'previewDeposit',
        args: [amountInSmallestUnit],
      });

      console.log('Expected shares:', expectedShares.toString());

      // Encode deposit
      const depositData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountInSmallestUnit, safeAddress]
      });

      const depositTxHash = await sendTxViaRelay([{
        to: vaultAddress,
        value: '0',
        data: depositData,
      }], 500_000n);

      if (!depositTxHash) throw new Error('Deposit transaction failed');

      setTransactionState({ 
        step: 'waiting-deposit', 
        txHash: depositTxHash 
      });

      // Wait for deposit to be mined
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Success!
      setTransactionState({ 
        step: 'success', 
        txHash: depositTxHash,
        depositedAmount: amount 
      });

      // Reset form and refetch data
      setAmount('');
      await fetchBalance();
      await refetchAllowance();
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }

    } catch (error) {
      console.error('Transaction error:', error);
      setTransactionState({ 
        step: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Transaction failed' 
      });
    }
  };

  const handleMax = () => {
    const maxAmount = formatUnits(usdcBalance, USDC_DECIMALS);
    setAmount(maxAmount);
  };

  const resetTransaction = () => {
    setTransactionState({ step: 'idle' });
  };

  // Loading skeleton
  if (isLoadingBalance || isLoadingAllowance) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
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

  // Calculate progress
  const getProgress = () => {
    switch (transactionState.step) {
      case 'checking': return 10;
      case 'approving': return 25;
      case 'waiting-approval': return 40;
      case 'depositing': return 60;
      case 'waiting-deposit': return 80;
      case 'success': return 100;
      default: return 0;
    }
  };

  // Transaction in progress
  if (transactionState.step !== 'idle' && transactionState.step !== 'success' && transactionState.step !== 'error') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Processing Transaction</span>
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
          
          <Progress value={getProgress()} className="h-2" />
          
          <div className="space-y-2">
            {(transactionState.step === 'checking') && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                Checking requirements...
              </div>
            )}
            
            {(transactionState.step === 'approving' || transactionState.step === 'waiting-approval') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  Step 1 of 2: Approving USDC
                </div>
                {transactionState.txHash && (
                  <a 
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View on BaseScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
            
            {(transactionState.step === 'depositing' || transactionState.step === 'waiting-deposit') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Step 2 of 2: Depositing USDC
                </div>
                {transactionState.txHash && (
                  <a 
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View on BaseScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Please wait while your transaction is being processed on Base network
        </p>
      </div>
    );
  }

  // Success state
  if (transactionState.step === 'success') {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="space-y-2">
            <div className="font-medium text-green-900">
              Successfully deposited {transactionState.depositedAmount} USDC!
            </div>
            <div className="text-green-800 text-sm">
              Your funds are now earning yield in the vault.
            </div>
            {transactionState.txHash && (
              <a 
                href={`https://basescan.org/tx/${transactionState.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-green-700 hover:underline"
              >
                View transaction on BaseScan
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          <Button 
            onClick={resetTransaction}
            variant="outline"
            className="flex-1"
          >
            Deposit More
          </Button>
          <Button 
            onClick={() => {
              resetTransaction();
              if (onDepositSuccess) onDepositSuccess();
            }}
            className="flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (transactionState.step === 'error') {
    return (
      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="space-y-2">
            <div className="font-medium text-red-900">
              Transaction Failed
            </div>
            <div className="text-red-800 text-sm">
              {transactionState.errorMessage}
            </div>
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={resetTransaction}
          variant="outline"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Default form state
  return (
    <div className="space-y-4">
      {/* Current Balance */}
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-2xl font-bold">${displayBalance}</div>
          </div>
          {currentAllowance > 0n && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Pre-approved</div>
              <div className="text-sm font-medium text-green-600">
                ${formatUnits(currentAllowance, USDC_DECIMALS)}
              </div>
            </div>
          )}
        </div>
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
            disabled={usdcBalance === 0n}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-xs text-muted-foreground">USDC</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMax}
              className="h-6 px-1.5 text-xs"
              disabled={usdcBalance === 0n}
            >
              Max
            </Button>
          </div>
        </div>
        {needsApproval && amount && (
          <p className="text-xs text-muted-foreground">
            Will require approval for {amount} USDC
          </p>
        )}
      </div>

      {/* Deposit Button */}
      <Button
        onClick={handleDeposit}
        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance) || !isRelayReady || usdcBalance === 0n}
        className="w-full"
        size="lg"
      >
        <ArrowDownToLine className="mr-2 h-4 w-4" />
        {needsApproval ? 'Approve & Deposit' : 'Deposit'}
      </Button>

      {/* No balance warning */}
      {usdcBalance === 0n && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have any USDC in your Safe wallet to deposit.
          </AlertDescription>
        </Alert>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground text-center">
        {needsApproval 
          ? 'This will approve and deposit in a single transaction flow'
          : 'Your deposit will start earning yield immediately'}
      </p>
    </div>
  );
}