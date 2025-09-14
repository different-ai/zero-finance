'use client';

import { FundsDisplayWithDemo } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display-with-demo';
import { TransactionTabsDemo } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/transaction-tabs-demo';
import { DemoSavingsWrapper } from './components/demo-savings-wrapper';
import { useDemoSavingsActivation } from '@/hooks/use-demo-savings';

// Demo funds component that always shows demo data
function DemoFunds() {
  return (
    <FundsDisplayWithDemo
      totalBalance={2500000} // $2.5M demo balance in checking
      walletAddress="0xDemo...1234"
    />
  );
}

export default function DemoPageContent() {
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
            <DemoFunds />
          </div>

          {/* Savings/Yield Section */}
          <DemoSavingsWrapper />

          {/* Transactions Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <div className="p-5 sm:p-6 border-b border-[#101010]/10">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                RECENT ACTIVITY
              </p>
              <h2 className="mt-2 font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Transactions & Transfers
              </h2>
            </div>
            <TransactionTabsDemo />
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-[#1B29FF] to-[#0A1172] rounded-[12px] p-8 text-white text-center">
            <h3 className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.01em] mb-4">
              Ready to start earning 8% APY?
            </h3>
            <p className="text-[16px] text-white/90 mb-6 max-w-2xl mx-auto">
              Join hundreds of startups already maximizing their idle cash with
              Zero Finance. Get started in minutes with bank-level security.
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
