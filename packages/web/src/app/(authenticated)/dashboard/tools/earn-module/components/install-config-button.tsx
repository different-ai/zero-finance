'use client';

import { useState } from 'react';
import { type Address, Hex, encodeFunctionData, encodeAbiParameters } from 'viem';
import { toast } from 'sonner';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';

import { useSafeRelay } from '@/hooks/use-safe-relay';
import { api } from '@/trpc/react';
import { AUTO_EARN_MODULE_ADDRESS, CONFIG_HASH_DECIMAL } from '@/lib/earn-module-constants';
import { Button } from '@/components/ui/button';

// ABI snippets
const EARN_MODULE_ABI_ON_INSTALL = [
  {
    type: 'function',
    name: 'onInstall',
    inputs: [{ name: 'data', type: 'bytes' }],
  },
] as const;

interface Props {
  safeAddress?: Address;
}

/**
 * Installs the default configuration for the Auto-Earn module on the user's Safe.
 * Handles its own status queries and relay logic, requiring only the Safe address.
 */
export function InstallConfigButton({ safeAddress }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [, setTxHash] = useState<Hex | null>(null);

  const { client: smartClient } = useSmartWallets();
  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(safeAddress);

  // Check prerequisite: module enabled on safe
  const { data: moduleStatus } = api.earn.isSafeModuleActivelyEnabled.useQuery(
    { safeAddress: safeAddress!, moduleAddress: AUTO_EARN_MODULE_ADDRESS },
    { enabled: !!safeAddress, staleTime: 5_000 },
  );
  const isModuleEnabled = moduleStatus?.isEnabled || false;

  // Check if config already installed (on-chain)
  const {
    data: initStatus,
    isLoading: isLoadingInitStatus,
    refetch: refetchInitStatus,
  } = api.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress, staleTime: 5_000 },
  );
  const isConfigInstalled = initStatus?.isInitializedOnChain || false;

  const recordInstallMutation = api.earn.recordInstall.useMutation();

  const handleClick = async () => {
    if (!safeAddress || !isRelayReady || !smartClient?.account || !isModuleEnabled) {
      toast.error('Prerequisites not met (Safe, relay or module status).');
      return;
    }

    setIsProcessing(true);
    setTxHash(null);
    setIsWaiting(true);

    try {
      const onInstallArgBytes = encodeAbiParameters([{ type: 'uint256' }], [BigInt(CONFIG_HASH_DECIMAL)]);
      const tx = [
        {
          to: AUTO_EARN_MODULE_ADDRESS,
          value: '0',
          data: encodeFunctionData({
            abi: EARN_MODULE_ABI_ON_INSTALL,
            functionName: 'onInstall',
            args: [onInstallArgBytes],
          }),
          operation: 0,
        },
      ];

      toast.info('Submitting: Install configuration transaction...', { id: 'install-config-tx' });
      const userOpHash = await sendTxViaRelay(tx, 300_000n);
      setTxHash(userOpHash);
      toast.success('Install configuration transaction submitted.', {
        description: `UserOp: ${userOpHash}`,
        id: 'install-config-tx',
      });

      // Poll for confirmation
      const start = Date.now();
      const timeoutMs = 120_000;
      let confirmed = false;
      while (Date.now() - start < timeoutMs) {
        await new Promise((r) => setTimeout(r, 5_000));
        const { data } = await refetchInitStatus();
        if (data?.isInitializedOnChain) {
          confirmed = true;
          break;
        }
      }

      if (!confirmed) {
        toast.error('On-chain confirmation timed out.');
        return;
      }

      toast.success('Configuration active on-chain, recording…');
      await recordInstallMutation.mutateAsync({ safeAddress });
    } catch (error: any) {
      console.error('Failed to install configuration:', error);
      toast.error(error.shortMessage || error.message || 'Unknown error');
    } finally {
      setIsProcessing(false);
      setIsWaiting(false);
      await refetchInitStatus();
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleClick}
        disabled={
          !isRelayReady ||
          !isModuleEnabled ||
          isProcessing ||
          recordInstallMutation.isPending ||
          isConfigInstalled ||
          isLoadingInitStatus
        }
        className="w-full md:w-auto"
      >
        {isLoadingInitStatus
          ? 'Checking Status…'
          : !isModuleEnabled
          ? '1. Enable Safe Module First'
          : isConfigInstalled
          ? '2. Configuration Installed ✓'
          : isWaiting
          ? 'Confirming On-Chain…'
          : isProcessing || recordInstallMutation.isPending
          ? 'Installing Configuration…'
          : '2. Install Module Configuration'}
      </Button>

      {isModuleEnabled && !isConfigInstalled && !isLoadingInitStatus && (
        <p className="text-xs text-muted-foreground mt-1">
          This will call <code>onInstall</code> on the Auto-Earn module with the default configuration.
        </p>
      )}
      {isConfigInstalled && (
        <p className="text-xs text-green-600 mt-1">Earning configuration active.</p>
      )}
    </div>
  );
} 