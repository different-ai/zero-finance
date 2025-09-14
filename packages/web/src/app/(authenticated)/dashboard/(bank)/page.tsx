import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { TransactionTabsDemo } from './components/dashboard/transaction-tabs-demo';
import { redirect } from 'next/navigation';
import { FundsDisplayWithDemo } from './components/dashboard/funds-display-with-demo';
import { VirtualAccountOnboardingLayer } from './components/dashboard/virtual-account-onboarding-layer';
import { USDC_ADDRESS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { SavingsWrapper } from './components/savings-wrapper';
import {
  EmptyCheckingAccount,
  EmptySavingsAccount,
  EmptyTransactions,
  OnboardingTasks,
} from './components/dashboard/empty-states';

// Loading components for Suspense boundaries
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

// Create a simple log object
const log = {
  info: (payload: any, message: string) =>
    console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload: any, message: string) =>
    console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload: any, message: string) =>
    console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
};

async function FundsData() {
  // Check if we're in demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.has('zero-finance-demo-mode');

  const userId = await getUserId();

  // If demo mode and no user, show demo data
  if (isDemoMode && !userId) {
    return (
      <FundsDisplayWithDemo
        totalBalance={2500000} // $2.5M demo balance in checking
        walletAddress="0xDemo...1234"
      />
    );
  }

  if (!userId) return <EmptyCheckingAccount />;

  const caller = appRouter.createCaller({ userId, db, log });
  const primarySafe = await caller.user.getPrimarySafeAddress();

  // Show empty state for new users without a safe
  if (!primarySafe?.primarySafeAddress) {
    return <EmptyCheckingAccount />;
  }

  // Get balance
  const balanceData = await caller.safe.getBalance({
    safeAddress: primarySafe.primarySafeAddress,
    tokenAddress: USDC_ADDRESS, // USDC on Base
  });

  const totalBalance = balanceData ? Number(balanceData.balance) / 1e6 : 0;

  return (
    <FundsDisplayWithDemo
      totalBalance={totalBalance}
      walletAddress={primarySafe.primarySafeAddress}
    />
  );
}

// Server components for data fetching
async function OnboardingData() {
  // Check if we're in demo mode
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.has('zero-finance-demo-mode');

  const userId = await getUserId();

  // In demo mode, don't show onboarding
  if (isDemoMode && !userId) {
    return null; // No onboarding in demo mode
  }

  if (!userId) return <OnboardingTasks />;

  const caller = appRouter.createCaller({ userId, db, log });

  try {
    const onboardingData = await caller.onboarding.getOnboardingSteps();

    // If we have onboarding data, check if it's complete
    if (onboardingData && onboardingData.isCompleted) {
      // If completed, don't show onboarding tasks
      return null;
    }

    return <VirtualAccountOnboardingLayer initialData={onboardingData} />;
  } catch (error) {
    // If there's an error fetching onboarding data, show default tasks
    return <OnboardingTasks />;
  }
}

export default async function DashboardPage() {
  // Check for demo mode cookie first
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.has('zero-finance-demo-mode');

  const userId = await getUserId();

  // Only redirect if NOT in demo mode AND no user
  if (!userId && !isDemoMode) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Demo Mode Banner */}
      {isDemoMode && !userId && (
        <div className="absolute top-0 w-full bg-[#1B29FF] text-white py-3 px-4 text-center">
          <p className="text-sm font-medium">
            🎮 Demo Mode - Explore Zero Finance with sample data
            <a
              href="/signin"
              className="ml-3 underline font-semibold hover:opacity-90"
            >
              Sign in to start earning real 8% APY →
            </a>
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6">
          {/* Welcome Section for Demo */}
          {isDemoMode && !userId && (
            <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-6">
              <h1 className="font-serif text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Welcome to Zero Finance
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
          )}

          {/* Balance Section - Checking Account */}
          <div>
            <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010] mb-4">
              Checking Account
            </h2>
            <Suspense fallback={<LoadingCard />}>
              <FundsData />
            </Suspense>
          </div>

          {/* Onboarding Section - show for all real users */}
          {userId && (
            <Suspense fallback={<LoadingCard />}>
              <OnboardingData />
            </Suspense>
          )}

          {/* Savings/Yield Section - Just call the actual savings page */}
          <SavingsWrapper />

          {/* Transactions Section */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <div className="p-5 sm:p-6 border-b border-[#101010]/10">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                {isDemoMode && !userId
                  ? 'SAMPLE TRANSACTIONS'
                  : 'RECENT ACTIVITY'}
              </p>
              <h2 className="mt-2 font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Transactions & Transfers
              </h2>
            </div>
            <Suspense fallback={<LoadingCard />}>
              <TransactionTabsDemo />
            </Suspense>
          </div>

          {/* Additional Demo Content */}
          {isDemoMode && !userId && (
            <>
              {/* CTA Card */}
              <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-6">
                <h3 className="font-serif text-[24px] text-[#101010] mb-2">
                  Ready to earn 8% on your treasury?
                </h3>
                <p className="text-[#101010]/70 mb-4">
                  Join 500+ startups already earning more with Zero Finance.
                  First 50 signups get 3 months free.
                </p>
                <a
                  href="/signin"
                  className="inline-flex items-center px-6 py-3 bg-[#1B29FF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Earning 8% APY →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
