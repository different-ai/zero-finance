'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  X,
  CheckCircle,
  ArrowRight,
  Shield,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import {
  type Address,
  Hex,
  createPublicClient,
  http,
  parseAbiItem,
  createWalletClient,
} from 'viem';
import { base } from 'viem/chains';
import { usePrivy, useSendTransaction } from '@privy-io/react-auth';
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
import { Progress } from '@/components/ui/progress';
import { steps } from '../layout';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';

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

export default function CreateSafePage() {
  const router = useRouter();
  const { user, ready } = usePrivy();
  const { refreshUser } = useUser();
  const { getClientForChain } = useSmartWallets();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const [deployedSafeAddress, setDeployedSafeAddress] =
    useState<Address | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<string>('');
  const [isLoadingInitialCheck, setIsLoadingInitialCheck] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { client: smartWalletClient } = useSmartWallets();

  // New state variables for smart wallet status
  const [hasSmartWallet, setHasSmartWallet] = useState<boolean | null>(null);
  const [isCreatingSmartWallet, setIsCreatingSmartWallet] = useState(false);
  const [smartWalletError, setSmartWalletError] = useState('');
  const [smartWalletAddress, setSmartWalletAddress] = useState<Address | null>(
    null,
  );

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

  // Determine the next step for navigation
  const currentStepPath = '/onboarding/create-safe';
  const currentStepIndex = steps.findIndex(
    (step) => step.path === currentStepPath,
  );
  const nextStep =
    currentStepIndex !== -1 && currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1]
      : null;

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
  ]);

  // Effect to check for existing Privy smart wallet
  useEffect(() => {
    if (ready && user) {
      const existingSmartWalletAccount = user.linkedAccounts?.find(
        (account) => account.type === 'smart_wallet',
      );
      if (existingSmartWalletAccount && typeof (existingSmartWalletAccount as any).address === 'string') {
        const addr = (existingSmartWalletAccount as any).address as Address;
        console.log(
          `0xHypr - Found existing Privy smart wallet: ${addr}`,
        );
        setHasSmartWallet(true);
        setSmartWalletAddress(addr);
      } else {
        console.log('0xHypr - No Privy smart wallet found for this user.');
        setHasSmartWallet(false);
        setSmartWalletAddress(null);
      }
    }
  }, [ready, user]);

  const handleCreateSmartWallet = async () => {
    if (!user) {
      setSmartWalletError('User not available. Please try again.');
      return;
    }

    setIsCreatingSmartWallet(true);
    setSmartWalletError('');
    setDeploymentStep('Preparing your smart wallet...');
    console.log('0xHypr - Starting handleCreateSmartWallet');

    try {
      const baseClient = await getClientForChain({ id: base.id });
      if (!baseClient) {
        throw new Error('Failed to get Base chain client for smart wallet creation');
      }

      let smartWalletAccount = user.linkedAccounts?.find(
        (account) => account.type === 'smart_wallet',
      );
      let currentSmartWalletAddress = 
        smartWalletAccount && typeof (smartWalletAccount as any).address === 'string'
        ? (smartWalletAccount as any).address as Address
        : null;

      if (!currentSmartWalletAddress) {
        console.log('0xHypr - Privy Smart wallet not found, proceeding to deploy.');
        setDeploymentStep('Deploying your smart wallet (this may take a moment)...');
        await baseClient.sendTransaction(
          {
            to: '0x0000000000000000000000000000000000000000',
            value: 0n,
            data: '0x',
          },
          {
            uiOptions: { showWalletUIs: false },
          },
        );

        let retries = 15;
        setDeploymentStep('Verifying smart wallet creation...');
        while (retries-- > 0) {
          await new Promise((r) => setTimeout(r, 2500));
          // Proactively refresh the Privy user object to fetch latest linked accounts
          try {
            await refreshUser();
          } catch (e) {
            console.warn('0xHypr - Failed to refresh Privy user during smart wallet polling', e);
          }
          smartWalletAccount = user.linkedAccounts?.find(
            (account) => account.type === 'smart_wallet',
          );
          currentSmartWalletAddress = 
            smartWalletAccount && typeof (smartWalletAccount as any).address === 'string'
            ? (smartWalletAccount as any).address as Address
            : null;

          if (currentSmartWalletAddress) {
            console.log(
              `0xHypr - Privy Smart wallet detected after polling: ${currentSmartWalletAddress}`,
            );
            break;
          }
          console.log(`0xHypr - Polling for smart wallet, retries left: ${retries}`);
        }
      }

      if (!currentSmartWalletAddress) {
        throw new Error(
          'Smart wallet deployment failed or was not detected in time.',
        );
      }

      console.log(
        `0xHypr - Smart wallet successfully ensured/found: ${currentSmartWalletAddress}`,
      );
      setSmartWalletAddress(currentSmartWalletAddress);
      setHasSmartWallet(true);
      setDeploymentStep('Smart wallet ready!');
      setDeploymentError(''); 

    } catch (error: any) {
      console.error('0xHypr - Error creating smart wallet:', error);
      let errMsg = 'Failed to create smart wallet.';
      if (error.message?.includes('User rejected the request')) {
        errMsg = 'Smart wallet creation rejected in wallet.';
      } else if (error.shortMessage) {
        errMsg = error.shortMessage;
      } else if (error.message) {
        errMsg = error.message;
      }
      setSmartWalletError(errMsg);
      setHasSmartWallet(false); // Explicitly set to false on error
      setDeploymentStep(''); // Clear deployment step on error
    } finally {
      setIsCreatingSmartWallet(false);
    }
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
    console.log('0xHypr - Starting handleCreateSafe with smartWalletAddress:', smartWalletAddress);

    try {
      // Step 1: Smart wallet is already ensured by prior step or initial check.
      // const { address: privyWalletAddress, client: baseClient } =
      //   await ensureSmartWallet(user, getClientForChain); // This line is removed
      // console.log(`0xHypr - Smart wallet ready at ${privyWalletAddress}`); // This line is removed
      // setDeploymentStep('Configuring your new secure account...'); // Moved up

      // Use the smartWalletAddress from state
      const privyWalletAddress = smartWalletAddress;

      // Step 2: Now use the Privy wallet to deploy a Safe
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
      setDeploymentStep(
        'Activating your account on the network (this may take a moment)...',
      );
      console.log(
        '0xHypr - Sending deployment transaction via smart wallet...',
      );
      const userOpHash = await smartWalletClient?.sendTransaction(
        {
          to: deploymentTransaction.to as Address,
          value: BigInt(deploymentTransaction.value || '0'),
          data: deploymentTransaction.data as `0x${string}`,
          chain: base,
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

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">
            {deployedSafeAddress
              ? 'Your Account is Ready'
              : isLoadingInitialCheck || hasSmartWallet === null
                ? 'Loading Account Status...'
                : !hasSmartWallet
                  ? 'Step 1: Create Your Smart Wallet'
                  : 'Step 2: Activate Your Secure Account'}
          </CardTitle>
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
                onClick={() => {
                  if (nextStep) {
                    router.push(nextStep.path);
                  } else {
                    router.push('/dashboard');
                  }
                }}
                className="w-full mt-2"
              >
                {nextStep ? `Continue to ${nextStep.name}` : 'Go to Dashboard'}
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
                      This is your personal wallet on the Base network, required to create a secure account.
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
                        {deploymentStep || 'Creating Wallet...'}
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
                      <AlertDescription>{smartWalletError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 2: Safe Creation (shown if smart wallet exists or after its creation) */} 
              {hasSmartWallet && (
                 <div className="flex flex-col items-center gap-4 pt-4 border-t border-dashed">
                  <Shield className="h-12 w-12 text-primary/80" /> 
                  <div className="text-center">
                    <h2 className="text-lg font-medium">
                      Activate Your Secure Account
                    </h2>
                     <p className="text-sm text-muted-foreground max-w-md mt-1">
                       Your smart wallet is ready! Now, create your secure multi-signature account.
                     </p>
                     <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                        Smart Wallet: <code className='font-mono'>{smartWalletAddress}</code>
                     </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCreateSafe}
                    disabled={!hasSmartWallet || isDeploying || isCreatingSmartWallet}
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
      <div className="text-center mt-4">
        <Button 
          variant="ghost" 
          onClick={skipOnboarding}
          disabled={isSkipping}
        >
          {isSkipping ? 'Skipping...' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}
