'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits } from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { USDC_DECIMALS } from '@/lib/constants';
import { trpc } from '@/utils/trpc';

export interface GnosisBalances {
  /** Native xDAI balance (18 decimals) */
  nativeXdai: bigint;
  /** Wrapped xDAI (WXDAI) balance (18 decimals) */
  wxdai: bigint;
  /** sDAI vault shares balance (18 decimals) */
  sdai: bigint;
  /** Total available for deposit (nativeXdai + wxdai) */
  totalAvailable: bigint;
}

export interface CrossChainBalanceState {
  /** Source chain (Base) USDC balance */
  sourceBalance: bigint;
  /** Target chain balance (USDC or xDAI depending on chain) */
  targetBalance: bigint;
  /** Gnosis-specific balances (only populated for Gnosis chain) */
  gnosisBalances: GnosisBalances | null;
  /** Whether balances are loading */
  isLoading: boolean;
  /** Whether we're polling for balance updates */
  isPolling: boolean;
}

interface UseCrossChainBalanceOptions {
  /** Base Safe address (source chain) */
  baseSafeAddress: Address | undefined;
  /** Target Safe address (destination chain) */
  targetSafeAddress: Address | undefined;
  /** Target chain ID */
  targetChainId: number;
  /** Whether this is a cross-chain operation */
  isCrossChain: boolean;
  /** Whether to poll for balance updates (e.g., during bridging) */
  pollForUpdates?: boolean;
  /** Polling interval in milliseconds */
  pollInterval?: number;
  /** Expected balance threshold to detect successful bridge (optional) */
  expectedBalanceThreshold?: bigint;
  /** Callback when expected balance is reached */
  onBalanceReached?: () => void;
}

interface UseCrossChainBalanceReturn extends CrossChainBalanceState {
  /** Refetch all balances */
  refetch: () => Promise<void>;
  /** Start polling for balance updates */
  startPolling: () => void;
  /** Stop polling */
  stopPolling: () => void;
  /** Formatted source balance (for display) */
  formattedSourceBalance: string;
  /** Formatted target balance (for display) */
  formattedTargetBalance: string;
}

/**
 * Hook for managing cross-chain balances.
 *
 * Handles:
 * - Fetching source chain (Base) USDC balance
 * - Fetching target chain balances (USDC or Gnosis tokens)
 * - Polling for balance updates during bridging
 * - Detecting when expected balance is reached
 */
export function useCrossChainBalance({
  baseSafeAddress,
  targetSafeAddress,
  targetChainId,
  isCrossChain,
  pollForUpdates = false,
  pollInterval = 5000,
  expectedBalanceThreshold,
  onBalanceReached,
}: UseCrossChainBalanceOptions): UseCrossChainBalanceReturn {
  const [isPolling, setIsPolling] = useState(false);
  const [sourceBalance, setSourceBalance] = useState<bigint>(0n);
  const [targetBalance, setTargetBalance] = useState<bigint>(0n);
  const [gnosisBalances, setGnosisBalances] = useState<GnosisBalances | null>(
    null,
  );

  const trpcUtils = trpc.useUtils();

  const isGnosis = targetChainId === SUPPORTED_CHAINS.GNOSIS;

  // Fetch Base USDC balance (source chain)
  const {
    data: baseUsdcData,
    refetch: refetchBaseUsdc,
    isLoading: isLoadingBaseUsdc,
  } = trpc.earn.getSafeBalanceOnChain.useQuery(
    {
      safeAddress: baseSafeAddress ?? '',
      chainId: SUPPORTED_CHAINS.BASE,
    },
    {
      enabled: !!baseSafeAddress && isCrossChain,
      staleTime: 30000,
      refetchInterval: isPolling ? pollInterval : false,
    },
  );

  // Fetch target chain USDC balance (for Arbitrum)
  const {
    data: targetUsdcData,
    refetch: refetchTargetUsdc,
    isLoading: isLoadingTargetUsdc,
  } = trpc.earn.getSafeBalanceOnChain.useQuery(
    {
      safeAddress: targetSafeAddress ?? '',
      chainId: targetChainId,
    },
    {
      enabled: !!targetSafeAddress && isCrossChain && !isGnosis,
      staleTime: 15000,
      refetchInterval: isPolling ? pollInterval : false,
    },
  );

  // Fetch Gnosis xDAI balance (for Gnosis chain)
  const {
    data: gnosisData,
    refetch: refetchGnosis,
    isLoading: isLoadingGnosis,
  } = trpc.earn.getGnosisXdaiBalance.useQuery(
    { safeAddress: targetSafeAddress ?? '' },
    {
      enabled: !!targetSafeAddress && isCrossChain && isGnosis,
      staleTime: 15000,
      refetchInterval: isPolling ? pollInterval : false,
    },
  );

  // Update source balance
  useEffect(() => {
    if (baseUsdcData) {
      setSourceBalance(BigInt(baseUsdcData.balance));
    }
  }, [baseUsdcData]);

  // Update target balance based on chain
  useEffect(() => {
    if (isGnosis && gnosisData) {
      const balances: GnosisBalances = {
        nativeXdai: BigInt(gnosisData.nativeXdai),
        wxdai: BigInt(gnosisData.wxdai),
        sdai: BigInt(gnosisData.sdai),
        totalAvailable: BigInt(gnosisData.totalAvailableForDeposit),
      };
      setGnosisBalances(balances);
      // For Gnosis, target balance is the total available for deposit
      setTargetBalance(balances.totalAvailable);
    } else if (!isGnosis && targetUsdcData) {
      setTargetBalance(BigInt(targetUsdcData.balance));
      setGnosisBalances(null);
    }
  }, [isGnosis, gnosisData, targetUsdcData]);

  // Check for expected balance threshold
  useEffect(() => {
    if (
      expectedBalanceThreshold !== undefined &&
      targetBalance >= expectedBalanceThreshold &&
      onBalanceReached
    ) {
      onBalanceReached();
      setIsPolling(false);
    }
  }, [targetBalance, expectedBalanceThreshold, onBalanceReached]);

  // Start polling based on prop
  useEffect(() => {
    setIsPolling(pollForUpdates);
  }, [pollForUpdates]);

  // Refetch all balances
  const refetch = useCallback(async () => {
    const promises: Promise<unknown>[] = [];

    if (baseSafeAddress && isCrossChain) {
      promises.push(refetchBaseUsdc());
    }

    if (targetSafeAddress && isCrossChain) {
      if (isGnosis) {
        promises.push(refetchGnosis());
      } else {
        promises.push(refetchTargetUsdc());
      }
    }

    await Promise.all(promises);
  }, [
    baseSafeAddress,
    targetSafeAddress,
    isCrossChain,
    isGnosis,
    refetchBaseUsdc,
    refetchTargetUsdc,
    refetchGnosis,
  ]);

  // Polling controls
  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  // Loading state
  const isLoading = useMemo(() => {
    if (!isCrossChain) return false;
    if (isGnosis) {
      return isLoadingBaseUsdc || isLoadingGnosis;
    }
    return isLoadingBaseUsdc || isLoadingTargetUsdc;
  }, [
    isCrossChain,
    isGnosis,
    isLoadingBaseUsdc,
    isLoadingTargetUsdc,
    isLoadingGnosis,
  ]);

  // Formatted balances
  const formattedSourceBalance = useMemo(() => {
    const value = formatUnits(sourceBalance, USDC_DECIMALS);
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }, [sourceBalance]);

  const formattedTargetBalance = useMemo(() => {
    // For Gnosis, target balance is in 18 decimals (xDAI)
    // For other chains, it's USDC (6 decimals)
    const decimals = isGnosis ? 18 : USDC_DECIMALS;
    const value = formatUnits(targetBalance, decimals);
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }, [targetBalance, isGnosis]);

  return {
    sourceBalance,
    targetBalance,
    gnosisBalances,
    isLoading,
    isPolling,
    refetch,
    startPolling,
    stopPolling,
    formattedSourceBalance,
    formattedTargetBalance,
  };
}
