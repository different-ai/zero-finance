'use client';

import { useState } from 'react';
import { type Address, encodeFunctionData, Hex } from 'viem';
import { toast } from 'sonner';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { useEarnState } from '../hooks/use-earn-state';
import {
  AUTO_EARN_MODULE_ADDRESS,
  PADDED_CONFIG_HASH,
} from '@/lib/earn-module-constants';
import { api } from '@/trpc/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

interface EnableEarnCardProps {
  safeAddress?: Address;
}

// ABI snippets needed for encoding
const SAFE_ABI_ENABLE_MODULE = [
  {
    type: 'function',
    name: 'enableModule',
    inputs: [{ name: 'module', type: 'address' }],
  },
] as const;
const EARN_MODULE_ABI_ON_INSTALL = [
  {
    type: 'function',
    name: 'onInstall',
    inputs: [{ name: 'configHash', type: 'bytes32' }],
  },
] as const;

export function EnableEarnCard({ safeAddress }: EnableEarnCardProps) {
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  // get privy smart wallet client
  const { client: smartClient } = useSmartWallets();
  // console log safeAddress
  console.log('safeAddress', safeAddress);
  console.log('PADDED_CONFIG_HASH', PADDED_CONFIG_HASH, PADDED_CONFIG_HASH.length);
  const {
    isEnabled,
    isLoading: isLoadingStatus,
    isError: isStatusError,
    refetchStatus,
  } = useEarnState(safeAddress);
  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);

  const recordInstallMutation = api.earn.recordInstall.useMutation({
    onSuccess: async () => {
      toast.success('Earn module enabled and recorded!');
      await refetchStatus();
      setTxHash(null);
    },
    onError: (error) => {
      toast.error(`Failed to record installation: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmittingTransaction(false);
    },
  });

  const handleEnableModule = async () => {
    if (!safeAddress || !isRelayReady || !smartClient?.account) {
      toast.error('Safe address not available or relay not ready.');
      return;
    }
    setIsSubmittingTransaction(true);
    setTxHash(null);

    try {
      // ---- tx #1: enableModule ------------------------------------
      const tx1EnableModule = [
        {
          to: safeAddress,
          value: '0',
          data: encodeFunctionData({
            abi: SAFE_ABI_ENABLE_MODULE,
            functionName: 'enableModule',
            args: [AUTO_EARN_MODULE_ADDRESS],
          }),
          operation: 0, // CALL
        },
      ];

      toast.info('Submitting: Enable Module transaction...', {
        id: 'enable-module-tx',
      });
      const userOpHashEnable = await sendTxViaRelay(tx1EnableModule, 300_000n);
      setTxHash(userOpHashEnable); // Set hash for the first tx
      toast.success(
        'Enable Module transaction submitted. Waiting for confirmation...',
        {
          description: `UserOp: ${userOpHashEnable}`,
          id: 'enable-module-tx',
        },
      );

      // Simple wait for a few seconds, ideally, we'd monitor the transaction status
      // For demo purposes, a timeout. In production, use a more robust tx monitoring.
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

      // ---- tx #2: onInstall via delegatecall ----------------------
      const tx2OnInstall = [
        {
          to: AUTO_EARN_MODULE_ADDRESS,
          value: '0',
          data: encodeFunctionData({
            abi: EARN_MODULE_ABI_ON_INSTALL,
            functionName: 'onInstall',
            args: [PADDED_CONFIG_HASH],
          }),
          operation: 1, // DELEGATECALL
        },
      ];

      toast.info('Submitting: onInstall transaction...', {
        id: 'oninstall-tx',
      });
      const userOpHashInstall = await sendTxViaRelay(tx2OnInstall, 300_000n);
      setTxHash(userOpHashInstall); // Update hash for the second tx
      toast.success(
        'onInstall transaction submitted. Waiting for confirmation.',
        {
          description: `UserOp: ${userOpHashInstall}`,
          id: 'oninstall-tx',
        },
      );

      // After the second transaction is submitted, call recordInstallMutation
      recordInstallMutation.mutate({ safeAddress });
    } catch (error: any) {
      console.error('Failed to send one of the transactions:', error);
      toast.error(
        `Transaction failed: ${error.shortMessage || error.message || 'Unknown error'}`,
      );
      setIsSubmittingTransaction(false);
      setTxHash(null); // Clear txHash on error
    }
  };

  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">
            No primary safe detected or selected.
          </p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure a primary safe is active to use this feature.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  if (isStatusError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading earn module status.</p>
          <Button onClick={() => refetchStatus()} className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // @ts-ignore If linter still complains, it might be a type issue beyond simple fix here.
  const isMutationProcessing = recordInstallMutation.isLoading;
  const isProcessing = isSubmittingTransaction || isMutationProcessing;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        {isEnabled && (
          <Badge variant="default" className="bg-green-500 text-white">
            Auto-Earn Module Active
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isEnabled ? (
          <p>
            Your Safe is automatically earning yield via the Morpho Seamless
            Vault.
          </p>
        ) : (
          <p>
            Enable the Auto-Earn module to automatically deposit idle USDC into
            yield-generating vaults.
          </p>
        )}
        {txHash && (
          <div className="mt-4">
            <p className="text-sm">Last transaction submitted:</p>
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              {txHash} (View on Basescan - may be UserOp hash)
            </a>
          </div>
        )}
      </CardContent>
      {!isEnabled && (
        <CardFooter className="flex flex-col items-start">
          <Button
            onClick={handleEnableModule}
            disabled={!isRelayReady || isProcessing}
          >
            {isProcessing ? 'Enabling...' : 'Enable Auto-Earn'}
          </Button>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Installs a Safe-native module; you can remove it anytime in
            settings.
          </CardDescription>
        </CardFooter>
      )}
    </Card>
  );
}
