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
import type { Address, Hex } from 'viem';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  createPublicClient,
  http,
  erc20Abi,
} from 'viem';
import { base, arbitrum } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import {
  ACROSS_SPOKE_POOLS,
  USDC_ADDRESSES,
  getMulticallHandler,
} from '@/lib/constants/across';
import { type CrossChainVault } from '@/server/earn/cross-chain-vaults';
import { getSafeDeploymentTransaction } from '@/lib/safe-multi-chain';

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
  | 'preparing'
  | 'deploying-safe'
  | 'waiting-safe-deployment'
  | 'approving'
  | 'waiting-approval'
  | 'transferring'
  | 'waiting-transfer'
  | 'complete'
  | 'error';

interface TransactionState {
  step: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  bridgedAmount?: string;
  safeDeployed?: boolean;
}

export function CrossChainDepositCard({
  vault,
  safeAddress,
  onDepositSuccess,
}: CrossChainDepositCardProps) {
  const [amount, setAmount] = useState('');
  const [transactionState, setTransactionState] = useState<TransactionState>({
    step: 'idle',
    safeDeployed: false,
  });

  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);
  const { client: smartWalletClient, getClientForChain } = useSmartWallets();
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
      setTransactionState({ step: 'preparing' });

      // Check balance
      if (amountInSmallestUnit > usdcBalance) {
        throw new Error(
          `Insufficient balance. You have ${formatUnits(usdcBalance, USDC_DECIMALS)} USDC`,
        );
      }

      // Check if Safe exists on destination chain, deploy if needed
      console.log(
        '[CrossChainDeposit] Checking Safe deployment on destination chain...',
      );

      const destinationClient = createPublicClient({
        chain: arbitrum,
        transport: http(
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
            'https://arb1.arbitrum.io/rpc',
        ),
      });

      const safeCode = await destinationClient.getCode({
        address: safeAddress,
      });

      let safeWasDeployed = false;
      if (!safeCode || safeCode === '0x') {
        // Safe doesn't exist - deploy it using user's smart wallet on Arbitrum
        console.log(
          '[CrossChainDeposit] Safe not found on Arbitrum, deploying via user wallet...',
        );
        setTransactionState({ step: 'deploying-safe', safeDeployed: false });

        // Get wallet client for Arbitrum chain
        // Arbitrum chain ID is 42161
        console.log('[CrossChainDeposit] Getting Arbitrum wallet client...');
        let arbitrumWalletClient;
        try {
          arbitrumWalletClient = await getClientForChain({
            id: 42161, // Arbitrum One
          });
        } catch (error) {
          console.error(
            '[CrossChainDeposit] Error getting Arbitrum client:',
            error,
          );
          throw new Error(
            'Unable to get Arbitrum wallet client. Your wallet may not support Arbitrum yet. Please contact support.',
          );
        }

        if (!arbitrumWalletClient) {
          throw new Error(
            'Arbitrum wallet client not available. Please ensure your wallet supports Arbitrum.',
          );
        }

        console.log(
          '[CrossChainDeposit] Successfully obtained Arbitrum wallet client',
        );

        // Generate deployment transaction
        const deployTx = await getSafeDeploymentTransaction(
          safeAddress,
          8453, // Base chain ID (source)
          vault.chainId, // Destination chain ID (Arbitrum)
        );

        if (!deployTx) {
          throw new Error('Safe already exists on destination chain');
        }

        console.log(
          '[CrossChainDeposit] Sending Safe deployment transaction to Arbitrum...',
        );

        // Send deployment transaction using user's smart wallet on Arbitrum
        const deployTxHash = await arbitrumWalletClient.sendTransaction({
          to: deployTx.to,
          data: deployTx.data,
          value: deployTx.value,
          chain: arbitrum,
        });

        console.log(
          '[CrossChainDeposit] ✅ Safe deployment tx sent:',
          deployTxHash,
        );
        setTransactionState({
          step: 'waiting-safe-deployment',
          safeDeployed: true,
        });

        // Wait for deployment to be mined
        console.log(
          '[CrossChainDeposit] Waiting for Safe deployment confirmation...',
        );

        await destinationClient.waitForTransactionReceipt({
          hash: deployTxHash as Hex,
          confirmations: 1,
        });

        console.log('[CrossChainDeposit] ✅ Safe deployed successfully');
        safeWasDeployed = true;

        // Wait a bit for deployment to settle
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      console.log(
        '[CrossChainDeposit] Safe verified on Arbitrum, preparing deposit...',
      );

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
          300_000n,
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

      // Step 2: Transfer to vault
      setTransactionState({ step: 'transferring' });

      const now = Math.floor(Date.now() / 1000);
      const fillDeadline = now + 3600; // 1 hour
      const exclusivityDeadline = 0; // No exclusivity

      const outputToken =
        USDC_ADDRESSES[vault.chainId as keyof typeof USDC_ADDRESSES];

      if (!outputToken) {
        throw new Error(`USDC not supported on chain ${vault.chainId}`);
      }

      // Get MulticallHandler address for destination chain
      const multicallHandler = getMulticallHandler(vault.chainId);
      if (!multicallHandler) {
        throw new Error(
          `MulticallHandler not deployed on chain ${vault.chainId}`,
        );
      }

      // Encode calls for automatic vault deposit
      // Call 1: Approve USDC for vault
      const approveCall = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [vault.address, outputAmount],
      });

      // Call 2: Deposit to vault
      const depositCall = encodeFunctionData({
        abi: [
          {
            name: 'deposit',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'assets', type: 'uint256' },
              { name: 'receiver', type: 'address' },
            ],
            outputs: [{ name: 'shares', type: 'uint256' }],
          },
        ] as const,
        functionName: 'deposit',
        args: [outputAmount, safeAddress],
      });

      // Encode multicall message for Across MulticallHandler
      // Format: Call[] where Call = {target, callData, value}
      // See: https://docs.across.to/developer-quickstart/embedded-crosschain-actions
      const calls = [
        { target: outputToken, callData: approveCall, value: 0n },
        { target: vault.address, callData: depositCall, value: 0n },
      ];

      const message = encodeFunctionData({
        abi: [
          {
            name: 'multicall',
            type: 'function',
            inputs: [
              {
                name: 'calls',
                type: 'tuple[]',
                components: [
                  { name: 'target', type: 'address' },
                  { name: 'callData', type: 'bytes' },
                  { name: 'value', type: 'uint256' },
                ],
              },
            ],
            outputs: [],
          },
        ] as const,
        functionName: 'multicall',
        args: [calls],
      });

      console.log('[CrossChainDeposit] Encoded automatic deposit message:', {
        multicallHandler,
        outputToken,
        vaultAddress: vault.address,
        outputAmount: outputAmount.toString(),
        callsCount: calls.length,
        messageLength: message.length,
      });

      const bridgeData = encodeFunctionData({
        abi: ACROSS_ABI,
        functionName: 'depositV3',
        args: [
          safeAddress, // depositor (who is sending the tokens)
          multicallHandler, // recipient (MulticallHandler will receive tokens + execute message)
          USDC_ADDRESS, // inputToken (USDC on Base)
          outputToken, // outputToken (USDC on destination)
          amountInSmallestUnit, // inputAmount
          outputAmount, // outputAmount (after fee)
          BigInt(vault.chainId), // destinationChainId
          '0x0000000000000000000000000000000000000000' as Address, // exclusiveRelayer (none)
          now, // quoteTimestamp
          fillDeadline, // fillDeadline
          exclusivityDeadline, // exclusivityDeadline
          message as `0x${string}`, // message (multicall: approve + deposit to vault)
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
        500_000n,
      );

      if (!bridgeTxHash) throw new Error('Transfer failed');

      console.log(
        '[CrossChainDeposit] ✅ Bridge transaction sent on Base:',
        bridgeTxHash,
      );
      console.log('[CrossChainDeposit] 📊 Deposit summary:');
      console.log(`  - Amount: $${amount} USDC`);
      console.log(
        `  - Input (Base): $${formatUnits(amountInSmallestUnit, USDC_DECIMALS)}`,
      );
      console.log(
        `  - Output (Arbitrum): $${formatUnits(outputAmount, USDC_DECIMALS)}`,
      );
      console.log(`  - Bridge fee: $${estimatedFee}`);
      console.log(`  - Destination vault: ${vault.address}`);
      console.log(`  - Your Safe: ${safeAddress}`);
      console.log(
        '[CrossChainDeposit] ⏳ Waiting for Across bridge to settle (~20-60 seconds)...',
      );

      setTransactionState({
        step: 'waiting-transfer',
        txHash: bridgeTxHash,
      });

      // Wait for transfer to complete
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // Success!
      console.log('[CrossChainDeposit] ✅ Deposit complete!');
      console.log('[CrossChainDeposit] 🔍 To check your Arbitrum balance:');
      console.log(`  1. Open browser console`);
      console.log(`  2. Look for "[CrossChainWithdraw] Assets value" logs`);
      console.log(`  3. Click "Refresh" button in the withdraw card`);
      console.log(`  4. Wait 20-60 seconds if balance still shows $0`);
      console.log(
        '[CrossChainDeposit] 📍 Check Arbiscan:',
        `https://arbiscan.io/address/${safeAddress}`,
      );

      setTransactionState({
        step: 'complete',
        txHash: bridgeTxHash,
        bridgedAmount: amount,
        safeDeployed: safeWasDeployed,
      });

      setAmount('');
      await fetchBalance();
      await fetchAllowance();

      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error) {
      console.error('[CrossChainDeposit] Error:', error);

      let errorMessage = 'Deposit failed';
      if (error instanceof Error) {
        if (error.message.includes('Insufficient')) {
          errorMessage = error.message;
        } else if (
          error.message.includes('denied') ||
          error.message.includes('rejected')
        ) {
          errorMessage = 'Deposit was cancelled';
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
  const displayBalance = parseFloat(availableBalance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    },
  );

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
        case 'preparing':
          return 10;
        case 'deploying-safe':
          return 20;
        case 'waiting-safe-deployment':
          return 30;
        case 'approving':
          return 45;
        case 'waiting-approval':
          return 60;
        case 'transferring':
          return 75;
        case 'waiting-transfer':
          return 90;
        default:
          return 0;
      }
    };

    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#101010]/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#101010]">
              Processing deposit...
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
            {transactionState.step === 'preparing' && (
              <div className="flex items-center gap-2 text-[12px] text-[#101010]/60">
                <Clock className="h-3 w-3" />
                Preparing deposit...
              </div>
            )}

            {(transactionState.step === 'deploying-safe' ||
              transactionState.step === 'waiting-safe-deployment') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#1B29FF] animate-pulse" />
                  Step 1 of 3: Setting up your account on Arbitrum
                </div>
                <p className="text-[11px] text-[#101010]/60">
                  Deploying your Safe account on Arbitrum. This is a one-time
                  setup (~10-30 seconds).
                </p>
              </div>
            )}

            {(transactionState.step === 'approving' ||
              transactionState.step === 'waiting-approval') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#FFA500] animate-pulse" />
                  Step 2 of 3: Approving transfer
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

            {(transactionState.step === 'transferring' ||
              transactionState.step === 'waiting-transfer') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#1B29FF] animate-pulse" />
                  Step 3 of 3: Completing deposit
                </div>
                <p className="text-[11px] text-[#101010]/60">
                  Your funds will start earning in ~30 seconds
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
                {transactionState.safeDeployed
                  ? 'Account setup complete!'
                  : 'Deposit successful'}
              </div>
              <div className="text-[12px] text-[#101010]/70">
                {transactionState.safeDeployed
                  ? `Your account has been set up on Arbitrum and $${transactionState.bridgedAmount} has been deposited. Your funds will start earning in ~30 seconds.`
                  : `$${transactionState.bridgedAmount} deposited. Your funds will start earning in ~30 seconds.`}
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

        <div className="p-4 bg-[#F7F7F2] border border-[#10B981]/20">
          <div className="space-y-2">
            <p className="text-[12px] font-medium text-[#101010]">
              Deposit in Progress
            </p>
            <p className="text-[11px] text-[#101010]/70">
              Your deposit is processing. This typically takes 20-30 seconds.
            </p>
            <p className="text-[11px] text-[#101010]/60">
              Your balance will update automatically when complete.
            </p>
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
                Deposit Failed
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
        <label
          htmlFor="bridge-amount"
          className="text-[12px] font-medium text-[#101010]"
        >
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

      {/* Deposit Summary */}
      {amount && (
        <div className="p-3 bg-[#F7F7F2] rounded-lg space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Amount deposited:</span>
            <span className="font-medium text-[#101010]">
              ~${estimatedReceived}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Transfer fee:</span>
            <span className="font-medium text-[#101010]/60">
              ~${estimatedFee}
            </span>
          </div>
        </div>
      )}

      {/* Info about automatic deposit */}
      <div className="flex items-start gap-2 p-3 bg-[#F7F7F2] border border-[#1B29FF]/20">
        <CheckCircle className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
        <div className="text-xs text-[#101010]">
          <p className="font-medium">Automatic deposit</p>
          <p className="mt-1 text-[#101010]/70">
            Your funds will be automatically deposited and start earning
            immediately.
          </p>
        </div>
      </div>

      {/* Deposit Button */}
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
        {needsApproval ? 'Approve & Deposit' : 'Deposit'}
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
        Deposits complete in ~30 seconds
      </p>
    </div>
  );
}
