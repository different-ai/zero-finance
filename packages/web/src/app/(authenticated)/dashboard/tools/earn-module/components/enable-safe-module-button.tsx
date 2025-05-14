'use client';

import { useState } from 'react';
import { type Address, Hex, encodeFunctionData } from 'viem';
import { toast } from 'sonner';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

import { useSafeRelay } from '@/hooks/use-safe-relay';
import { api } from '@/trpc/react';
import { AUTO_EARN_MODULE_ADDRESS } from '@/lib/earn-module-constants';
import { Button } from '@/components/ui/button';

// Minimal ABI needed to call enableModule on a Safe contract
const SAFE_ABI_ENABLE_MODULE = [
  {
    type: 'function',
    name: 'enableModule',
    inputs: [{ name: 'module', type: 'address' }],
  },
] as const;

interface Props {
  safeAddress?: Address;
}

/**
 * A fully-self-contained button that enables the Auto-Earn contract
 * as a Safe module. It manages its own on-chain status queries and relay logic
 * so you only need to supply the user's Safe address.
 */
export function EnableSafeModuleButton({ safeAddress }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setTxHash] = useState<Hex | null>(null); // kept for debugging/analytics if needed

  const { client: smartClient } = useSmartWallets();
  const {
    ready: isRelayReady,
    send: sendTxViaRelay,
  } = useSafeRelay(safeAddress);

  // Query on-chain to know if module already enabled
  const {
    data: onChainModuleStatus,
    isLoading,
    refetch: refetchOnChainModuleStatus,
  } = api.earn.isSafeModuleActivelyEnabled.useQuery(
    { safeAddress: safeAddress!, moduleAddress: AUTO_EARN_MODULE_ADDRESS },
    {
      enabled: !!safeAddress,
      staleTime: 5_000,
    },
  );

  const isModuleEnabled = onChainModuleStatus?.isEnabled || false;

  const handleClick = async () => {
    if (!safeAddress || !isRelayReady || !smartClient?.account) {
      toast.error('Safe address not available or relay not ready.');
      return;
    }

    setIsProcessing(true);
    setTxHash(null);

    try {
      const tx = [
        {
          to: safeAddress,
          value: '0',
          data: encodeFunctionData({
            abi: SAFE_ABI_ENABLE_MODULE,
            functionName: 'enableModule',
            args: [AUTO_EARN_MODULE_ADDRESS],
          }),
          operation: 0,
        },
      ];

      toast.info('Submitting: Enable Safe Module transaction...', {
        id: 'enable-safe-module-tx',
      });
      const userOpHash = await sendTxViaRelay(tx, 300_000n);
      setTxHash(userOpHash);

      toast.success('Enable Safe Module transaction submitted.', {
        description: `UserOp: ${userOpHash}`,
        id: 'enable-safe-module-tx',
      });

      // Give the tx some time then refresh status
      await new Promise((r) => setTimeout(r, 10_000));
      await refetchOnChainModuleStatus();
    } catch (error: any) {
      console.error('Failed to enable Safe module:', error);
      toast.error(error.shortMessage || error.message || 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleClick}
        disabled={!isRelayReady || isProcessing || isModuleEnabled || isLoading}
        className="w-full md:w-auto"
      >
        {isLoading
          ? 'Checking Safe Module...'
          : isModuleEnabled
          ? '1. Safe Module Enabled ✓'
          : isProcessing
          ? 'Enabling Safe Module...'
          : '1. Enable Safe Module on Safe'}
      </Button>
      {!isModuleEnabled && !isLoading && (
        <p className="text-xs text-muted-foreground mt-1">
          This will enable the Auto-Earn module on your Safe.
        </p>
      )}
      {isModuleEnabled && (
        <p className="text-xs text-green-600 mt-1">
          Auto-Earn module enabled on Safe.
        </p>
      )}
    </div>
  );
} 