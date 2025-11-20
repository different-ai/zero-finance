'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/trpc/react';
import { useSmartWallet } from './use-smart-wallet';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe, {
  type SafeAccountConfig,
  type SafeDeploymentConfig,
} from '@safe-global/protocol-kit';
import { base } from 'viem/chains';
import { type Address, encodeAbiParameters, encodeFunctionData } from 'viem';
import { createPublicClient, http } from 'viem';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import {
  AUTO_EARN_MODULE_ADDRESS,
  CONFIG_HASH_DECIMAL,
} from '@/lib/earn-module-constants';
import { relaySafeTx, buildSafeTx } from '@/lib/sponsor-tx/core';

const SAFE_VERSION = '1.4.1';

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

type SetupStep = 'smartWallet' | 'primarySafe' | 'savings';

export type StepStatus = 'pending' | 'in_progress' | 'success' | 'error';

export interface SetupProgressItem {
  step: SetupStep;
  label: string;
  status: StepStatus;
  detail?: string;
}

interface SetupResult {
  safeAddress: Address;
}

const INITIAL_PROGRESS: SetupProgressItem[] = [
  {
    step: 'smartWallet',
    label: 'Setting up secure authentication',
    status: 'pending',
  },
  {
    step: 'primarySafe',
    label: 'Creating your primary account',
    status: 'pending',
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitUntilDeployed(addr: Address) {
  const publicClient = createPublicClient({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chain: base as any,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL as string),
  });

  for (let i = 0; i < 30; i++) {
    const code = await publicClient.getBytecode({ address: addr });
    if (code && code !== '0x') return;
    await sleep(4_000);
  }

  throw new Error('Timed out waiting for Safe deployment');
}

export function usePrimaryAccountSetup() {
  const utils = api.useUtils();
  const { hasSmartWallet, smartWalletAddress, createSmartWallet } =
    useSmartWallet();
  const { client: smartWalletClient } = useSmartWallets();

  const completeOnboardingMutation =
    api.onboarding.completeOnboarding.useMutation();
  const recordInstallMutation = api.earn.recordInstall.useMutation();
  const setAutoEarnPctMutation = api.earn.setAutoEarnPct.useMutation();

  const [progress, setProgress] = useState<SetupProgressItem[]>(() =>
    INITIAL_PROGRESS.map((item) => ({ ...item })),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SetupResult | null>(null);

  const latestSmartWalletAddressRef = useRef<Address | null>(
    smartWalletAddress,
  );

  useEffect(() => {
    latestSmartWalletAddressRef.current = smartWalletAddress;
  }, [smartWalletAddress]);

  const updateStep = useCallback(
    (step: SetupStep, updates: Partial<SetupProgressItem>) => {
      setProgress((prev) =>
        prev.map((item) =>
          item.step === step
            ? {
                ...item,
                ...updates,
              }
            : item,
        ),
      );
    },
    [],
  );

  const reset = useCallback(() => {
    setProgress(INITIAL_PROGRESS.map((item) => ({ ...item })));
    setIsRunning(false);
    setError(null);
    setResult(null);
  }, []);

  const ensureSmartWallet = useCallback(async () => {
    updateStep('smartWallet', {
      status: 'in_progress',
      detail: undefined,
    });

    if (hasSmartWallet && latestSmartWalletAddressRef.current) {
      updateStep('smartWallet', { status: 'success' });
      return latestSmartWalletAddressRef.current;
    }

    await createSmartWallet();

    const timeoutMs = 60_000;
    const intervalMs = 2_000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      if (latestSmartWalletAddressRef.current) {
        updateStep('smartWallet', { status: 'success' });
        return latestSmartWalletAddressRef.current;
      }
      await sleep(intervalMs);
    }

    throw new Error('Timed out while setting up authentication.');
  }, [createSmartWallet, hasSmartWallet, updateStep]);

  const ensurePrimarySafe = useCallback(
    async (ownerAddress: Address) => {
      updateStep('primarySafe', {
        status: 'in_progress',
        detail: undefined,
      });

      const existingSafe =
        await utils.settings.userSafes.getPrimarySafeAddress.fetch();

      if (existingSafe) {
        updateStep('primarySafe', { status: 'success' });
        return existingSafe as Address;
      }

      if (!smartWalletClient) {
        throw new Error('Unable to create your account at this time.');
      }

      const safeAccountConfig: SafeAccountConfig = {
        owners: [ownerAddress],
        threshold: 1,
      };

      const safeDeploymentConfig: SafeDeploymentConfig = {
        saltNonce: Date.now().toString(),
        safeVersion: SAFE_VERSION,
      };

      const protocolKit = await Safe.init({
        predictedSafe: {
          safeAccountConfig,
          safeDeploymentConfig,
        },
        provider: process.env.NEXT_PUBLIC_BASE_RPC_URL as string,
      });

      const predictedSafeAddress = (await protocolKit.getAddress()) as Address;
      const deploymentTransaction =
        await protocolKit.createSafeDeploymentTransaction();

      await smartWalletClient.sendTransaction(
        {
          to: deploymentTransaction.to as Address,
          value: BigInt(deploymentTransaction.value || '0'),
          data: deploymentTransaction.data as `0x${string}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chain: base as any,
        },
        {
          uiOptions: {
            showWalletUIs: false,
          },
        },
      );

      await waitUntilDeployed(predictedSafeAddress);

      await completeOnboardingMutation.mutateAsync({
        primarySafeAddress: predictedSafeAddress,
      });

      updateStep('primarySafe', { status: 'success' });
      return predictedSafeAddress;
    },
    [
      completeOnboardingMutation,
      smartWalletClient,
      updateStep,
      utils.settings.userSafes.getPrimarySafeAddress,
    ],
  );

  const waitForSmartWalletClient = useCallback(async () => {
    const timeoutMs = 60_000;
    const intervalMs = 2_000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const accountAddress = smartWalletClient?.account?.address as
        | Address
        | undefined;

      if (smartWalletClient && accountAddress) {
        return {
          client: smartWalletClient,
          signer: accountAddress,
        };
      }

      await sleep(intervalMs);
    }

    throw new Error('Authentication session not ready.');
  }, [smartWalletClient]);

  const sendViaRelay = useCallback(
    async (
      txs: MetaTransactionData[],
      safeAddress: Address,
      gas: bigint = 300_000n,
    ) => {
      const { client, signer } = await waitForSmartWalletClient();
      const safeTx = await buildSafeTx(txs, { safeAddress, gas });
      return relaySafeTx(safeTx, signer, client, safeAddress);
    },
    [waitForSmartWalletClient],
  );

  // NOTE: activateSavings is preserved for future use with FluidKey integration
  // Currently not called during onboarding - users can manually deposit/withdraw
  // without auto-earn module activation
  const activateSavings = useCallback(
    async (safeAddress: Address) => {
      updateStep('savings', {
        status: 'in_progress',
        detail: 'Checking existing savings configuration...',
      });

      const [moduleStatus, initStatus] = await Promise.all([
        utils.earn.isSafeModuleActivelyEnabled.fetch({
          safeAddress,
          moduleAddress: AUTO_EARN_MODULE_ADDRESS,
        }),
        utils.earn.getEarnModuleOnChainInitializationStatus.fetch({
          safeAddress,
        }),
      ]);

      let moduleEnabled = moduleStatus?.isEnabled ?? false;
      let configInstalled = initStatus?.isInitializedOnChain ?? false;

      if (!moduleEnabled) {
        updateStep('savings', {
          status: 'in_progress',
          detail: 'Enabling the savings module...',
        });

        const enableTx: MetaTransactionData[] = [
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

        await sendViaRelay(enableTx, safeAddress);

        const start = Date.now();
        const timeoutMs = 60_000;
        while (Date.now() - start < timeoutMs) {
          await sleep(3_000);
          const status = await utils.earn.isSafeModuleActivelyEnabled.fetch({
            safeAddress,
            moduleAddress: AUTO_EARN_MODULE_ADDRESS,
          });
          if (status?.isEnabled) {
            moduleEnabled = true;
            break;
          }
        }

        if (!moduleEnabled) {
          throw new Error('Module enablement timed out.');
        }
      }

      if (!configInstalled) {
        updateStep('savings', {
          status: 'in_progress',
          detail: 'Configuring auto-earn savings...',
        });

        const onInstallArgBytes = encodeAbiParameters(
          [{ type: 'uint256' }],
          [BigInt(CONFIG_HASH_DECIMAL)],
        );

        const configTx: MetaTransactionData[] = [
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

        await sendViaRelay(configTx, safeAddress);

        const start = Date.now();
        const timeoutMs = 60_000;
        while (Date.now() - start < timeoutMs) {
          await sleep(3_000);
          const status =
            await utils.earn.getEarnModuleOnChainInitializationStatus.fetch({
              safeAddress,
            });
          if (status?.isInitializedOnChain) {
            configInstalled = true;
            break;
          }
        }

        if (!configInstalled) {
          throw new Error('Savings configuration timed out.');
        }

        await recordInstallMutation.mutateAsync({ safeAddress });
      }

      try {
        await setAutoEarnPctMutation.mutateAsync({
          safeAddress,
          pct: 100,
        });
      } catch (err) {
        console.error('Auto-earn configuration failed (non-fatal):', err);
      }

      updateStep('savings', { status: 'success', detail: undefined });
    },
    [
      recordInstallMutation,
      sendViaRelay,
      setAutoEarnPctMutation,
      updateStep,
      utils.earn.getEarnModuleOnChainInitializationStatus,
      utils.earn.isSafeModuleActivelyEnabled,
    ],
  );

  const runSetup = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setProgress(INITIAL_PROGRESS.map((item) => ({ ...item })));
    setResult(null);

    try {
      const ownerAddress = await ensureSmartWallet();
      const safeAddress = await ensurePrimarySafe(ownerAddress);

      // Skip auto-earn module activation for now
      // await activateSavings(safeAddress);

      setResult({ safeAddress });
      return { safeAddress };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error during setup.';
      setError(message);

      setProgress((prev) =>
        prev.map((item) =>
          item.status === 'in_progress'
            ? { ...item, status: 'error', detail: message }
            : item,
        ),
      );

      throw err;
    } finally {
      setIsRunning(false);
    }
  }, [ensurePrimarySafe, ensureSmartWallet]);

  return {
    progress,
    isRunning,
    error,
    result,
    runSetup,
    reset,
  };
}
