import { useMemo, useState, useEffect } from 'react';

// Check if we're in demo mode by looking at the URL
function useIsDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemoMode(window.location.pathname.startsWith('/dashboard/demo'));
    }
  }, []);

  return isDemoMode;
}

// Store demo savings state in localStorage for persistence
const DEMO_SAVINGS_KEY = 'zero-finance-demo-savings-state';

export function useDemoSavingsActivation() {
  const [isActivated, setIsActivated] = useState(false);
  const isDemoMode = useIsDemoMode();

  useEffect(() => {
    if (isDemoMode && typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_SAVINGS_KEY);
      setIsActivated(stored === 'true');
    }
  }, [isDemoMode]);

  const activateSavings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_SAVINGS_KEY, 'true');
      setIsActivated(true);
    }
  };

  const resetDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_SAVINGS_KEY);
      setIsActivated(false);
    }
  };

  return { isActivated, activateSavings, resetDemo };
}

// Override for useRealSavingsState hook
export function useDemoSavingsState(realState: any, isLoading: boolean) {
  const isDemoMode = useIsDemoMode();
  const { isActivated } = useDemoSavingsActivation();

  const demoState = useMemo(() => {
    if (!isDemoMode) return null;

    // If savings not activated, show disabled state
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

    // Show active savings with earnings
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
export function useDemoEarnModuleStatus(realStatus: any, isLoading: boolean) {
  const isDemoMode = useIsDemoMode();
  const { isActivated } = useDemoSavingsActivation();

  if (isDemoMode) {
    return {
      data: {
        isInitializedOnChain: isActivated, // Only initialized after activation
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
  const isDemoMode = useIsDemoMode();
  const { isActivated } = useDemoSavingsActivation();

  if (!isDemoMode) return null;

  // Only show vault data if savings is activated
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
  const isDemoMode = useIsDemoMode();
  const { isActivated } = useDemoSavingsActivation();

  if (!isDemoMode) return null;

  // Calculate earned amount based on demo balance and time
  const calculateEarned = (balance: number) => {
    if (balance === 0 || !isActivated) return 0;
    // Assume 30 days of earnings at 8% APY
    return (balance * 0.08 * 30) / 365;
  };

  const baseVaults = [
    {
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      vaultName: 'Seamless USDC',
      assetsUsd: isActivated ? 2500000 : 0, // Show balance only if activated
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
  const isDemoMode = useIsDemoMode();
  const { isActivated } = useDemoSavingsActivation();

  if (!isDemoMode || !isActivated) return [];

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
  const isDemoMode = useIsDemoMode();

  if (!isDemoMode) return [];

  // Always show a sample withdrawal in demo
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
