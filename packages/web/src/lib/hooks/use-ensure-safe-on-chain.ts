/**
 * Hook for ensuring Safe exists on destination chain before cross-chain operations
 */

import { useMutation } from '@tanstack/react-query';
import { type Address } from 'viem';
import { trpc } from '@/utils/trpc';

export interface EnsureSafeParams {
  /** Safe address to check/deploy */
  safeAddress: Address;
  /** Destination chain ID */
  destinationChainId: number;
}

export interface EnsureSafeResult {
  /** Whether Safe exists now */
  exists: boolean;
  /** Whether Safe was deployed (vs already existing) */
  deployed: boolean;
  /** Deployment transaction hash (if deployed) */
  hash?: string;
}

/**
 * Hook to ensure Safe exists on destination chain
 * Will deploy Safe if needed using CREATE2 for same address across chains
 */
export function useEnsureSafeOnChain() {
  const ensureSafeMutation = trpc.earn.ensureSafeOnChain.useMutation();

  return useMutation({
    mutationFn: async (params: EnsureSafeParams): Promise<EnsureSafeResult> => {
      const { safeAddress, destinationChainId } = params;

      console.log(
        `[useEnsureSafe] Ensuring Safe ${safeAddress} exists on chain ${destinationChainId}...`,
      );

      const result = await ensureSafeMutation.mutateAsync({
        safeAddress,
        destinationChainId,
      });

      if (result.deployed) {
        console.log(
          `[useEnsureSafe] ✅ Safe deployed on chain ${destinationChainId}`,
        );
        console.log(`[useEnsureSafe] Tx: ${result.hash}`);
      } else {
        console.log(
          `[useEnsureSafe] Safe already exists on chain ${destinationChainId}`,
        );
      }

      return result as EnsureSafeResult;
    },
    onError: (error) => {
      console.error('[useEnsureSafe] Failed to ensure Safe:', error);
    },
  });
}
