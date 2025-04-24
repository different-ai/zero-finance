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
} from 'lucide-react';
import Link from 'next/link';
import {
  type Address,
  Hex,
  createPublicClient,
  http,
  parseAbiItem,
  createWalletClient,
} from 'viem';
import { base } from 'viem/chains';
import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/trpc/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
} from '@safe-global/protocol-kit';
import { Button } from '@/components/ui/button';

/**
 * Ensures the logged‑in Privy user has a deployed smart wallet on Base.
 * If the wallet does not yet exist, it deploys one by sending a zero‑value
 * transaction (gas‑sponsored by Privy).
 * Returns the smart‑wallet address together with the Base‑chain client.
 */
async function ensureSmartWallet(
  user: ReturnType<typeof usePrivy>['user'],
  getClientForChain: ReturnType<typeof useSmartWallets>['getClientForChain'],
): Promise<{
  address: Address;
  client: ReturnType<typeof createWalletClient>;
}> {
  // Obtain viem client for Base
  const baseClient = await getClientForChain({ id: base.id });
  if (!baseClient) {
    throw new Error('Failed to get Base chain client');
  }

  // Look for existing smart wallet
  let smartWallet = user?.linkedAccounts?.find(
    (account) => account.type === 'smart_wallet',
  );

  // Deploy if missing
  if (!smartWallet || !smartWallet.address) {
    await baseClient.sendTransaction({
      to: '0x0000000000000000000000000000000000000000',
      value: 0n,
      data: '0x',
    });

    // Poll Privy for the newly‑created smart wallet address
    let retries = 10;
    while (retries-- > 0) {
      await new Promise((r) => setTimeout(r, 2000));
      smartWallet = user?.linkedAccounts?.find(
        (account) => account.type === 'smart_wallet',
      );
      if (smartWallet?.address) break;
    }
  }

  if (!smartWallet?.address) {
    throw new Error('Smart wallet deployment failed');
  }

  // @ts-ignore
  return { address: smartWallet.address as Address, client: baseClient };
}

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
  const { getClientForChain } = useSmartWallets();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState('');
  const [deployedSafeAddress, setDeployedSafeAddress] =
    useState<Address | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<string>('');

  // Use tRPC mutation to complete onboarding
  const completeOnboardingMutation =
    api.onboarding.completeOnboarding.useMutation();

  // Add access to tRPC utils for invalidation
  const utils = api.useUtils();

  // Check if user already has a primary safe on load
  useEffect(() => {
    if (ready && user && deployedSafeAddress === null) {
      console.log('0xHypr - Checking for existing primary safe...');
      utils.settings.userSafes.getPrimarySafeAddress
        .fetch()
        .then((primarySafeAddr) => {
          if (primarySafeAddr) {
            console.log(
              `0xHypr - Found existing primary safe: ${primarySafeAddr}`,
            );
            setDeployedSafeAddress(primarySafeAddr as Address);
            // Automatically move to next step if already activated
            router.push('/onboarding/funding');
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
        });
    }
  }, [
    ready,
    user,
    deployedSafeAddress,
    utils.settings.userSafes.getPrimarySafeAddress,
    router,
  ]);

  const handleCreateSafe = async () => {
    setIsDeploying(true);
    setDeploymentError('');
    setDeploymentStep('Initializing Privy Smart Wallet');

    if (!user) {
      setDeploymentError('User not authenticated.');
      setIsDeploying(false);
      return;
    }

    try {
      // Ensure the user possesses a smart wallet (deploy if absent)
      const { address: privyWalletAddress, client: baseClient } =
        await ensureSmartWallet(user, getClientForChain);

      console.log(`0xHypr - Privy smart wallet address: ${privyWalletAddress}`);

      // Step 2: Now use the Privy wallet to deploy a Safe
      setDeploymentStep('Configuring Safe deployment');

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

      // Initialize the Protocol Kit with the Privy wallet
      setDeploymentStep('Initializing Protocol Kit');
      console.log('0xHypr - Initializing Protocol Kit...');

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
      setDeploymentStep('Creating Safe deployment transaction');
      console.log('0xHypr - Creating deployment transaction data...');
      const deploymentTransaction =
        await protocolKit.createSafeDeploymentTransaction();

      // Create a viem wallet client using the Privy provider
      // deployment transaction using the wallet client
      setDeploymentStep('Executing Safe deployment transaction');
      console.log(
        '0xHypr - Sending deployment transaction via smart wallet...',
      );
      const userOpHash = await baseClient.sendTransaction({
        to: deploymentTransaction.to as Address,
        value: BigInt(deploymentTransaction.value || '0'),
        data: deploymentTransaction.data as `0x${string}`,
        account: privyWalletAddress,
        chain: {
          id: base.id,
          name: base.name,
          rpcUrls: base.rpcUrls,
          nativeCurrency: base.nativeCurrency,
          blockExplorers: base.blockExplorers,
          contracts: base.contracts,
        },
      });

      console.log(`0xHypr - UserOperation hash: ${userOpHash}`);

      // Wait for transaction confirmation
      setDeploymentStep('Waiting for Safe deployment confirmation');
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
      setDeploymentStep('Saving Safe address to profile');
      console.log(
        `0xHypr - Saving Safe address ${predictedSafeAddress} to profile via tRPC...`,
      );

      try {
        const result = await completeOnboardingMutation.mutateAsync({
          primarySafeAddress: predictedSafeAddress,
        });

        console.log('0xHypr - CompleteOnboarding mutation result:', result);

        // Invalidate user safes query to ensure UI shows the updated safe
        console.log('0xHypr - Invalidating queries to refresh UI data...');
        await utils.settings.userSafes.list.invalidate();
        await utils.onboarding.getOnboardingStatus.invalidate();

        console.log(
          `0xHypr - Safe address ${predictedSafeAddress} saved successfully`,
        );
      } catch (mutationError: any) {
        console.error(
          '0xHypr - Error saving Safe address to profile:',
          mutationError,
        );
        throw new Error(
          `Failed to save Safe address: ${mutationError.message || 'Unknown error'}`,
        );
      }
      setDeploymentStep('Deployment completed successfully');
    } catch (error: any) {
      console.error('0xHypr - Error deploying Safe:', error);
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            {deployedSafeAddress
              ? 'Account Ready!'
              : 'Activate Your Secure Account'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {!deployedSafeAddress ? (
            <>
              <p className="text-muted-foreground">
                Click the button below to activate your secure, self-custodial
                account vault.
              </p>
              <Shield className="mx-auto h-16 w-16 text-primary" />
              <Button
                onClick={handleCreateSafe}
                disabled={isDeploying || !user || deployedSafeAddress !== null}
                className="w-full"
                size="lg"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {deploymentStep || 'Activating...'}
                  </>
                ) : (
                  <>
                    Activate Account <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {deploymentError && (
                <Alert variant="destructive" className="text-left mt-4">
                  <X className="h-4 w-4" />
                  <AlertTitle>Activation Failed</AlertTitle>
                  <AlertDescription>{deploymentError}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-muted-foreground pt-4">
                This step creates your unique account vault on the Base network
                using secure smart contract technology.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <p className="text-lg font-medium">
                Your secure account is active!
              </p>
              <div className="flex items-center gap-2 mb-4 justify-center">
                <span className="text-muted-foreground text-sm">
                  Account Address:
                </span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono border border-border break-all">
                  {deployedSafeAddress}
                </code>
              </div>
              <p className="text-muted-foreground">
                Redirecting you to the next step...
              </p>
            </>
          )}

          {!deployedSafeAddress && (
            <div className="mt-6 pt-6 border-t border-border/40">
              <Link
                href="/onboarding/info"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
                aria-disabled={isDeploying}
                onClick={(e) => {
                  if (isDeploying) e.preventDefault();
                }}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
