import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { ActiveAgents } from './components/agents/active-agents';
import { TransactionTabsDemo } from './components/dashboard/transaction-tabs-demo';
import { redirect } from 'next/navigation';
import { FundsDisplayWithDemo } from './components/dashboard/funds-display-with-demo';
import { VirtualAccountOnboardingLayer } from './components/dashboard/virtual-account-onboarding-layer';
import { USDC_ADDRESS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (!userId) return null;

  const caller = appRouter.createCaller({ userId, db, log });
  const primarySafe = await caller.user.getPrimarySafeAddress();

  if (!primarySafe?.primarySafeAddress) {
    return null;
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
  const userId = await getUserId();
  if (!userId) return null;

  const caller = appRouter.createCaller({ userId, db, log });
  const onboardingData = await caller.onboarding.getOnboardingSteps();

  return <VirtualAccountOnboardingLayer initialData={onboardingData} />;
}

export default async function DashboardPage() {
  const userId = await getUserId();
  if (!userId) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header Section */}
      <div className="border-b border-[#101010]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="uppercase tracking-[0.18em] text-[12px] text-[#101010]/60">
            OVERVIEW
          </p>
          <h1 className="mt-1 font-serif text-[32px] sm:text-[36px] leading-[0.98] tracking-[-0.01em] text-[#101010]">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6">
          {/* Balance Section */}
          <Suspense fallback={<LoadingCard />}>
            <FundsData />
          </Suspense>

          {/* Onboarding Section */}
          <OnboardingData />

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
