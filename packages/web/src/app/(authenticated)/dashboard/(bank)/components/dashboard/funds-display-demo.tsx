'use client';

import React from 'react';
import { FundsDisplay } from './funds-display';
import { useDemoMode } from '@/context/demo-mode-context';
import { getDemoVirtualAccounts } from '@/utils/demo-trpc';

// Mock the TRPC hook for demo mode
const mockApi = {
  align: {
    getVirtualAccountDetails: {
      useQuery: (input: any, options: any) => {
        const { isDemoMode, demoStep } = useDemoMode();

        if (isDemoMode) {
          return {
            data: getDemoVirtualAccounts(demoStep),
            isLoading: false,
            refetch: () => {},
          };
        }

        // Return a dummy for non-demo mode - real component will use its own hook
        return {
          data: [],
          isLoading: false,
          refetch: () => {},
        };
      },
    },
  },
};

interface FundsDisplayDemoProps {
  totalBalance?: number;
  walletAddress?: string;
}

export function FundsDisplayDemo({
  totalBalance = 0,
  walletAddress,
}: FundsDisplayDemoProps) {
  const { isDemoMode, demoStep, demoBalance } = useDemoMode();

  // Use demo data if in demo mode
  const displayBalance = isDemoMode
    ? demoStep >= 3
      ? demoBalance
      : 0
    : totalBalance;
  const displayAddress = isDemoMode
    ? '0xDemo1234567890abcdef1234567890abcdef1234'
    : walletAddress;

  // For demo mode, we need to intercept the TRPC calls
  // This is a bit hacky but works for demo purposes
  if (isDemoMode) {
    // Override the api import in FundsDisplay
    const originalRequire = require;
    if (typeof window !== 'undefined') {
      (window as any).__demo_funding_sources = getDemoVirtualAccounts(demoStep);
    }
  }

  return (
    <FundsDisplay
      totalBalance={displayBalance}
      walletAddress={displayAddress}
    />
  );
}
