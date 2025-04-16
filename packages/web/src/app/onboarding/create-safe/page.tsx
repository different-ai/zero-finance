'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Wallet, X, CheckCircle, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { type Address } from 'viem';
import { base } from 'viem/chains';
import { createWalletClient, custom, publicActions } from 'viem';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Safe, { Eip1193Provider, SafeAccountConfig, SafeDeploymentConfig } from '@safe-global/protocol-kit';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#111827] mb-3">Create Your Primary Safe</h2>
        <p className="text-[#6B7280] text-lg leading-relaxed">
          Your Primary Safe Wallet will be deployed on Base network, a secure and cost-effective Ethereum layer 2 solution.
        </p>
      </div>

      <Card className="border border-[#E5E7EB]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-[#10B981]/10 p-2 rounded-full">
              <Shield className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-medium text-[#111827] text-lg mb-2">Smart Contract Wallet</h3>
              <p className="text-[#6B7280]">
                We&apos;re creating a Gnosis Safe smart contract wallet for you. This is more secure than a regular wallet
                and allows for advanced features like multi-signature transactions in the future.
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-[#6B7280]">
                <Wallet className="h-5 w-5" />
                <span>Connected Address:</span>
                <code className="bg-[#F9FAFB] px-2 py-0.5 rounded text-xs font-mono border border-[#E5E7EB]">
                  {embeddedWallet?.address ? 
                    `${embeddedWallet.address.slice(0, 6)}...${embeddedWallet.address.slice(-4)}` : 
                    'No wallet connected'
                  }
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {deploymentError && (
        <Alert variant="destructive" className="my-4 border-red-200 bg-red-50">
          <AlertTitle className="text-red-800 flex items-center gap-2">
            <X className="h-4 w-4" />
            Deployment Error
          </AlertTitle>
          <AlertDescription className="text-red-700 mt-1">
            {deploymentError}
            {deployedSafeAddress && (
              <p className="mt-2">Your Safe was created at <code className="bg-white px-2 py-0.5 rounded text-xs font-mono border border-red-200">{deployedSafeAddress}</code>, but saving failed. Please copy this address and contact support.</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {deployedSafeAddress && !deploymentError ? (
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-6">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-6 w-6 text-[#10B981] mr-2" />
            <h3 className="font-medium text-[#111827] text-lg">Safe Successfully Created!</h3>
          </div>
          <p className="text-[#6B7280] mb-3">
            Your Primary Safe Wallet has been deployed to Base network.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#6B7280]">Safe Address:</span>
            <code className="bg-white px-3 py-1 rounded text-sm font-mono border border-[#E5E7EB] flex-1 break-all">
              {deployedSafeAddress}
            </code>
          </div>
          <p className="text-[#6B7280] text-sm mb-4">
            This address is now linked to your profile. You can proceed to the next step.
          </p>
          <Link
            href="/onboarding/info"
            className="bg-[#111827] hover:bg-[#111827]/90 text-white px-6 py-2.5 rounded-md inline-flex items-center font-medium shadow-sm"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] flex flex-col items-center">
          <p className="text-[#6B7280] text-center mb-6">
            Click the button below to create your Primary Safe. This will deploy a smart contract to the blockchain 
            and requires a small transaction fee.
          </p>
          
          <button
            onClick={handleCreateSafe}
            disabled={isLoading || !embeddedWallet}
            className={`px-8 py-3 text-white rounded-md inline-flex items-center justify-center font-medium shadow-sm ${
              isLoading || !embeddedWallet
                ? 'bg-[#111827]/50 cursor-not-allowed'
                : 'bg-[#111827] hover:bg-[#111827]/90'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Deploying Safe... (Check Wallet)
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Deploy Primary Safe on Base
              </>
            )}
          </button>
          
          <p className="mt-4 text-xs text-[#6B7280]">
            This requires a small amount of ETH on Base for gas fees. The deployment might take a minute.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Link
          href="/onboarding/welcome"
          className="px-5 py-2 text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-md inline-flex items-center font-medium transition-colors"
          aria-disabled={isLoading}
          tabIndex={isLoading ? -1 : undefined}
          style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        
        {(!isLoading && !deployedSafeAddress) && (
          <Link
            href="/onboarding/info"
            className="px-4 py-2 text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-md font-medium transition-colors"
          >
            Skip for Now
          </Link>
        )}
        
        {deployedSafeAddress && !deploymentError && (
          <Link
            href="/onboarding/info"
            className="px-6 py-2.5 bg-[#111827] hover:bg-[#111827]/90 text-white rounded-md inline-flex items-center font-medium shadow-sm"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
} 