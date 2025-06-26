import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { ActiveAgents } from './components/agents/active-agents';
import { TransactionHistoryList } from './components/dashboard/transaction-history-list';
import { redirect } from 'next/navigation';
import { FundsDisplay } from './components/dashboard/funds-display';
import { OnboardingTasksCard } from './components/dashboard/onboarding-tasks-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OutgoingTransfersList from './components/dashboard/outgoing-transfers-list';

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

export default async function DashboardPage() {
  const userId = await getUserId();
  if (!userId) {
    redirect('/');
  }

  // Create tRPC caller for server-side fetching
  const caller = appRouter.createCaller({ userId, log, db });

  // Fetch necessary data in parallel (onboarding steps, funds, etc.)
  const onboardingDataPromise = caller.onboarding.getOnboardingSteps().catch(() => ({
    steps: {
      addEmail: { isCompleted: false, status: 'not_started' as const },
      createSafe: { isCompleted: false, status: 'not_started' as const },
      verifyIdentity: { isCompleted: false, status: 'not_started' as const },
      setupBankAccount: { isCompleted: false, status: 'not_started' as const },
    },
    isCompleted: false,
  }));

  const fundsDataPromise = caller.dashboard.getBalance().catch(() => ({
    totalBalance: 0,
    primarySafeAddress: undefined,
  }));

  // Await promises for Suspense boundaries
  const OnboardingData = async () => {
    const data = await onboardingDataPromise;
    return <OnboardingTasksCard initialData={data} />;
  };

  const FundsData = async () => {
    const data = await fundsDataPromise;
    return <FundsDisplay totalBalance={data.totalBalance} walletAddress={data.primarySafeAddress} />;
  };

  return (
    <div className="">
      <div className="space-y-6">
        <Suspense fallback={<LoadingCard />}>
          <OnboardingData />
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <FundsData />
        </Suspense>

        {/* Tabbed section */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="h-10">
            <TabsTrigger value="wallet" className="data-[state=active]:font-medium">Wallet</TabsTrigger>
            <TabsTrigger value="transfers" className="data-[state=active]:font-medium">Outgoing Transfers</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <Suspense fallback={<LoadingCard />}>
              <TransactionHistoryList />
            </Suspense>
            <Suspense fallback={null}>
              <ActiveAgents />
            </Suspense>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-6">
            <Suspense fallback={<LoadingCard />}>
              <OutgoingTransfersList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
