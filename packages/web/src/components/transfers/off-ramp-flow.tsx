'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { api } from '@/trpc/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  type Address,
  type Hex,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  getAddress,
  isHex,
  encodeFunctionData,
  pad,
} from 'viem';
import { base } from 'viem/chains';
import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';
import { getSafeContract } from '@safe-global/protocol-kit';
import type { SafeVersion } from '@safe-global/safe-core-sdk-types';
import {
  InitiateTransferForm,
  type InitiateTransferFormValues,
} from './initiate-transfer-form';
import { DepositDetails } from './deposit-details';
import type { RouterInputs, RouterOutputs } from '@/utils/trpc';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Step 1: Form Component (To be created)
// import { InitiateTransferForm, type InitiateTransferFormValues } from './initiate-transfer-form';

// Step 2: Deposit Details Component (To be created)
// import { DepositDetails, type DepositInfo } from './deposit-details';

// Define type for the mutation input
type CreateOfframpTransferInput =
  RouterInputs['align']['createOfframpTransfer'];

// Type for Align transfer creation response (subset needed for deposit step)
type AlignTransferCreatedResponse =
  RouterOutputs['align']['createOfframpTransfer'];

// Assuming prepare returns MetaTransactionData structure
type PreparedTxData = RouterOutputs['align']['prepareOfframpTokenTransfer'];

const steps = [
  { label: 'Initiate Transfer', description: 'Enter withdrawal details' },
  { label: 'Send Funds', description: 'Transfer crypto from your Safe' },
  { label: 'Processing', description: 'Withdrawal is being processed' },
];

// Helper function to build pre-validated signature for Safe
function buildPrevalidatedSig(owner: Address): Hex {
  return `0x000000000000000000000000${owner.slice(
    2,
  )}000000000000000000000000000000000000000000000000000000000000000001` as Hex;
}

export default function OffRampFlow() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { client: smartClient } = useSmartWallets();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);

  // State to hold data between steps
  const [transferDetails, setTransferDetails] =
    useState<AlignTransferCreatedResponse | null>(null);
  const [userOpHash, setUserOpHash] = useState<string | null>(null);

  // State for fetched primary safe address
  const [primarySafeAddress, setPrimarySafeAddress] = useState<Address | null>(
    null,
  );

  // Fetch Primary Safe Address
  const {
    data: fetchedPrimarySafeAddress,
    isLoading: isLoadingSafeAddress,
    error: safeAddressError,
  } = api.settings.userSafes.getPrimarySafeAddress.useQuery();

  useEffect(() => {
    if (fetchedPrimarySafeAddress) {
      setPrimarySafeAddress(getAddress(fetchedPrimarySafeAddress)); // Ensure checksummed
    }
  }, [fetchedPrimarySafeAddress]);

  const embeddedWallet = wallets.find(
    (w) => w.walletClientType === 'privy' && w.chainId === `eip155:${base.id}`,
  );

  // Mutations
  const createTransferMutation = api.align.createOfframpTransfer.useMutation({
    onSuccess: (data) => {
      setTransferDetails(data);
      setCurrentStep(1); // Move to next step
      toast.success('Transfer initiated. Please send funds from your Safe.');
    },
    onError: (err) => {
      setError(`Failed to initiate transfer: ${err.message}`);
      toast.error('Failed to initiate transfer', { description: err.message });
    },
  });

  // Prepare Transaction Mutation
  const prepareTxMutation = api.align.prepareOfframpTokenTransfer.useMutation({
    onError: (err) => {
      setError(`Failed to prepare transaction: ${err.message}`);
      toast.error('Failed to prepare transaction', {
        description: err.message,
      });
      setIsLoading(false);
    },
  });

  // Complete Transfer Mutation
  const completeTransferMutation =
    api.align.completeOfframpTransfer.useMutation({
      onSuccess: (data) => {
        toast.success('Transfer completion reported to Align.', {
          description: `New status: ${data.status}`,
        });
        setCurrentStep(2); // Move to final step
      },
      onError: (err) => {
        // Don't reset step, but show error
        setError(`Failed to report completion to Align: ${err.message}`);
        toast.error('Failed to report completion', {
          description: err.message,
        });
      },
      onSettled: () => {
        setIsLoading(false); // Stop loading after complete attempt
      },
    });

  const handleInitiateSubmit = async (values: CreateOfframpTransferInput) => {
    setError(null);
    await createTransferMutation.mutateAsync(values);
  };

  const handleSendFunds = async () => {
    if (
      !transferDetails ||
      !primarySafeAddress ||
      !smartClient ||
      !smartClient.account
    ) {
      toast.error(
        'Missing required information: Safe address, smart wallet, or transfer details.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    const { alignTransferId } = transferDetails;

    try {
      // 1. Prepare Target Transaction Data via tRPC
      setLoadingMessage('Preparing transaction...');
      const preparedData = await prepareTxMutation.mutateAsync({
        alignTransferId,
      });

      if (
        !preparedData ||
        !preparedData.to ||
        !preparedData.data ||
        !preparedData.value
      ) {
        throw new Error(
          'Received invalid transaction preparation data from server.',
        );
      }

      // 2. Initialize Safe SDK with Public RPC
      setLoadingMessage('Initializing Safe SDK...');
      // Use a public RPC for initializing Safe SDK for creating transactions
      const rpcProvider = http(process.env.NEXT_PUBLIC_BASE_RPC_URL as string);
      const publicClient = createPublicClient({ chain: base, transport: rpcProvider });

      // Note: `provider` for Safe.init is used for reading blockchain state,
      // not for signing. Signing happens via smartClient.sendTransaction.
      const safeSdk = await Safe.init({
        // @ts-ignore - Eip1193Provider type mismatch might occur, using publicClient
        provider: publicClient, // Use viem public client or an EIP1193 provider adapter
        safeAddress: primarySafeAddress,
      });

      // 3. Create Safe Transaction Object
      setLoadingMessage('Creating Safe transaction...');
      const safeTransactionData = {
        to: preparedData.to,
        value: preparedData.value,
        data: preparedData.data,
        operation: preparedData.operation ?? 0, // Default to CALL (0)
      };
      const safeTransaction = await safeSdk.createTransaction({
        transactions: [safeTransactionData],
      });

      // 4. Estimate Gas (Optional but Recommended for ERC20 transfers)
      safeTransaction.data.safeTxGas = BigInt(220000).toString(); // Convert BigInt to string

      // 5. Add Pre-validated Signature using Smart Wallet Address
      setLoadingMessage('Adding pre-validated signature...');
      const ownerAddress = smartClient.account.address;
      const prevalidatedSig = buildPrevalidatedSig(ownerAddress);
      // Use the object structure for the signature as shown in sponsored-safe-txs rule
      safeTransaction.addSignature({
        signer: ownerAddress,
        data: prevalidatedSig,
        // Note: The SDK might infer static/dynamic parts based on the structure
      });

      // 6. Encode `execTransaction` Data using Safe SDK's encode method
      setLoadingMessage('Encoding execution data...');
      // Get the contract instance using getContractManager
      const contractManager = await safeSdk.getContractManager();
      const safeContract = contractManager.safeContract;

      if (!safeContract) {
        throw new Error('Could not get Safe contract instance');
      }

      // Use the contract instance's encode method
      const encodedExecData = await safeContract.encode('execTransaction', [
        safeTransaction.data.to,
        BigInt(safeTransaction.data.value),
        safeTransaction.data.data,
        safeTransaction.data.operation,
        safeTransaction.data.safeTxGas,
        safeTransaction.data.baseGas,
        safeTransaction.data.gasPrice,
        safeTransaction.data.gasToken,
        safeTransaction.data.refundReceiver,
        safeTransaction.encodedSignatures(),
      ] as any) as `0x${string}`;

      // 7. Relay via Privy Smart Wallet (Sponsored Transaction)
      setLoadingMessage('Sending transaction via Privy Smart Wallet...');
      const opHash = await smartClient.sendTransaction({
        to: primarySafeAddress,
        data: encodedExecData as Hex, // Cast encoded data to Hex
        value: 0n, // Value for the execTransaction itself is 0
        chain: base, // Ensure correct chain is specified
      });

      setUserOpHash(opHash); // Store the UserOperation hash
      toast.success('Transaction sent to Privy relayer!', {
        description: `UserOp Hash: ${opHash}. Awaiting confirmation.`,
      });

      // 8. Complete Transfer via tRPC (using the UserOperation hash)
      setLoadingMessage('Reporting completion to Align...');
      // Pass the UserOperation hash instead of the final tx hash
      await completeTransferMutation.mutateAsync({
        alignTransferId,
        depositTransactionHash: opHash,
      });
      // Final loading state handled by completeTransferMutation.onSettled
    } catch (err: any) {
      console.error('Error during handleSendFunds:', err);
      const message =
        err.shortMessage ||
        err.message ||
        'Unknown error during fund transfer.';
      setError(`Error: ${message}`);
      toast.error('Fund transfer failed', { description: message });
      setIsLoading(false); // Stop loading on error
    }
  };

  // Show loading or error if safe address isn't loaded yet
  if (isLoadingSafeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Wallet Info...</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (safeAddressError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Could not load Primary Safe Address</AlertTitle>
            <AlertDescription>{safeAddressError.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!primarySafeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Primary Safe Required</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <AlertTitle>No Primary Safe Found</AlertTitle>
            <AlertDescription>
              You need to register or create a Primary Safe in Settings before
              you can use the off-ramp feature.
            </AlertDescription>
            {/* TODO: Add Link to settings/safes */}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Render the main flow only if primary safe address is loaded
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Withdraw Funds</CardTitle>
        <CardDescription className="text-gray-600">
          Withdraw funds from your Primary Safe ({primarySafeAddress.slice(0, 6)}...{primarySafeAddress.slice(-4)}).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-8 flex space-x-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={cn(
                "text-sm font-medium",
                index === currentStep ? "text-primary" : (index < currentStep ? "text-gray-900" : "text-gray-500")
              )}>
                Step {index + 1}: {step.label}
              </div>
              <div className={cn(
                "text-xs",
                index <= currentStep ? "text-gray-600" : "text-gray-400"
              )}>
                {step.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <InitiateTransferForm
                onSubmit={handleInitiateSubmit}
                isLoading={createTransferMutation.isPending}
                primarySafeAddress={primarySafeAddress}
              />
              {createTransferMutation.error && <p className="text-red-500 text-sm mt-2">Error: {createTransferMutation.error.message}</p>}
            </div>
          )}

          {currentStep === 1 && transferDetails && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-gray-800">Step 2: Send Funds from Safe</h3>
              <DepositDetails depositInfo={transferDetails} />
              <Button
                onClick={handleSendFunds}
                disabled={
                  isLoading ||
                  createTransferMutation.isPending ||
                  prepareTxMutation.isPending ||
                  completeTransferMutation.isPending
                }
                className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-800"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? loadingMessage : 'Prepare & Send from Safe'}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 text-center py-8">
              <h3 className="text-base font-semibold text-gray-800">Step 3: Processing</h3>
              <p className="text-gray-600">Your withdrawal is being processed by Align.</p>
              {userOpHash &&
                <p className="text-sm text-muted-foreground break-all">
                  Tx Hash: <code className="text-xs bg-gray-100 p-1 rounded">{userOpHash}</code>
                </p>
              }
              <p className="text-sm text-muted-foreground mt-2">You will receive an email confirmation once the funds arrive in your bank account (this may take 1-3 business days).</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
