import { useDemoMode } from '@/context/demo-mode-context';
import { useMemo } from 'react';

// Override for useRealSavingsState hook
export function useDemoSavingsState(realState: any, isLoading: boolean) {
  const { isDemoMode, demoStep, demoSavingsBalance } = useDemoMode();

  const demoState = useMemo(() => {
    if (!isDemoMode) return null;

    // Before step 5, savings not enabled
    if (demoStep < 5) {
      return {
        enabled: false,
        allocation: 0,
        apy: 8.0,
        totalSaved: 0,
        totalEarned: 0,
        currentBalance: 0,
        vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738', // Seamless vault
      };
    }

    // Step 5+: Savings enabled with 10% allocation
    const dailyYield = (demoSavingsBalance * 0.08) / 365;
    const accumulatedYield = demoStep >= 6 ? dailyYield : 0;

    return {
      enabled: true,
      allocation: 10, // 10% auto-save
      apy: 8.0,
      totalSaved: demoSavingsBalance,
      totalEarned: accumulatedYield,
      currentBalance: demoSavingsBalance + accumulatedYield,
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
    };
  }, [isDemoMode, demoStep, demoSavingsBalance]);

  if (isDemoMode && demoState) {
    return {
      savingsState: demoState,
      isLoading: false,
    };
  }

  return {
    savingsState: realState,
    isLoading,
  };
}

// Override for earn module initialization status
export function useDemoEarnModuleStatus(realStatus: any, isLoading: boolean) {
  const { isDemoMode, demoStep } = useDemoMode();

  if (isDemoMode) {
    return {
      data: {
        isInitializedOnChain: demoStep >= 5, // Initialized at step 5
      },
      isLoading: false,
      refetch: () => {},
    };
  }

  return {
    data: realStatus,
    isLoading,
    refetch: realStatus?.refetch || (() => {}),
  };
}

// Override for vault stats
export function useDemoVaultStats() {
  const { isDemoMode, demoStep, demoSavingsBalance } = useDemoMode();

  if (!isDemoMode) return null;

  if (demoStep < 5) {
    return [];
  }

  // Calculate daily yield
  const dailyYield = (demoSavingsBalance * 0.08) / 365;
  const yieldAmount = demoStep >= 6 ? dailyYield * 1e6 : 0; // Convert to USDC decimals

  return [
    {
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      vaultName: 'Seamless USDC',
      apy: 8.0,
      netApy: 8.0,
      tvl: 25000000n,
      yield: BigInt(Math.floor(yieldAmount)),
    },
  ];
}

// Override for user positions
export function useDemoUserPositions() {
  const { isDemoMode, demoStep, demoSavingsBalance } = useDemoMode();

  if (!isDemoMode) return null;

  const baseVaults = [
    {
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      vaultName: 'Seamless USDC',
      assetsUsd: demoStep >= 5 ? demoSavingsBalance : 0,
    },
    {
      vaultAddress: '0xTreasuryBills',
      vaultName: 'Treasury Bills',
      assetsUsd: 0,
    },
    {
      vaultAddress: '0xBlueChipLending',
      vaultName: 'Blue Chip Lending',
      assetsUsd: 0,
    },
  ];

  return baseVaults;
}

// Override for recent deposits
export function useDemoRecentDeposits() {
  const { isDemoMode, demoStep } = useDemoMode();

  if (!isDemoMode || demoStep < 5) return [];

  return [
    {
      id: 'demo-deposit-1',
      amount: 200000, // $200k
      skimmedAmount: 200000,
      timestamp: Date.now() - 1800000, // 30 mins ago
      status: 'completed',
      transactionHash: '0xdemo123',
    },
  ];
}

// Override for recent withdrawals
export function useDemoRecentWithdrawals() {
  const { isDemoMode, demoStep } = useDemoMode();

  if (!isDemoMode || demoStep < 7) return [];

  return [
    {
      id: 'demo-withdrawal-1',
      amount: 50000, // $50k
      timestamp: Date.now() - 900000, // 15 mins ago
      status: 'pending',
      transactionHash: '0xdemo456',
    },
  ];
}
