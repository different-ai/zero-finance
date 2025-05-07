'use client';

import { useState } from 'react';
import { type Address, encodeFunctionData, Hex, encodeAbiParameters } from 'viem';
import { toast } from 'sonner';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { useEarnState } from '../hooks/use-earn-state';
import {
  AUTO_EARN_MODULE_ADDRESS,
  PADDED_CONFIG_HASH,
  CONFIG_HASH_DECIMAL,
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
    inputs: [{ name: 'data', type: 'bytes' }],
  },
] as const;

export function EnableEarnCard({ safeAddress }: EnableEarnCardProps) {
  const [txHashEnableModule, setTxHashEnableModule] = useState<Hex | null>(null);
  const [txHashInstallConfig, setTxHashInstallConfig] = useState<Hex | null>(null);
  
  const [isProcessingEnableSafeModule, setIsProcessingEnableSafeModule] = useState(false);
  const [isProcessingInstallConfig, setIsProcessingInstallConfig] = useState(false);
  const [isWaitingForOnChainConfirmation, setIsWaitingForOnChainConfirmation] = useState(false);

  const { client: smartClient } = useSmartWallets();

  // 1. Check if module is enabled on Safe contract (on-chain)
  const { 
    data: onChainModuleStatus, 
    isLoading: isLoadingOnChainModuleStatus,
    isError: isOnChainModuleStatusError,
    refetch: refetchOnChainModuleStatus
  } = api.earn.isSafeModuleActivelyEnabled.useQuery(
    { safeAddress: safeAddress!, moduleAddress: AUTO_EARN_MODULE_ADDRESS },
    { 
      enabled: !!safeAddress,
      staleTime: 5000, // Refetch on-chain status occasionally
    }
  );
  const isModuleEnabledOnSafeContract = onChainModuleStatus?.isEnabled || false;

  // 2. Check if configuration is installed & recorded in DB (app-level status)
  const { 
    data: dbEarnStatus, 
    isLoading: isLoadingDbEarnStatus,
    isError: isDbEarnStatusError,
    refetch: refetchDbEarnStatus
  } = api.earn.status.useQuery(
    { safeAddress: safeAddress! },
    { 
      enabled: !!safeAddress,
    }
  );

  // 3. Query for on-chain initialization status (used for polling after install tx)
  const { 
    data: earnModuleOnChainInitStatus, 
    refetch: refetchEarnModuleOnChainInitStatus,
    isFetching: isFetchingEarnModuleOnChainInitStatus,
  } = api.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: safeAddress! }, 
    { 
      enabled: false, // Initially disable, enable manually for polling
      refetchInterval: false, // Disable automatic refetching
    }
  );

  const isConfigInstalledAndRecordedInDB = earnModuleOnChainInitStatus?.isInitializedOnChain || false;
  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);

  const recordInstallMutation = api.earn.recordInstall.useMutation({
    onSuccess: async () => {
      toast.success('Earn module configuration installed and recorded!');
      await refetchDbEarnStatus(); // Refetch DB status
      // Optionally refetch on-chain status too, though it might not change here
      await refetchOnChainModuleStatus(); 
      setTxHashInstallConfig(null);
    },
    onError: (error) => {
      toast.error(`Failed to record installation: ${error.message}`);
    },
    onSettled: () => {
      setIsProcessingInstallConfig(false);
    },
  });

  const handleEnableSafeModule = async () => {
    if (!safeAddress || !isRelayReady || !smartClient?.account) {
      toast.error('Safe address not available or relay not ready.');
      return;
    }
    setIsProcessingEnableSafeModule(true);
    setTxHashEnableModule(null);

    try {
      const txEnableModule = [
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

      toast.info('Submitting: Enable Safe Module transaction...', {
        id: 'enable-safe-module-tx',
      });
      const userOpHashEnable = await sendTxViaRelay(txEnableModule, 300_000n);
      setTxHashEnableModule(userOpHashEnable);
      toast.success(
        'Enable Safe Module transaction submitted. Waiting for confirmation...',
        {
          description: `UserOp: ${userOpHashEnable}`,
          id: 'enable-safe-module-tx',
        },
      );
      
      // Wait for a bit then refetch on-chain status
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await refetchOnChainModuleStatus();
      toast.info('On-chain module status updated.');

    } catch (error: any) {
      console.error('Failed to send Enable Safe Module transaction:', error);
      toast.error(
        `Transaction failed: ${error.shortMessage || error.message || 'Unknown error'}`,
      );
      setTxHashEnableModule(null);
    } finally {
      setIsProcessingEnableSafeModule(false);
    }
  };

  const handleInstallConfiguration = async () => {
    if (!safeAddress || !isRelayReady || !smartClient?.account || !isModuleEnabledOnSafeContract) {
      toast.error('Cannot install: Safe address not available, relay not ready, or module not enabled on Safe.');
      return;
    }
    setIsProcessingInstallConfig(true);
    setTxHashInstallConfig(null);
    setIsWaitingForOnChainConfirmation(false); // Reset this state
    
    try {
      const onInstallArgBytes = encodeAbiParameters(
        [{ type: 'uint256' }],
        [BigInt(CONFIG_HASH_DECIMAL)],
      );

      const txOnInstall = [
        {
          to: AUTO_EARN_MODULE_ADDRESS,
          value: '0',
          data: encodeFunctionData({
            abi: EARN_MODULE_ABI_ON_INSTALL,
            functionName: 'onInstall',
            args: [onInstallArgBytes],
          }),
          operation: 0, // CALL (module needs its own storage context)
        },
      ];

      toast.info('Submitting: Install Module Configuration transaction...', {
        id: 'install-config-tx',
      });
      const userOpHashInstall = await sendTxViaRelay(txOnInstall, 300_000n);
      setTxHashInstallConfig(userOpHashInstall);
      toast.success(
        'Install Module Configuration transaction submitted. Waiting for confirmation and recording...',
        {
          description: `UserOp: ${userOpHashInstall}`,
          id: 'install-config-tx',
        },
      );

      // After the transaction is submitted, start polling for on-chain confirmation
      setIsWaitingForOnChainConfirmation(true);
      const pollInterval = setInterval(async () => {
        try {
          console.log('Polling for on-chain initialization status...');
          const { data: status, isError: pollError } = await refetchEarnModuleOnChainInitStatus();
          if (pollError) {
            console.error('Polling error:', status);
            // Optionally stop polling on error or let it continue
            return;
          }
          if (status?.isInitializedOnChain) {
            console.log('On-chain initialization confirmed!');
            clearInterval(pollInterval);
            setIsWaitingForOnChainConfirmation(false);
            toast.success('Module configuration confirmed on-chain. Recording...');
            recordInstallMutation.mutate({ safeAddress });
          } else {
            console.log('Still waiting for on-chain confirmation...', status);
          }
        } catch (e) {
          console.error('Exception during polling:', e);
          // Optionally stop polling on major exception
        }
      }, 5000); // Poll every 5 seconds

      // Set a timeout to stop polling after a certain duration (e.g., 2 minutes)
      setTimeout(() => {
        if (isWaitingForOnChainConfirmation) { // Check if still waiting
          clearInterval(pollInterval);
          setIsWaitingForOnChainConfirmation(false);
          setIsProcessingInstallConfig(false); // Allow user to retry if it timed out
          toast.error('On-chain confirmation timed out. Please check the transaction on a block explorer and try installing again if necessary.');
          setTxHashInstallConfig(null); // Clear hash as it might be stuck or failed
        }
      }, 120000); // 2 minutes timeout

    } catch (error: any) {
      console.error('Failed to send Install Module Configuration transaction:', error);
      toast.error(
        `Transaction failed: ${error.shortMessage || error.message || 'Unknown error'}`,
      );
      setIsProcessingInstallConfig(false); // Also set to false on direct error
      setTxHashInstallConfig(null);
    } 
    // Note: setIsProcessingInstallConfig(false) is handled by recordInstallMutation.onSettled
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

  if (isLoadingOnChainModuleStatus || isLoadingDbEarnStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3 mr-2" />
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  if (isOnChainModuleStatusError || isDbEarnStatusError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading earn module status.</p>
          {isOnChainModuleStatusError && <p className="text-xs text-red-400">On-chain module status check failed.</p>}
          {isDbEarnStatusError && <p className="text-xs text-red-400">DB status check failed.</p>}
          <Button onClick={() => {
            if (isOnChainModuleStatusError) refetchOnChainModuleStatus();
            if (isDbEarnStatusError) refetchDbEarnStatus();
          }} className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        {isConfigInstalledAndRecordedInDB && (
          <Badge variant="default" className="bg-green-500 text-white">
            Auto-Earn Fully Active
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Enable the Auto-Earn module in two steps: 
          1. Enable the module on your Safe. 
          2. Install the specific earning configuration on the module.
        </p>
        {isConfigInstalledAndRecordedInDB ? (
          <p>
            Your Safe is set up to automatically earn yield via the Morpho Seamless Vault.
          </p>
        ) : (
          <p>
            Follow the steps below to activate auto-earning.
          </p>
        )}

        {txHashEnableModule && (
          <div className="mt-2">
            <p className="text-sm">Enable Safe Module Tx:</p>
            <a
              href={`https://basescan.org/tx/${txHashEnableModule}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              {txHashEnableModule} (View UserOp on Basescan)
            </a>
          </div>
        )}
        {txHashInstallConfig && (
          <div className="mt-2">
            <p className="text-sm">Install Config Tx:</p>
            <a
              href={`https://basescan.org/tx/${txHashInstallConfig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              {txHashInstallConfig} (View UserOp on Basescan)
            </a>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="w-full">
          <Button
            onClick={handleEnableSafeModule}
            disabled={
              !isRelayReady || 
              isProcessingEnableSafeModule || 
              isModuleEnabledOnSafeContract ||
              isLoadingOnChainModuleStatus
            }
            className="w-full md:w-auto"
          >
            {isLoadingOnChainModuleStatus ? 'Checking Safe Module...' :
             isModuleEnabledOnSafeContract ? '1. Safe Module Enabled ✓' :
             isProcessingEnableSafeModule ? 'Enabling Safe Module...' : 
             '1. Enable Safe Module on Safe'}
          </Button>
          {!isModuleEnabledOnSafeContract && !isLoadingOnChainModuleStatus && (
            <p className="text-xs text-muted-foreground mt-1">This action enables the Auto-Earn contract as a module on your Safe.</p>
          )}
           {isModuleEnabledOnSafeContract && (
            <p className="text-xs text-green-600 mt-1">The Auto-Earn contract is enabled as a module on your Safe.</p>
          )}
        </div>

        <div className="w-full">
          <Button
            onClick={handleInstallConfiguration}
            disabled={
              !isRelayReady || 
              !isModuleEnabledOnSafeContract || // Prerequisite
              isProcessingInstallConfig || 
              recordInstallMutation.isPending ||
              isConfigInstalledAndRecordedInDB ||
              isLoadingDbEarnStatus || isLoadingOnChainModuleStatus
            }
            className="w-full md:w-auto"
          >
            {isLoadingDbEarnStatus || isLoadingOnChainModuleStatus ? 'Checking Status...' :
             !isModuleEnabledOnSafeContract ? '1. Enable Safe Module First' :
             isConfigInstalledAndRecordedInDB ? '2. Configuration Installed ✓' :
             isWaitingForOnChainConfirmation ? 'Confirming On-Chain...' :
             isProcessingInstallConfig || recordInstallMutation.isPending ? 'Installing Configuration...' :
             '2. Install Module Configuration'}
          </Button>
          {isModuleEnabledOnSafeContract && !isConfigInstalledAndRecordedInDB && !isLoadingDbEarnStatus && (
             <p className="text-xs text-muted-foreground mt-1">This action calls `onInstall` on the Auto-Earn module with the default configuration.</p>
          )}
          {isConfigInstalledAndRecordedInDB && (
            <p className="text-xs text-green-600 mt-1">The earning configuration is active.</p>
          )}
        </div>

        {!isConfigInstalledAndRecordedInDB && (
          <CardDescription className="text-xs text-gray-500 mt-2">
            These actions involve on-chain transactions. You can remove the module or change configurations later.
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  );
}
