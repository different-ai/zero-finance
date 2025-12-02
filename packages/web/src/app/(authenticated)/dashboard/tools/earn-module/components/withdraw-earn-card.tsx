'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Loader2,
  AlertCircle,
  ArrowUpFromLine,
  CheckCircle,
  ExternalLink,
  Rocket,
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import type { Address } from 'viem';
import { cn } from '@/lib/utils';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  encodePacked,
  parseAbi,
  createPublicClient,
  http,
} from 'viem';
import { base, arbitrum, gnosis } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import {
  ALL_BASE_VAULTS,
  ORIGIN_SUPER_OETH_VAULT,
} from '@/server/earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
} from '@safe-global/protocol-kit';

// Contract addresses for superOETH → ETH swap on Base
const SUPER_OETH_ADDRESS =
  '0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3' as const;
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006' as const;
const SLIPSTREAM_ROUTER = '0xBE6D8f0d05cC4be24d5167a3eF062215bE6D18a5' as const;
const TICK_SPACING = 1; // 0.01% fee tier for superOETH/WETH CL pool

interface WithdrawEarnCardProps {
  safeAddress: Address; // Base Safe address (used as fallback for Base chain)
  vaultAddress: Address;
  onWithdrawSuccess?: () => void;
  chainId?: number; // Target chain for the vault (default: Base)
  isTechnical?: boolean; // Bimodal interface toggle
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

// ERC20 ABI for approve
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
]);

// Aerodrome SlipStream Router ABI for exactInput
const SLIPSTREAM_ROUTER_ABI = parseAbi([
  'function exactInput((bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)) external payable returns (uint256 amountOut)',
]);

// WETH ABI for unwrap
const WETH_ABI = parseAbi(['function withdraw(uint256 wad) external']);

// Transaction state management for two-phase loading
type WithdrawStep =
  | 'idle'
  | 'checking' // Checking Safe deployment status
  | 'needs-safe-deployment' // Safe not deployed on target chain
  | 'deploying-safe' // Deploying Safe on target chain
  | 'processing' // Sending transaction
  | 'confirming' // Transaction sent, waiting for chain confirmation
  | 'indexing' // Chain confirmed, waiting for balance update
  | 'success' // All done
  | 'error';

interface DeploymentInfo {
  chainId: number;
  predictedAddress: string;
}

interface WithdrawState {
  step: WithdrawStep;
  txHash?: string;
  errorMessage?: string;
  withdrawnAmount?: string;
  outputAsset?: string;
  deploymentInfo?: DeploymentInfo;
}

export function WithdrawEarnCard({
  safeAddress,
  vaultAddress,
  onWithdrawSuccess,
  chainId = 8453, // Default to Base
  isTechnical = false,
}: WithdrawEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);
  const [withdrawState, setWithdrawState] = useState<WithdrawState>({
    step: 'idle',
  });

  // Track initial balance for poll-until-changed
  const initialBalanceRef = useRef<bigint | null>(null);

  // Look up vault config to determine asset symbol
  const vaultConfig = useMemo(() => {
    const allVaults = [...ALL_BASE_VAULTS, ...ALL_CROSS_CHAIN_VAULTS];
    return allVaults.find(
      (v) => v.address.toLowerCase() === vaultAddress.toLowerCase(),
    );
  }, [vaultAddress]);

  // Determine asset symbol for display - handle type differences
  const assetSymbol = useMemo(() => {
    if (vaultConfig && 'asset' in vaultConfig) {
      return (
        (vaultConfig as { asset?: { symbol?: string } }).asset?.symbol || 'USD'
      );
    }
    return 'USD';
  }, [vaultConfig]);

  const isNativeAsset = useMemo(() => {
    if (vaultConfig && 'asset' in vaultConfig) {
      return (
        (vaultConfig as { asset?: { isNative?: boolean } }).asset?.isNative ||
        false
      );
    }
    return false;
  }, [vaultConfig]);

  // Detect if this is the wsuperOETHb vault (needs special multicall to withdraw to ETH)
  const isSuperOethVault = useMemo(() => {
    return (
      vaultAddress.toLowerCase() ===
      ORIGIN_SUPER_OETH_VAULT.address.toLowerCase()
    );
  }, [vaultAddress]);

  // Determine if this is a cross-chain withdrawal (vault on different chain than Base)
  const isCrossChain = chainId !== SUPPORTED_CHAINS.BASE;

  // Fetch user's multi-chain positions to get the correct Safe addresses
  // IMPORTANT: Always fetch - needed for Base chain too, not just cross-chain
  // The safeAddress prop may come from workspace-scoped query which can be wrong
  const { data: multiChainPositions, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: true, // Always fetch to get authoritative Safe addresses
      staleTime: 30000,
    });

  // Get the Safe address for the target chain from multiChainPositions
  // This is the authoritative source (user-scoped, not workspace-scoped)
  const baseSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.BASE,
  )?.address as Address | undefined;

  const targetSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === chainId,
  )?.address as Address | undefined;

  // Use the correct Safe address: prefer multiChainPositions, fallback to prop
  const effectiveSafeAddress = (
    isCrossChain
      ? targetSafeAddress || safeAddress
      : baseSafeAddress || safeAddress
  ) as Address;

  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    effectiveSafeAddress,
    chainId,
  );

  // Select chain based on chainId
  const isArbitrum = chainId === 42161;
  const isGnosis = chainId === 100;
  const chain = isGnosis ? gnosis : isArbitrum ? arbitrum : base;
  const rpcUrl = isGnosis
    ? process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || 'https://rpc.gnosischain.com'
    : isArbitrum
      ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
        'https://arb1.arbitrum.io/rpc'
      : process.env.NEXT_PUBLIC_BASE_RPC_URL;

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  // Smart wallet client for Safe deployment
  const { client: defaultSmartClient, getClientForChain } = useSmartWallets();

  // tRPC utilities for refetching
  const trpcUtils = trpc.useUtils();

  // Safe deployment mutation - for deploying Safe on target chain
  const safeDeploymentMutation = trpc.earn.getSafeDeploymentTx.useMutation();

  // Register Safe mutation - for registering deployed Safe in DB
  const registerSafeMutation = trpc.earn.registerDeployedSafe.useMutation();

  // Track whether Safe is actually deployed on-chain (not just in DB)
  const [isSafeDeployedOnChain, setIsSafeDeployedOnChain] = useState<
    boolean | null
  >(null);
  const [isCheckingDeployment, setIsCheckingDeployment] = useState(false);

  // Check if Safe is actually deployed on-chain (bytecode check)
  useEffect(() => {
    if (!isCrossChain || !targetSafeAddress || isCheckingDeployment) return;

    const checkSafeDeployment = async () => {
      setIsCheckingDeployment(true);
      try {
        console.log(
          '[WithdrawEarnCard] Checking if Safe is deployed on-chain:',
          targetSafeAddress,
          'chainId:',
          chainId,
        );

        const code = await publicClient.getBytecode({
          address: targetSafeAddress,
        });

        const isDeployed = !!(code && code !== '0x');
        console.log(
          '[WithdrawEarnCard] Safe deployment check result:',
          isDeployed,
        );
        setIsSafeDeployedOnChain(isDeployed);

        if (!isDeployed && withdrawState.step === 'idle') {
          // Safe exists in DB but not on-chain - need deployment
          console.log(
            '[WithdrawEarnCard] Safe registered but not deployed, prompting deployment',
          );
          setWithdrawState({
            step: 'needs-safe-deployment',
            deploymentInfo: {
              chainId: chainId,
              predictedAddress: targetSafeAddress,
            },
          });
        }
      } catch (err) {
        console.error(
          '[WithdrawEarnCard] Failed to check Safe deployment:',
          err,
        );
        setIsSafeDeployedOnChain(false);
      } finally {
        setIsCheckingDeployment(false);
      }
    };

    checkSafeDeployment();
  }, [isCrossChain, targetSafeAddress, chainId, publicClient]);

  // Check if Safe needs to be deployed on target chain (for cross-chain withdrawals)
  const needsSafeDeployment = useMemo(() => {
    if (!isCrossChain) return false;
    if (isLoadingPositions) return false;
    // If no target Safe address exists in DB, we need to deploy
    if (!targetSafeAddress) return true;
    // If Safe exists in DB but not deployed on-chain, we need to deploy
    if (isSafeDeployedOnChain === false) return true;
    return false;
  }, [
    isCrossChain,
    isLoadingPositions,
    targetSafeAddress,
    isSafeDeployedOnChain,
  ]);

  // Auto-trigger deployment flow if no Safe address at all in DB
  useEffect(() => {
    if (
      isCrossChain &&
      !isLoadingPositions &&
      !targetSafeAddress &&
      withdrawState.step === 'idle'
    ) {
      console.log(
        '[WithdrawEarnCard] No target Safe found in DB for chainId:',
        chainId,
        '- fetching deployment info',
      );

      // Fetch predicted address for the Safe
      safeDeploymentMutation
        .mutateAsync({
          targetChainId: chainId,
          safeType: 'primary',
        })
        .then(
          (res: {
            to: string;
            data: string;
            value: string;
            predictedAddress: string;
          }) => {
            setWithdrawState({
              step: 'needs-safe-deployment',
              deploymentInfo: {
                chainId: chainId,
                predictedAddress: res.predictedAddress,
              },
            });
          },
        )
        .catch((err: Error) => {
          console.error(
            '[WithdrawEarnCard] Failed to fetch deployment info:',
            err,
          );
          setWithdrawState({
            step: 'error',
            errorMessage: 'Failed to load account setup info. Please refresh.',
          });
        });
    }
  }, [
    isCrossChain,
    isLoadingPositions,
    targetSafeAddress,
    chainId,
    withdrawState.step,
  ]);

  // Reset state when vault changes
  useEffect(() => {
    console.log(
      '[WithdrawEarnCard] Vault address changed to:',
      vaultAddress,
      'chainId:',
      chainId,
    );
    setAmount('');
    setWithdrawState({ step: 'idle' });
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
      // Capture initial balance for poll-until-changed
      initialBalanceRef.current = vaultInfo.assets;

      setWithdrawState({ step: 'processing' });
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

      // Build transactions array
      const transactions: Array<{
        to: Address;
        value: string;
        data: `0x${string}`;
        operation?: number;
      }> = [];

      // For superOETH vault, build multicall: redeem → approve → swap → unwrap
      if (isSuperOethVault) {
        // 1. Redeem wsuperOETHb → superOETHb (assets go to Safe)
        transactions.push({
          to: vaultAddress,
          value: '0',
          data: redeemData,
          operation: 0,
        });

        // The amount we'll get from redeem is approximately amountInSmallestUnit
        // We use the full amount for subsequent operations
        const superOethAmount = amountInSmallestUnit;

        // 2. Approve superOETHb to SlipStream Router
        const approveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [SLIPSTREAM_ROUTER, superOethAmount],
        });
        transactions.push({
          to: SUPER_OETH_ADDRESS,
          value: '0',
          data: approveData,
          operation: 0,
        });

        // 3. Swap superOETHb → WETH via Aerodrome SlipStream
        // Using exactInput with encoded path (handles sqrtPriceLimitX96 automatically)
        const path = encodePacked(
          ['address', 'int24', 'address'],
          [SUPER_OETH_ADDRESS, TICK_SPACING, WETH_ADDRESS],
        );

        // Calculate minimum output with 1% slippage (superOETH ~= 1:1 with ETH)
        const minOut = (superOethAmount * 99n) / 100n;
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800); // 30 min

        const swapData = encodeFunctionData({
          abi: SLIPSTREAM_ROUTER_ABI,
          functionName: 'exactInput',
          args: [
            {
              path,
              recipient: effectiveSafeAddress,
              deadline,
              amountIn: superOethAmount,
              amountOutMinimum: minOut,
            },
          ],
        });
        transactions.push({
          to: SLIPSTREAM_ROUTER,
          value: '0',
          data: swapData,
          operation: 0,
        });

        // 4. Unwrap WETH → ETH
        const unwrapData = encodeFunctionData({
          abi: WETH_ABI,
          functionName: 'withdraw',
          args: [minOut], // Unwrap the minimum expected amount
        });
        transactions.push({
          to: WETH_ADDRESS,
          value: '0',
          data: unwrapData,
          operation: 0,
        });

        console.log('[WithdrawEarnCard] SuperOETH multicall transactions:', {
          count: transactions.length,
          steps: [
            'redeem wsuperOETHb',
            'approve superOETHb',
            'swap to WETH',
            'unwrap to ETH',
          ],
        });
      } else {
        // Standard vault: just redeem
        transactions.push({
          to: vaultAddress,
          value: '0',
          data: redeemData,
          operation: 0,
        });
      }

      console.log('[WithdrawEarnCard] Sending withdrawal tx via relay:', {
        safeAddress: effectiveSafeAddress,
        chainId,
        vaultAddress,
        isSuperOethVault,
        transactionCount: transactions.length,
      });

      // Use higher gas for superOETH multicall (4 operations)
      const gasLimit = isSuperOethVault ? 2_000_000n : 1_200_000n;

      // Phase 1: Send transaction
      setWithdrawState({ step: 'confirming' });
      const userOpHash = await sendTxViaRelay(transactions, gasLimit);

      console.log('[WithdrawEarnCard] Withdrawal tx hash:', userOpHash);

      if (!userOpHash) {
        throw new Error('Transaction failed - no hash returned');
      }

      // Record the withdrawal in the database
      await recordWithdrawalMutation.mutateAsync({
        safeAddress: effectiveSafeAddress,
        vaultAddress: vaultAddress,
        tokenAddress: vaultInfo.assetAddress,
        assetsWithdrawn: amountInSmallestUnit.toString(),
        sharesBurned: sharesToRedeem.toString(),
        userOpHash: userOpHash,
      });

      // Phase 2: Poll until balance changes
      setWithdrawState({
        step: 'indexing',
        txHash: userOpHash,
        withdrawnAmount: amount,
        outputAsset: isSuperOethVault ? 'ETH' : assetSymbol,
      });

      // Start polling for balance change - don't await, let it run in background
      const pollForBalanceChange = async () => {
        const maxAttempts = 20; // 20 seconds max
        let attempts = 0;
        const initialBalance = initialBalanceRef.current ?? 0n;

        const checkBalance = async (): Promise<void> => {
          attempts++;

          // Refetch and get the fresh data directly from the query result
          const result = await refetchVaultInfo();
          const freshData = result.data;

          if (freshData) {
            const newBalance = BigInt(freshData.assets);
            console.log('[WithdrawEarnCard] Polling balance:', {
              attempt: attempts,
              initialBalance: initialBalance.toString(),
              newBalance: newBalance.toString(),
              changed: newBalance !== initialBalance,
            });

            if (newBalance !== initialBalance) {
              // Balance changed - show success
              setWithdrawState({
                step: 'success',
                txHash: userOpHash,
                withdrawnAmount: amount,
                outputAsset: isSuperOethVault ? 'ETH' : assetSymbol,
              });
              // Trigger parent callback to refresh other components
              onWithdrawSuccess?.();
              return;
            }
          }

          if (attempts >= maxAttempts) {
            // Timeout - show success anyway (transaction was confirmed)
            console.log('[WithdrawEarnCard] Polling timeout, showing success');
            setWithdrawState({
              step: 'success',
              txHash: userOpHash,
              withdrawnAmount: amount,
              outputAsset: isSuperOethVault ? 'ETH' : assetSymbol,
            });
            onWithdrawSuccess?.();
            return;
          }

          // Keep polling
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return checkBalance();
        };

        // Start polling after a short delay to let the transaction propagate
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await checkBalance();
      };

      pollForBalanceChange();
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawState({
        step: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
      toast.error(
        `Withdrawal failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      );
    }
  };

  const handleMax = () => {
    if (!vaultInfo) return;
    const maxAmount = formatUnits(vaultInfo.assets, vaultInfo.assetDecimals);
    setAmount(maxAmount);
  };

  // Loading state
  if (isLoadingVault || (isCrossChain && isLoadingPositions)) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      </div>
    );
  }

  // For cross-chain vaults, we need the target Safe to exist
  if (isCrossChain && !targetSafeAddress) {
    return (
      <div className="bg-[#FFF7ED] border border-[#F59E0B]/20 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#101010]/70">
            No account found on this chain. Please make a deposit first to
            create your account.
          </div>
        </div>
      </div>
    );
  }

  // No balance state
  if (!vaultInfo || vaultInfo.assets === 0n) {
    return (
      <div className="bg-[#F7F7F2] border border-[#101010]/10 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-[#101010]/40 flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#101010]/60 space-y-1">
            <div>No funds available to withdraw from this vault.</div>
            {isTechnical && (
              <div className="font-mono text-[10px] text-[#101010]/40 space-y-0.5">
                <div>Safe: {effectiveSafeAddress}</div>
                <div>Vault: {vaultAddress}</div>
                <div>Chain: {chainId}</div>
                <div>
                  Shares: {vaultInfo?.shares?.toString() ?? 'null'} | Assets:{' '}
                  {vaultInfo?.assets?.toString() ?? 'null'}
                </div>
                {baseSafeAddress &&
                  baseSafeAddress !== effectiveSafeAddress && (
                    <div className="text-orange-500">
                      Base Safe differs: {baseSafeAddress}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
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

  const isProcessing = [
    'processing',
    'confirming',
    'indexing',
    'deploying-safe',
  ].includes(withdrawState.step);

  const disableWithdraw =
    !hasAmountInput ||
    amountParseFailed ||
    !amountIsPositive ||
    amountExceedsBalance ||
    isProcessing ||
    !isRelayReady ||
    !effectiveSafeAddress ||
    needsSafeDeployment;

  // Handle dismissing success banner
  const handleDismissSuccess = () => {
    setWithdrawState({ step: 'idle' });
    setAmount('');
    // Final refetch to ensure UI is up to date
    refetchVaultInfo();
  };

  // Success banner component - shown at top of form
  const SuccessBanner = () => {
    if (withdrawState.step !== 'success') return null;

    // Format amount for banking mode (no token symbols, use $)
    const displayAmount = isTechnical
      ? `${withdrawState.withdrawnAmount} ${withdrawState.outputAsset}`
      : withdrawState.outputAsset === 'ETH'
        ? `${withdrawState.withdrawnAmount} ETH`
        : `$${withdrawState.withdrawnAmount}`;

    return (
      <div
        className={cn(
          'p-4 mb-4 relative',
          isTechnical
            ? 'bg-[#10B981]/5 border border-[#10B981]/30'
            : 'bg-[#F0FDF4] border border-[#10B981]/20',
        )}
      >
        <button
          onClick={handleDismissSuccess}
          className="absolute top-2 right-2 text-[#101010]/40 hover:text-[#101010]/60 transition-colors"
          aria-label="Dismiss"
        >
          <span className="text-[16px]">×</span>
        </button>
        <div className="flex gap-3">
          <CheckCircle className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1 pr-4">
            <div
              className={cn(
                'text-[14px] font-medium text-[#101010]',
                isTechnical && 'font-mono',
              )}
            >
              {isTechnical
                ? `WITHDRAWAL::COMPLETE — ${displayAmount}`
                : `Withdrew ${displayAmount}`}
            </div>
            <p
              className={cn(
                'text-[12px] text-[#101010]/70',
                isTechnical && 'font-mono',
              )}
            >
              {isTechnical
                ? 'NOTE: BALANCE_UPDATE may take up to 60s'
                : 'Your balance may take up to 1 minute to update.'}
            </p>
            {/* Only show transaction link in technical mode */}
            {isTechnical && withdrawState.txHash && (
              <a
                href={`https://basescan.org/tx/${withdrawState.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1B29FF] hover:text-[#1420CC]"
              >
                VIEW_TX
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Processing banner component - shown during withdrawal processing
  const ProcessingBanner = () => {
    if (!isProcessing) return null;

    const statusMessage = {
      processing: isTechnical ? 'SIGNING_TX...' : 'Processing withdrawal...',
      confirming: isTechnical
        ? 'CONFIRMING_ON_CHAIN...'
        : 'Confirming on chain...',
      indexing: isTechnical ? 'UPDATING_BALANCES...' : 'Updating balances...',
    }[withdrawState.step as 'processing' | 'confirming' | 'indexing'];

    return (
      <div
        className={cn(
          'p-4 mb-4 relative',
          isTechnical
            ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/30'
            : 'bg-[#EFF6FF] border border-[#1B29FF]/20',
        )}
      >
        <div className="flex gap-3">
          <Loader2 className="h-5 w-5 text-[#1B29FF] flex-shrink-0 mt-0.5 animate-spin" />
          <div className="space-y-1.5 flex-1">
            <div
              className={cn(
                'text-[14px] font-medium text-[#101010]',
                isTechnical && 'font-mono',
              )}
            >
              {isTechnical ? 'PROCESSING::WITHDRAWAL' : 'Processing withdrawal'}
            </div>
            <p
              className={cn(
                'text-[12px] text-[#101010]/70',
                isTechnical && 'font-mono',
              )}
            >
              {statusMessage}
            </p>
            {/* Only show transaction link in technical mode during indexing */}
            {isTechnical &&
              withdrawState.step === 'indexing' &&
              withdrawState.txHash && (
                <a
                  href={`https://basescan.org/tx/${withdrawState.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1B29FF] hover:text-[#1420CC]"
                >
                  VIEW_TX
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
          </div>
        </div>
      </div>
    );
  };

  // Get chain name for display
  const getChainName = (id: number) => {
    switch (id) {
      case SUPPORTED_CHAINS.GNOSIS:
        return 'Gnosis';
      case SUPPORTED_CHAINS.ARBITRUM:
        return 'Arbitrum';
      case SUPPORTED_CHAINS.BASE:
        return 'Base';
      default:
        return `Chain ${id}`;
    }
  };

  // Handle Safe deployment
  const handleDeploySafe = async () => {
    if (!withdrawState.deploymentInfo) return;

    try {
      setWithdrawState({ step: 'deploying-safe' });

      const targetChainId = withdrawState.deploymentInfo.chainId;
      const chainName = getChainName(targetChainId);

      console.log(`[WithdrawEarnCard] Deploying Safe on ${chainName}...`);

      // Get the smart wallet client for the target chain
      const targetClient = await getClientForChain({ id: targetChainId });
      if (!targetClient) {
        throw new Error(
          `Failed to get ${chainName} client for Safe deployment`,
        );
      }

      const ownerAddress = targetClient.account?.address;
      if (!ownerAddress) {
        throw new Error('No valid owner address found (Smart Wallet)');
      }

      console.log('[WithdrawEarnCard] Owner address:', ownerAddress);

      // Create Safe configuration
      const safeAccountConfig: SafeAccountConfig = {
        owners: [ownerAddress as Address],
        threshold: 1,
      };

      // Use the Base Safe address as salt nonce for deterministic address matching
      const saltNonce = safeAddress.toLowerCase();
      const safeDeploymentConfig: SafeDeploymentConfig = {
        saltNonce,
        safeVersion: '1.4.1',
      };

      // Get RPC URL for target chain
      const targetRpcUrl =
        targetChainId === SUPPORTED_CHAINS.GNOSIS
          ? process.env.NEXT_PUBLIC_GNOSIS_RPC_URL ||
            'https://rpc.gnosischain.com'
          : targetChainId === SUPPORTED_CHAINS.ARBITRUM
            ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
              'https://arb1.arbitrum.io/rpc'
            : process.env.NEXT_PUBLIC_BASE_RPC_URL ||
              'https://mainnet.base.org';

      // Initialize the Protocol Kit
      const protocolKit = await Safe.init({
        predictedSafe: {
          safeAccountConfig,
          safeDeploymentConfig,
        },
        provider: targetRpcUrl,
      });

      // Get the predicted Safe address
      const predictedSafeAddress = (await protocolKit.getAddress()) as Address;
      console.log(
        `[WithdrawEarnCard] Predicted Safe address on ${chainName}: ${predictedSafeAddress}`,
      );

      // Check if Safe is already deployed
      const targetPublicClient = createPublicClient({
        chain:
          targetChainId === SUPPORTED_CHAINS.GNOSIS
            ? gnosis
            : targetChainId === SUPPORTED_CHAINS.ARBITRUM
              ? arbitrum
              : base,
        transport: http(targetRpcUrl),
      });

      const code = await targetPublicClient.getBytecode({
        address: predictedSafeAddress,
      });

      if (code && code !== '0x') {
        console.log(
          '[WithdrawEarnCard] Safe is already deployed on-chain. Registering...',
        );
        // Safe exists, just register it
        await registerSafeMutation.mutateAsync({
          safeAddress: predictedSafeAddress,
          chainId: targetChainId,
          safeType: 'primary',
        });
      } else {
        // Deploy the Safe
        console.log('[WithdrawEarnCard] Deploying new Safe...');

        const deploymentTransaction =
          await protocolKit.createSafeDeploymentTransaction();

        // Send deployment transaction via smart wallet
        const txHash = await targetClient.sendTransaction({
          to: deploymentTransaction.to as Address,
          data: deploymentTransaction.data as `0x${string}`,
          value: BigInt(deploymentTransaction.value || '0'),
        });

        console.log('[WithdrawEarnCard] Deployment tx hash:', txHash);

        // Wait for confirmation
        const receipt = await targetPublicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        if (receipt.status !== 'success') {
          throw new Error('Safe deployment transaction failed');
        }

        console.log('[WithdrawEarnCard] Safe deployed successfully!');

        // Register the Safe in the database
        await registerSafeMutation.mutateAsync({
          safeAddress: predictedSafeAddress,
          chainId: targetChainId,
          safeType: 'primary',
        });
      }

      // Refetch positions to update the UI
      await trpcUtils.earn.getMultiChainPositions.invalidate();

      toast.success(`Account ready on ${chainName}!`);

      // Reset to idle so user can now withdraw
      setWithdrawState({ step: 'idle' });
    } catch (err) {
      console.error('[WithdrawEarnCard] Safe deployment failed:', err);
      setWithdrawState({
        step: 'error',
        errorMessage:
          err instanceof Error ? err.message : 'Failed to set up account',
      });
    }
  };

  // Needs Safe deployment state - show UI to deploy Safe on destination chain
  if (
    withdrawState.step === 'needs-safe-deployment' &&
    withdrawState.deploymentInfo
  ) {
    const chainName = getChainName(withdrawState.deploymentInfo.chainId);

    return (
      <div
        className={cn(
          'p-6 text-center space-y-4 relative',
          isTechnical && 'bg-[#fafafa] border border-[#1B29FF]/20',
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto',
            isTechnical
              ? 'bg-[#1B29FF]/10 border border-[#1B29FF]/30'
              : 'bg-[#1B29FF]/10',
          )}
        >
          <Rocket className="h-6 w-6 text-[#1B29FF]" />
        </div>
        <div>
          <h3
            className={cn(
              'text-[18px] font-semibold text-[#101010] mb-2',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? `SETUP::${chainName.toUpperCase()}_ACCOUNT`
              : `Set Up ${chainName} Account`}
          </h3>
          <p
            className={cn(
              'text-[14px] text-[#101010]/70',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? `DEPLOY_SAFE_ON_${chainName.toUpperCase()}_TO_ENABLE_WITHDRAWAL`
              : `To withdraw from this vault, you need to set up your account on ${chainName} first.`}
          </p>
        </div>
        <button
          onClick={handleDeploySafe}
          className={cn(
            'w-full px-4 py-2.5 text-[14px] font-medium transition-colors flex items-center justify-center gap-2',
            isTechnical
              ? 'font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white'
              : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
          )}
        >
          <Rocket className="h-4 w-4" />
          {isTechnical ? '[ DEPLOY_SAFE ]' : `Set Up ${chainName} Account`}
        </button>
      </div>
    );
  }

  // Deploying Safe state - show loading UI
  if (withdrawState.step === 'deploying-safe') {
    const chainName = withdrawState.deploymentInfo
      ? getChainName(withdrawState.deploymentInfo.chainId)
      : 'target chain';

    return (
      <div
        className={cn(
          'p-6 text-center space-y-4 relative',
          isTechnical && 'bg-[#fafafa] border border-[#1B29FF]/20',
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto',
            isTechnical
              ? 'bg-[#1B29FF]/10 border border-[#1B29FF]/30'
              : 'bg-[#1B29FF]/10',
          )}
        >
          <Loader2 className="h-6 w-6 text-[#1B29FF] animate-spin" />
        </div>
        <div>
          <h3
            className={cn(
              'text-[18px] font-semibold text-[#101010] mb-2',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? `DEPLOYING::${chainName.toUpperCase()}_SAFE`
              : `Setting Up ${chainName} Account`}
          </h3>
          <p
            className={cn(
              'text-[14px] text-[#101010]/70',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? 'TX_IN_PROGRESS...'
              : 'This may take a moment. Please wait...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state - show error with retry option
  if (withdrawState.step === 'error') {
    return (
      <div
        className={cn(
          'p-6 text-center space-y-4 relative',
          isTechnical && 'bg-[#fafafa] border border-[#EF4444]/20',
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto',
            isTechnical
              ? 'bg-[#EF4444]/10 border border-[#EF4444]/30'
              : 'bg-[#EF4444]/10',
          )}
        >
          <AlertCircle className="h-6 w-6 text-[#EF4444]" />
        </div>
        <div>
          <h3
            className={cn(
              'text-[18px] font-semibold text-[#101010] mb-2',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical ? 'ERROR::WITHDRAWAL_FAILED' : 'Withdrawal Failed'}
          </h3>
          <p
            className={cn(
              'text-[14px] text-[#101010]/70',
              isTechnical && 'font-mono',
            )}
          >
            {withdrawState.errorMessage || 'An unknown error occurred'}
          </p>
        </div>
        <button
          onClick={() => setWithdrawState({ step: 'idle' })}
          className={cn(
            'w-full px-4 py-2.5 text-[14px] font-medium transition-colors',
            isTechnical
              ? 'font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white'
              : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
          )}
        >
          {isTechnical ? '[ TRY_AGAIN ]' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'space-y-4 relative p-4',
        isTechnical && 'p-4 bg-[#fafafa] border border-[#1B29FF]/20',
      )}
    >
      {/* Blueprint grid overlay for technical mode */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1B29FF 1px, transparent 1px),
              linear-gradient(to bottom, #1B29FF 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Success Banner - shown after successful withdrawal */}
      <SuccessBanner />

      {/* Processing Banner - shown during withdrawal */}
      <ProcessingBanner />

      {/* Current Balance */}
      <div
        className={cn(
          'p-4 relative',
          isTechnical
            ? 'bg-white border border-[#1B29FF]/30'
            : 'bg-[#F7F7F2] border border-[#101010]/10',
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={cn(
                'uppercase tracking-[0.14em] text-[11px] mb-1',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/60',
              )}
            >
              {isTechnical ? 'BALANCE::REDEEMABLE' : 'Available to Withdraw'}
            </p>
            {isTechnical ? (
              <div>
                <p className="text-[24px] font-mono tabular-nums text-[#101010]">
                  {displayBalance} {isNativeAsset ? assetSymbol : 'USDC'}
                </p>
                {!isNativeAsset && (
                  <p className="text-[12px] font-mono text-[#101010]/50">
                    ≈ ${displayBalance} USD
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[24px] font-medium tabular-nums text-[#101010]">
                {isNativeAsset ? '' : '$'}
                {displayBalance} {isNativeAsset ? assetSymbol : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 relative">
        <label
          htmlFor="withdraw-amount"
          className={cn(
            'text-[12px] font-medium',
            isTechnical
              ? 'font-mono text-[#1B29FF] uppercase'
              : 'text-[#101010]',
          )}
        >
          {isTechnical ? 'INPUT::AMOUNT' : 'Amount to Withdraw'}
        </label>
        <div className="relative">
          <input
            id="withdraw-amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(
              'w-full px-3 py-2 pr-20 text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              isTechnical
                ? 'font-mono bg-white border border-[#1B29FF]/30 text-[#101010] placeholder:text-[#101010]/30 focus:border-[#1B29FF] focus:outline-none'
                : 'bg-white border border-[#101010]/10 focus:border-[#1B29FF] focus:outline-none',
            )}
            step="0.000001"
            min="0"
            max={availableBalance}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span
              className={cn(
                'text-[11px]',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/50',
              )}
            >
              {isNativeAsset ? assetSymbol : isTechnical ? 'USDC' : 'USD'}
            </span>
            <button
              type="button"
              onClick={handleMax}
              className={cn(
                'px-1.5 py-0.5 text-[10px] transition-colors',
                isTechnical
                  ? 'font-mono text-[#1B29FF] hover:text-[#1420CC] border border-[#1B29FF]/30 hover:border-[#1B29FF]'
                  : 'text-[#1B29FF] hover:text-[#1420CC]',
              )}
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={disableWithdraw}
        className={cn(
          'w-full px-4 py-2.5 text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 relative',
          isTechnical
            ? 'font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white'
            : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
        )}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowUpFromLine className="h-4 w-4" />
        )}
        {isTechnical
          ? isProcessing
            ? 'PROCESSING...'
            : '[ EXECUTE ]'
          : isProcessing
            ? 'Processing...'
            : 'Withdraw'}
      </button>

      {/* Error states */}
      {amountParseFailed && (
        <div
          className={cn(
            'p-3 relative',
            isTechnical
              ? 'bg-[#EF4444]/5 border border-[#EF4444]/30'
              : 'bg-[#FEF2F2] border border-[#EF4444]/20',
          )}
        >
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <p
              className={cn(
                'text-[12px]',
                isTechnical ? 'font-mono text-[#EF4444]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical
                ? 'ERR: PARSE_FAILED'
                : 'Unable to parse the withdrawal amount. Please check the format.'}
            </p>
          </div>
        </div>
      )}

      {amountExceedsBalance && (
        <div
          className={cn(
            'p-3 relative',
            isTechnical
              ? 'bg-[#EF4444]/5 border border-[#EF4444]/30'
              : 'bg-[#FEF2F2] border border-[#EF4444]/20',
          )}
        >
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <p
              className={cn(
                'text-[12px]',
                isTechnical ? 'font-mono text-[#EF4444]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical
                ? 'ERR: AMOUNT > BALANCE'
                : 'Amount exceeds your available vault balance.'}
            </p>
          </div>
        </div>
      )}

      {/* Help text */}
      <p
        className={cn(
          'text-[11px] text-center relative',
          isTechnical ? 'font-mono text-[#1B29FF]/60' : 'text-[#101010]/50',
        )}
      >
        {isTechnical
          ? isSuperOethVault
            ? 'MULTICALL: REDEEM → SWAP → UNWRAP → ETH'
            : isNativeAsset
              ? 'OUTPUT: WETH (UNWRAP_REQUIRED)'
              : 'SETTLEMENT: IMMEDIATE'
          : isSuperOethVault
            ? 'Converts to ETH via Aerodrome in one transaction'
            : isNativeAsset
              ? 'You will receive WETH which can be unwrapped to ETH'
              : 'Your funds will be available in your account immediately'}
      </p>
    </div>
  );
}
