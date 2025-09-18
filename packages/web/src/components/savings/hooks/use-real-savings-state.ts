'use client';

import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import type { SavingsState, VaultTransaction } from '../lib/types';
import { ALLOC_KEY, FIRST_RUN_KEY } from '../lib/local-storage-keys';

export function useRealSavingsState(
  safeAddress: string | null,
  initialMainBalance: number,
) {
  const [allocation, setAllocation] = useState<number>(0);
  const [savingsState, setSavingsState] = useState<SavingsState | null>(null);
  const [mainBalance] = useState(initialMainBalance);

  // Fetch auto-earn config
  const { data: config, isLoading: configLoading } =
    trpc.earn.getAutoEarnConfig.useQuery(
      { safeAddress: safeAddress! },
      { enabled: !!safeAddress },
    );

  // Fetch full state
  const { data: state, isLoading: stateLoading } = trpc.earn.getState.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress },
  );

  // Fetch recent transactions
  const { data: recentDeposits, isLoading: depositsLoading } =
    trpc.earn.getRecentEarnDeposits.useQuery(
      { safeAddress: safeAddress!, limit: 5 },
      { enabled: !!safeAddress },
    );

  // Mutations
  const setAutoEarnPct = trpc.earn.setAutoEarnPct.useMutation();
  const disableAutoEarn = trpc.earn.disableAutoEarn.useMutation();

  const isLoading = configLoading || stateLoading || depositsLoading;

  useEffect(() => {
    if (safeAddress && config && state) {
      const serverAlloc = config.pct || 0;
      setAllocation(serverAlloc);

      // Transform recent deposits to VaultTransaction format
      const recentTransactions: VaultTransaction[] = (recentDeposits || []).map(
        (deposit) => ({
          id: deposit.id,
          type: deposit.type as 'deposit',
          amount: deposit.amount, // This is already the original deposit amount
          timestamp: deposit.timestamp,
          source: deposit.source,
          txHash: deposit.txHash,
          skimmedAmount: deposit.skimmedAmount, // This is already the saved amount
        }),
      );

      setSavingsState({
        enabled: serverAlloc > 0,
        allocation: serverAlloc,
        apy: 8.0, // Morpho Gauntlet USDC Frontier APY
        firstEnabledAt: config.lastTrigger
          ? new Date(config.lastTrigger).getTime()
          : null,
        currentVaultBalance: 0, // We can add a separate vault balance query if needed
        recentTransactions,
      });

      // Sync localStorage
      localStorage.setItem(ALLOC_KEY(safeAddress), serverAlloc.toString());
      if (serverAlloc > 0) {
        localStorage.setItem(FIRST_RUN_KEY(safeAddress), '1');
      }
    }
  }, [safeAddress, config, state, recentDeposits]);

  const updateSavingsState = useCallback(
    async (newState: Partial<SavingsState>) => {
      if (!safeAddress) return;

      const newAllocation = newState.allocation ?? allocation;

      try {
        if (newAllocation === 0) {
          // Disable auto-earn
          await disableAutoEarn.mutateAsync({ safeAddress });
        } else {
          // Set new percentage
          await setAutoEarnPct.mutateAsync({
            safeAddress,
            pct: newAllocation,
          });
        }

        // Update local state optimistically
        setSavingsState((prev) => {
          if (!prev) return newState as SavingsState;
          const updated = { ...prev, ...newState } as SavingsState;

          if (newState.allocation !== undefined) {
            setAllocation(newState.allocation);
            localStorage.setItem(
              ALLOC_KEY(safeAddress),
              newState.allocation.toString(),
            );
          }

          if (newState.allocation && newState.allocation > 0) {
            localStorage.setItem(FIRST_RUN_KEY(safeAddress), '1');
          }

          return updated;
        });
      } catch (error) {
        console.error('Failed to update savings state:', error);
        throw error;
      }
    },
    [safeAddress, allocation, setAutoEarnPct, disableAutoEarn],
  );

  return {
    savingsState,
    isLoading,
    mainBalance,
    optimisticAllocation: allocation,
    updateSavingsState,
  };
}
