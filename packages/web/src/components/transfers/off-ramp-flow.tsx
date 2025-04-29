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
        toast.success('Transfer completion reported.', {
          description: `New status: ${data.status}`,
        });
        setCurrentStep(2); // Move to final step
      },
      onError: (err) => {
        // Don't reset step, but show error
        setError(`Failed to report completion: ${err.message}`);
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
        'Missing required information: Account address, smart wallet, or withdrawal details.',
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
      const publicClient = createPublicClient({
        chain: base,
        transport: rpcProvider,
      });

      // Note: `provider` for Safe.init is used for reading blockchain state,
      // not for signing. Signing happens via smartClient.sendTransaction.
      const safeSdk = await Safe.init({
        // @ts-ignore - Eip1193Provider type mismatch might occur, using publicClient
        provider: publicClient, // Use viem public client or an EIP1193 provider adapter
        safeAddress: primarySafeAddress,
      });

      // 3. Create Safe Transaction Object
      setLoadingMessage('Creating transaction...');
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
      setLoadingMessage('Adding signature...');
      const ownerAddress = smartClient.account.address;
      const prevalidatedSig = buildPrevalidatedSig(ownerAddress);
      // Use the object structure for the signature as shown in sponsored-safe-txs rule
      safeTransaction.addSignature({
        signer: ownerAddress as Address,
        data: prevalidatedSig as `0x${string}`,
      } as any);

      // 6. Encode `execTransaction` Data using Safe SDK's encode method
      setLoadingMessage('Encoding execution data...');
      // Get the contract instance using getContractManager
      const contractManager = await safeSdk.getContractManager();
      const safeContract = contractManager.safeContract;

      if (!safeContract) {
        throw new Error('Could not get Safe contract instance');
      }

      // Use the contract instance's encode method
      // @ts-ignore
      const encodedExecData = (await safeContract.encode('execTransaction', [
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
      ] as any)) as `0x${string}`;

      // 7. Send the UserOperation via the smart wallet client
      setLoadingMessage('Sending transaction via smart wallet...');
      const txResponse = await smartClient.sendTransaction({
        to: primarySafeAddress,
        data: encodedExecData,
      });

      setUserOpHash(txResponse);
      setLoadingMessage('Transaction submitted, reporting to backend...');
      toast.success('Transaction sent! Reporting completion...', {
        description: `Tx Hash: ${txResponse.slice(0, 10)}...`,
      });

      // 8. Report completion to backend (fire-and-forget or wait)
      completeTransferMutation.mutate({ alignTransferId, txHash: txResponse });
    } catch (err: any) {
      console.error('Error during send funds:', err);
      let errMsg = err.message || 'An unknown error occurred.';
      if (errMsg.includes('User rejected')) {
        errMsg = 'Transaction rejected by user.';
      }
      setError(`Failed to send funds: ${errMsg}`);
      toast.error('Failed to send funds', { description: errMsg });
      setIsLoading(false); // Stop loading on error
    }
    // Note: setIsLoading(false) is handled in completeTransferMutation.onSettled
  };

  const renderCurrentStep = () => {
    if (isLoadingSafeAddress) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Loading your account details...</p>
          </CardContent>
        </Card>
      );
    }

    if (safeAddressError || !primarySafeAddress) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error Loading Account</AlertTitle>
          <AlertDescription>
            Could not load your primary account address. Please ensure it&apos;s set up
            in settings. Error: {safeAddressError?.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <InitiateTransferForm
            onSubmit={handleInitiateSubmit}
            isLoading={createTransferMutation.isPending}
            initialCurrency="USD" // Or fetch from user profile/settings
          />
        );
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Send Funds from Your Account</CardTitle>
              <CardDescription>
                Send the required amount to the specified deposit address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transferDetails && (
                <DepositDetails
                  amount={transferDetails.depositAmount}
                  tokenSymbol={transferDetails.depositTokenSymbol}
                  depositAddress={transferDetails.depositAddress}
                  qrCodeData={transferDetails.depositQrCodeData}
                  memo={transferDetails.depositMemo}
                />
              )}
              <Button
                onClick={handleSendFunds}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingMessage}
                  </>
                ) : (
                  'Confirm & Send Funds'
                )}
              </Button>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Processing</CardTitle>
              <CardDescription>
                Your funds have been sent. The withdrawal is now being processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                You will be notified once the funds arrive in your bank account.
              </p>
              {userOpHash && (
                <p className="text-xs text-muted-foreground">
                  Transaction Ref: {userOpHash.slice(0, 10)}...
                </p>
              )}
            </CardContent>
          </Card>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Optional: Stepper Component */}
      {/* <Stepper currentStep={currentStep} steps={steps} /> */}

      {renderCurrentStep()}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
