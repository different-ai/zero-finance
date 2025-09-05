import { useDemoMode } from '@/context/demo-mode-context';
import { useUserSafes as useRealUserSafes } from './use-user-safes';
import { useMemo } from 'react';

export const useUserSafes = () => {
  const { isDemoMode, demoStep } = useDemoMode();
  const realData = useRealUserSafes();

  // Create demo data based on demo step
  const demoData = useMemo(() => {
    if (!isDemoMode) return null;

    // Return demo safe data
    return {
      data:
        demoStep >= 1
          ? [
              {
                id: 'demo-safe-1',
                userId: 'demo-user',
                safeAddress: '0xDemo1234567890abcdef1234567890abcdef1234',
                chainId: 8453, // Base
                deployedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isPrimary: true,
                name: 'Demo Treasury Safe',
              },
            ]
          : [],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    };
  }, [isDemoMode, demoStep]);

  // Return demo data if in demo mode, otherwise return real data
  if (isDemoMode && demoData) {
    return demoData;
  }

  return realData;
};
