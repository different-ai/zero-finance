'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SavingsState, VaultTransaction } from '../lib/types';
import { ALLOC_KEY, FIRST_RUN_KEY } from '../lib/local-storage-keys';

const mockGetState = async (safeAddress: string): Promise<SavingsState> => {
  console.log(`Mock API: Fetching state for ${safeAddress}`);
  await new Promise((resolve) => setTimeout(resolve, 600));
  const storedAlloc = Number(localStorage.getItem(ALLOC_KEY(safeAddress))) || 0;
  const wizardDone = localStorage.getItem(FIRST_RUN_KEY(safeAddress)) === '1';
  const backendAllocation = storedAlloc;
  const backendEnabled = backendAllocation > 0;
  const mockVaultBalance =
    wizardDone && backendEnabled ? Math.random() * 5000 + 500 : 0;
  const mockTransactions: VaultTransaction[] =
    wizardDone && backendEnabled
      ? [
          {
            id: 'tx1',
            type: 'deposit',
            amount: 1200,
            skimmedAmount: 240,
            timestamp: Date.now() - 86400000 * 1,
            source: 'Payroll',
          },
          {
            id: 'tx2',
            type: 'deposit',
            amount: 350,
            skimmedAmount: 70,
            timestamp: Date.now() - 86400000 * 2,
            source: 'Refund',
          },
          {
            id: 'tx3',
            type: 'deposit',
            amount: 59.99,
            skimmedAmount: 11.99,
            timestamp: Date.now() - 86400000 * 3,
            source: 'Stripe',
          },
          {
            id: 'tx4',
            type: 'manual_deposit',
            amount: 500,
            timestamp: Date.now() - 86400000 * 4,
            source: 'Manual Top-up',
          },
        ]
      : [];

  return {
    enabled: backendEnabled,
    allocation: backendAllocation,
    apy: 8.0,
    firstEnabledAt:
      wizardDone && backendEnabled ? Date.now() - 86400000 * 7 : null,
    currentVaultBalance: mockVaultBalance,
    recentTransactions: mockTransactions.slice(0, 3),
  };
};

export function useOptimisticSavingsState(
  safeAddress: string | null,
  initialMainBalance: number,
) {
  const [allocation, setAllocation] = useState<number>(0);
  const [savingsState, setSavingsState] = useState<SavingsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainBalance] = useState(initialMainBalance);

  useEffect(() => {
    if (safeAddress) {
      const lsAlloc = Number(localStorage.getItem(ALLOC_KEY(safeAddress))) || 0;
      setAllocation(lsAlloc);
      const wizardDone =
        localStorage.getItem(FIRST_RUN_KEY(safeAddress)) === '1';
      setSavingsState({
        enabled: lsAlloc > 0,
        allocation: lsAlloc,
        apy: 8.0,
        firstEnabledAt: wizardDone && lsAlloc > 0 ? Date.now() - 100000 : null,
        currentVaultBalance: 0,
        recentTransactions: [],
      });
      setIsLoading(false);

      mockGetState(safeAddress)
        .then((backendState) => {
          setSavingsState(backendState);
          if (backendState.allocation !== lsAlloc) {
            setAllocation(backendState.allocation);
            localStorage.setItem(
              ALLOC_KEY(safeAddress),
              backendState.allocation.toString(),
            );
          }
          if (
            backendState.firstEnabledAt &&
            localStorage.getItem(FIRST_RUN_KEY(safeAddress)) !== '1'
          ) {
            localStorage.setItem(FIRST_RUN_KEY(safeAddress), '1');
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch savings state:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [safeAddress]);

  const updateSavingsState = useCallback(
    (newState: Partial<SavingsState>) => {
      setSavingsState((prev: SavingsState | null) => {
        if (!prev) return newState as SavingsState;
        const updated = { ...prev, ...newState } as SavingsState;
        if (newState.allocation !== undefined && safeAddress) {
          setAllocation(newState.allocation);
          localStorage.setItem(
            ALLOC_KEY(safeAddress),
            newState.allocation.toString(),
          );
        }
        if (
          newState.firstEnabledAt !== undefined &&
          safeAddress &&
          localStorage.getItem(FIRST_RUN_KEY(safeAddress)) !== '1'
        ) {
          localStorage.setItem(FIRST_RUN_KEY(safeAddress), '1');
        }
        return updated;
      });
    },
    [safeAddress],
  );

  return {
    savingsState,
    isLoading,
    mainBalance,
    optimisticAllocation: allocation,
    updateSavingsState,
  };
}
