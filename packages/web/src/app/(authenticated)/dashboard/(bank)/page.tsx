import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { ActiveAgents } from './components/agents/active-agents';
import { TransactionTabs } from './components/dashboard/transaction-tabs';
import { redirect } from 'next/navigation';
import { FundsDisplay } from './components/dashboard/funds-display';
import { OnboardingTasksCard } from './components/dashboard/onboarding-tasks-card';

// Loading components for Suspense boundaries
function LoadingCard() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
    tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
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
  );
}
