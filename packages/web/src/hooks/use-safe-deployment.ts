'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Address, type Hex, createPublicClient, http } from 'viem';
import { base, arbitrum, gnosis, optimism } from 'viem/chains';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { trpc } from '@/utils/trpc';

export type DeploymentState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'deployed'; address: Address }
  | {
      status: 'needs-deployment';
      predictedAddress: Address;
      deploymentTransaction: { to: Address; data: Hex; value: bigint };
    }
  | {
      status: 'deploying';
      predictedAddress: Address;
      deploymentTransaction: { to: Address; data: Hex; value: bigint };
    }
  | { status: 'success'; address: Address; txHash?: string }
  | { status: 'error'; message: string };

interface UseSafeDeploymentOptions {
  /** The Base Safe address to use as salt nonce for deterministic deployment */
  baseSafeAddress: Address | undefined;
  /** Target chain ID where Safe should be deployed */
  targetChainId: number;
  /** Whether this is a cross-chain operation (skip if false) */
  enabled?: boolean;
  /** Callback when deployment completes successfully */
  onDeploymentComplete?: (safeAddress: Address) => void;
}

interface UseSafeDeploymentReturn {
  /** Current deployment state */
  state: DeploymentState;
  /** Target Safe address (deployed or predicted) */
  targetSafeAddress: Address | undefined;
  /** Whether Safe needs to be deployed */
  needsDeployment: boolean;
  /** Whether Safe is deployed and ready */
  isReady: boolean;
  /** Whether we're checking deployment status */
  isChecking: boolean;
  /** Deploy the Safe on target chain */
  deploy: () => Promise<Address>;
  /** Reset state to idle */
  reset: () => void;
}

/**
 * Hook for managing Safe deployment on cross-chain operations.
 *
 * Handles:
 * - Checking if Safe exists on target chain (DB + on-chain bytecode)
 * - Fetching predicted address for deployment
 * - Executing deployment via Privy smart wallet
 * - Registering deployed Safe in database
 *
 * Uses Base Safe address as salt nonce for deterministic address matching.
 */
export function useSafeDeployment({
  baseSafeAddress,
  targetChainId,
  enabled = true,
  onDeploymentComplete,
}: UseSafeDeploymentOptions): UseSafeDeploymentReturn {
  const [state, setState] = useState<DeploymentState>({ status: 'idle' });
  const { getClientForChain } = useSmartWallets();
  const trpcUtils = trpc.useUtils();

  // tRPC mutations
  const safeDeploymentMutation = trpc.earn.getSafeDeploymentTx.useMutation();
  const registerSafeMutation = trpc.earn.registerDeployedSafe.useMutation();

  // Get multi-chain positions to find existing Safe
  const { data: multiChainPositions, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: enabled && !!baseSafeAddress,
    });

  // Check if Safe exists in DB
  const targetSafeFromDB = useMemo(() => {
    if (!multiChainPositions?.safes) return undefined;
    const safe = multiChainPositions.safes.find(
      (s) => s.chainId === targetChainId,
    );
    return safe?.address as Address | undefined;
  }, [multiChainPositions, targetChainId]);

  // Determine if this is cross-chain
  const isCrossChain = targetChainId !== SUPPORTED_CHAINS.BASE;

  // Determine chain and RPC URL based on target chain
  const isArbitrum = targetChainId === SUPPORTED_CHAINS.ARBITRUM;
  const isGnosis = targetChainId === SUPPORTED_CHAINS.GNOSIS;
  const isOptimism = targetChainId === SUPPORTED_CHAINS.OPTIMISM;

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
        : process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

  // Create public client for target chain
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }, [chain, rpcUrl]);

  // Get chain name for logging
  const getChainName = useCallback((chainId: number): string => {
    const names: Record<number, string> = {
      [SUPPORTED_CHAINS.BASE]: 'Base',
      [SUPPORTED_CHAINS.ARBITRUM]: 'Arbitrum',
      [SUPPORTED_CHAINS.OPTIMISM]: 'Optimism',
      [SUPPORTED_CHAINS.GNOSIS]: 'Gnosis',
    };
    return names[chainId] || `Chain ${chainId}`;
  }, []);

  // Check on-chain deployment when we have a DB address
  useEffect(() => {
    if (!enabled || !isCrossChain || !targetSafeFromDB) return;
    if (state.status !== 'idle') return;

    const checkOnChainDeployment = async () => {
      setState({ status: 'checking' });

      try {
        console.log(
          `[useSafeDeployment] Checking if Safe is deployed on ${getChainName(targetChainId)}:`,
          targetSafeFromDB,
        );

        const code = await publicClient.getBytecode({
          address: targetSafeFromDB,
        });

        const isDeployed = !!(code && code !== '0x');
        console.log(
          '[useSafeDeployment] On-chain deployment check result:',
          isDeployed,
        );

        if (isDeployed) {
          setState({ status: 'deployed', address: targetSafeFromDB });
          return;
        }

        // Safe exists in DB but not deployed on-chain.
        // Fetch a deterministic deployment tx (cloned from Base Safe owners/threshold).
        const result = await safeDeploymentMutation.mutateAsync({
          targetChainId,
          safeType: 'primary',
        });

        setState({
          status: 'needs-deployment',
          predictedAddress: result.predictedAddress as Address,
          deploymentTransaction: {
            to: result.to as Address,
            data: result.data as Hex,
            value: BigInt(result.value || '0'),
          },
        });
      } catch (err) {
        console.error('[useSafeDeployment] Failed to check deployment:', err);

        try {
          const result = await safeDeploymentMutation.mutateAsync({
            targetChainId,
            safeType: 'primary',
          });

          setState({
            status: 'needs-deployment',
            predictedAddress: result.predictedAddress as Address,
            deploymentTransaction: {
              to: result.to as Address,
              data: result.data as Hex,
              value: BigInt(result.value || '0'),
            },
          });
        } catch (innerErr) {
          console.error(
            '[useSafeDeployment] Failed to fetch deployment info after deployment check error:',
            innerErr,
          );
          setState({
            status: 'error',
            message: 'Failed to load account setup info. Please refresh.',
          });
        }
      }
    };

    checkOnChainDeployment();
  }, [
    enabled,
    isCrossChain,
    targetSafeFromDB,
    targetChainId,
    publicClient,
    getChainName,
    state.status,
    safeDeploymentMutation,
  ]);

  // Fetch deployment info when no Safe in DB
  useEffect(() => {
    if (!enabled || !isCrossChain || !baseSafeAddress) return;
    if (isLoadingPositions) return;
    if (targetSafeFromDB) return; // Already have Safe in DB
    if (state.status !== 'idle') return;

    const fetchDeploymentInfo = async () => {
      setState({ status: 'checking' });

      try {
        console.log(
          `[useSafeDeployment] No Safe found in DB for ${getChainName(targetChainId)}, fetching deployment info...`,
        );

        const result = await safeDeploymentMutation.mutateAsync({
          targetChainId,
          safeType: 'primary',
        });

        setState({
          status: 'needs-deployment',
          predictedAddress: result.predictedAddress as Address,
          deploymentTransaction: {
            to: result.to as Address,
            data: result.data as Hex,
            value: BigInt(result.value || '0'),
          },
        });
      } catch (err) {
        console.error(
          '[useSafeDeployment] Failed to fetch deployment info:',
          err,
        );
        setState({
          status: 'error',
          message: 'Failed to load account setup info. Please refresh.',
        });
      }
    };

    fetchDeploymentInfo();
  }, [
    enabled,
    isCrossChain,
    baseSafeAddress,
    isLoadingPositions,
    targetSafeFromDB,
    targetChainId,
    getChainName,
    state.status,
    safeDeploymentMutation,
  ]);

  // Deploy function
  const deploy = useCallback(async (): Promise<Address> => {
    if (!baseSafeAddress) {
      throw new Error('Base Safe address is required for deployment');
    }

    if (state.status !== 'needs-deployment') {
      throw new Error(`Cannot deploy in state: ${state.status}`);
    }

    const predictedAddress = state.predictedAddress;
    setState({
      status: 'deploying',
      predictedAddress,
      deploymentTransaction: state.deploymentTransaction,
    });

    try {
      const chainName = getChainName(targetChainId);
      console.log(`[useSafeDeployment] Deploying Safe on ${chainName}...`);

      // Get smart wallet client for target chain
      const targetClient = await getClientForChain({ id: targetChainId });
      if (!targetClient) {
        throw new Error(
          `Failed to get ${chainName} client for Safe deployment`,
        );
      }

      const deploymentTransaction = state.deploymentTransaction;

      // Check if already deployed on-chain
      const code = await publicClient.getBytecode({
        address: predictedAddress,
      });

      let txHash: string | undefined;

      if (code && code !== '0x') {
        console.log(
          '[useSafeDeployment] Safe is already deployed on-chain. Registering...',
        );
      } else {
        // Deploy the Safe
        console.log('[useSafeDeployment] Deploying new Safe...');

        txHash = await targetClient.sendTransaction({
          to: deploymentTransaction.to,
          data: deploymentTransaction.data,
          value: deploymentTransaction.value,
        });

        console.log('[useSafeDeployment] Deployment tx hash:', txHash);

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
        });

        if (receipt.status !== 'success') {
          throw new Error('Safe deployment transaction failed');
        }

        console.log('[useSafeDeployment] Safe deployed successfully!');
      }

      // Register the Safe in database
      await registerSafeMutation.mutateAsync({
        safeAddress: predictedAddress,
        chainId: targetChainId,
        safeType: 'primary',
      });

      console.log('[useSafeDeployment] Safe registered in database');

      // Invalidate positions cache
      await trpcUtils.earn.getMultiChainPositions.invalidate();

      setState({
        status: 'success',
        address: predictedAddress,
        txHash,
      });

      onDeploymentComplete?.(predictedAddress);

      return predictedAddress;
    } catch (err) {
      console.error('[useSafeDeployment] Deployment failed:', err);
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Safe deployment failed',
      });
      throw err;
    }
  }, [
    baseSafeAddress,
    state,
    targetChainId,
    getChainName,
    getClientForChain,
    rpcUrl,
    publicClient,
    registerSafeMutation,
    trpcUtils,
    onDeploymentComplete,
  ]);

  // Reset function
  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  // Derived values
  const targetSafeAddress = useMemo((): Address | undefined => {
    if (state.status === 'deployed' || state.status === 'success') {
      return state.address;
    }
    if (state.status === 'needs-deployment' || state.status === 'deploying') {
      return state.predictedAddress;
    }
    return targetSafeFromDB;
  }, [state, targetSafeFromDB]);

  const needsDeployment = useMemo(() => {
    if (!enabled || !isCrossChain) return false;
    return state.status === 'needs-deployment' || state.status === 'deploying';
  }, [enabled, isCrossChain, state.status]);

  const isReady = useMemo(() => {
    if (!enabled) return true; // Not cross-chain, always ready
    if (!isCrossChain) return true;
    return state.status === 'deployed' || state.status === 'success';
  }, [enabled, isCrossChain, state.status]);

  const isChecking = state.status === 'checking';

  return {
    state,
    targetSafeAddress,
    needsDeployment,
    isReady,
    isChecking,
    deploy,
    reset,
  };
}
