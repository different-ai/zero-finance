'use client';

import { useState, useCallback } from 'react';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { type Address, type Hex, createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
} from '@safe-global/protocol-kit';

/**
 * Hook to deploy a Safe on a cross-chain network (e.g., Arbitrum)
 * using the same CREATE2 parameters as the Base deployment
 * to ensure the same Safe address across chains.
 * 
 * IMPORTANT: The saltNonce should be derived deterministically from user identity
 * (e.g., hash of Privy DID) to ensure the same Safe address across all chains.
 */
export function useDeploySafeCrossChain() {
  const { client: smartWalletClient } = useSmartWallets();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<string>('');

  const deploySafeOnArbitrum = useCallback(
    async (params: {
      owners: Address[];
      threshold: number;
      rpcUrl?: string;
    }): Promise<{ success: boolean; safeAddress?: Address; txHash?: Hex }> => {
      if (!smartWalletClient) {
        throw new Error('Smart wallet client not available');
      }

      setIsDeploying(true);
      setDeploymentError(null);
      setDeploymentStep('Preparing Safe deployment...');

      try {
        const { owners, threshold, rpcUrl } = params;
        
        // Generate deterministic saltNonce from owners array
        // This ensures same Safe address across chains for same owners/threshold
        const ownersHash = owners
          .map((addr) => addr.toLowerCase())
          .sort()
          .join('');
        const saltNonce = `0x${Buffer.from(ownersHash).toString('hex')}`;

        // Use Arbitrum RPC URL
        const arbitrumRpcUrl =
          rpcUrl ||
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
          'https://arb1.arbitrum.io/rpc';

        // Create Safe configuration (MUST match Base deployment params!)
        const safeAccountConfig: SafeAccountConfig = {
          owners,
          threshold,
        };

        const safeDeploymentConfig: SafeDeploymentConfig = {
          saltNonce, // CRITICAL: Use same saltNonce as Base deployment
          safeVersion: '1.4.1',
        };

        console.log('[DeploySafeCrossChain] Initializing Safe Protocol Kit...');
        setDeploymentStep('Calculating Safe address...');

        // Initialize Protocol Kit with predicted Safe
        const protocolKit = await Safe.init({
          predictedSafe: {
            safeAccountConfig,
            safeDeploymentConfig,
          },
          provider: arbitrumRpcUrl,
        });

        // Get predicted Safe address (should match Base!)
        const predictedSafeAddress = (await protocolKit.getAddress()) as Address;
        console.log(
          `[DeploySafeCrossChain] Predicted Safe address: ${predictedSafeAddress}`
        );

        // Check if Safe already exists
        const publicClient = createPublicClient({
          chain: arbitrum,
          transport: http(arbitrumRpcUrl),
        });

        const code = await publicClient.getCode({ address: predictedSafeAddress });
        if (code && code !== '0x') {
          console.log('[DeploySafeCrossChain] Safe already exists on Arbitrum');
          return { success: true, safeAddress: predictedSafeAddress };
        }

        // Create deployment transaction
        setDeploymentStep('Preparing deployment transaction...');
        console.log('[DeploySafeCrossChain] Creating deployment transaction...');

        const deploymentTransaction =
          await protocolKit.createSafeDeploymentTransaction();

        // Send transaction via Privy smart wallet
        setDeploymentStep('Deploying Safe on Arbitrum...');
        console.log('[DeploySafeCrossChain] Sending deployment transaction...');

        const userOpHash = await smartWalletClient.sendTransaction(
          {
            to: deploymentTransaction.to as Address,
            value: BigInt(deploymentTransaction.value || '0'),
            data: deploymentTransaction.data as `0x${string}`,
            chain: arbitrum,
          },
          {
            uiOptions: {
              showWalletUIs: false,
            },
          }
        );

        console.log(`[DeploySafeCrossChain] UserOp hash: ${userOpHash}`);

        // Wait for Safe deployment
        setDeploymentStep('Waiting for deployment confirmation...');
        console.log('[DeploySafeCrossChain] Waiting for Safe deployment...');

        // Poll for bytecode
        let retries = 30; // 30 * 3s = 90s max wait
        while (retries-- > 0) {
          await new Promise((r) => setTimeout(r, 3000));
          const newCode = await publicClient.getCode({
            address: predictedSafeAddress,
          });
          if (newCode && newCode !== '0x') {
            console.log('[DeploySafeCrossChain] ✅ Safe deployed successfully!');
            setDeploymentStep('Safe deployed successfully!');
            return {
              success: true,
              safeAddress: predictedSafeAddress,
              txHash: userOpHash as Hex,
            };
          }
        }

        throw new Error('Safe deployment timeout - bytecode not detected');
      } catch (error: any) {
        console.error('[DeploySafeCrossChain] Deployment error:', error);
        const errorMessage = error.message || 'Failed to deploy Safe';
        setDeploymentError(errorMessage);
        throw error;
      } finally {
        setIsDeploying(false);
      }
    },
    [smartWalletClient]
  );

  const resetError = useCallback(() => {
    setDeploymentError(null);
  }, []);

  return {
    deploySafeOnArbitrum,
    isDeploying,
    deploymentError,
    deploymentStep,
    resetError,
  };
}
