import { useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { type Address } from 'viem';
import { base } from 'viem/chains';
import Safe, { SafeAccountConfig, SafeDeploymentConfig } from '@safe-global/protocol-kit';
import { api } from '@/trpc/react';
import { useSmartWallet } from './use-smart-wallet';

/**
 * Hook to automatically create a Safe for new users after authentication
 * This runs invisibly in the background without user interaction
 */
export function useAutoSafeCreation() {
  const { authenticated, user } = usePrivy();
  const { smartWalletAddress, hasSmartWallet, createSmartWallet } = useSmartWallet();
  const { client: smartWalletClient } = useSmartWallets();
  const utils = api.useUtils();
  const completeOnboardingMutation = api.onboarding.completeOnboarding.useMutation();
  
  // Ref to track if we've already started the process
  const isProcessingRef = useRef(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only run once per session
    if (!authenticated || !user || hasCheckedRef.current) {
      return;
    }

    async function checkAndCreateSafe() {
      if (isProcessingRef.current) return;
      
      try {
        isProcessingRef.current = true;
        hasCheckedRef.current = true;
        
        console.log('0xHypr - Auto Safe Creation: Checking for existing Safe...');
        
        // Check if user already has a primary safe
        const primarySafeAddr = await utils.settings.userSafes.getPrimarySafeAddress.fetch();
        
        if (primarySafeAddr) {
          console.log('0xHypr - Auto Safe Creation: User already has a Safe:', primarySafeAddr);
          return;
        }
        
        console.log('0xHypr - Auto Safe Creation: No Safe found, creating one...');
        
        // Step 1: Ensure smart wallet exists
        if (!hasSmartWallet || !smartWalletAddress) {
          console.log('0xHypr - Auto Safe Creation: Creating smart wallet first...');
          await createSmartWallet();
          
          // Wait for smart wallet to be available
          let retries = 10;
          while (retries-- > 0 && (!hasSmartWallet || !smartWalletAddress)) {
            await new Promise(r => setTimeout(r, 2000));
          }
          
          if (!smartWalletAddress) {
            console.error('0xHypr - Auto Safe Creation: Failed to create smart wallet');
            return;
          }
        }
        
        // Step 2: Create Safe
        console.log('0xHypr - Auto Safe Creation: Creating Safe with smart wallet:', smartWalletAddress);
        
        // Create Safe configuration
        const safeAccountConfig: SafeAccountConfig = {
          owners: [smartWalletAddress!],
          threshold: 1,
        };
        
        const saltNonce = Date.now().toString();
        const safeDeploymentConfig: SafeDeploymentConfig = {
          saltNonce,
          safeVersion: '1.4.1',
        };
        
        // Initialize Protocol Kit
        const protocolKit = await Safe.init({
          predictedSafe: {
            safeAccountConfig,
            safeDeploymentConfig,
          },
          provider: process.env.NEXT_PUBLIC_BASE_RPC_URL as string,
        });
        
        // Get predicted Safe address
        const predictedSafeAddress = (await protocolKit.getAddress()) as Address;
        console.log('0xHypr - Auto Safe Creation: Predicted Safe address:', predictedSafeAddress);
        
        // Create deployment transaction
        const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();
        
        // Send transaction
        console.log('0xHypr - Auto Safe Creation: Deploying Safe...');
        await smartWalletClient?.sendTransaction(
          {
            to: deploymentTransaction.to as Address,
            value: BigInt(deploymentTransaction.value || '0'),
            data: deploymentTransaction.data as `0x${string}`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            chain: base as any,
          },
          {
            uiOptions: {
              showWalletUIs: false,
            },
          },
        );
        
        // Wait for deployment
        await waitUntilDeployed(predictedSafeAddress);
        
        console.log('0xHypr - Auto Safe Creation: Safe deployed successfully!');
        
        // Save to database
        await completeOnboardingMutation.mutateAsync({
          primarySafeAddress: predictedSafeAddress,
        });
        
        console.log('0xHypr - Auto Safe Creation: Safe saved to user profile');
        
      } catch (error) {
        console.error('0xHypr - Auto Safe Creation: Error:', error);
      } finally {
        isProcessingRef.current = false;
      }
    }
    
    // Start the process after a short delay
    const timer = setTimeout(() => {
      checkAndCreateSafe();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [
    authenticated, 
    user, 
    hasSmartWallet, 
    smartWalletAddress, 
    createSmartWallet,
    smartWalletClient,
    utils.settings.userSafes.getPrimarySafeAddress,
    completeOnboardingMutation
  ]);
}

// Helper function to wait until Safe is deployed
async function waitUntilDeployed(addr: Address) {
  const publicClient = createPublicClient({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            chain: base as any,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL as string),
  });
  
  for (let i = 0; i < 30; i++) { // Max 2 minutes
    const code = await publicClient.getBytecode({ address: addr });
    if (code && code !== '0x') break;
    await new Promise(r => setTimeout(r, 4000));
  }
}

// Import needed for viem
import { createPublicClient, http } from 'viem';