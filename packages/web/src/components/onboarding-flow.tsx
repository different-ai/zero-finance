'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, ArrowRight, Check, X, CheckCircle, Loader2, Wallet } from 'lucide-react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Safe, { Eip1193Provider, SafeAccountConfig, SafeDeploymentConfig } from '@safe-global/protocol-kit';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type Address } from 'viem';
import { base } from 'viem/chains';
import { createWalletClient, http, custom, publicActions } from 'viem';
import { trpc } from '@/utils/trpc'; // Import tRPC client
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

// Define onboarding steps
const STEPS = {
  WELCOME: 0,
  CREATE_SAFE: 1,
  PLATFORM_INFO: 2,
  COMPLETE: 3,
};

export function OnboardingFlow() {
  const router = useRouter();
  const { user, ready, authenticated, exportWallet } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const [deployedSafeAddress, setDeployedSafeAddress] = useState<Address | null>(null);
  const queryClient = useQueryClient();

  // Use tRPC query to check onboarding status
  const { 
    data: onboardingStatus, 
    isLoading: isLoadingStatus,
    error: statusError
  } = trpc.onboarding.getOnboardingStatus.useQuery(undefined, {
      enabled: ready && authenticated, // Only run when ready and authenticated
      refetchOnWindowFocus: false, // Don't refetch status constantly
      retry: 1, // Retry once on error
  });

  // Use tRPC mutation to complete onboarding
  const completeOnboardingMutation = trpc.onboarding.completeOnboarding.useMutation();
  
  // Add access to tRPC utils for invalidation
  const utils = trpc.useUtils();

  // Check if onboarding is needed based on tRPC query result
  useEffect(() => {
    if (ready && authenticated && !isLoadingStatus && onboardingStatus) {
      if (!onboardingStatus.hasCompletedOnboarding) {
        setIsOpen(true);
      } else {
        setIsOpen(false); // Ensure it's closed if already completed
      }
    } else if (ready && authenticated && !isLoadingStatus && statusError) {
       // Handle error fetching status (e.g., show toast, log)
       console.error("Error checking onboarding status via tRPC:", statusError);
       toast.error("Could not verify onboarding status. Please refresh.");
    }
  }, [ready, authenticated, isLoadingStatus, onboardingStatus, statusError]);

  // --- Client-Side Safe Creation ---
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  const handleCreateSafeClientSide = useCallback(async () => {
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
      // @ts-ignore - Suppress ethers version mismatch error

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
         
         // Also invalidate any allocation state if relevant
         queryClient.invalidateQueries({ queryKey: ['allocationState'] });

         console.log("0xHypr - Safe address saved successfully via tRPC.");
         // If save is successful, move to next step
         setCurrentStep(STEPS.PLATFORM_INFO);

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
  }, [embeddedWallet, completeOnboardingMutation, queryClient, utils]); // Add utils and queryClient to dependency array

  const completeOnboardingFlow = async () => {
    try {
      // Make sure latest data is refreshed
      await utils.settings.userSafes.list.invalidate();
      await utils.onboarding.getOnboardingStatus.invalidate();
      await queryClient.invalidateQueries({ queryKey: ['allocationState'] });
      
      // Additional verification that onboarding actually completed
      const onboardingStatus = await utils.onboarding.getOnboardingStatus.fetch();
      const userSafes = await utils.settings.userSafes.list.fetch();
      
      const safeExists = userSafes && userSafes.some(safe => safe.safeType === 'primary');
      
      if (!onboardingStatus.hasCompletedOnboarding || !safeExists) {
        console.warn("Onboarding status or safe registration not confirmed. Attempting to fix...");
        
        // If we have a deployed safe address but it's not registered, try to register it again
        if (deployedSafeAddress && !safeExists) {
          try {
            // Try once more to complete the onboarding
            await completeOnboardingMutation.mutateAsync({ 
              primarySafeAddress: deployedSafeAddress 
            });
            console.log("Safe registration reattempted successfully");
            
            // Invalidate queries again
            await utils.settings.userSafes.list.invalidate();
            await utils.onboarding.getOnboardingStatus.invalidate();
            await queryClient.invalidateQueries({ queryKey: ['allocationState'] });
          } catch (retryError) {
            console.error("Failed to reattempt safe registration:", retryError);
            // Continue to completion even with errors
          }
        }
      }
      
      // Set to complete regardless
      setCurrentStep(STEPS.COMPLETE);
    } catch (error) {
      console.error("Error in completeOnboardingFlow:", error);
      // Move to complete step even if there were errors
      setCurrentStep(STEPS.COMPLETE);
    }
  };

  const closeOnboarding = () => {
    setIsOpen(false);
    router.refresh();
  };

  const navigateToDashboard = () => {
    setIsOpen(false);
    router.push('/dashboard');
  };

  const navigateToInvoices = () => {
    setIsOpen(false);
    router.push('/dashboard/create-invoice');
  };

  // Adjust loading state check
  const showLoadingSpinner = !ready || (ready && authenticated && isLoadingStatus);
  if (showLoadingSpinner) {
      // Optionally show a spinner overlay instead of returning null
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      );
  }

  if (!isOpen || !authenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden transform transition-all sm:scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Welcome to hyprsqrl</h2>
          {currentStep !== STEPS.COMPLETE && (
            <button
              onClick={closeOnboarding}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Stepper */}
        <div className="px-6 py-3 bg-muted/50 border-b">
          <div className="flex items-center">
            {[STEPS.WELCOME, STEPS.CREATE_SAFE, STEPS.PLATFORM_INFO, STEPS.COMPLETE].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {step === STEPS.WELCOME && 'Welcome'}
                    {step === STEPS.CREATE_SAFE && 'Create Safe'}
                    {step === STEPS.PLATFORM_INFO && 'Info'}
                    {step === STEPS.COMPLETE && 'Complete'}
                  </span>
                </div>
                {step < STEPS.COMPLETE && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                    currentStep > step ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Welcome */}
          {currentStep === STEPS.WELCOME && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Welcome to hyprsqrl!</h3>
              <p className="mb-4 text-muted-foreground">
                Let&apos;s set up your secure **Primary Safe Wallet**. This wallet is where you&apos;ll receive invoice payments
                and manage your funds within HyprSQRL.
              </p>
              
              <div className="bg-primary/10 p-4 rounded-lg mb-6 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">What your Primary Safe enables:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-primary/90">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Receive crypto payments directly from invoices (USDC, EURe, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-primary/90">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Securely manage funds with Safe multi-sig capabilities (future feature)</span>
                  </li>
                   <li className="flex items-start gap-2 text-sm text-primary/90">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Automate allocations for taxes or other goals (coming soon)</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                <p>
                  We use Gnosis Safe technology to provide you with a secure, smart contract wallet.
                  You&apos;ll control this wallet using your connected account ({user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : '...'}).
                </p>
              </div>
            </div>
          )}
          
          {/* Step 2: Create Safe */}
          {currentStep === STEPS.CREATE_SAFE && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Create Your Primary Safe</h3>
              <p className="mb-4 text-muted-foreground">
                We&apos;ll deploy a new Gnosis Safe smart contract wallet for you on the Base network.
                This wallet will be owned and controlled by your connected address:
                 <strong className="block font-mono text-sm break-all my-2 p-2 bg-muted rounded border">{embeddedWallet?.address ?? 'Loading...'}</strong>
                Click the button below to start the deployment. You&apos;ll need to confirm the transaction in your wallet.
              </p>

              {deployedSafeAddress && !deploymentError && (
                <Alert variant="default" className="mb-4 border-green-500/50 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900">Safe Deployed Successfully!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Your Primary Safe address is:
                        <strong className="block font-mono text-sm break-all my-1">{deployedSafeAddress}</strong>
                        This address is now linked to your profile. Proceed to the next step.
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
                    onClick={handleCreateSafeClientSide}
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
            </div>
          )}
          
          {/* Step 3: Platform Information */}
          {currentStep === STEPS.PLATFORM_INFO && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Platform Information</h3>
              
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="font-medium text-lg mb-2">Current Capabilities</h4>
                  <p className="mb-3">
                    With your Primary Safe set up, hyprsqrl supports:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Creating and sending crypto invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Receiving payments (USDC/Base, EURe/Gnosis) directly to your Safe</span>
                    </li>
                     <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Swapping ETH to USDC within the platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Managing invoices through your dashboard</span>
                    </li>
                  </ul>
                </div>
                
               
                
                <div>
                  <h4 className="font-medium text-lg mb-2">Coming Soon</h4>
                  <p className="mb-3">
                    We&apos;re actively working on:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-500 text-xs">→</span>
                      </div>
                      <span>Automated fund allocation (Tax, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-500 text-xs">→</span>
                      </div>
                      <span>Fiat integration for seamless on/off ramping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-500 text-xs">→</span>
                      </div>
                      <span>AI-powered insights and financial automation</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link 
                  href="https://hyprsqrl.com/roadmap" 
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  View Full Roadmap <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
                <Link 
                  href="https://github.com/different-ai/hypr-v0/issues/new" 
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  Request Features <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
          
          {/* Step 4: Complete */}
          {currentStep === STEPS.COMPLETE && (
            <div className="py-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Setup Complete!</h3>
                <p className="mb-4 text-muted-foreground">
                  Your Primary Safe is deployed and ready to use. You can now start managing your finances with HyprSQRL.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Your Primary Safe address is <strong className="font-mono break-all">{deployedSafeAddress ?? '...'}</strong>.
                  This address will be used for receiving invoice payments.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={navigateToDashboard}
                    className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={navigateToInvoices}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Invoice
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-muted/30 border-t flex justify-between items-center">
          {currentStep > STEPS.WELCOME && currentStep < STEPS.COMPLETE && (
            <button
              onClick={() => setCurrentStep(prevStep => prevStep - 1)}
              disabled={isLoading || currentStep === STEPS.CREATE_SAFE}
              className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
          )}
          {(currentStep <= STEPS.WELCOME || currentStep >= STEPS.COMPLETE) && <div></div>}
          {currentStep < STEPS.COMPLETE && currentStep !== STEPS.CREATE_SAFE && (
            <button
              onClick={() => {
                if (currentStep === STEPS.PLATFORM_INFO) {
                  completeOnboardingFlow();
                } else {
                  setCurrentStep(prevStep => prevStep + 1);
                }
              }}
              className="px-4 py-2 text-sm text-primary-foreground rounded-md inline-flex items-center bg-primary hover:bg-primary/90 transition-colors"
            >
               {currentStep === STEPS.PLATFORM_INFO ? 'Finish Setup' : 'Next'}
               <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
          {currentStep === STEPS.CREATE_SAFE && deployedSafeAddress && !deploymentError && (
             <button
                onClick={() => setCurrentStep(STEPS.PLATFORM_INFO)}
                className="px-4 py-2 text-sm text-primary-foreground rounded-md inline-flex items-center bg-primary hover:bg-primary/90 transition-colors"
             >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
             </button>
          )}
          {currentStep === STEPS.COMPLETE && (
            <div className="flex gap-2">
              <button
                onClick={navigateToDashboard}
                className="px-4 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/90 rounded-md inline-flex items-center transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={navigateToInvoices}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md inline-flex items-center transition-colors"
              >
                Create Invoice
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}