'use client';

import { FundsDisplay } from './funds-display';
import { useDemoMode } from '@/context/demo-mode-context';

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

  return (
    <FundsDisplay
      totalBalance={displayBalance}
      walletAddress={displayAddress}
    />
  );
}
