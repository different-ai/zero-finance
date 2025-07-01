import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { ActiveAgents } from './components/agents/active-agents';
import { TransactionTabs } from './components/dashboard/transaction-tabs';
import { redirect } from 'next/navigation';
import { FundsDisplay } from './components/dashboard/funds-display';
import { OnboardingTasksCard } from './components/dashboard/onboarding-tasks-card';
import { EarningsCard } from '@/components/dashboard/earnings-card';

// Loading components for Suspense boundaries
function LoadingCard() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  );
}

// Simple logger implementation
const log = {
  info: (payload: any, message: string) => console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload: any, message: string) => console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload: any, message: string) => console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
};

// Server components for data fetching
async function OnboardingData() {
  const userId = await getUserId();
  if (!userId) return null;

  const caller = appRouter.createCaller({ userId, db, log });
  const onboardingData = await caller.onboarding.getOnboardingSteps();

  return <OnboardingTasksCard initialData={onboardingData} />;
}

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
    <>
      <FundsDisplay 
        totalBalance={totalBalance} 
        walletAddress={primarySafe.primarySafeAddress}
      />
      <EarningsCard safeAddress={primarySafe.primarySafeAddress} />
    </>
  );
}

export default async function DashboardPage() {
  const userId = await getUserId();
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="">
      <div className="space-y-6">
        <Suspense fallback={<LoadingCard />}>
          <OnboardingData />
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <FundsData />
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <TransactionTabs />
        </Suspense>

        <Suspense fallback={null}>
          <ActiveAgents />
        </Suspense>
      </div>
    </div>
  );
}
