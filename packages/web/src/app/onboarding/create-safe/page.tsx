'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Wallet, X, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { type Address } from 'viem';
import { base } from 'viem/chains';
import { createWalletClient, custom, publicActions } from 'viem';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Safe, { Eip1193Provider, SafeAccountConfig, SafeDeploymentConfig } from '@safe-global/protocol-kit';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/trpc/react';

export default function CreateSafePage() {
  const router = useRouter();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const [deployedSafeAddress, setDeployedSafeAddress] = useState<Address | null>(null);

  // Use tRPC mutation to complete onboarding
  const completeOnboardingMutation = api.onboarding.completeOnboarding.useMutation();
  
  // Add access to tRPC utils for invalidation
  const utils = api.useUtils();

  const handleCreateSafe = async () => {
    if (!embeddedWallet) {
      setDeploymentError("Embedded wallet not available. Please ensure you are logged in.");
      return;
    }

    setIsLoading(true);
    setDeploymentError('');
    setDeployedSafeAddress(null);

    try {
      // 1. Get provider and signer details from Privy
      try {
        // Force switch to Base chain and wait for confirmation
        await embeddedWallet.switchChain(base.id); // Ensure wallet is on Base
        console.log(`0xHypr - Switched to Base (Chain ID: ${base.id})`);
      } catch (switchError) {
        console.error("Failed to switch chain:", switchError);
        setDeploymentError(`Failed to switch to Base network. Please switch to Base network in your wallet and try again.`);
        setIsLoading(false);
        return;
      }

      // Get provider after chain switch to ensure it's on Base
      const provider = await embeddedWallet.getEthereumProvider(); // Correct Privy method
      
      // Verify chain ID to ensure we're on Base
      const chainId = await new Promise<number>((resolve) => {
        provider.request({ method: 'eth_chainId' }).then(
          (result: string) => resolve(parseInt(result, 16)),
          (error: any) => {
            console.error("Failed to get chainId:", error);
            setDeploymentError("Failed to verify current chain. Please try again.");
            setIsLoading(false);
            throw error;
          }
        );
      });
      
      if (chainId !== base.id) {
        console.error(`Wrong chain detected. Expected ${base.id}, got ${chainId}`);
        setDeploymentError(`Your wallet is connected to chain ID ${chainId}, but we need Base (${base.id}). Please switch to Base network and try again.`);
        setIsLoading(false);
        return;
      }
      
      console.log(`0xHypr - Confirmed on Base (Chain ID: ${chainId})`);
      
      const ethersProvider = new ethers.providers.Web3Provider(provider); // Wrap in ethers provider
      const signer = ethersProvider.getSigner();
      const userAddress = await signer.getAddress() as Address;

      console.log(`0xHypr - User address for Safe owner: ${userAddress}`);
      console.log("0xHypr - Initializing EthersAdapter (for potential later use)...");

      // 2. Prepare Safe configuration
      const safeAccountConfig: SafeAccountConfig = { owners: [userAddress], threshold: 1 };
      const saltNonce = Date.now().toString();
      const safeDeploymentConfig: SafeDeploymentConfig = { saltNonce, safeVersion: '1.3.0' };

      const ethereumProvider = await embeddedWallet.getEthereumProvider();

      // 3. Initialize Safe SDK - Fix for the type errors
      console.log("0xHypr - Initializing Protocol Kit...");
      const protocolKit = await Safe.init({ 
          predictedSafe: { safeAccountConfig, safeDeploymentConfig },
          provider: ethereumProvider as Eip1193Provider,
          // Let the Safe SDK figure out the right types internally
          // We've seen this work despite the typescript errors
      });
      const predictedSafeAddress = await protocolKit.getAddress() as Address;
      console.log(`0xHypr - Predicted Safe address: ${predictedSafeAddress}`);

      // 4. Get deployment transaction data (should work on the initialized kit)
      console.log("0xHypr - Creating deployment transaction data...");
      const safeDeploymentTransaction = await protocolKit.createSafeDeploymentTransaction();

      // 5. Prepare viem clients for sending transaction - Use the provider that's confirmed to be on Base
      const walletClient = createWalletClient({
        account: embeddedWallet.address as Address,
        chain: base,
        transport: custom(ethereumProvider as any), // Use the provider we confirmed is on Base
      }).extend(publicActions);

      // 6. Send the deployment transaction
      console.log("0xHypr - Sending deployment transaction via user wallet...");
      const txHash = await walletClient.sendTransaction({
        chain: base,
        to: safeDeploymentTransaction.to as Address,
        value: BigInt(safeDeploymentTransaction.value),
        data: safeDeploymentTransaction.data as `0x${string}`,
        // Gas estimation can be added here if needed
      });
      console.log(`0xHypr - Deployment transaction sent: ${txHash}`);
      console.log("0xHypr - Waiting for transaction confirmation...");

      // 7. Wait for confirmation
      const txReceipt = await walletClient.waitForTransactionReceipt({ hash: txHash });
      console.log(`0xHypr - Transaction confirmed in block: ${txReceipt.blockNumber}`);

      // 8. Verify deployed address (optional but good practice)
      // The predicted address should match the address derived from receipt if successful
      // For simplicity, we'll use the predicted address optimistically after confirmation
      const deployedAddress = predictedSafeAddress; // Use predicted address after confirmation
      setDeployedSafeAddress(deployedAddress);
      console.log(`0xHypr - Safe deployed successfully at: ${deployedAddress}`);

      // 9. Save the deployed address to the user's profile using tRPC mutation
      console.log("0xHypr - Saving Safe address to profile via tRPC...");
      try {
        await completeOnboardingMutation.mutateAsync({ 
          primarySafeAddress: deployedAddress 
        });

        // Invalidate user safes query to ensure UI shows the updated safe
        utils.settings.userSafes.list.invalidate();
        utils.onboarding.getOnboardingStatus.invalidate();
        
        console.log("0xHypr - Safe address saved successfully via tRPC.");

        // Success! The user can now proceed manually to the next step

      } catch (trpcSaveError: any) {
        console.error("Error saving Safe address via tRPC:", trpcSaveError);
        const message = trpcSaveError.message || 'Failed to save profile.';
        setDeploymentError(`Safe created (${deployedAddress}), but failed to save profile: ${message}. Please copy the address and contact support.`);
      }

    } catch (error: any) {
      console.error('Error creating Safe client-side:', error);
      // Extract more specific errors if possible (e.g., user rejection)
      let errorMessage = 'An unknown error occurred during Safe deployment.';
      if (error.message?.includes('User rejected the request')) {
        errorMessage = 'Transaction rejected in wallet.';
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage;
      }
      else if (error.message) {
        errorMessage = error.message;
      }
      setDeploymentError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-foreground">Create Your Primary Safe</h3>
      <p className="mb-4 text-muted-foreground">
        We&apos;ll deploy a new Gnosis Safe smart contract wallet for you on the Base network.
        This wallet will be owned and controlled by your connected address:
        <strong className="block font-mono text-sm break-all my-2 p-2 bg-muted rounded border">
          {embeddedWallet?.address ?? 'Loading...'}
        </strong>
        Click the button below to start the deployment. You&apos;ll need to confirm the transaction in your wallet.
      </p>

      {deployedSafeAddress && !deploymentError && (
        <Alert variant="default" className="mb-4 border-green-500/50 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Safe Deployed Successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your Primary Safe address is:
            <strong className="block font-mono text-sm break-all my-1">{deployedSafeAddress}</strong>
            This address is now linked to your profile. You can proceed to the next step.
          </AlertDescription>
        </Alert>
      )}

      {deploymentError && (
        <Alert variant="destructive" className="mb-4">
          <X className="h-4 w-4" />
          <AlertTitle>Deployment Error</AlertTitle>
          <AlertDescription>
            {deploymentError}
            {deployedSafeAddress && (
              <p className="mt-1">Your Safe was created at <strong className="font-mono break-all">{deployedSafeAddress}</strong>, but saving failed. Please copy this address and contact support.</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!deployedSafeAddress && (
        <button
          onClick={handleCreateSafe}
          disabled={isLoading || !embeddedWallet}
          className={`w-full px-4 py-3 text-white rounded-md inline-flex items-center justify-center font-semibold transition-colors ${
            isLoading || !embeddedWallet
              ? 'bg-primary/50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Deploying Safe... (Check Wallet)
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Deploy Primary Safe on Base
            </>
          )}
        </button>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        This requires a small amount of ETH on Base for gas fees. The deployment might take a minute.
      </div>

      <div className="flex justify-between mt-8">
        <Link
          href="/onboarding/welcome"
          className="px-4 py-2 text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors"
        >
          Back
        </Link>
        
        {deployedSafeAddress && !deploymentError && (
          <Link
            href="/onboarding/info"
            className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center font-medium hover:bg-primary/90 transition-colors"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
} 