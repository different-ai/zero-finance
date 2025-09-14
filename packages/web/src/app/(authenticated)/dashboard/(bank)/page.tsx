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
  const userId = await getUserId();

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
  // Hide onboarding in lite mode (no Align API)
  const isLiteMode = !process.env.ALIGN_API_KEY || process.env.LITE_MODE === 'true';
  if (isLiteMode) {
    return null;
  }

  const userId = await getUserId();

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
  const userId = await getUserId();

  // Redirect if no user
  if (!userId) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6">
          {/* Balance Section - Checking Account */}
          <div>
            <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010] mb-4">
              Checking Account
            </h2>
            <Suspense fallback={<LoadingCard />}>
              <FundsData />
            </Suspense>
          </div>

          {/* Onboarding Section */}
          <Suspense fallback={<LoadingCard />}>
            <OnboardingData />
          </Suspense>

          {/* Savings/Yield Section */}
          <SavingsWrapper />

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
            <Suspense fallback={<LoadingCard />}>
              <TransactionTabsDemo />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
