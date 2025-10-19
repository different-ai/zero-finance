'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  AlertCircle,
  ArrowDownToLine,
  CheckCircle,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { Address } from 'viem';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  parseAbi,
  createPublicClient,
  http,
  erc20Abi,
} from 'viem';
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

type TransactionStep =
  | 'idle'
  | 'checking'
  | 'approving'
  | 'waiting-approval'
  | 'depositing'
  | 'waiting-deposit'
  | 'success'
  | 'error';

interface TransactionState {
  step: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  depositedAmount?: string;
}

export function DepositEarnCard({
  safeAddress,
  vaultAddress,
  onDepositSuccess,
}: DepositEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [transactionState, setTransactionState] = useState<TransactionState>({
    step: 'idle',
  });

  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);
  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  });

  // Reset state when vault changes
  useEffect(() => {
    console.log('[DepositEarnCard] Vault address changed to:', vaultAddress);
    setAmount('');
    setTransactionState({ step: 'idle' });
  }, [vaultAddress]);

  // Fetch USDC balance
  const [usdcBalance, setUsdcBalance] = useState<bigint>(0n);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const fetchBalance = async () => {
    if (!safeAddress) return;

    try {
      // Only show loading on first load, not on refetches
      if (!hasInitialLoad) {
        setIsLoadingBalance(true);
      }
      const balance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [safeAddress],
      });
      setUsdcBalance(balance);
      setHasInitialLoad(true);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setUsdcBalance(0n);
      setHasInitialLoad(true);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch balance on mount and after transactions
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Poll every 30 seconds instead of 10
    return () => {
      clearInterval(interval);
    };
  }, [safeAddress]);

  // Check current allowance
  const {
    data: allowanceData,
    refetch: refetchAllowance,
    isLoading: isLoadingAllowance,
  } = trpc.earn.checkAllowance.useQuery(
    {
      tokenAddress: USDC_ADDRESS,
      ownerAddress: safeAddress,
      spenderAddress: vaultAddress,
    },
    {
      enabled: !!safeAddress && !!vaultAddress,
      refetchInterval: 30000, // Reduced from 10s to 30s
      staleTime: 20000, // Consider data fresh for 20s
    },
  );

  // Single flow deposit handler
  const handleDeposit = async () => {
    if (!amount || !isRelayReady) return;

    const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
    const currentAllowance = allowanceData
      ? BigInt(allowanceData.allowance)
      : 0n;
    const needsApproval = amountInSmallestUnit > currentAllowance;

    console.log('[DepositEarnCard] Starting deposit flow:', {
      vault: vaultAddress,
      amount: amount,
      amountInSmallestUnit: amountInSmallestUnit.toString(),
      currentAllowance: currentAllowance.toString(),
      needsApproval,
      isRelayReady,
    });

    try {
      // Step 1: Check requirements
      setTransactionState({ step: 'checking' });

      // Check balance
      if (amountInSmallestUnit > usdcBalance) {
        throw new Error(
          `Insufficient balance. You have ${formatUnits(usdcBalance, USDC_DECIMALS)} USDC`,
        );
      }

      // Step 2: Approve if needed
      if (needsApproval) {
        setTransactionState((prev) => ({ ...prev, step: 'approving' }));

        console.log(
          'Approving',
          formatUnits(amountInSmallestUnit, USDC_DECIMALS),
          'USDC for vault:',
          vaultAddress,
        );

        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [vaultAddress, amountInSmallestUnit],
        });

        const approvalTxHash = await sendTxViaRelay(
          [
            {
              to: USDC_ADDRESS,
              value: '0',
              data: approveData,
            },
          ],
          300_000n,
        );

        if (!approvalTxHash) throw new Error('Approval transaction failed');

        setTransactionState({
          step: 'waiting-approval',
          txHash: approvalTxHash,
        });

        // Wait for approval to be mined and verify it succeeded
        await new Promise((resolve) => setTimeout(resolve, 7000));
        await refetchAllowance();

        // Verify the approval was successful
        const newAllowance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [safeAddress, vaultAddress],
        });

        console.log('New allowance after approval:', newAllowance.toString());

        if (newAllowance < amountInSmallestUnit) {
          throw new Error(
            'Approval transaction succeeded but allowance was not updated correctly',
          );
        }
      }

      // Step 3: Execute deposit
      setTransactionState((prev) => ({ ...prev, step: 'depositing' }));

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

      // Check max deposit limit
      const maxDepositLimit = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'maxDeposit',
        args: [safeAddress],
      });

      console.log('Max deposit limit:', maxDepositLimit.toString());
      console.log('Attempting to deposit:', amountInSmallestUnit.toString());

      if (amountInSmallestUnit > maxDepositLimit) {
        throw new Error(
          `Deposit amount exceeds vault limit. Maximum allowed: ${formatUnits(maxDepositLimit, USDC_DECIMALS)} USDC`,
        );
      }

      // Preview deposit
      let expectedShares: bigint;
      try {
        expectedShares = await publicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'previewDeposit',
          args: [amountInSmallestUnit],
        });
        console.log('Expected shares:', expectedShares.toString());
      } catch (previewError) {
        console.error('Preview deposit failed:', previewError);
        throw new Error(
          'Unable to preview deposit. The vault may be paused or have reached its capacity.',
        );
      }

      // Encode deposit
      const depositData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountInSmallestUnit, safeAddress],
      });

      // Use higher gas limit for Gauntlet vault (it might have more complex logic)
      const isGauntletVault =
        vaultAddress.toLowerCase() ===
        '0x236919f11ff9ea9550a4287696c2fc9e18e6e890';
      const gasLimit = isGauntletVault ? 750_000n : 500_000n;

      console.log(
        'Using gas limit:',
        gasLimit.toString(),
        'for vault:',
        vaultAddress,
      );

      const depositTxHash = await sendTxViaRelay(
        [
          {
            to: vaultAddress,
            value: '0',
            data: depositData,
          },
        ],
        gasLimit,
      );

      if (!depositTxHash) throw new Error('Deposit transaction failed');

      setTransactionState({
        step: 'waiting-deposit',
        txHash: depositTxHash,
      });

      // Wait for deposit to be mined
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // Success!
      setTransactionState({
        step: 'success',
        txHash: depositTxHash,
        depositedAmount: amount,
      });

      // Reset form and refetch data
      setAmount('');
      await fetchBalance();
      await refetchAllowance();

      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error) {
      console.error('[DepositEarnCard] Transaction error:', error);
      console.error('[DepositEarnCard] Error details:', {
        vault: vaultAddress,
        amount: amount,
        step: transactionState.step,
        errorType: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });

      // Provide more specific error messages
      let errorMessage = 'Transaction failed';
      if (error instanceof Error) {
        if (
          error.message.includes('insufficient funds') ||
          error.message.includes('Insufficient')
        ) {
          errorMessage = error.message;
        } else if (
          error.message.includes('User denied') ||
          error.message.includes('rejected')
        ) {
          errorMessage = 'Transaction was cancelled';
        } else if (error.message.includes('gas')) {
          errorMessage =
            'Transaction ran out of gas. Please try again with a smaller amount.';
        } else if (
          error.message.includes('vault limit') ||
          error.message.includes('capacity')
        ) {
          errorMessage = error.message;
        } else if (error.message.includes('allowance')) {
          errorMessage = 'Token approval failed. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setTransactionState((prev) => ({
        ...prev,
        step: 'error',
        errorMessage,
      }));
    }
  };

  const handleMax = () => {
    const maxAmount = formatUnits(usdcBalance, USDC_DECIMALS);
    setAmount(maxAmount);
  };

  const resetTransaction = () => {
    setTransactionState({ step: 'idle' });
  };

  // Only show loading skeleton on very first load, never on data refetches
  const showSkeleton = isLoadingBalance && !hasInitialLoad;

  const currentAllowance = allowanceData ? BigInt(allowanceData.allowance) : 0n;
  const availableBalance = formatUnits(usdcBalance, USDC_DECIMALS);
  const displayBalance = parseFloat(availableBalance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    },
  );

  // Show skeleton only on initial load, not on data updates
  if (showSkeleton) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      </div>
    );
  }

  // Check if we need approval
  const amountInSmallestUnit = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const needsApproval = amountInSmallestUnit > currentAllowance;

  // Calculate progress
  const getProgress = () => {
    switch (transactionState.step) {
      case 'checking':
        return 10;
      case 'approving':
        return 25;
      case 'waiting-approval':
        return 40;
      case 'depositing':
        return 60;
      case 'waiting-deposit':
        return 80;
      case 'success':
        return 100;
      default:
        return 0;
    }
  };

  // Transaction in progress
  if (
    transactionState.step !== 'idle' &&
    transactionState.step !== 'success' &&
    transactionState.step !== 'error'
  ) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#101010]/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#101010]">
              Processing Transaction
            </span>
            <Loader2 className="h-4 w-4 animate-spin text-[#1B29FF]" />
          </div>

          <div className="relative h-2 bg-[#101010]/5 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#1B29FF] transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="space-y-2">
            {transactionState.step === 'checking' && (
              <div className="flex items-center gap-2 text-[12px] text-[#101010]/60">
                <Clock className="h-3 w-3" />
                Checking requirements...
              </div>
            )}

            {(transactionState.step === 'approving' ||
              transactionState.step === 'waiting-approval') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#FFA500] animate-pulse" />
                  Step 1 of 2: Approving USDC
                </div>
                {transactionState.txHash && (
                  <a
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    View on BaseScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {(transactionState.step === 'depositing' ||
              transactionState.step === 'waiting-deposit') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#1B29FF] animate-pulse" />
                  Step 2 of 2: Depositing USDC
                </div>
                {transactionState.txHash && (
                  <a
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    View on BaseScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#101010]/50 text-center">
          Please wait while your transaction is being processed on Base network
        </p>
      </div>
    );
  }

  // Success state
  if (transactionState.step === 'success') {
    return (
      <div className="space-y-4">
        <div className="bg-[#F6F5EF] border border-[#10B981]/20 p-4">
          <div className="flex gap-3">
            <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="text-[14px] font-medium text-[#101010]">
                Successfully deposited {transactionState.depositedAmount} USDC
              </div>
              <div className="text-[12px] text-[#101010]/70">
                Your funds are now earning yield in the vault.
              </div>
              {transactionState.txHash && (
                <a
                  href={`https://basescan.org/tx/${transactionState.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                >
                  View transaction on BaseScan
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetTransaction}
            className="flex-1 px-3 py-2 text-[13px] text-[#101010] bg-white border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
          >
            Deposit More
          </button>
          <button
            onClick={() => {
              resetTransaction();
              if (onDepositSuccess) onDepositSuccess();
            }}
            className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (transactionState.step === 'error') {
    return (
      <div className="space-y-4">
        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-4 w-4 text-[#FFA500] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-[14px] font-medium text-[#101010]">
                Transaction Failed
              </div>
              <div className="text-[12px] text-[#101010]/70">
                {transactionState.errorMessage}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={resetTransaction}
          className="w-full px-3 py-2 text-[13px] text-[#101010] bg-white border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Default form state
  return (
    <div className="space-y-4">
      {/* Current Balance */}
      <div className="bg-[#F7F7F2] border border-[#101010]/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
              Available Balance
            </p>
            <p className="text-[24px] font-medium tabular-nums text-[#101010]">
              ${displayBalance}
            </p>
          </div>
          {currentAllowance > 0n && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-[#101010]/50">
                Pre-approved
              </p>
              <p className="text-[14px] font-medium tabular-nums text-[#10B981]">
                ${formatUnits(currentAllowance, USDC_DECIMALS)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label
          htmlFor="deposit-amount"
          className="text-[12px] font-medium text-[#101010]"
        >
          Amount to Deposit
        </label>
        <div className="relative">
          <input
            id="deposit-amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 pr-20 text-[14px] bg-white border border-[#101010]/10 focus:border-[#1B29FF] focus:outline-none transition-colors"
            step="0.000001"
            min="0"
            max={availableBalance}
            disabled={usdcBalance === 0n}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[11px] text-[#101010]/50">USD</span>
            <button
              type="button"
              onClick={handleMax}
              className="px-1.5 py-0.5 text-[10px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
              disabled={usdcBalance === 0n}
            >
              MAX
            </button>
          </div>
        </div>
        {needsApproval && amount && (
          <p className="text-[11px] text-[#101010]/50">
            Will require approval for ${amount}
          </p>
        )}
      </div>

      {/* Deposit Button */}
      <button
        onClick={handleDeposit}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > parseFloat(availableBalance) ||
          !isRelayReady ||
          usdcBalance === 0n
        }
        className="w-full px-4 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <ArrowDownToLine className="h-4 w-4" />
        {needsApproval ? 'Approve & Deposit' : 'Deposit'}
      </button>

      {/* No balance warning */}
      {usdcBalance === 0n && (
        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-3">
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#FFA500] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#101010]/70">
              No balance available to deposit. Wire funds to your account to get
              started.
            </p>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-[11px] text-[#101010]/50 text-center">
        {needsApproval
          ? 'This will approve and deposit in a single transaction flow'
          : 'Your deposit will start earning yield immediately'}
      </p>
    </div>
  );
}
