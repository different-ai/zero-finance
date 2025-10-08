'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation'; // Use client-side hook for params
import { useUserSafes } from '@/hooks/use-user-safes';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { shortenAddress } from '@/lib/utils/formatters';
import { trpc } from '@/lib/trpc';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  AlertCircle,
  Building,
  Copy,
  ArrowLeft,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  isAddress,
  parseUnits,
  formatUnits,
  encodeFunctionData,
  erc20Abi,
  type Address,
  type Hex,
} from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants'; // Assuming constants exist
import Link from 'next/link';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { relayNestedSafeTx } from '@/lib/sponsor-tx/core';
import Safe from '@safe-global/protocol-kit';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';

// Reusable component for displaying balance
function SafeBalanceDisplay({ safeAddress }: { safeAddress: Address }) {
  const { data, isLoading, isError, error, refetch } =
    trpc.safe.getBalance.useQuery(
      {
        safeAddress: safeAddress,
        tokenAddress: USDC_ADDRESS,
      },
      { staleTime: 1000 * 60, retry: 1 }, // Shorter stale time for detail page
    );

  const balanceText = useMemo(() => {
    if (isLoading) return '(Loading...)';
    if (isError) {
      console.error(`Balance fetch error for ${safeAddress}:`, error);
      return '(Error)';
    }
    if (data) return `${formatUnits(data.balance, USDC_DECIMALS)} USDC`;
    return '(N/A)';
  }, [data, isLoading, isError, error, safeAddress]);

  return (
    <span className="font-mono text-lg">
      {balanceText}
      <Button
        variant="ghost"
        size="icon"
        className="ml-1 h-6 w-6"
        onClick={() => refetch()}
      >
        {isLoading && <Loader2 className={`h-3 w-3 animate-spin`} />}
      </Button>
    </span>
  );
}

// Transfer Form Component
function TransferForm({
  sourceSafeAddress,
  userSafes,
  refreshBalances,
}: {
  sourceSafeAddress: Address;
  userSafes: Array<{ id: string; safeAddress: string; safeType: string }>;
  refreshBalances: () => void;
}) {
  const [destinationAddress, setDestinationAddress] = useState<Address | ''>(
    '',
  );
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ready: relayReady, send: sendWithRelay } =
    useSafeRelay(sourceSafeAddress);
  const { client: smartClient } = useSmartWallets();

  const destinationOptions = useMemo(() => {
    return userSafes.filter((s) => s.safeAddress !== sourceSafeAddress);
  }, [userSafes, sourceSafeAddress]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!relayReady) {
        toast.error('Relay service not ready. Please wait and try again.');
        return;
      }
      if (!destinationAddress || !isAddress(destinationAddress)) {
        toast.error('Please select a valid destination account.');
        return;
      }
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        toast.error('Please enter a valid positive amount.');
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading('Preparing transaction...');

      try {
        const value = parseUnits(amount, USDC_DECIMALS);

        // TODO: Add balance check before sending

        const transferData: Hex = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [destinationAddress, value],
        });

        const transaction: MetaTransactionData = {
          to: USDC_ADDRESS,
          value: '0',
          data: transferData,
          operation: 0, // Call
        };

        toast.loading('Sending transaction via relay... Please wait.', {
          id: toastId,
        });

        let txHash: Hex;
        // is nested safe?

        const isPrimarySafe =
          userSafes.find((s) => s.safeType === 'primary')?.safeAddress ===
          sourceSafeAddress;
        console.log('isPrimarySafe', isPrimarySafe);
        const isNestedSafe = !isPrimarySafe;

        // If the source safe is a nested safe, relay via the primary‑>nested pattern
        if (isNestedSafe) {
          // print every single fucking step to debug
          console.log('sourceSafeAddress', sourceSafeAddress);
          console.log('userSafes', userSafes);
          const primarySafeAddress = userSafes.find(
            (s) => s.safeType === 'primary',
          )?.safeAddress as Address | undefined;
          console.log('primarySafeAddress', primarySafeAddress);
          if (!primarySafeAddress) {
            throw new Error('Primary account not found in your account.');
          }
          console.log('smartClient', smartClient);
          if (!smartClient?.account) {
            throw new Error('Smart wallet client not ready.');
          }
          console.log('verifying ownership');
          await verifyOwnership(
            sourceSafeAddress,
            primarySafeAddress,
            getBaseRpcUrl(),
          );
          console.log('relaying nested safe tx');
          txHash = await relayNestedSafeTx([transaction], {
            nestedSafe: sourceSafeAddress,
            primarySafe: primarySafeAddress,
            signerAddress: smartClient.account.address as Address,
            smartClient,
          });
          console.log('txHash', txHash);
        } else {
          // Standard single‑safe flow
          txHash = await sendWithRelay([transaction]);
        }

        toast.success(
          `Transaction submitted! Hash: ${txHash.slice(0, 10)}...`,
          {
            id: toastId,
            description: 'Waiting for confirmation...',
          },
        );

        // TODO: Add polling for receipt or integrate with backend confirmation

        setDestinationAddress('');
        setAmount('');
        // Optimistically refresh balances after a short delay
        setTimeout(refreshBalances, 3000);
      } catch (error: any) {
        console.error('Transfer failed:', error);
        toast.error(
          `Transfer failed: ${error.shortMessage || error.message || 'Unknown error'}`,
          { id: toastId },
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      relayReady,
      sourceSafeAddress,
      destinationAddress,
      amount,
      sendWithRelay,
      refreshBalances,
      smartClient,
      userSafes,
    ],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer USDC</CardTitle>
        <CardDescription>
          Send funds from this account to another one of your accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="destination">To Account</Label>
            <Select
              value={destinationAddress}
              onValueChange={(value) => setDestinationAddress(value as Address)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="destination">
                <SelectValue placeholder="Select destination account..." />
              </SelectTrigger>
              <SelectContent>
                {destinationOptions.map((safe) => (
                  <SelectItem key={safe.id} value={safe.safeAddress}>
                    <span className="capitalize">{safe.safeType} Account</span> (
                    {shortenAddress(safe.safeAddress)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Select the destination account.
            </p>
          </div>
          <div>
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            disabled={
              !relayReady || isSubmitting || !destinationAddress || !amount
            }
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? 'Submitting...' : 'Review & Send'}
          </Button>
          {!relayReady && (
            <p className="text-xs text-yellow-600 text-center">
              Relay service initializing...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function SafeDetailPage() {
  const params = useParams(); // Use client hook
  const safeAddress = params.safeAddress as Address;

  // Validate address param early
  const sourceSafeAddress = useMemo(() => {
    if (typeof safeAddress === 'string' && isAddress(safeAddress)) {
      return safeAddress as Address;
    }
    return null;
  }, [safeAddress]);

  const {
    data: allSafes,
    isLoading: isLoadingSafes,
    isError: isErrorSafes,
    error: fetchSafesError,
  } = useUserSafes();
  const utils = trpc.useUtils();

  // Find the specific safe data from the list
  const currentSafe = useMemo(() => {
    if (!sourceSafeAddress || !allSafes) return null;
    return allSafes.find((s) => s.safeAddress === sourceSafeAddress);
  }, [sourceSafeAddress, allSafes]);

  const refreshAllBalances = useCallback(() => {
    if (allSafes) {
      allSafes.forEach((safe) => {
        utils.safe.getBalance.invalidate({
          safeAddress: safe.safeAddress as Address,
          tokenAddress: USDC_ADDRESS,
        });
      });
      // Optionally trigger a refetch of the list page balance if needed
      // utils.safe.getBalance.invalidate(); // Broad invalidation if needed elsewhere
    }
    // Also refetch the current page's balance
    if (sourceSafeAddress) {
      utils.safe.getBalance.invalidate({
        safeAddress: sourceSafeAddress,
        tokenAddress: USDC_ADDRESS,
      });
    }
  }, [allSafes, utils, sourceSafeAddress]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Address copied to clipboard!');
      },
      (err) => {
        toast.error('Failed to copy address.');
        console.error('Could not copy text: ', err);
      },
    );
  };

  if (isLoadingSafes) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading account details...</span>
      </div>
    );
  }

  if (!sourceSafeAddress) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invalid Account Address</AlertTitle>
        <AlertDescription>
          The address in the URL is not a valid Ethereum address.
          <Link href="/dashboard/safes">
            <Button variant="link" className="p-0 h-auto ml-1">
              Go back
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (isErrorSafes || !allSafes) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Account Information</AlertTitle>
        <AlertDescription>
          {fetchSafesError?.message || 'Could not fetch account details.'}
          <Link href="/dashboard/safes">
            <Button variant="link" className="p-0 h-auto ml-1">
              Go back
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentSafe) {
    return (
      <Alert
        variant="default"
        className="mt-4 border-yellow-500/50 bg-yellow-50 text-yellow-800"
      >
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-900">Account Not Found</AlertTitle>
        <AlertDescription className="text-yellow-700">
          The specified account address was not found in your linked accounts.
          Please check the address or go back to the accounts list.
          <Link href="/dashboard/safes">
            <Button
              variant="link"
              className="p-0 h-auto ml-1 text-yellow-800 hover:text-yellow-900"
            >
              Go back
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/safes"
        className="inline-flex items-center text-sm text-primary hover:underline mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to All Accounts
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-6 w-6 mr-2 text-primary" />
            <CardTitle>
              <span className="capitalize">{currentSafe.safeType} Account</span>
            </CardTitle>
          </CardTitle>
          <CardDescription className="flex items-center space-x-2 pt-2">
            <span className="font-mono text-sm break-all">
              {shortenAddress(currentSafe.safeAddress)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => copyToClipboard(currentSafe.safeAddress)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Current Balance:</p>
            <SafeBalanceDisplay safeAddress={currentSafe.safeAddress as `0x${string}`} />
          </div>
          <TransferForm
            sourceSafeAddress={currentSafe.safeAddress as `0x${string}`}
            userSafes={allSafes}
            refreshBalances={refreshAllBalances}
          />
        </CardContent>
      </Card>
    </div>
  );
}
// 2. Add owner verification before sending
async function verifyOwnership(
  nestedSafe: Address,
  primarySafe: Address,
  provider: string,
) {
  let safeSdk: Safe | undefined;
  try {
    safeSdk = await Safe.init({ provider, safeAddress: nestedSafe });
    const owners = await safeSdk.getOwners();
    if (!owners.map((o) => o.toLowerCase()).includes(primarySafe.toLowerCase())) {
      throw new Error('Primary account is not an owner of the nested account');
    }
  } catch (error: any) {
    console.error('Owner verification failed:', error);
    throw error;
  }
}
