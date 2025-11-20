'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  X,
  CheckCircle,
  ArrowRight,
  Shield,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import {
  type Address,
  Hex,
  createPublicClient,
  http,
  parseAbiItem,
} from 'viem';
import { base } from 'viem/chains';
import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { useUser } from '@privy-io/react-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/trpc/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
} from '@safe-global/protocol-kit';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSmartWallet } from '@/hooks/use-smart-wallet';

// Entry point address for Base
const ENTRY_POINT = '0x0576a174D229E3cFA37253523E645A78A0C91B57'; // v0.6 on Base

// Helper function to wait until Safe is deployed by checking bytecode
async function waitUntilDeployed(addr: Address) {
  const pc = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL as string),
  });

  for (;;) {
    const code = await pc.getBytecode({ address: addr });
    if (code && code !== '0x') break; // Safe proxy is live
    await new Promise((r) => setTimeout(r, 4000));
  }
}

// Helper function to find transaction hash from EntryPoint logs
async function waitForUserOp(userOpHash: Hex) {
  const pc = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL as string),
  });

  for (;;) {
    const logs = await pc.getLogs({
      address: ENTRY_POINT,
      event: parseAbiItem(
        'event UserOperationEvent(bytes32 userOpHash,address sender,address paymaster,uint256 nonce,bool success,uint256 actualGasCost,uint256 actualGasUsed)',
      ),
      fromBlock: BigInt(-2000), // Use negative number as offset from latest block
    });
    const hit = logs.find(
      (l) => l.args.userOpHash?.toLowerCase() === userOpHash.toLowerCase(),
    );
    if (hit && hit.transactionHash) return hit.transactionHash;
    await new Promise((r) => setTimeout(r, 4000));
  }
}

export interface CreateSafeCardProps {
  onSuccess?: (safeAddress: Address) => void;
  onSkip?: () => void;
  showSkipButton?: boolean;
  nextStepPath?: string;
  nextStepName?: string;
}

export function CreateSafeCard({
  onSuccess,
  onSkip,
  showSkipButton = false,
  nextStepPath,
  nextStepName,
}: CreateSafeCardProps) {
  const router = useRouter();
  const { user, ready } = usePrivy();
  const { refreshUser } = useUser();
  const { getClientForChain } = useSmartWallets();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const [deployedSafeAddress, setDeployedSafeAddress] =
    useState<Address | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<string>('');
  const [isLoadingInitialCheck, setIsLoadingInitialCheck] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { client: smartWalletClient } = useSmartWallets();

  // Use the useSmartWallet hook
  const {
    hasSmartWallet,
    smartWalletAddress,
    isCreatingSmartWallet,
    smartWalletError,
    deploymentStep: smartWalletDeploymentStep,
    createSmartWallet,
    resetError: resetSmartWalletError,
  } = useSmartWallet();

  // Use tRPC mutation to complete onboarding
  const completeOnboardingMutation =
    api.onboarding.completeOnboarding.useMutation();

  // Add access to tRPC utils for invalidation
  const utils = api.useUtils();

  // Handle copying address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  // Check if user already has a primary safe on load
  useEffect(() => {
    if (ready && user && deployedSafeAddress === null) {
      console.log('0xHypr - Checking for existing primary safe...');
      setIsLoadingInitialCheck(true);
      utils.settings.userSafes.getPrimarySafeAddress
        .fetch()
        .then((primarySafeAddr) => {
          if (primarySafeAddr) {
            console.log(
              `0xHypr - Found existing primary safe: ${primarySafeAddr}`,
            );
            setDeployedSafeAddress(primarySafeAddr as Address);
            if (onSuccess) {
              onSuccess(primarySafeAddr as Address);
            }
          } else {
            console.log('0xHypr - No primary safe found for this user.');
          }
        })
        .catch((error) => {
          console.error(
            '0xHypr - Error checking for existing primary safe:',
            error,
          );
          setDeploymentError(
            'Could not verify account status. Please try again.',
          );
        })
        .finally(() => {
          setIsLoadingInitialCheck(false);
        });
    } else if (!ready || !user) {
      setIsLoadingInitialCheck(false);
    }
  }, [
    ready,
    user,
    deployedSafeAddress,
    utils.settings.userSafes.getPrimarySafeAddress,
    onSuccess,
  ]);

  const handleCreateSmartWallet = async () => {
    if (!user) {
      // This check might be redundant if useSmartWallet handles it, but good for safety
      // setSmartWalletError('User not available. Please try again.'); // useSmartWallet handles this
      return;
    }
    // Call the hook's createSmartWallet function
    await createSmartWallet();
  };

  const handleCreateSafe = async () => {
    if (!smartWalletAddress) {
      setDeploymentError(
        'Smart wallet address not found. Please create a smart wallet first.',
      );
      console.error(
        '0xHypr - handleCreateSafe called without a smartWalletAddress.',
      );
      return;
    }

    setIsDeploying(true);
    setDeploymentError('');
    // Ensure deploymentStep is for Safe creation now
    setDeploymentStep('Configuring your new secure account...');
    console.log(
      '0xHypr - Starting handleCreateSafe with smartWalletAddress:',
      smartWalletAddress,
    );

    try {
      // Use the smartWalletAddress from state
      const privyWalletAddress = smartWalletAddress;

      // Create Safe configuration with the Privy wallet as owner
      const safeAccountConfig: SafeAccountConfig = {
        owners: [privyWalletAddress],
        threshold: 1,
      };

      // Add salt nonce for deterministic address
      const saltNonce = Date.now().toString();
      const safeDeploymentConfig: SafeDeploymentConfig = {
        saltNonce,
        safeVersion: '1.4.1',
      };

      console.log('0xHypr - Safe config:', {
        safeAccountConfig,
        safeDeploymentConfig,
      });

      // Initialize the Protocol Kit with the Privy wallet
      console.log('0xHypr - Initializing Protocol Kit...');
      setDeploymentStep('Initializing security protocols...');

      const protocolKit = await Safe.init({
        predictedSafe: {
          safeAccountConfig,
          safeDeploymentConfig,
        },
        provider: process.env.NEXT_PUBLIC_BASE_RPC_URL as string,
        // The Smart Wallet client will be used as the signer
      });

      // Get the predicted Safe address
      const predictedSafeAddress = (await protocolKit.getAddress()) as Address;
      console.log(`0xHypr - Predicted Safe address: ${predictedSafeAddress}`);

      // Create the Safe deployment transaction
      setDeploymentStep('Generating your unique account details...');
      console.log('0xHypr - Creating deployment transaction data...');
      const deploymentTransaction =
        await protocolKit.createSafeDeploymentTransaction();

      // Send the transaction using Privy's sendTransaction with enhanced UI
      setDeploymentStep('Activating your account on the network...');
      console.log(
        '0xHypr - Sending deployment transaction via smart wallet...',
      );
      const userOpHash = await smartWalletClient?.sendTransaction(
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

      console.log(`0xHypr - UserOperation hash: ${userOpHash}`);

      // Wait for transaction confirmation
      setDeploymentStep('Confirming account activation on the network...');
      console.log('0xHypr - Waiting for Safe to be deployed...');

      // Replace waitForUserOperationReceipt with direct bytecode polling
      await waitUntilDeployed(predictedSafeAddress);
      console.log('0xHypr - Safe proxy bytecode detected, deployment complete');

      // Optionally, get the transaction hash using EntryPoint logs
      try {
        const txHash = await waitForUserOp(userOpHash as Hex);
        console.log(`0xHypr - Safe deployment transaction hash: ${txHash}`);
      } catch (error) {
        console.warn(
          '0xHypr - Could not retrieve transaction hash from EntryPoint logs',
          error,
        );
      }

      // Set the deployed Safe address
      setDeployedSafeAddress(predictedSafeAddress);
      console.log(`0xHypr - Safe deployed at address: ${predictedSafeAddress}`);

      // Save the deployed Safe address to the user's profile
      setDeploymentStep('Saving your new account details securely...');
      console.log(
        `0xHypr - Saving primary Safe address to profile via tRPC...`,
      );

      try {
        await completeOnboardingMutation.mutateAsync({
          primarySafeAddress: predictedSafeAddress,
        });
        console.log(
          '0xHypr - Primary Safe address saved successfully via tRPC.',
        );
        setDeploymentStep('Your new account is active!');

        // Call onSuccess callback if provided (but don't auto-navigate)
        if (onSuccess) {
          onSuccess(predictedSafeAddress);
        }
      } catch (trpcSaveError: any) {
        console.error('Error saving Safe address via tRPC:', trpcSaveError);
        const message = trpcSaveError.message || 'Failed to save profile.';
        throw new Error(message);
      }
    } catch (error: any) {
      console.error('0xHypr - Error deploying Safe:', error);
      console.error('0xHypr - Error Name:', error.name);
      console.error('0xHypr - Error Message:', error.message);
      console.error('0xHypr - Error Stack:', error.stack);
      let errorMessage = 'An unknown error occurred during Safe deployment.';
      if (error.message?.includes('User rejected the request')) {
        errorMessage = 'Transaction rejected in wallet.';
      } else if (error.shortMessage) {
        errorMessage = error.shortMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setDeploymentError(errorMessage);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleContinue = () => {
    if (nextStepPath) {
      router.push(nextStepPath);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Create a smart account</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoadingInitialCheck || hasSmartWallet === null ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                Checking account status...
              </p>
            </div>
          ) : deployedSafeAddress ? (
            // Safe already deployed or just deployed - success state
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold">Account Created</h2>
                <p className="text-muted-foreground max-w-md mt-2">
                  Your secure account is deployed and ready to use.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="address"
                  className="border border-b rounded-md overflow-hidden"
                >
                  <AccordionTrigger className="px-3 py-3">
                    <span className="text-sm font-medium">
                      Advanced account info
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    <div className="flex items-center justify-between bg-muted/30 rounded p-2">
                      <code className="text-xs font-mono overflow-auto flex-1">
                        {deployedSafeAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(deployedSafeAddress)}
                        className="h-7 w-7 p-0 ml-2"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is your smart account&apos;s unique identifier on the
                      Base network.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button
                size="lg"
                onClick={handleContinue}
                className="w-full mt-2"
              >
                {nextStepPath
                  ? `Continue to ${nextStepName || 'Next Step'}`
                  : 'Go to Dashboard'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            // Two-step deployment: Smart Wallet then Safe
            <div className="flex flex-col gap-8 py-6">
              {/* Step 1: Smart Wallet Creation */}
              {!hasSmartWallet && (
                <div className="flex flex-col items-center gap-4">
                  <Shield className="h-12 w-12 text-primary/70" />
                  <div className="text-center">
                    <h2 className="text-lg font-medium">
                      Create Your Smart Wallet
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mt-1">
                      This is your personal wallet on the Base network, required
                      to create a secure account.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCreateSmartWallet}
                    disabled={isCreatingSmartWallet || isLoadingInitialCheck}
                    className="w-full"
                  >
                    {isCreatingSmartWallet ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {smartWalletDeploymentStep || 'Creating Wallet...'}
                      </>
                    ) : (
                      <>
                        Create Smart Wallet
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {smartWalletError && (
                    <Alert variant="destructive" className="mt-2 w-full">
                      <AlertTitle className="flex items-center">
                        <X className="h-4 w-4 mr-2" /> Error
                      </AlertTitle>
                      <AlertDescription>
                        {smartWalletError}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={resetSmartWalletError}
                          className="pl-2 text-red-500 hover:text-red-700"
                        >
                          Dismiss
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 2: Safe Creation (shown if smart wallet exists or after its creation) */}
              {hasSmartWallet && smartWalletAddress && (
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-dashed">
                  <Shield className="h-12 w-12 text-primary/80" />
                  <div className="text-center">
                    <h2 className="text-lg font-medium">
                      Activate Your Secure Account
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mt-1">
                      Your smart wallet is ready! Now, create your secure
                      multi-signature account.
                    </p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="smart-wallet-details">
                        <AccordionTrigger className="text-xs text-muted-foreground">
                          Secure account details
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                            Smart Wallet:{' '}
                            <code className="font-mono">
                              {smartWalletAddress}
                            </code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCreateSafe}
                    disabled={
                      !hasSmartWallet || isDeploying || isCreatingSmartWallet
                    }
                    className="w-full"
                  >
                    {isDeploying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {deploymentStep || 'Activating Account...'}
                      </>
                    ) : (
                      <>
                        Activate Secure Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {deploymentError && (
                    <Alert variant="destructive" className="mt-2 w-full">
                      <AlertTitle className="flex items-center">
                        <X className="h-4 w-4 mr-2" /> Error
                      </AlertTitle>
                      <AlertDescription>{deploymentError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {showSkipButton && onSkip && (
        <div className="text-center mt-4">
          <Button variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
        </div>
      )}
    </>
  );
}
