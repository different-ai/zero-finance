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
import { base, arbitrum, gnosis, optimism } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import {
  ALL_BASE_VAULTS,
  ORIGIN_SUPER_OETH_VAULT,
} from '@/server/earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

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
  transaction: {
    to: string;
    data: string;
    value: string;
  };
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

  // Gnosis bridge-back state (for bridging xDAI back to Base USDC)
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeQuote, setBridgeQuote] = useState<{
    inputAmount: string;
    outputAmount: string;
    outputAmountMin: string;
    totalFeeUsd: string;
    estimatedTime: number;
    tool: string;
    transactionRequest: {
      to: string;
      data: string;
      value: string;
      chainId: number;
    };
    approvalAddress?: string;
  } | null>(null);
  const [bridgeQuoteError, setBridgeQuoteError] = useState<string | null>(null);
  const [isLoadingBridgeQuote, setIsLoadingBridgeQuote] = useState(false);

  // Arbitrum bridge-back state (for bridging USDC back to Base)
  const [arbBridgeAmount, setArbBridgeAmount] = useState('');
  const [arbBridgeQuote, setArbBridgeQuote] = useState<{
    inputAmount: string;
    outputAmount: string;
    totalFee: string;
    estimatedFillTime: number;
  } | null>(null);
  const [isLoadingArbBridgeQuote, setIsLoadingArbBridgeQuote] = useState(false);

  // Optimism bridge-back state (for bridging USDC back to Base)
  const [opBridgeAmount, setOpBridgeAmount] = useState('');
  const [opBridgeQuote, setOpBridgeQuote] = useState<{
    inputAmount: string;
    outputAmount: string;
    totalFee: string;
    estimatedFillTime: number;
  } | null>(null);
  const [isLoadingOpBridgeQuote, setIsLoadingOpBridgeQuote] = useState(false);

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
  const isOptimism = chainId === 10;

  const chain = isGnosis
    ? gnosis
    : isOptimism
      ? optimism
      : isArbitrum
        ? arbitrum
        : base;
  const rpcUrl = isGnosis
    ? process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || 'https://rpc.gnosischain.com'
    : isOptimism
      ? process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL ||
        'https://mainnet.optimism.io'
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
          try {
            const res = await safeDeploymentMutation.mutateAsync({
              targetChainId: chainId,
              safeType: 'primary',
            });

            setWithdrawState({
              step: 'needs-safe-deployment',
              deploymentInfo: {
                chainId: chainId,
                predictedAddress: res.predictedAddress,
                transaction: {
                  to: res.to,
                  data: res.data,
                  value: res.value,
                },
              },
            });
          } catch (err) {
            console.error(
              '[WithdrawEarnCard] Failed to fetch deployment info after on-chain mismatch:',
              err,
            );
            setWithdrawState({
              step: 'error',
              errorMessage:
                err instanceof Error
                  ? err.message
                  : 'Failed to load account setup info. Please refresh.',
            });
          }
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
  }, [
    isCrossChain,
    targetSafeAddress,
    chainId,
    publicClient,
    withdrawState.step,
    safeDeploymentMutation,
  ]);

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
                transaction: {
                  to: res.to,
                  data: res.data,
                  value: res.value,
                },
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

  // Gnosis xDAI balance query (for bridge-back flow)
  // Use effectiveSafeAddress to handle cases where targetSafeAddress might not be
  // in multiChainPositions yet (e.g., newly deployed Safes)
  const isGnosisVault = chainId === SUPPORTED_CHAINS.GNOSIS;
  const gnosisQueryAddress = isGnosisVault
    ? targetSafeAddress || effectiveSafeAddress
    : undefined;
  const { data: gnosisBalanceData, refetch: refetchGnosisBalance } =
    trpc.earn.getGnosisXdaiBalance.useQuery(
      { safeAddress: gnosisQueryAddress ?? '' },
      {
        enabled: !!gnosisQueryAddress && isGnosisVault,
        staleTime: 15000,
        refetchInterval: 15000,
      },
    );

  // Parse Gnosis balances
  const gnosisXdaiBalance = useMemo(() => {
    if (!gnosisBalanceData) {
      return { nativeXdai: 0n, wxdai: 0n, sdai: 0n, totalAvailable: 0n };
    }
    return {
      nativeXdai: BigInt(gnosisBalanceData.nativeXdai),
      wxdai: BigInt(gnosisBalanceData.wxdai),
      sdai: BigInt(gnosisBalanceData.sdai),
      totalAvailable: BigInt(gnosisBalanceData.totalAvailableForDeposit),
    };
  }, [gnosisBalanceData]);

  // Fetch bridge quote when bridge amount changes (for Gnosis -> Base)
  useEffect(() => {
    if (!isGnosisVault || !bridgeAmount || parseFloat(bridgeAmount) <= 0) {
      setBridgeQuote(null);
      return;
    }

    const fetchBridgeQuote = async () => {
      setIsLoadingBridgeQuote(true);
      setBridgeQuoteError(null);
      try {
        const amountIn18Decimals = parseUnits(bridgeAmount, 18);
        const quote = await trpcUtils.earn.getGnosisXdaiToBaseUsdcQuote.fetch({
          amount: amountIn18Decimals.toString(),
          slippage: 0.5,
        });
        setBridgeQuote(quote);
      } catch (error) {
        console.error(
          '[WithdrawEarnCard] Failed to fetch bridge quote:',
          error,
        );
        setBridgeQuote(null);
        setBridgeQuoteError(
          error instanceof Error ? error.message : 'Failed to get bridge quote',
        );
      } finally {
        setIsLoadingBridgeQuote(false);
      }
    };

    const debounceTimer = setTimeout(fetchBridgeQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [isGnosisVault, bridgeAmount, trpcUtils]);

  // Arbitrum / Optimism detection
  const isArbitrumVault = chainId === SUPPORTED_CHAINS.ARBITRUM;
  const isOptimismVault = chainId === SUPPORTED_CHAINS.OPTIMISM;

  // Query target Safe USDC balance for Arbitrum/Optimism (for bridge-back flow)
  // This shows USDC that's in the Safe but NOT in the vault (e.g., after a vault redemption)
  // Use effectiveSafeAddress which falls back to safeAddress prop if targetSafeAddress is undefined
  const { data: targetSafeUsdcBalance, refetch: refetchTargetSafeBalance } =
    trpc.earn.getSafeBalanceOnChain.useQuery(
      {
        safeAddress: effectiveSafeAddress,
        chainId,
      },
      {
        enabled:
          !!effectiveSafeAddress &&
          isCrossChain &&
          (isArbitrumVault || isOptimismVault),
        staleTime: 15000,
        refetchInterval: 15000,
      },
    );

  // Parse target Safe USDC balance
  const targetSafeUsdcBigInt = useMemo(() => {
    if (!targetSafeUsdcBalance) return 0n;
    return BigInt(targetSafeUsdcBalance.balance);
  }, [targetSafeUsdcBalance]);

  // Fetch Arbitrum -> Base bridge quote when bridge amount changes
  useEffect(() => {
    if (
      !isArbitrumVault ||
      !arbBridgeAmount ||
      parseFloat(arbBridgeAmount) <= 0
    ) {
      setArbBridgeQuote(null);
      return;
    }

    const fetchArbBridgeQuote = async () => {
      setIsLoadingArbBridgeQuote(true);
      try {
        const amountIn6Decimals = parseUnits(arbBridgeAmount, 6); // USDC has 6 decimals
        const quote = await trpcUtils.earn.getArbitrumUsdcToBaseQuote.fetch({
          amount: amountIn6Decimals.toString(),
        });
        setArbBridgeQuote(quote);
      } catch (error) {
        console.error(
          '[WithdrawEarnCard] Failed to fetch Arbitrum bridge quote:',
          error,
        );
        setArbBridgeQuote(null);
      } finally {
        setIsLoadingArbBridgeQuote(false);
      }
    };

    const debounceTimer = setTimeout(fetchArbBridgeQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [isArbitrumVault, arbBridgeAmount, trpcUtils]);

  // Fetch Optimism -> Base bridge quote when bridge amount changes
  useEffect(() => {
    if (
      !isOptimismVault ||
      !opBridgeAmount ||
      parseFloat(opBridgeAmount) <= 0
    ) {
      setOpBridgeQuote(null);
      return;
    }

    const fetchOpBridgeQuote = async () => {
      setIsLoadingOpBridgeQuote(true);
      try {
        const amountIn6Decimals = parseUnits(opBridgeAmount, 6); // USDC has 6 decimals
        const quote = await trpcUtils.earn.getOptimismUsdcToBaseQuote.fetch({
          amount: amountIn6Decimals.toString(),
        });
        setOpBridgeQuote(quote);
      } catch (error) {
        console.error(
          '[WithdrawEarnCard] Failed to fetch Optimism bridge quote:',
          error,
        );
        setOpBridgeQuote(null);
      } finally {
        setIsLoadingOpBridgeQuote(false);
      }
    };

    const debounceTimer = setTimeout(fetchOpBridgeQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [isOptimismVault, opBridgeAmount, trpcUtils]);

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
              // Clear the input for next withdrawal
              setAmount('');
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
            // Clear the input for next withdrawal
            setAmount('');
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

  // Handler for bridging xDAI back to Base USDC (Gnosis -> Base)
  const handleBridgeToBase = async () => {
    if (!bridgeQuote || !targetSafeAddress || !baseSafeAddress) return;

    try {
      setIsBridging(true);
      setWithdrawState({ step: 'processing' });

      const bridgeAmountBigInt = parseUnits(bridgeAmount, 18);

      // Get the smart wallet client for Gnosis
      const gnosisClient = await getClientForChain({ id: chainId });
      if (!gnosisClient) {
        throw new Error('Failed to get Gnosis client');
      }

      const smartWalletAddress = gnosisClient.account?.address;
      if (!smartWalletAddress) {
        throw new Error('No smart wallet address found');
      }

      // WXDAI ABI for wrapping and approval
      const WXDAI_ABI = parseAbi([
        'function deposit() public payable',
        'function approve(address spender, uint256 amount) public returns (bool)',
        'function balanceOf(address account) public view returns (uint256)',
      ]);

      const WXDAI_ADDRESS =
        '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d' as Address;

      // Build transactions:
      // 1. Wrap native xDAI to WXDAI (if needed)
      // 2. Approve WXDAI to LI.FI router
      // 3. Execute bridge transaction

      const transactions: Array<{
        to: Address;
        value: string;
        data: `0x${string}`;
      }> = [];

      // Check if we need to wrap xDAI
      const useNativeXdai = gnosisXdaiBalance.nativeXdai >= bridgeAmountBigInt;

      if (useNativeXdai) {
        // Wrap native xDAI to WXDAI
        const wrapData = encodeFunctionData({
          abi: WXDAI_ABI,
          functionName: 'deposit',
        });
        transactions.push({
          to: WXDAI_ADDRESS,
          value: bridgeAmountBigInt.toString(),
          data: wrapData,
        });
      }

      // Approve WXDAI to LI.FI router if needed
      if (bridgeQuote.approvalAddress) {
        const approveData = encodeFunctionData({
          abi: WXDAI_ABI,
          functionName: 'approve',
          args: [bridgeQuote.approvalAddress as Address, bridgeAmountBigInt],
        });
        transactions.push({
          to: WXDAI_ADDRESS,
          value: '0',
          data: approveData,
        });
      }

      // Add the bridge transaction
      transactions.push({
        to: bridgeQuote.transactionRequest.to as Address,
        value: bridgeQuote.transactionRequest.value,
        data: bridgeQuote.transactionRequest.data as `0x${string}`,
      });

      // Import buildSafeTx and relaySafeTx
      const { buildSafeTx, relaySafeTx } = await import(
        '@/lib/sponsor-tx/core'
      );

      // Build and execute Safe transaction on Gnosis
      const safeTx = await buildSafeTx(transactions, {
        safeAddress: targetSafeAddress,
        chainId,
        gas: 600_000n,
      });

      const bridgeTxHash = await relaySafeTx(
        safeTx,
        smartWalletAddress,
        gnosisClient,
        targetSafeAddress,
        gnosis,
      );

      console.log('[WithdrawEarnCard] Bridge tx hash:', bridgeTxHash);

      setWithdrawState({
        step: 'confirming',
        txHash: bridgeTxHash,
      });

      // Wait for bridge confirmation and show success
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Refetch balances
      await refetchGnosisBalance();

      setWithdrawState({
        step: 'success',
        txHash: bridgeTxHash,
        withdrawnAmount: bridgeAmount,
        outputAsset: 'USDC (arriving on Base)',
      });

      setBridgeAmount('');
      toast.success(
        'Bridge initiated! Funds will arrive on Base in ~5-15 minutes.',
      );
    } catch (error) {
      console.error('[WithdrawEarnCard] Bridge error:', error);
      setWithdrawState({
        step: 'error',
        errorMessage: error instanceof Error ? error.message : 'Bridge failed',
      });
      toast.error(
        `Bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsBridging(false);
    }
  };

  const handleMaxBridge = () => {
    const maxAmount = formatUnits(gnosisXdaiBalance.totalAvailable, 18);
    setBridgeAmount(maxAmount);
  };

  // Handler for bridging Arbitrum USDC back to Base
  const arbBridgeMutation = trpc.earn.getArbitrumToBaseBridgeTx.useMutation();

  // Handler for bridging Optimism USDC back to Base
  const opBridgeMutation = trpc.earn.getOptimismToBaseBridgeTx.useMutation();

  const handleArbBridgeToBase = async () => {
    if (!arbBridgeAmount || !targetSafeAddress || !baseSafeAddress) return;

    try {
      setIsBridging(true);
      setWithdrawState({ step: 'processing' });

      const arbBridgeAmountBigInt = parseUnits(arbBridgeAmount, 6); // USDC has 6 decimals

      // Get the bridge transactions from backend
      const bridgeResult = await arbBridgeMutation.mutateAsync({
        amount: arbBridgeAmountBigInt.toString(),
      });

      // Get the smart wallet client for Arbitrum
      const arbitrumClient = await getClientForChain({ id: chainId });
      if (!arbitrumClient) {
        throw new Error('Failed to get Arbitrum client');
      }

      const smartWalletAddress = arbitrumClient.account?.address;
      if (!smartWalletAddress) {
        throw new Error('No smart wallet address found');
      }

      // Import buildSafeTx and relaySafeTx
      const { buildSafeTx, relaySafeTx } = await import(
        '@/lib/sponsor-tx/core'
      );

      // Convert transactions to the format expected by buildSafeTx
      const transactions = bridgeResult.transactions.map((tx) => ({
        to: tx.to as Address,
        value: tx.value,
        data: tx.data as `0x${string}`,
      }));

      // Build and execute Safe transaction on Arbitrum
      const safeTx = await buildSafeTx(transactions, {
        safeAddress: targetSafeAddress,
        chainId,
        gas: 400_000n,
      });

      const bridgeTxHash = await relaySafeTx(
        safeTx,
        smartWalletAddress,
        arbitrumClient,
        targetSafeAddress,
        arbitrum,
      );

      console.log('[WithdrawEarnCard] Arbitrum bridge tx hash:', bridgeTxHash);

      setWithdrawState({
        step: 'confirming',
        txHash: bridgeTxHash,
      });

      // Wait for confirmation
      await new Promise((resolve) => setTimeout(resolve, 10000));

      setWithdrawState({
        step: 'success',
        txHash: bridgeTxHash,
        withdrawnAmount: arbBridgeAmount,
        outputAsset: 'USDC (arriving on Base)',
      });

      setArbBridgeAmount('');
      toast.success(
        'Bridge initiated! Funds will arrive on Base in ~2-10 minutes.',
      );
    } catch (error) {
      console.error('[WithdrawEarnCard] Arbitrum bridge error:', error);
      setWithdrawState({
        step: 'error',
        errorMessage: error instanceof Error ? error.message : 'Bridge failed',
      });
      toast.error(
        `Bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsBridging(false);
    }
  };

  const handleMaxArbBridge = () => {
    // Use the Safe USDC balance (not vault assets) for bridge max
    if (targetSafeUsdcBigInt > 0n) {
      const maxAmount = formatUnits(targetSafeUsdcBigInt, 6);
      setArbBridgeAmount(maxAmount);
    } else if (vaultInfo) {
      // Fallback to vault assets if Safe balance not loaded yet
      const maxAmount = formatUnits(vaultInfo.assets, vaultInfo.assetDecimals);
      setArbBridgeAmount(maxAmount);
    }
  };

  const handleOpBridgeToBase = async () => {
    if (!opBridgeAmount || !targetSafeAddress || !baseSafeAddress) return;

    try {
      setIsBridging(true);
      setWithdrawState({ step: 'processing' });

      const opBridgeAmountBigInt = parseUnits(opBridgeAmount, 6); // USDC has 6 decimals

      const bridgeResult = await opBridgeMutation.mutateAsync({
        amount: opBridgeAmountBigInt.toString(),
      });

      // Get the smart wallet client for Optimism
      const optimismClient = await getClientForChain({ id: chainId });
      if (!optimismClient) {
        throw new Error('Failed to get Optimism client');
      }

      const smartWalletAddress = optimismClient.account?.address;
      if (!smartWalletAddress) {
        throw new Error('No smart wallet address found');
      }

      const { buildSafeTx, relaySafeTx } = await import(
        '@/lib/sponsor-tx/core'
      );

      const transactions = bridgeResult.transactions.map((tx) => ({
        to: tx.to as Address,
        value: tx.value,
        data: tx.data as `0x${string}`,
      }));

      const safeTx = await buildSafeTx(transactions, {
        safeAddress: targetSafeAddress,
        chainId,
        gas: 400_000n,
      });

      const bridgeTxHash = await relaySafeTx(
        safeTx,
        smartWalletAddress,
        optimismClient,
        targetSafeAddress,
        optimism,
      );

      console.log('[WithdrawEarnCard] Optimism bridge tx hash:', bridgeTxHash);

      setWithdrawState({
        step: 'confirming',
        txHash: bridgeTxHash,
      });

      await new Promise((resolve) => setTimeout(resolve, 10000));

      setWithdrawState({
        step: 'success',
        txHash: bridgeTxHash,
        withdrawnAmount: opBridgeAmount,
        outputAsset: 'USDC (arriving on Base)',
      });

      setOpBridgeAmount('');
      toast.success(
        'Bridge initiated! Funds will arrive on Base in ~2-10 minutes.',
      );
    } catch (error) {
      console.error('[WithdrawEarnCard] Optimism bridge error:', error);
      setWithdrawState({
        step: 'error',
        errorMessage: error instanceof Error ? error.message : 'Bridge failed',
      });
      toast.error(
        `Bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsBridging(false);
    }
  };

  const handleMaxOpBridge = () => {
    // Use the Safe USDC balance (not vault assets) for bridge max
    if (targetSafeUsdcBigInt > 0n) {
      const maxAmount = formatUnits(targetSafeUsdcBigInt, 6);
      setOpBridgeAmount(maxAmount);
    } else if (vaultInfo) {
      // Fallback to vault assets if Safe balance not loaded yet
      const maxAmount = formatUnits(vaultInfo.assets, vaultInfo.assetDecimals);
      setOpBridgeAmount(maxAmount);
    }
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

  // No balance state - but for cross-chain vaults, also check Safe balance for bridge-back
  if (!vaultInfo || vaultInfo.assets === 0n) {
    // For Gnosis vaults, if there's no sDAI but there IS xDAI, show bridge-back UI
    if (isGnosisVault && gnosisXdaiBalance.totalAvailable > 0n) {
      // Show bridge-back only UI
      const availableXdai = formatUnits(gnosisXdaiBalance.totalAvailable, 18);
      const displayXdaiBalance = parseFloat(availableXdai).toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 6 },
      );

      return (
        <div className="space-y-6 p-4 bg-[#fafafa] border border-[#1B29FF]/20 relative">
          {/* Blueprint grid overlay */}
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

          {/* xDAI Balance Card - Bridge Back to Base */}
          <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                  BALANCE::GNO_xDAI
                </p>
                <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                  {displayXdaiBalance}{' '}
                  <span className="text-[12px] text-[#1B29FF]">xDAI</span>
                </p>
              </div>
            </div>

            {/* Bridge to Base Input & Button */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
                INPUT::BRIDGE_AMOUNT (xDAI → Base USDC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  step="0.000001"
                  min="0"
                  max={availableXdai}
                  disabled={isBridging}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#1B29FF]/70">
                    xDAI
                  </span>
                  <button
                    type="button"
                    onClick={handleMaxBridge}
                    className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                    disabled={isBridging}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Bridge Quote Info */}
              {isLoadingBridgeQuote && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#1B29FF]/60">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Fetching quote...
                </div>
              )}
              {bridgeQuoteError && (
                <div className="p-2 bg-[#EF4444]/5 border border-[#EF4444]/20 space-y-1">
                  <p className="font-mono text-[10px] text-[#EF4444]">
                    ERROR: {bridgeQuoteError}
                  </p>
                </div>
              )}
              {bridgeQuote && !isLoadingBridgeQuote && (
                <div className="p-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 space-y-1">
                  <p className="font-mono text-[10px] text-[#1B29FF]">
                    OUTPUT ≈ {formatUnits(BigInt(bridgeQuote.outputAmount), 6)}{' '}
                    USDC
                  </p>
                  <p className="font-mono text-[10px] text-[#101010]/50">
                    Fee: ~${bridgeQuote.totalFeeUsd} • ETA: ~
                    {Math.ceil(bridgeQuote.estimatedTime / 60)} min
                  </p>
                </div>
              )}

              <button
                onClick={handleBridgeToBase}
                disabled={
                  !bridgeAmount ||
                  parseFloat(bridgeAmount) <= 0 ||
                  !bridgeQuote ||
                  isLoadingBridgeQuote ||
                  isBridging
                }
                className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBridging ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4" />
                )}
                <span className="leading-none">[ BRIDGE TO BASE ]</span>
              </button>
            </div>

            <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
              Bridge via LI.FI • Funds arrive on Base in ~5-15 min
            </p>
          </div>

          <p className="font-mono text-[10px] text-center text-[#101010]/40">
            No sDAI in vault. Use this to bridge xDAI back to Base.
          </p>
        </div>
      );
    }

    // For Arbitrum/Optimism vaults, if there's no vault balance but there IS USDC in the Safe, show bridge-back UI
    if (
      (isArbitrumVault || isOptimismVault) &&
      targetSafeUsdcBigInt > 0n &&
      targetSafeAddress
    ) {
      const chainCode = isArbitrumVault ? 'ARB' : 'OP';
      const chainName = isArbitrumVault ? 'Arbitrum' : 'Optimism';
      const availableUsdc = formatUnits(targetSafeUsdcBigInt, 6);
      const displayUsdcBalance = parseFloat(availableUsdc).toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 6 },
      );
      const bridgeAmountState = isArbitrumVault
        ? arbBridgeAmount
        : opBridgeAmount;
      const setBridgeAmountState = isArbitrumVault
        ? setArbBridgeAmount
        : setOpBridgeAmount;
      const bridgeQuoteState = isArbitrumVault ? arbBridgeQuote : opBridgeQuote;
      const isLoadingBridgeQuoteState = isArbitrumVault
        ? isLoadingArbBridgeQuote
        : isLoadingOpBridgeQuote;
      const handleBridge = isArbitrumVault
        ? handleArbBridgeToBase
        : handleOpBridgeToBase;

      const handleMaxBridgeUsdc = () => {
        setBridgeAmountState(availableUsdc);
      };

      return (
        <div className="space-y-6 p-4 bg-[#fafafa] border border-[#1B29FF]/20 relative">
          {/* Blueprint grid overlay */}
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

          {/* USDC Balance Card - Bridge Back to Base */}
          <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                  BALANCE::{chainCode}_USDC
                </p>
                <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                  {displayUsdcBalance}{' '}
                  <span className="text-[12px] text-[#1B29FF]">USDC</span>
                </p>
                <p className="text-[12px] font-mono text-[#101010]/50">
                  ≈ ${displayUsdcBalance} USD
                </p>
              </div>
            </div>

            {/* Bridge to Base Input & Button */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
                INPUT::BRIDGE_AMOUNT ({chainCode} USDC → Base USDC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  value={bridgeAmountState}
                  onChange={(e) => setBridgeAmountState(e.target.value)}
                  className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  step="0.000001"
                  min="0"
                  max={availableUsdc}
                  disabled={isBridging}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#1B29FF]/70">
                    USDC
                  </span>
                  <button
                    type="button"
                    onClick={handleMaxBridgeUsdc}
                    className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                    disabled={isBridging}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Bridge Quote Info */}
              {isLoadingBridgeQuoteState && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#1B29FF]/60">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Fetching quote...
                </div>
              )}
              {bridgeQuoteState && !isLoadingBridgeQuoteState && (
                <div className="p-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 space-y-1">
                  <p className="font-mono text-[10px] text-[#1B29FF]">
                    OUTPUT ≈{' '}
                    {formatUnits(BigInt(bridgeQuoteState.outputAmount), 6)} USDC
                  </p>
                  <p className="font-mono text-[10px] text-[#101010]/50">
                    Fee: ~{formatUnits(BigInt(bridgeQuoteState.totalFee), 6)}{' '}
                    USDC • ETA: ~
                    {Math.ceil(bridgeQuoteState.estimatedFillTime / 60)} min
                  </p>
                </div>
              )}

              <button
                onClick={handleBridge}
                disabled={
                  !bridgeAmountState ||
                  parseFloat(bridgeAmountState) <= 0 ||
                  !bridgeQuoteState ||
                  isLoadingBridgeQuoteState ||
                  isBridging
                }
                className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isBridging ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4" />
                )}
                <span className="leading-none">[ BRIDGE TO BASE ]</span>
              </button>
            </div>

            <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
              Bridge via Across Protocol • Funds arrive on Base in ~2-10 min
            </p>
          </div>

          <p className="font-mono text-[10px] text-center text-[#101010]/40">
            No funds in vault. Use this to bridge {chainName} USDC back to Base.
          </p>
        </div>
      );
    }

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
                {(isArbitrumVault || isOptimismVault) && (
                  <div>
                    Safe USDC: {targetSafeUsdcBalance?.formatted ?? '0'}
                  </div>
                )}
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
      case SUPPORTED_CHAINS.OPTIMISM:
        return 'Optimism';
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

      // Use backend-provided predicted address + deployment tx.
      // The backend clones the Base Safe owners/threshold.
      const predictedSafeAddress = withdrawState.deploymentInfo
        .predictedAddress as Address;

      console.log(
        `[WithdrawEarnCard] Predicted Safe address on ${chainName}: ${predictedSafeAddress}`,
      );

      // Get RPC URL for target chain
      const targetRpcUrl =
        targetChainId === SUPPORTED_CHAINS.GNOSIS
          ? process.env.NEXT_PUBLIC_GNOSIS_RPC_URL ||
            'https://rpc.gnosischain.com'
          : targetChainId === SUPPORTED_CHAINS.OPTIMISM
            ? process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL ||
              'https://mainnet.optimism.io'
            : targetChainId === SUPPORTED_CHAINS.ARBITRUM
              ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
                'https://arb1.arbitrum.io/rpc'
              : process.env.NEXT_PUBLIC_BASE_RPC_URL ||
                'https://mainnet.base.org';

      // Check if Safe is already deployed
      const targetPublicClient = createPublicClient({
        chain:
          targetChainId === SUPPORTED_CHAINS.GNOSIS
            ? gnosis
            : targetChainId === SUPPORTED_CHAINS.OPTIMISM
              ? optimism
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

        // Send backend-generated deployment transaction via smart wallet
        const txHash = await targetClient.sendTransaction({
          to: withdrawState.deploymentInfo.transaction.to as Address,
          data: withdrawState.deploymentInfo.transaction.data as `0x${string}`,
          value: BigInt(withdrawState.deploymentInfo.transaction.value || '0'),
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

  // --- GNOSIS 2-STEP WITHDRAWAL FLOW ---
  // Step 1: Withdraw sDAI -> xDAI (redeem from vault)
  // Step 2: Bridge xDAI -> Base USDC (via LI.FI)
  if (isGnosisVault && targetSafeAddress) {
    const availableXdai = formatUnits(gnosisXdaiBalance.totalAvailable, 18);
    const displayXdaiBalance = parseFloat(availableXdai).toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 6 },
    );

    return (
      <div className="space-y-6 p-4 bg-[#fafafa] border border-[#1B29FF]/20 relative">
        {/* Blueprint grid overlay */}
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

        {/* Success Banner */}
        <SuccessBanner />

        {/* Processing Banner */}
        <ProcessingBanner />

        {/* TOP CARD: sDAI Vault Balance - Withdraw to xDAI */}
        <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                VAULT::sDAI_BALANCE
              </p>
              <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                {displayBalance}{' '}
                <span className="text-[12px] text-[#1B29FF]">sDAI</span>
              </p>
              <p className="text-[12px] font-mono text-[#101010]/50">
                ≈ ${displayBalance} USD
              </p>
              {/* Show Safe address in technical mode */}
              <p className="font-mono text-[10px] text-[#1B29FF]/60 mt-1">
                SAFE::
                {effectiveSafeAddress
                  ? `${effectiveSafeAddress.slice(0, 6)}...${effectiveSafeAddress.slice(-4)}`
                  : 'NOT_SET'}
              </p>
              {targetSafeAddress &&
                targetSafeAddress !== effectiveSafeAddress && (
                  <p className="font-mono text-[10px] text-orange-500 mt-0.5">
                    TARGET_SAFE::{targetSafeAddress.slice(0, 6)}...
                    {targetSafeAddress.slice(-4)} (MISMATCH)
                  </p>
                )}
            </div>
          </div>

          {/* Withdraw sDAI to xDAI */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
              INPUT::WITHDRAW_AMOUNT (sDAI → xDAI)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000001"
                min="0"
                max={availableBalance}
                disabled={isProcessing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#1B29FF]/70">
                  sDAI
                </span>
                <button
                  type="button"
                  onClick={handleMax}
                  className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                  disabled={isProcessing}
                >
                  MAX
                </button>
              </div>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={disableWithdraw}
              className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4" />
              )}
              <span className="leading-none">[ WITHDRAW TO xDAI ]</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
            Redeems sDAI shares for xDAI on Gnosis
          </p>
        </div>

        {/* BOTTOM CARD: xDAI Balance - Bridge to Base */}
        <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                BALANCE::GNO_xDAI
              </p>
              <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                {displayXdaiBalance}{' '}
                <span className="text-[12px] text-[#1B29FF]">xDAI</span>
              </p>
              {/* Debug: Show query address in technical mode */}
              <p className="font-mono text-[10px] text-[#1B29FF]/60 mt-1">
                QUERY_ADDR::
                {gnosisQueryAddress
                  ? `${gnosisQueryAddress.slice(0, 6)}...${gnosisQueryAddress.slice(-4)}`
                  : 'NOT_SET'}
              </p>
            </div>
          </div>

          {/* Bridge to Base Input & Button */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
              INPUT::BRIDGE_AMOUNT (xDAI → Base USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={bridgeAmount}
                onChange={(e) => setBridgeAmount(e.target.value)}
                className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000001"
                min="0"
                max={availableXdai}
                disabled={gnosisXdaiBalance.totalAvailable === 0n || isBridging}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#1B29FF]/70">
                  xDAI
                </span>
                <button
                  type="button"
                  onClick={handleMaxBridge}
                  className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                  disabled={
                    gnosisXdaiBalance.totalAvailable === 0n || isBridging
                  }
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Bridge Quote Info */}
            {isLoadingBridgeQuote && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#1B29FF]/60">
                <Loader2 className="h-3 w-3 animate-spin" />
                Fetching quote...
              </div>
            )}
            {bridgeQuoteError && (
              <div className="p-2 bg-[#EF4444]/5 border border-[#EF4444]/20 space-y-1">
                <p className="font-mono text-[10px] text-[#EF4444]">
                  ERROR: {bridgeQuoteError}
                </p>
              </div>
            )}
            {bridgeQuote && !isLoadingBridgeQuote && (
              <div className="p-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 space-y-1">
                <p className="font-mono text-[10px] text-[#1B29FF]">
                  OUTPUT ≈ {formatUnits(BigInt(bridgeQuote.outputAmount), 6)}{' '}
                  USDC
                </p>
                <p className="font-mono text-[10px] text-[#101010]/50">
                  Fee: ~${bridgeQuote.totalFeeUsd} • ETA: ~
                  {Math.ceil(bridgeQuote.estimatedTime / 60)} min
                </p>
              </div>
            )}

            <button
              onClick={handleBridgeToBase}
              disabled={
                !bridgeAmount ||
                parseFloat(bridgeAmount) <= 0 ||
                gnosisXdaiBalance.totalAvailable === 0n ||
                !bridgeQuote ||
                isLoadingBridgeQuote ||
                isBridging
              }
              className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBridging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4" />
              )}
              <span className="leading-none">[ BRIDGE TO BASE ]</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
            Bridge via LI.FI • Funds arrive on Base in ~5-15 min
          </p>
        </div>

        {/* Help text */}
        <p className="font-mono text-[10px] text-center text-[#101010]/40">
          2-STEP WITHDRAWAL: sDAI → xDAI → Base USDC
        </p>
      </div>
    );
  }

  // --- ARBITRUM 2-STEP WITHDRAWAL FLOW ---
  // Step 1: Withdraw from vault (get USDC on Arbitrum)
  // Step 2: Bridge USDC -> Base (via Across Protocol)
  if (isArbitrumVault && targetSafeAddress) {
    return (
      <div className="space-y-6 p-4 bg-[#fafafa] border border-[#1B29FF]/20 relative">
        {/* Blueprint grid overlay */}
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

        {/* Success Banner */}
        <SuccessBanner />

        {/* Processing Banner */}
        <ProcessingBanner />

        {/* TOP CARD: Vault Balance - Withdraw USDC */}
        <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                VAULT::ARB_USDC_BALANCE
              </p>
              <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                {displayBalance}{' '}
                <span className="text-[12px] text-[#1B29FF]">USDC</span>
              </p>
              <p className="text-[12px] font-mono text-[#101010]/50">
                ≈ ${displayBalance} USD
              </p>
            </div>
          </div>

          {/* Withdraw from vault */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
              INPUT::WITHDRAW_AMOUNT (Vault → Arbitrum USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000001"
                min="0"
                max={availableBalance}
                disabled={isProcessing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#1B29FF]/70">
                  USDC
                </span>
                <button
                  type="button"
                  onClick={handleMax}
                  className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                  disabled={isProcessing}
                >
                  MAX
                </button>
              </div>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={disableWithdraw}
              className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4" />
              )}
              <span className="leading-none">[ WITHDRAW FROM VAULT ]</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
            Redeems vault shares for USDC on Arbitrum
          </p>
        </div>

        {/* BOTTOM CARD: Arbitrum USDC Balance - Bridge to Base */}
        <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                BALANCE::ARB_USDC (Spendable)
              </p>
              <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                {targetSafeUsdcBalance?.formatted
                  ? parseFloat(targetSafeUsdcBalance.formatted).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      },
                    )
                  : '0.00'}{' '}
                <span className="text-[12px] text-[#1B29FF]">USDC</span>
              </p>
              <p className="text-[12px] font-mono text-[#101010]/50">
                ≈ ${targetSafeUsdcBalance?.formatted || '0.00'} USD
              </p>
            </div>
          </div>

          {/* Bridge to Base Input & Button */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
              INPUT::BRIDGE_AMOUNT (Arb USDC → Base USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={arbBridgeAmount}
                onChange={(e) => setArbBridgeAmount(e.target.value)}
                className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000001"
                min="0"
                disabled={isBridging}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#1B29FF]/70">
                  USDC
                </span>
                <button
                  type="button"
                  onClick={handleMaxArbBridge}
                  className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                  disabled={isBridging}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Bridge Quote Info */}
            {isLoadingArbBridgeQuote && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#1B29FF]/60">
                <Loader2 className="h-3 w-3 animate-spin" />
                Fetching quote...
              </div>
            )}
            {arbBridgeQuote && !isLoadingArbBridgeQuote && (
              <div className="p-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 space-y-1">
                <p className="font-mono text-[10px] text-[#1B29FF]">
                  OUTPUT ≈ {formatUnits(BigInt(arbBridgeQuote.outputAmount), 6)}{' '}
                  USDC
                </p>
                <p className="font-mono text-[10px] text-[#101010]/50">
                  Fee: ~{formatUnits(BigInt(arbBridgeQuote.totalFee), 6)} USDC •
                  ETA: ~{Math.ceil(arbBridgeQuote.estimatedFillTime / 60)} min
                </p>
              </div>
            )}

            <button
              onClick={handleArbBridgeToBase}
              disabled={
                !arbBridgeAmount ||
                parseFloat(arbBridgeAmount) <= 0 ||
                !arbBridgeQuote ||
                isLoadingArbBridgeQuote ||
                isBridging
              }
              className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBridging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4" />
              )}
              <span className="leading-none">[ BRIDGE TO BASE ]</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
            Bridge via Across Protocol • Funds arrive on Base in ~2-10 min
          </p>
        </div>

        {/* Help text */}
        <p className="font-mono text-[10px] text-center text-[#101010]/40">
          2-STEP WITHDRAWAL: Vault → Arb USDC → Base USDC
        </p>
      </div>
    );
  }

  // --- OPTIMISM 2-STEP WITHDRAWAL FLOW ---
  // Step 1: Withdraw from vault (get USDC on Optimism)
  // Step 2: Bridge USDC -> Base (via Across Protocol)
  if (isOptimismVault && targetSafeAddress) {
    return (
      <div className="space-y-6 p-4 bg-[#fafafa] border border-[#1B29FF]/20 relative">
        {/* Blueprint grid overlay */}
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

        {/* Success Banner */}
        <SuccessBanner />

        {/* Processing Banner */}
        <ProcessingBanner />

        {/* TOP CARD: Vault Balance - Withdraw USDC */}
        <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                VAULT::OP_USDC_BALANCE
              </p>
              <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                {displayBalance}{' '}
                <span className="text-[12px] text-[#1B29FF]">USDC</span>
              </p>
              <p className="text-[12px] font-mono text-[#101010]/50">
                ≈ ${displayBalance} USD
              </p>
            </div>
          </div>

          {/* Withdraw from vault */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
              INPUT::WITHDRAW_AMOUNT (Vault → Optimism USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000001"
                min="0"
                max={availableBalance}
                disabled={isProcessing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#1B29FF]/70">
                  USDC
                </span>
                <button
                  type="button"
                  onClick={handleMax}
                  className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                  disabled={isProcessing}
                >
                  MAX
                </button>
              </div>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={disableWithdraw}
              className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4" />
              )}
              <span className="leading-none">[ WITHDRAW FROM VAULT ]</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
            Redeems vault shares for USDC on Optimism
          </p>
        </div>

        {/* BOTTOM CARD: Optimism USDC Balance - Bridge to Base */}
        <div className="bg-white border border-[#1B29FF]/30 p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-[#1B29FF] mb-1">
                BALANCE::OP_USDC (Spendable)
              </p>
              <p className="font-mono text-[24px] tabular-nums text-[#101010]">
                {targetSafeUsdcBalance?.formatted
                  ? parseFloat(targetSafeUsdcBalance.formatted).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      },
                    )
                  : '0.00'}{' '}
                <span className="text-[12px] text-[#1B29FF]">USDC</span>
              </p>
              <p className="text-[12px] font-mono text-[#101010]/50">
                ≈ ${targetSafeUsdcBalance?.formatted || '0.00'} USD
              </p>
            </div>
          </div>

          {/* Bridge to Base Input & Button */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase">
              INPUT::BRIDGE_AMOUNT (Op USDC → Base USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={opBridgeAmount}
                onChange={(e) => setOpBridgeAmount(e.target.value)}
                className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/30 focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="0.000001"
                min="0"
                disabled={isBridging}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#1B29FF]/70">
                  USDC
                </span>
                <button
                  type="button"
                  onClick={handleMaxOpBridge}
                  className="font-mono px-2 py-1 text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 hover:border-[#1B29FF] transition-colors bg-white hover:bg-[#1B29FF]/5"
                  disabled={isBridging}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Bridge Quote Info */}
            {isLoadingOpBridgeQuote && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#1B29FF]/60">
                <Loader2 className="h-3 w-3 animate-spin" />
                Fetching quote...
              </div>
            )}
            {opBridgeQuote && !isLoadingOpBridgeQuote && (
              <div className="p-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 space-y-1">
                <p className="font-mono text-[10px] text-[#1B29FF]">
                  OUTPUT ≈ {formatUnits(BigInt(opBridgeQuote.outputAmount), 6)}{' '}
                  USDC
                </p>
                <p className="font-mono text-[10px] text-[#101010]/50">
                  Fee: ~{formatUnits(BigInt(opBridgeQuote.totalFee), 6)} USDC •
                  ETA: ~{Math.ceil(opBridgeQuote.estimatedFillTime / 60)} min
                </p>
              </div>
            )}

            <button
              onClick={handleOpBridgeToBase}
              disabled={
                !opBridgeAmount ||
                parseFloat(opBridgeAmount) <= 0 ||
                !opBridgeQuote ||
                isLoadingOpBridgeQuote ||
                isBridging
              }
              className="w-full h-10 font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBridging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="h-4 w-4" />
              )}
              <span className="leading-none">[ BRIDGE TO BASE ]</span>
            </button>
          </div>

          <p className="font-mono text-[10px] text-center text-[#1B29FF]/60 mt-3">
            Bridge via Across Protocol • Funds arrive on Base in ~2-10 min
          </p>
        </div>

        {/* Help text */}
        <p className="font-mono text-[10px] text-center text-[#101010]/40">
          2-STEP WITHDRAWAL: Vault → Op USDC → Base USDC
        </p>
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
