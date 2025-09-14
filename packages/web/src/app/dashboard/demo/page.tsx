'use client';

import { Suspense } from 'react';
import { FundsDisplayWithDemo } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display-with-demo';
import { TransactionTabsDemo } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/transaction-tabs-demo';
import { DemoSavingsWrapper } from './components/demo-savings-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { useDemoSavingsActivation } from '@/hooks/use-demo-savings';
import { RotateCcw } from 'lucide-react';

// Loading component for Suspense boundaries
function LoadingCard() {
  return (
    <div className="border border-[#101010]/10 bg-white rounded-md">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 bg-[#101010]/5" />
          <Skeleton className="h-10 w-48 bg-[#101010]/5" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 bg-[#101010]/5" />
          <Skeleton className="h-12 w-32 bg-[#101010]/5" />
        </div>
      </div>
    </div>
  );
}

// Demo funds component that always shows demo data
function DemoFunds() {
  return (
    <FundsDisplayWithDemo
      totalBalance={2500000} // $2.5M demo balance in checking
      walletAddress="0xDemo...1234"
    />
  );
}

export default function DashboardDemoPage() {
  const { resetDemo } = useDemoSavingsActivation();

  const handleReset = () => {
    resetDemo();
    // Force page refresh to reset all components
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] relative">
      {/* Demo Mode Banner - Absolute positioned at top */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-[#1B29FF] border-b border-[#101010]/10 ">
        <div className="h-[48px] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-[11px] uppercase tracking-[0.14em] text-white/90">
                Demo Mode
              </span>
            </div>
            <p className="text-[14px] text-white/90">
              Explore Zero Finance with sample data
            </p>
            <a
              href="/signin"
              className="ml-4 text-[14px] text-white font-medium underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              Sign in to start earning real 8% APY →
            </a>
          </div>
        </div>
      </div>

      {/* Main Content - Add padding-top to account for banner */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pb-12">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-6">
            <h1 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Welcome to Zero Finance Demo
            </h1>
            <p className="mt-3 text-[16px] text-[#101010]/70">
              Your startup's idle cash earning 8% APY. $2.5M demo portfolio
              below.
            </p>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[#101010]/60">Live Demo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#101010]/60">
                  $2.5M in Savings · $2.5M in Checking
                </span>
              </div>
            </div>
          </div>

          {/* Balance Section - Checking Account */}
          <div>
            <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010] mb-4">
              Checking Account
            </h2>
            <Suspense fallback={<LoadingCard />}>
              <DemoFunds />
            </Suspense>
          </div>

          {/* Savings/Yield Section */}
          <div>
            <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010] mb-4">
              Savings
            </h2>
            <DemoSavingsWrapper />
          </div>

          {/* Transactions Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <div className="p-5 sm:p-6 border-b border-[#101010]/10">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                SAMPLE TRANSACTIONS
              </p>
              <h2 className="mt-2 font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Transactions & Transfers
              </h2>
            </div>
            <Suspense fallback={<LoadingCard />}>
              <TransactionTabsDemo />
            </Suspense>
          </div>

          {/* CTA Card */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-6">
            <h3 className="font-serif text-[24px] text-[#101010] mb-2">
              Ready to earn 8% on your treasury?
            </h3>
            <p className="text-[#101010]/70 mb-4">
              Join 500+ startups already earning more with Zero Finance. First
              50 signups get 3 months free.
            </p>
            <a
              href="/signin"
              className="inline-flex items-center px-6 py-3 bg-[#1B29FF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Earning 8% APY →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
