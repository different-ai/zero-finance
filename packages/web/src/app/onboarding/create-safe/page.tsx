'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Wallet,
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
} from 'viem';
import { base } from 'viem/chains';
import { createWalletClient, custom, publicActions } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/trpc/react';

/**
 * Ensures the logged‑in Privy user has a deployed smart wallet on Base.
 * If the wallet does not yet exist, it deploys one by sending a zero‑value
 * transaction (gas‑sponsored by Privy).  
 * Returns the smart‑wallet address together with the Base‑chain client.
 */
async function ensureSmartWallet(
  user: ReturnType<typeof usePrivy>['user'],
  getClientForChain: ReturnType<typeof useSmartWallets>['getClientForChain'],
): Promise<{ address: Address; client: ReturnType<typeof createWalletClient> }> {
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
import { Card, CardContent } from '@/components/ui/card';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
  Eip1193Provider,
} from '@safe-global/protocol-kit';

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
  const { user } = usePrivy();
  const {
    client,
    // : isSmartWalletLoading,
    getClientForChain,
  } = useSmartWallets();
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
    if (user) {
      // Use the tRPC query to check if the user has a primary safe
      utils.settings.userSafes.list
        .fetch()
        .then((safes) => {
          const primarySafe = safes?.find(
            (safe) => safe.safeType === 'primary',
          );
          if (primarySafe && primarySafe.safeAddress) {
            console.log(
              `0xHypr - Found existing primary safe: ${primarySafe.safeAddress}`,
            );
            setDeployedSafeAddress(primarySafe.safeAddress as Address);
          } else {
            console.log('0xHypr - No primary safe found for this user');
            setDeployedSafeAddress(null);
          }
        })
        .catch((error) => {
          console.error('0xHypr - Error checking for existing safe:', error);
        });
    }
  }, [user, utils.settings.userSafes.list]);

  const handleCreateSafe = async () => {
    setIsDeploying(true);
    setDeploymentError('');
    setDeploymentStep('Initializing Privy Smart Wallet');

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

      // Get the Ethereum provider from the Privy wallet
      // const ethereumProvider = await baseClient.getEthereumProvider();

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

  // Get current wallet info
  const embeddedWallet = user?.linkedAccounts?.find(
    (account) => account.type === 'email',
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#111827] mb-3">
          Create Your Primary Safe
        </h2>
        <p className="text-[#6B7280] text-lg leading-relaxed">
          Your Primary Safe Wallet will be deployed on Base network, a secure
          and cost-effective Ethereum layer 2 solution.
        </p>
      </div>

      <Card className="border border-[#E5E7EB]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-[#10B981]/10 p-2 rounded-full">
              <Shield className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-medium text-[#111827] text-lg mb-2">
                Smart Contract Wallet
              </h3>
              <p className="text-[#6B7280]">
                We&apos;re creating a Gnosis Safe smart contract wallet for you.
                This is more secure than a regular wallet and allows for
                advanced features like multi-signature transactions in the
                future.
              </p>

              <div className="mt-4 flex items-center gap-2 text-[#6B7280]">
                <Wallet className="h-5 w-5" />
                <span>Connected Address:</span>
                <code className="bg-[#F9FAFB] px-2 py-0.5 rounded text-xs font-mono border border-[#E5E7EB]">
                  {embeddedWallet?.address
                    ? `${embeddedWallet.address.slice(0, 6)}...${embeddedWallet.address.slice(-4)}`
                    : 'No wallet connected'}
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
          </AlertDescription>
        </Alert>
      )}

      {deployedSafeAddress && !deploymentError ? (
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-6">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-6 w-6 text-[#10B981] mr-2" />
            <h3 className="font-medium text-[#111827] text-lg">
              Safe Successfully Created!
            </h3>
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
            This address is now linked to your profile. You can proceed to the
            next step.
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
            Click the button below to create your Primary Safe. This will deploy
            a smart contract to the blockchain and requires a small transaction
            fee.
          </p>

          <button
            onClick={handleCreateSafe}
            disabled={isDeploying || !user}
            className={`px-8 py-3 text-white rounded-md inline-flex items-center justify-center font-medium shadow-sm ${
              isDeploying || !user
                ? 'bg-[#111827]/50 cursor-not-allowed'
                : 'bg-[#111827] hover:bg-[#111827]/90'
            }`}
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {deploymentStep || 'Deploying Safe... (Check Wallet)'}
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Deploy Primary Safe on Base
              </>
            )}
          </button>

          <p className="mt-4 text-xs text-[#6B7280]">
            This requires a small amount of ETH on Base for gas fees. The
            deployment might take a minute.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Link
          href="/onboarding/welcome"
          className="px-5 py-2 text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-md inline-flex items-center font-medium transition-colors"
          aria-disabled={isDeploying}
          tabIndex={isDeploying ? -1 : undefined}
          style={
            isDeploying ? { pointerEvents: 'none', opacity: 0.7 } : undefined
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        {!isDeploying && !deployedSafeAddress && (
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
