import { useDemoMode } from '@/context/demo-mode-context';
import { useMemo } from 'react';

// Override for useRealSavingsState hook
export function useDemoSavingsState(realState: any, isLoading: boolean) {
  const { isDemoMode, demoStep, demoSavingsBalance } = useDemoMode();

  const demoState = useMemo(() => {
    if (!isDemoMode) return null;

    // Always show savings enabled in demo mode
    // Calculate some earnings to show
    const dailyYield = (2500000 * 0.08) / 365;
    const accumulatedYield = dailyYield * 30; // Show 30 days of earnings

    return {
      enabled: true,
      allocation: 100, // 100% auto-save
      apy: 8.0,
      totalSaved: 2500000,
      totalEarned: accumulatedYield,
      currentBalance: 2500000 + accumulatedYield,
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
        isInitializedOnChain: true, // Always initialized in demo
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

  // Always show savings data in demo mode
  // Calculate daily yield on $2.5M
  const dailyYield = (2500000 * 0.08) / 365;
  const yieldAmount = dailyYield * 1e6; // Convert to USDC decimals

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

  // Calculate earned amount based on demo balance and time
  const calculateEarned = (balance: number) => {
    if (balance === 0) return 0;
    // Assume 30 days of earnings at 8% APY
    return (balance * 0.08 * 30) / 365;
  };

  const baseVaults = [
    {
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      vaultName: 'Seamless USDC',
      assetsUsd: 2500000, // Always show $2.5M in demo
      earned: calculateEarned(2500000),
    },
    {
      vaultAddress: '0xTreasuryBills',
      vaultName: 'Treasury Bills',
      assetsUsd: 0,
      earned: 0,
    },
    {
      vaultAddress: '0xBlueChipLending',
      vaultName: 'Blue Chip Lending',
      assetsUsd: 0,
      earned: 0,
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
      amount: 2500000, // $2.5M
      skimmedAmount: 2500000,
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
