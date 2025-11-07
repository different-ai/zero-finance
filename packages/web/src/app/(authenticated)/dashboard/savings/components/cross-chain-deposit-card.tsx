'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type { Address } from 'viem';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  createPublicClient,
  http,
  erc20Abi,
} from 'viem';
import { base } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import { ACROSS_SPOKE_POOLS, USDC_ADDRESSES } from '@/lib/constants/across';
import { type CrossChainVault } from '@/server/earn/cross-chain-vaults';

interface CrossChainDepositCardProps {
  vault: CrossChainVault;
  safeAddress: Address;
  onDepositSuccess?: () => void;
}

// Across SpokePool V3 ABI (simplified)
const ACROSS_ABI = [
  {
    inputs: [
      { name: 'depositor', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'inputToken', type: 'address' },
      { name: 'outputToken', type: 'address' },
      { name: 'inputAmount', type: 'uint256' },
      { name: 'outputAmount', type: 'uint256' },
      { name: 'destinationChainId', type: 'uint256' },
      { name: 'exclusiveRelayer', type: 'address' },
      { name: 'quoteTimestamp', type: 'uint32' },
      { name: 'fillDeadline', type: 'uint32' },
      { name: 'exclusivityDeadline', type: 'uint32' },
      { name: 'message', type: 'bytes' },
    ],
    name: 'depositV3',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

type TransactionStep =
  | 'idle'
  | 'checking'
  | 'approving'
  | 'waiting-approval'
  | 'bridging'
  | 'waiting-bridge'
  | 'complete'
  | 'error';

interface TransactionState {
  step: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  bridgedAmount?: string;
}

export function CrossChainDepositCard({
  vault,
  safeAddress,
  onDepositSuccess,
}: CrossChainDepositCardProps) {
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

  // Fetch USDC balance
  const [usdcBalance, setUsdcBalance] = useState<bigint>(0n);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const fetchBalance = async () => {
    if (!safeAddress) return;
    try {
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

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [safeAddress]);

  // Check allowance for Across SpokePool
  const [allowance, setAllowance] = useState<bigint>(0n);

  const fetchAllowance = async () => {
    if (!safeAddress) return;
    try {
      const spokePoolBase = ACROSS_SPOKE_POOLS[8453]; // Base
      const currentAllowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [safeAddress, spokePoolBase],
      });
      setAllowance(currentAllowance);
    } catch (error) {
      console.error('Error fetching allowance:', error);
    }
  };

  useEffect(() => {
    fetchAllowance();
  }, [safeAddress]);

  const handleBridge = async () => {
    if (!amount || !isRelayReady) return;

    const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
    const needsApproval = amountInSmallestUnit > allowance;

    // Apply 0.5% fee (Across typical fee)
    const fee = amountInSmallestUnit / 200n; // 0.5%
    const outputAmount = amountInSmallestUnit - fee;

    console.log('[CrossChainDeposit] Starting bridge:', {
      amount,
      amountInSmallestUnit: amountInSmallestUnit.toString(),
      outputAmount: outputAmount.toString(),
      needsApproval,
      destinationChain: vault.chainId,
    });

    try {
      setTransactionState({ step: 'checking' });

      // Check balance
      if (amountInSmallestUnit > usdcBalance) {
        throw new Error(
          `Insufficient balance. You have ${formatUnits(usdcBalance, USDC_DECIMALS)} USDC`
        );
      }

      const spokePoolBase = ACROSS_SPOKE_POOLS[8453]; // Base SpokePool

      // Step 1: Approve Across SpokePool if needed
      if (needsApproval) {
        setTransactionState({ step: 'approving' });

        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [spokePoolBase, amountInSmallestUnit],
        });

        const approvalTxHash = await sendTxViaRelay(
          [
            {
              to: USDC_ADDRESS,
              value: '0',
              data: approveData,
            },
          ],
          300_000n
        );

        if (!approvalTxHash) throw new Error('Approval transaction failed');

        setTransactionState({
          step: 'waiting-approval',
          txHash: approvalTxHash,
        });

        // Wait for approval
        await new Promise((resolve) => setTimeout(resolve, 7000));
        await fetchAllowance();

        // Verify approval
        const newAllowance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [safeAddress, spokePoolBase],
        });

        if (newAllowance < amountInSmallestUnit) {
          throw new Error('Approval failed');
        }
      }

      // Step 2: Bridge via Across Protocol
      setTransactionState({ step: 'bridging' });

      const now = Math.floor(Date.now() / 1000);
      const fillDeadline = now + 3600; // 1 hour
      const exclusivityDeadline = 0; // No exclusivity

      const outputToken = USDC_ADDRESSES[vault.chainId as keyof typeof USDC_ADDRESSES];
      
      if (!outputToken) {
        throw new Error(`USDC not supported on chain ${vault.chainId}`);
      }

      const bridgeData = encodeFunctionData({
        abi: ACROSS_ABI,
        functionName: 'depositV3',
        args: [
          safeAddress, // depositor
          safeAddress, // recipient (same address on destination chain!)
          USDC_ADDRESS, // inputToken (USDC on Base)
          outputToken, // outputToken (USDC on destination)
          amountInSmallestUnit, // inputAmount
          outputAmount, // outputAmount (after fee)
          BigInt(vault.chainId), // destinationChainId
          '0x0000000000000000000000000000000000000000' as Address, // exclusiveRelayer (none)
          now, // quoteTimestamp
          fillDeadline, // fillDeadline
          exclusivityDeadline, // exclusivityDeadline
          '0x' as `0x${string}`, // message (empty)
        ],
      });

      const bridgeTxHash = await sendTxViaRelay(
        [
          {
            to: spokePoolBase,
            value: '0',
            data: bridgeData,
          },
        ],
        500_000n
      );

      if (!bridgeTxHash) throw new Error('Bridge transaction failed');

      setTransactionState({
        step: 'waiting-bridge',
        txHash: bridgeTxHash,
      });

      // Wait for bridge
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // Success!
      setTransactionState({
        step: 'complete',
        txHash: bridgeTxHash,
        bridgedAmount: amount,
      });

      setAmount('');
      await fetchBalance();
      await fetchAllowance();

      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error) {
      console.error('[CrossChainDeposit] Error:', error);

      let errorMessage = 'Bridge failed';
      if (error instanceof Error) {
        if (error.message.includes('Insufficient')) {
          errorMessage = error.message;
        } else if (error.message.includes('denied') || error.message.includes('rejected')) {
          errorMessage = 'Transaction was cancelled';
        } else {
          errorMessage = error.message;
        }
      }

      setTransactionState({
        step: 'error',
        errorMessage,
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

  const availableBalance = formatUnits(usdcBalance, USDC_DECIMALS);
  const displayBalance = parseFloat(availableBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  const amountInSmallestUnit = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const needsApproval = amountInSmallestUnit > allowance;
  const estimatedFee = amount ? (Number(amount) * 0.005).toFixed(2) : '0';
  const estimatedReceived = amount ? (Number(amount) * 0.995).toFixed(2) : '0';

  // Loading skeleton
  if (isLoadingBalance) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      </div>
    );
  }

  // Transaction in progress
  if (
    transactionState.step !== 'idle' &&
    transactionState.step !== 'complete' &&
    transactionState.step !== 'error'
  ) {
    const getProgress = () => {
      switch (transactionState.step) {
        case 'checking':
          return 10;
        case 'approving':
          return 25;
        case 'waiting-approval':
          return 40;
        case 'bridging':
          return 60;
        case 'waiting-bridge':
          return 80;
        default:
          return 0;
      }
    };

    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#101010]/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#101010]">Bridging to {vault.chainName}</span>
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
                  Step 1 of 2: Approving USDC for Across Protocol
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

            {(transactionState.step === 'bridging' ||
              transactionState.step === 'waiting-bridge') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#1B29FF] animate-pulse" />
                  Step 2 of 2: Bridging USDC to {vault.chainName}
                </div>
                <p className="text-[11px] text-[#101010]/60">
                  Relayers will deliver your USDC in ~20 seconds
                </p>
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
          Please wait while your transaction is being processed
        </p>
      </div>
    );
  }

  // Complete state
  if (transactionState.step === 'complete') {
    return (
      <div className="space-y-4">
        <div className="bg-[#F6F5EF] border border-[#10B981]/20 p-4">
          <div className="flex gap-3">
            <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="text-[14px] font-medium text-[#101010]">
                Successfully bridged {transactionState.bridgedAmount} USDC to {vault.chainName}
              </div>
              <div className="text-[12px] text-[#101010]/70">
                Your USDC will arrive on {vault.chainName} in ~20 seconds.
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

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <p className="text-sm font-medium text-blue-900">Next Steps:</p>
          <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
            <li>Wait ~20 seconds for USDC to arrive on {vault.chainName}</li>
            <li>Switch to {vault.chainName} network in your wallet</li>
            <li>Visit Morpho app to complete your deposit</li>
          </ol>
          <a
            href={vault.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Open Morpho App on {vault.chainName} <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetTransaction}
            className="flex-1 px-3 py-2 text-[13px] text-[#101010] bg-white border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
          >
            Bridge More
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
              <div className="text-[14px] font-medium text-[#101010]">Bridge Failed</div>
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
          {allowance > 0n && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-[#101010]/50">
                Pre-approved
              </p>
              <p className="text-[14px] font-medium tabular-nums text-[#10B981]">
                ${formatUnits(allowance, USDC_DECIMALS)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label htmlFor="bridge-amount" className="text-[12px] font-medium text-[#101010]">
          Amount to Bridge
        </label>
        <div className="relative">
          <input
            id="bridge-amount"
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
      </div>

      {/* Bridge Details */}
      {amount && (
        <div className="p-3 bg-[#F7F7F2] rounded-lg space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Bridge from:</span>
            <span className="font-medium">Base</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Bridge to:</span>
            <span className="font-medium">{vault.chainName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Estimated fee:</span>
            <span className="font-medium text-[#FFA500]">~${estimatedFee} (0.5%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">You will receive:</span>
            <span className="font-medium text-[#10B981]">~${estimatedReceived}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Estimated time:</span>
            <span className="font-medium">~20 seconds</span>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800">
          <p className="font-medium">Manual deposit required</p>
          <p className="mt-1 text-yellow-700">
            After bridging, you'll need to manually deposit to the vault on {vault.chainName} using
            the Morpho app.
          </p>
        </div>
      </div>

      {/* Bridge Button */}
      <button
        onClick={handleBridge}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > parseFloat(availableBalance) ||
          !isRelayReady ||
          usdcBalance === 0n
        }
        className="w-full px-4 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        {needsApproval ? `Approve & Bridge to ${vault.chainName}` : `Bridge to ${vault.chainName}`}
      </button>

      {/* No balance warning */}
      {usdcBalance === 0n && (
        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-3">
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#FFA500] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#101010]/70">
              No balance available. Wire funds to your account to get started.
            </p>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-[11px] text-[#101010]/50 text-center">
        Powered by Across Protocol • Funds arrive in ~20 seconds
      </p>
    </div>
  );
}
