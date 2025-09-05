'use client';

import React from 'react';
import { useDemoMode } from '@/providers/demo-mode-provider';
import { FundsDisplay } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display';

interface DemoFundsDisplayProps {
  totalBalance: number;
  walletAddress: string;
}

export function DemoFundsDisplay({
  totalBalance,
  walletAddress,
}: DemoFundsDisplayProps) {
  const demo = useDemoMode();

  // If in demo mode, use demo data
  if (demo.isDemo) {
    return (
      <FundsDisplay
        totalBalance={demo.demoBalance}
        walletAddress={
          walletAddress || '0x742d35Cc6634C0532AD746845C9E38e21a1E7'
        }
      />
    );
  }

  // Otherwise use real data
  return (
    <FundsDisplay totalBalance={totalBalance} walletAddress={walletAddress} />
  );
}
