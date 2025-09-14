'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react';
import { useDemoMode } from '@/context/demo-mode-context';
import { TransactionTabs } from './transaction-tabs';
import { formatUsd } from '@/lib/utils';

function DemoTransactionHistory() {
  const { demoStep } = useDemoMode();

  if (demoStep < 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  const transactions = [
    ...(demoStep >= 3
      ? [
          {
            id: 'demo-1',
            type: 'deposit',
            amount: 2500000,
            description: 'Initial treasury deposit',
            from: 'Chase Bank',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
    ...(demoStep >= 4
      ? [
          {
            id: 'demo-2',
            type: 'payment',
            amount: 45000,
            description: 'AWS Infrastructure',
            to: 'Amazon Web Services',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed',
          },
          {
            id: 'demo-3',
            type: 'payment',
            amount: 125000,
            description: 'Monthly Payroll',
            to: 'Gusto Payroll',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
    ...(demoStep >= 5
      ? [
          {
            id: 'demo-4',
            type: 'savings',
            amount: 200000,
            description: 'Auto-save to Seamless vault (8% APY)',
            to: 'Seamless USDC Vault',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
    ...(demoStep >= 6
      ? [
          {
            id: 'demo-5',
            type: 'yield',
            amount: 43.84, // Daily yield on $200k at 8% APY
            description: 'Yield earned',
            from: 'Seamless Vault',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
  ];

  // Group transactions by day
  const groupTransactionsByDay = (txs: typeof transactions) => {
    const groups: Record<string, typeof transactions> = {};
    txs.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dayLabel: string;
      if (date.toDateString() === today.toDateString()) {
        dayLabel = 'TODAY';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dayLabel = 'YESTERDAY';
      } else {
        dayLabel = date
          .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          .toUpperCase();
      }

      if (!groups[dayLabel]) {
        groups[dayLabel] = [];
      }
      groups[dayLabel].push(tx);
    });
    return groups;
  };

  const bankTransactions = transactions.filter(
    (tx) => tx.type !== 'yield' && tx.type !== 'savings',
  );
  const cryptoTransactions = transactions.filter(
    (tx) => tx.type === 'savings' || tx.type === 'yield',
  );
  const groupedBankTransactions = groupTransactionsByDay(bankTransactions);
  const groupedCryptoTransactions = groupTransactionsByDay(cryptoTransactions);

  return (
    <div className="w-full p-5 sm:p-6 pt-0">
      {/* Segmented Control */}
      <div className="inline-flex p-[2px] rounded-md border border-[#101010]/10 bg-white text-[12px] mb-6">
        <button
          onClick={() => {}}
          className="px-3 py-1.5 rounded-[6px] bg-[#1B29FF] text-white font-medium"
        >
          Bank transfers{' '}
          {bankTransactions.length > 0 && `(${bankTransactions.length})`}
        </button>
        <button
          onClick={() => {}}
          className="px-3 py-1.5 rounded-[6px] text-[#101010]/80 hover:bg-[#F7F7F2] font-medium"
        >
          Crypto{' '}
          {cryptoTransactions.length > 0 && `(${cryptoTransactions.length})`}
        </button>
      </div>

      {/* Bank Transfers List */}
      <div className="divide-y divide-[#101010]/8">
        {Object.entries(groupedBankTransactions).map(
          ([day, dayTransactions]) => (
            <div key={day}>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mt-6 mb-3 first:mt-0">
                {day}
              </p>
              {dayTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-[28px_1fr_auto] items-center py-3 border-b border-[#101010]/8 last:border-0"
                >
                  <div className="h-7 w-7 rounded-full bg-[#F7F7F2] inline-flex items-center justify-center">
                    {tx.type === 'deposit' || tx.type === 'yield' ? (
                      <ArrowDownLeft className="h-4 w-4 text-[#1B29FF]" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-[#101010]" />
                    )}
                  </div>
                  <div className="min-w-0 px-3">
                    <p className="truncate text-[14px] text-[#101010] font-medium">
                      {tx.description}
                    </p>
                    <p className="text-[12px] text-[#101010]/60">
                      {tx.from || tx.to} ·{' '}
                      {tx.status === 'completed' ? 'Completed' : tx.status}
                    </p>
                  </div>
                  <div className="text-right tabular-nums">
                    <span
                      className={`text-[14px] ${
                        tx.type === 'deposit' || tx.type === 'yield'
                          ? 'text-[#1B29FF]'
                          : 'text-[#101010]'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'yield' ? '+' : '-'}
                      {Math.abs(tx.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="ml-1 text-[12px] text-[#101010]/60">
                      USD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ),
        )}
        {bankTransactions.length === 0 && (
          <p className="text-sm text-[#101010]/60 py-8 text-center">
            No bank transactions yet
          </p>
        )}
      </div>
    </div>
  );
}

export function TransactionTabsDemo() {
  // Demo mode removed - always show real transactions
  // Demo only available at /dashboard/demo
  return <TransactionTabs />;
}
