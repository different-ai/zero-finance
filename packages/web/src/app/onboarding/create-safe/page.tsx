'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Wallet, X, CheckCircle, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
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
  // Use tRPC mutation to save the primary safe
  const addSafeMutation = api.settings.userSafes.add.useMutation({
    onSuccess: async () => {
      // Invalidate the user safes query to refresh the data
      await utils.settings.userSafes.list.invalidate();
      
      // Mark onboarding as complete
      await completeOnboardingMutation.mutateAsync();
      
      // Navigate to the final step of onboarding
      router.push('/onboarding/info');
    }
  });
  
  // Function to deploy the Safe
  const deploySafe = async () => {
    try {
      setIsLoading(true);
      setDeploymentError('');
      
      if (!embeddedWallet) {
        throw new Error("No embedded wallet available. Please connect your wallet first.");
      }
      
      // Get connected wallet provider
      const provider = await embeddedWallet.getEthersProvider();
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Initialize Safe SDK
      const ethAdapter = new ethers.providers.Web3Provider(provider.provider as any).getSigner();
      
      // Create Safe instance
      const safeSdk = await Safe.create({
        ethAdapter: ethAdapter as any,
        predictedSafe: {
          safeAccountConfig: {
            owners: [signerAddress],
            threshold: 1,
          },
          safeDeploymentConfig: {
            saltNonce: Date.now().toString(),
          },
        },
      });
      
      // Deploy Safe
      const deploymentResult = await safeSdk.deploySafe({ gasLimit: 5000000 });
      
      // Wait for transaction confirmation
      const receipt = await deploymentResult.transactionResponse?.wait();
      
      if (receipt?.status !== 1) {
        throw new Error("Safe deployment transaction failed");
      }
      
      // Get Safe contract address
      const safeAddress = await safeSdk.getAddress();
      
      // Save to state
      setDeployedSafeAddress(safeAddress as Address);
      
      // Save the Safe to the database
      await addSafeMutation.mutateAsync({
        safeAddress: safeAddress as Address,
        chainId: base.id,
        safeType: 'primary',
      });
      
      // Note: Redirect handled in the mutation onSuccess callback
      
    } catch (error) {
      console.error("Failed to deploy Safe:", error);
      setDeploymentError(error instanceof Error ? error.message : "Failed to deploy safe");
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
                <span>Connected Account: </span>
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
            Error Creating Safe
          </AlertTitle>
          <AlertDescription className="text-red-700 mt-1">
            {deploymentError}
          </AlertDescription>
        </Alert>
      )}

      {deployedSafeAddress ? (
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-6 animate-fade-in">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-6 w-6 text-[#10B981] mr-2" />
            <h3 className="font-medium text-[#111827] text-lg">Safe Successfully Created!</h3>
          </div>
          <p className="text-[#6B7280] mb-2">
            Your Primary Safe Wallet has been deployed to Base network.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#6B7280]">Safe Address:</span>
            <code className="bg-white px-3 py-1 rounded text-sm font-mono border border-[#E5E7EB] flex-1 break-all">
              {deployedSafeAddress}
            </code>
          </div>
          <Button
            onClick={() => router.push('/onboarding/info')}
            className="bg-[#111827] hover:bg-[#111827]/90 text-white px-6 py-2.5 rounded-md flex items-center gap-2 shadow-sm"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] flex flex-col items-center">
          <p className="text-[#6B7280] text-center mb-6">
            Click the button below to create your Primary Safe. This will deploy a smart contract to the blockchain 
            and requires a small transaction fee.
          </p>
          
          <Button
            onClick={deploySafe}
            disabled={isLoading || !embeddedWallet}
            className="bg-[#111827] hover:bg-[#111827]/90 text-white px-8 py-3 rounded-md flex items-center gap-2 shadow-sm w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Safe...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Create Primary Safe
              </>
            )}
          </Button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => router.push('/onboarding/welcome')}
          variant="outline"
          className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] px-5"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {!isLoading && !deployedSafeAddress && (
          <Button
            onClick={() => router.push('/onboarding/info')}
            variant="outline"
            className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB]"
          >
            Skip for Now
          </Button>
        )}
      </div>
    </div>
  );
} 