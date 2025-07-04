import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { ActiveAgents } from './components/agents/active-agents';
import { TransactionTabs } from './components/dashboard/transaction-tabs';
import { redirect } from 'next/navigation';
import { FundsDisplay } from './components/dashboard/funds-display';
import { OnboardingTasksCard } from './components/dashboard/onboarding-tasks-card';
import { USDC_ADDRESS } from '@/lib/constants';
import { WelcomeSlideshowWrapper } from './components/dashboard/welcome-slideshow-wrapper';
import { Skeleton } from '@/components/ui/skeleton';

// Loading components for Suspense boundaries
function LoadingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="avatar" className="h-12 w-12" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="h-4 w-1/3" />
            <Skeleton variant="text" className="h-3 w-1/4" />
          </div>
        </div>
        <Skeleton variant="text" className="h-8 w-full" />
        <div className="flex gap-3">
          <Skeleton variant="button" className="h-10 flex-1" />
          <Skeleton variant="button" className="h-10 flex-1" />
          <Skeleton variant="button" className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

// Create a simple log object
const log = {
  info: (payload: any, message: string) => console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload: any, message: string) => console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload: any, message: string) => console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
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
    <FundsDisplay 
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

  return <OnboardingTasksCard initialData={onboardingData} />;
}

export default async function DashboardPage() {
  const userId = await getUserId();
  if (!userId) {
    redirect('/auth');
  }

  return (
    <>
      <WelcomeSlideshowWrapper />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <FundsData />
          </Suspense>

          <Suspense fallback={<LoadingCard />}>
            <OnboardingData />
          </Suspense>

          <Suspense fallback={<LoadingCard />}>
            <TransactionTabs />
          </Suspense>

          <ActiveAgents />
        </div>
      </div>
    </>
  );
}
