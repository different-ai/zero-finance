'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Coffee,
  Cloud,
  Palette,
  ShoppingBag,
  Utensils,
  Fuel,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock transaction data
const DEMO_TRANSACTIONS = [
  {
    id: 1,
    merchant: 'Blue Bottle Coffee',
    icon: Coffee,
    amount: 5.0,
    fromSpendable: 4.0,
    fromVault: 1.0,
  },
  {
    id: 2,
    merchant: 'AWS',
    icon: Cloud,
    amount: 127.5,
    fromSpendable: 50.0,
    fromVault: 77.5,
  },
  {
    id: 3,
    merchant: 'Figma',
    icon: Palette,
    amount: 15.0,
    fromSpendable: 15.0,
    fromVault: 0,
  },
  {
    id: 4,
    merchant: 'Amazon',
    icon: ShoppingBag,
    amount: 89.99,
    fromSpendable: 30.0,
    fromVault: 59.99,
  },
  {
    id: 5,
    merchant: 'Uber Eats',
    icon: Utensils,
    amount: 32.5,
    fromSpendable: 20.0,
    fromVault: 12.5,
  },
  {
    id: 6,
    merchant: 'Shell Gas',
    icon: Fuel,
    amount: 65.0,
    fromSpendable: 40.0,
    fromVault: 25.0,
  },
];

type Transaction = (typeof DEMO_TRANSACTIONS)[number] & {
  visibleId: number;
  isNew?: boolean;
};

function VirtualCard() {
  return (
    <div className="relative w-full max-w-[400px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(27,41,255,0.15)]">
      {/* Card background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B29FF] via-[#2d3bff] to-[#0050ff]" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Card content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top row - Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-[14px] font-bold">0</span>
            </div>
            <span className="text-[14px] font-semibold tracking-wide">
              ZERO FINANCE
            </span>
          </div>
          <div className="text-[11px] font-medium tracking-wider opacity-80">
            VIRTUAL
          </div>
        </div>

        {/* Middle - Chip and contactless */}
        <div className="flex items-center gap-4">
          {/* Chip */}
          <div
            className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 shadow-inner"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #f59e0b 100%)',
            }}
          >
            <div className="w-full h-full grid grid-cols-3 gap-px p-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-amber-500/30 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Contactless icon */}
          <div className="opacity-80">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8.5 14.5A4 4 0 0 1 7 11a4 4 0 0 1 1.5-3.5" />
              <path d="M12 17a7 7 0 0 1-2.5-5.5A7 7 0 0 1 12 6" />
              <path d="M15.5 19.5a10 10 0 0 1-3.5-8 10 10 0 0 1 3.5-8" />
            </svg>
          </div>
        </div>

        {/* Bottom - Card number and details */}
        <div className="space-y-3">
          {/* Card number */}
          <div className="font-mono text-[22px] tracking-[0.15em] font-medium">
            •••• •••• •••• 4242
          </div>

          {/* Cardholder and expiry */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-wider opacity-60 mb-1">
                Card Holder
              </div>
              <div className="text-[14px] font-medium tracking-wide">
                BENJAMIN SHAFII
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider opacity-60 mb-1">
                Expires
              </div>
              <div className="text-[14px] font-medium tracking-wide">09/28</div>
            </div>
            {/* Visa-style logo placeholder */}
            <div className="text-[24px] font-bold italic opacity-90">VISA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({
  transaction,
  isNew,
}: {
  transaction: Transaction;
  isNew?: boolean;
}) {
  const Icon = transaction.icon;
  const hasVaultWithdraw = transaction.fromVault > 0;

  return (
    <div
      className={cn(
        'p-4 border-b border-[#101010]/10 last:border-b-0 transition-all duration-500',
        isNew &&
          'bg-[#1B29FF]/5 animate-in slide-in-from-top-2 fade-in duration-300',
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-[#F7F7F2] flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[#101010]/70" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-medium text-[#101010] truncate">
              {transaction.merchant}
            </span>
            <span className="text-[15px] font-semibold tabular-nums text-[#101010] flex-shrink-0">
              -${transaction.amount.toFixed(2)}
            </span>
          </div>

          <div className="mt-1 text-[12px] text-[#101010]/50">Just now</div>

          {/* Source breakdown */}
          <div className="mt-3 pt-3 border-t border-[#101010]/5 space-y-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#101010]/60">From Spendable</span>
              <span className="tabular-nums text-[#101010]/80">
                ${transaction.fromSpendable.toFixed(2)}
              </span>
            </div>
            {hasVaultWithdraw && (
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#101010]/60">From Vault</span>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums text-[#101010]/80">
                    ${transaction.fromVault.toFixed(2)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#1B29FF] bg-[#1B29FF]/10 px-1.5 py-0.5 rounded">
                    auto-withdrawn
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardDemoPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionIndex, setTransactionIndex] = useState(0);
  const [newestId, setNewestId] = useState<number | null>(null);

  // Calculate balances based on transactions
  const totalBalance = 10000;
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const earningBalance =
    5000 - transactions.reduce((sum, t) => sum + t.fromVault, 0);
  const remainingBalance = totalBalance - totalSpent;

  const addTransaction = useCallback(() => {
    if (transactionIndex >= DEMO_TRANSACTIONS.length) {
      // Reset to beginning
      setTransactionIndex(0);
      setTransactions([]);
      setNewestId(null);
      return;
    }

    const newTransaction = {
      ...DEMO_TRANSACTIONS[transactionIndex],
      visibleId: Date.now(),
      isNew: true,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setNewestId(newTransaction.visibleId);
    setTransactionIndex((prev) => prev + 1);

    // Remove "new" highlight after animation
    setTimeout(() => {
      setNewestId(null);
    }, 2000);
  }, [transactionIndex]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger on 'T' key or Space
      if (e.key === 't' || e.key === 'T' || e.key === ' ') {
        // Don't trigger if user is typing in an input
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        addTransaction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addTransaction]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            CARDS
          </p>
          <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Your Card
          </h1>
          <p className="mt-3 text-[15px] text-[#101010]/70 max-w-[600px]">
            Spend anywhere cards are accepted. Your balance automatically
            includes funds earning yield.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Virtual Card */}
            <div className="flex justify-center lg:justify-start">
              <VirtualCard />
            </div>

            {/* Balance Info */}
            <div className="bg-white border border-[#101010]/10 rounded-xl p-5 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
                Card Balance
              </p>
              <p className="text-[32px] font-semibold tabular-nums text-[#101010]">
                $
                {remainingBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-[13px] text-[#101010]/60">
                Includes{' '}
                <span className="text-[#1B29FF] font-medium">
                  $
                  {earningBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>{' '}
                earning 8% APY
              </p>
            </div>

            {/* Demo hint */}
            <div className="bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-xl p-4 text-center">
              <p className="text-[13px] text-[#1B29FF]">
                Press{' '}
                <kbd className="px-2 py-0.5 bg-white border border-[#1B29FF]/30 rounded text-[12px] font-mono mx-1">
                  T
                </kbd>{' '}
                or{' '}
                <kbd className="px-2 py-0.5 bg-white border border-[#1B29FF]/30 rounded text-[12px] font-mono mx-1">
                  Space
                </kbd>{' '}
                to simulate a card payment
              </p>
            </div>
          </div>

          {/* Right column - Transactions */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#101010]/10 rounded-xl shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  Recent Activity
                </p>
              </div>

              {/* Transaction list */}
              <div className="max-h-[500px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-[#F7F7F2] rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-8 h-8 text-[#101010]/30" />
                    </div>
                    <p className="text-[15px] font-medium text-[#101010]/70 mb-2">
                      No transactions yet
                    </p>
                    <p className="text-[13px] text-[#101010]/50">
                      Press{' '}
                      <kbd className="px-1.5 py-0.5 bg-[#F7F7F2] border border-[#101010]/10 rounded text-[11px] font-mono">
                        T
                      </kbd>{' '}
                      to simulate a payment
                    </p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <TransactionRow
                      key={tx.visibleId}
                      transaction={tx}
                      isNew={tx.visibleId === newestId}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
