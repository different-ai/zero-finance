'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { FundsDisplay } from '@/components/funds/funds-display';
import { MockTransactionHistoryList } from './mock-transaction-history-list';

export function BankAccountDemo() {
  return (
    // make it completely non-interactive / non-clickable
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard"
        title="Zero Finance - Smart Bank Account"
      >
        <div className="bg-gray-50 p-4 md:p-6">
          <FundsDisplay totalBalance={25109.42} walletAddress="0x...deface" network='ethereum' />
          <MockTransactionHistoryList />
        </div>
      </BrowserWindow>
    </div>
  );
} 