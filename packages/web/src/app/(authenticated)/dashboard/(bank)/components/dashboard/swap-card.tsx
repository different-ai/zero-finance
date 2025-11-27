'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowRightLeft, Wallet } from 'lucide-react';
import {
  formatUnits,
  parseUnits,
  getAddress,
  type Address,
  createWalletClient,
  createPublicClient,
  custom,
  http,
  type EIP1193Provider,
} from 'viem';
import { base } from 'viem/chains';
import Safe from '@safe-global/protocol-kit';
import { toast } from 'sonner';
import { getLifiQuoteAndTxData } from '../../lib/swap-service';

type CustomEIP1193Provider = string | EIP1193Provider;

// Define constants (ensure env vars are available client-side)
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL as string;

// Type guard to check if the response is a string starting with 0x
function isTransactionHash(response: any): response is `0x${string}` {
  return typeof response === 'string' && response.startsWith('0x');
}

interface SwapCardProps {
  primarySafeAddress: Address | null | undefined;
}

export function SwapCard({ primarySafeAddress }: SwapCardProps) {
  const { wallets } = useWallets();
  const [ethAmount, setEthAmount] = useState('');
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [swapStatus, setSwapStatus] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  const embeddedWallet = wallets.find(
    (w) => w.walletClientType === 'privy' && w.chainId === `eip155:${base.id}`,
  );

  // Fetch ETH balance of the embedded wallet
  useEffect(() => {
    const fetchBalance = async () => {
      if (!embeddedWallet || !BASE_RPC_URL) return;
      setIsLoadingBalance(true);
      try {
        const publicClient = createPublicClient({
          chain: base,
          transport: http(BASE_RPC_URL),
        });
        const balanceWei = await publicClient.getBalance({
          address: embeddedWallet.address as Address,
        });
        const balanceEth = formatUnits(balanceWei, 18);
        setEthBalance(parseFloat(balanceEth).toFixed(6)); // Show more precision
      } catch (error) {
        console.error('Error fetching ETH balance:', error);
        setEthBalance(null);
        toast.error('Could not fetch your ETH balance.');
      }
      setIsLoadingBalance(false);
    };
    fetchBalance();
  }, [embeddedWallet]);

  const handleMaxClick = () => {
    if (ethBalance) {
      // Consider leaving a tiny amount for gas if needed, though LI.FI might handle this
      setEthAmount(ethBalance);
    }
  };

  // Swap handler using LI.FI
  const handleInitiateSwap = async () => {
    if (!primarySafeAddress) {
      toast.error('Primary Safe address not available.');
      return;
    }
    if (!embeddedWallet) {
      toast.error('Privy embedded wallet not found or not on Base network.');
      return;
    }
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      toast.error('Please enter a valid ETH amount to swap.');
      return;
    }

    setSwapStatus('Processing...');
    setSwapError(null);
    const toastId = toast.loading('Preparing swap...');

    const checksummedSafeAddress = getAddress(primarySafeAddress);
    const fromAddress = embeddedWallet.address as Address;

    try {
      toast.loading('Initializing transaction...', { id: toastId });
      await embeddedWallet.switchChain(base.id);
      const ethereumProvider = await embeddedWallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: fromAddress,
        chain: base,
        transport: custom(ethereumProvider),
      });
      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_URL),
      });

      toast.loading('Initializing Safe SDK...', { id: toastId });
      const safeSdk = await Safe.init({
        // @ts-ignore
        provider: ethereumProvider as CustomEIP1193Provider,
        signer: fromAddress,
        safeAddress: checksummedSafeAddress,
      });

      toast.loading('Fetching swap data from LI.FI...', { id: toastId });
      const swapTxDataFromLifi = await getLifiQuoteAndTxData(
        ethAmount,
        fromAddress,
        checksummedSafeAddress,
      );

      const safeTransactionData = {
        to: swapTxDataFromLifi.to,
        value: swapTxDataFromLifi.value.toString(),
        data: swapTxDataFromLifi.data,
        operation: 0, // Call
      };

      toast.loading('Creating Safe transaction...', { id: toastId });
      const safeTransaction = await safeSdk.createTransaction({
        transactions: [safeTransactionData],
      });

      toast.loading('Executing Safe transaction...', { id: toastId });
      const executeTxResponse = await safeSdk.executeTransaction(
        safeTransaction,
        {
          gasLimit: swapTxDataFromLifi.estimatedGas
            ? BigInt(swapTxDataFromLifi.estimatedGas)
            : undefined,
        }, // Use LI.FI gas if available
      );

      let txHash: `0x${string}` | undefined;
      if (isTransactionHash(executeTxResponse)) {
        txHash = executeTxResponse;
      } else if (executeTxResponse && typeof executeTxResponse === 'object') {
        const txResponse = executeTxResponse as Record<string, any>;
        const potentialHash =
          txResponse.hash || txResponse.transactionResponse?.hash;
        if (isTransactionHash(potentialHash)) {
          txHash = potentialHash;
        }
      }

      if (txHash) {
        toast.loading(
          `Waiting for confirmation (Hash: ${txHash.substring(0, 10)}...)`,
          { id: toastId },
        );
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        if (receipt.status === 'success') {
          toast.success(`Swap via Safe completed!`, {
            id: toastId,
            description: `Tx: ${receipt.transactionHash}`,
          });
          setSwapStatus(`Completed`);
          // Refetch ETH balance after swap
          const balanceWei = await publicClient.getBalance({
            address: embeddedWallet.address as Address,
          });
          const balanceEth = formatUnits(balanceWei, 18);
          setEthBalance(parseFloat(balanceEth).toFixed(6));
        } else {
          throw new Error(
            `Transaction reverted. Hash: ${receipt.transactionHash}`,
          );
        }
      } else {
        toast.info(
          'Swap via Safe executed (confirmation pending). Check your wallet.',
          { id: toastId },
        );
        setSwapStatus('Executed (Pending)');
      }
    } catch (error: any) {
      console.error('Swap via Safe failed:', error);
      const errorMessage =
        error.shortMessage || error.message || 'Unknown error';
      setSwapError(`Swap failed: ${errorMessage}`);
      toast.error('Swap via Safe failed', {
        id: toastId,
        description: errorMessage,
      });
      setSwapStatus(null);
    } finally {
      // Ensure status is cleared if no longer loading and not completed/pending
      if (swapStatus === 'Processing...') setSwapStatus(null);
    }
  };

  // Determine if the button should be disabled
  const isSwapInProgress =
    swapStatus !== null &&
    (swapStatus === 'Processing...' ||
      swapStatus.includes('Waiting') ||
      swapStatus.includes('Executing'));

  // Determine if the success alert should be shown
  const showSuccessAlert =
    swapStatus &&
    !swapError &&
    swapStatus !== 'Processing...' &&
    !swapStatus.includes('Waiting') &&
    !swapStatus.includes('Executing');

  return (
    <div className="space-y-4">
      {!embeddedWallet && (
        <Alert
          variant="default"
          className="border-yellow-500/50 bg-yellow-50 text-yellow-800"
        >
          <Wallet className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-900">
            Embedded Wallet Not Found
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            Could not find your Privy embedded wallet on the Base network.
            Please ensure it&apos;s set up.
          </AlertDescription>
        </Alert>
      )}

      {embeddedWallet && (
        <>
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <label
                htmlFor="ethAmount"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                ETH Amount
              </label>
              <Input
                id="ethAmount"
                type="number"
                placeholder="0.0"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                step="any"
                min="0"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMaxClick}
              disabled={!ethBalance || isLoadingBalance}
            >
              MAX
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            {isLoadingBalance ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Checking
                balance...
              </span>
            ) : (
              `Available: ${ethBalance ?? '--'} ETH`
            )}
          </p>

          <Button
            onClick={handleInitiateSwap}
            disabled={
              !embeddedWallet || !primarySafeAddress || isSwapInProgress
            }
            className="w-full"
          >
            {isSwapInProgress && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Initiate Swap via Safe
          </Button>

          {/* Display status/error messages */}
          {showSuccessAlert && (
            <Alert
              variant="default"
              className="border-green-500/50 bg-green-50 text-green-800"
            >
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">
                Swap Status: {swapStatus}
              </AlertTitle>
            </Alert>
          )}
          {swapError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Swap Error</AlertTitle>
              <AlertDescription>{swapError}</AlertDescription>
            </Alert>
          )}

          <p className="text-xs text-gray-500 text-center pt-2">
            Your Wallet:{' '}
            <span className="font-mono break-all">
              {embeddedWallet.address}
            </span>
          </p>
        </>
      )}
    </div>
  );
}
