import { useMemo, useState, useEffect } from 'react';

export type SavingsExperienceMode = 'demo' | 'real';

// Check if we're in demo mode by looking at the URL unless an explicit mode is passed
export function useIsDemoMode(explicitMode?: SavingsExperienceMode) {
  const [isDemoMode, setIsDemoMode] = useState(explicitMode === 'demo');

  useEffect(() => {
    if (explicitMode) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    setIsDemoMode(window.location.pathname.startsWith('/dashboard/demo'));
  }, [explicitMode]);

  return explicitMode ? explicitMode === 'demo' : isDemoMode;
}

// Store demo savings state in localStorage for persistence
const DEMO_SAVINGS_KEY = 'zero-finance-demo-savings-state';

export function useDemoSavingsActivation(mode?: SavingsExperienceMode) {
  const isDemoMode = useIsDemoMode(mode);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (!isDemoMode || typeof window === 'undefined') {
      if (!isDemoMode) {
        setIsActivated(false);
      }
      return;
    }

    const stored = localStorage.getItem(DEMO_SAVINGS_KEY);
    setIsActivated(stored === 'true');
  }, [isDemoMode]);

  const activateSavings = () => {
    if (!isDemoMode || typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(DEMO_SAVINGS_KEY, 'true');
    setIsActivated(true);
  };

  const resetDemo = () => {
    if (!isDemoMode || typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(DEMO_SAVINGS_KEY);
    setIsActivated(false);
  };

  return {
    isActivated,
    activateSavings,
    resetDemo,
  };
}

// Override for useRealSavingsState hook
export function useDemoSavingsState(
  realState: any,
  isLoading: boolean,
  mode?: SavingsExperienceMode,
) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated } = useDemoSavingsActivation(mode);

  const demoState = useMemo(() => {
    if (!isDemoMode) return null;

    if (!isActivated) {
      return {
        enabled: false,
        allocation: 0,
        apy: 8.0,
        totalSaved: 0,
        totalEarned: 0,
        currentBalance: 0,
        vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      };
    }

    const dailyYield = (901323.0005 * 0.08) / 365;
    const accumulatedYield = dailyYield * 30; // Approximate 30 days of earnings

    return {
      enabled: true,
      allocation: 100,
      apy: 8.0,
      totalSaved: 901323.0005,
      totalEarned: accumulatedYield,
      currentBalance: 901323.0005 + accumulatedYield,
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
    };
  }, [isDemoMode, isActivated]);

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
export function useDemoEarnModuleStatus(
  realStatus: any,
  isLoading: boolean,
  mode?: SavingsExperienceMode,
) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated } = useDemoSavingsActivation(mode);

  if (isDemoMode) {
    return {
      data: {
        isInitializedOnChain: isActivated,
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
export function useDemoVaultStats(mode?: SavingsExperienceMode) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated } = useDemoSavingsActivation(mode);

  if (!isDemoMode) return null;

  if (!isActivated) {
    return [
      {
        vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
        vaultName: 'Seamless USDC',
        apy: 8.0,
        netApy: 8.0,
        tvl: 25000000n,
        yield: 0n,
      },
    ];
  }

  const dailyYield = (901323.0005 * 0.08) / 365;
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
export function useDemoUserPositions(mode?: SavingsExperienceMode) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated } = useDemoSavingsActivation(mode);

  if (!isDemoMode) return null;

  const calculateEarned = (balance: number) => {
    if (balance === 0 || !isActivated) return 0;
    return (balance * 0.08 * 30) / 365;
  };

  return [
    {
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      vaultName: 'Seamless USDC',
      assetsUsd: isActivated ? 901323.0005 : 0,
      earned: calculateEarned(901323.0005),
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
}

// Override for recent deposits
export function useDemoRecentDeposits(mode?: SavingsExperienceMode) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated } = useDemoSavingsActivation(mode);

  if (!isDemoMode || !isActivated) return [];

  return [
    {
      id: 'demo-deposit-1',
      amount: 901323.0005,
      skimmedAmount: 901323.0005,
      timestamp: Date.now() - 1800000,
      status: 'completed',
      transactionHash: '0xdemo123',
    },
  ];
}

// Override for recent withdrawals
export function useDemoRecentWithdrawals(mode?: SavingsExperienceMode) {
  const isDemoMode = useIsDemoMode(mode);
  const { isActivated } = useDemoSavingsActivation(mode);

  if (!isDemoMode || !isActivated) return [];

  return [
    {
      id: 'demo-withdrawal-1',
      amount: 50000,
      timestamp: Date.now() - 900000,
      status: 'pending',
      transactionHash: '0xdemo456',
    },
  ];
}
