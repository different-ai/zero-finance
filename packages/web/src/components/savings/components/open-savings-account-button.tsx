'use client';

import { useState } from 'react';
import {
  type Address,
  Hex,
  encodeFunctionData,
  encodeAbiParameters,
} from 'viem';
import { toast } from 'sonner';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { api } from '@/trpc/react';
import {
  AUTO_EARN_MODULE_ADDRESS,
  CONFIG_HASH_DECIMAL,
} from '@/lib/earn-module-constants';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Wallet } from 'lucide-react';

// ABIs
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

interface OpenSavingsAccountButtonProps {
  safeAddress?: Address;
  onSuccess?: () => void;
}

export function OpenSavingsAccountButton({
  safeAddress,
  onSuccess,
}: OpenSavingsAccountButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'enabling-module' | 'installing-config' | 'complete'
  >('idle');

  const { client: smartClient } = useSmartWallets();
  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);

  // Check module status
  const {
    data: moduleStatus,
    isLoading: isLoadingModuleStatus,
    refetch: refetchModuleStatus,
  } = api.earn.isSafeModuleActivelyEnabled.useQuery(
    { safeAddress: safeAddress!, moduleAddress: AUTO_EARN_MODULE_ADDRESS },
    { enabled: !!safeAddress, staleTime: 5_000 },
  );
  const isModuleEnabled = moduleStatus?.isEnabled || false;

  // Check config status
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
  const setAutoEarnPctMutation = api.earn.setAutoEarnPct.useMutation();

  const isFullySetUp = isModuleEnabled && isConfigInstalled;
  const isLoading = isLoadingModuleStatus || isLoadingInitStatus;

  const handleOpenAccount = async () => {
    if (!safeAddress || !isRelayReady || !smartClient?.account) {
      toast.error(
        'Prerequisites not met. Please ensure your account is properly set up.',
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Enable module if needed
      if (!isModuleEnabled) {
        setCurrentStep('enabling-module');

        const enableTx = [
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

        toast.info('Step 1/2: Enabling savings module...', {
          id: 'open-savings-account',
        });
        const enableUserOpHash = await sendTxViaRelay(enableTx, 300_000n);

        toast.info('Waiting for module to be enabled...', {
          id: 'open-savings-account',
        });

        // Poll for module enablement
        let moduleEnabledOnChain = false;
        const moduleStart = Date.now();
        while (Date.now() - moduleStart < 60_000) {
          await new Promise((r) => setTimeout(r, 3_000));
          const { data } = await refetchModuleStatus();
          if (data?.isEnabled) {
            moduleEnabledOnChain = true;
            break;
          }
        }

        if (!moduleEnabledOnChain) {
          throw new Error('Module enablement timed out');
        }
      }

      // Step 2: Install config if needed
      if (!isConfigInstalled) {
        setCurrentStep('installing-config');

        const onInstallArgBytes = encodeAbiParameters(
          [{ type: 'uint256' }],
          [BigInt(CONFIG_HASH_DECIMAL)],
        );
        const configTx = [
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

        toast.info('Step 2/2: Configuring savings account...', {
          id: 'open-savings-account',
        });
        const configUserOpHash = await sendTxViaRelay(configTx, 300_000n);

        toast.info('Finalizing account setup...', {
          id: 'open-savings-account',
        });

        // Poll for config installation
        let configInstalledOnChain = false;
        const configStart = Date.now();
        while (Date.now() - configStart < 60_000) {
          await new Promise((r) => setTimeout(r, 3_000));
          const { data } = await refetchInitStatus();
          if (data?.isInitializedOnChain) {
            configInstalledOnChain = true;
            break;
          }
        }

        if (!configInstalledOnChain) {
          throw new Error('Configuration installation timed out');
        }

        // Record installation
        await recordInstallMutation.mutateAsync({ safeAddress });
      }

      // Set the auto-earn percentage to 100%
      try {
        await setAutoEarnPctMutation.mutateAsync({
          safeAddress: safeAddress as string,
          pct: 100,
        });
        toast.success('Auto-save set to 100% of incoming deposits', {
          id: 'auto-earn-percentage',
        });
      } catch (error) {
        console.error('Failed to set auto-earn percentage:', error);
        // Don't fail the whole process if this fails, just log it
      }

      setCurrentStep('complete');
      toast.success('Savings account opened successfully!', {
        id: 'open-savings-account',
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Failed to open savings account:', error);
      toast.error(error.message || 'Failed to open savings account', {
        id: 'open-savings-account',
      });
    } finally {
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  };

  // Button text based on state
  const getButtonText = () => {
    if (isLoading) return 'Checking account status...';
    if (isFullySetUp) return 'Savings Account Active';
    if (currentStep === 'enabling-module') return 'Enabling savings module...';
    if (currentStep === 'installing-config') return 'Configuring account...';
    if (isProcessing) return 'Opening account...';
    return 'Open your savings account';
  };

  // Button icon based on state
  const getButtonIcon = () => {
    if (isLoading || isProcessing)
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    if (isFullySetUp) return <CheckCircle className="mr-2 h-4 w-4" />;
    return <Wallet className="mr-2 h-4 w-4" />;
  };

  return (
    <Button
      onClick={handleOpenAccount}
      disabled={isLoading || isProcessing || isFullySetUp || !isRelayReady}
      size="lg"
      className="w-full bg-primary hover:bg-primary/90 text-white"
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
}
