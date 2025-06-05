import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { type Address } from 'viem';
import { ActiveAgents } from './components/agents/active-agents';
import { OnboardingTasksCard } from './components/dashboard/onboarding-tasks-card';
import { FundingSourceDisplay } from '../settings/components/funding-source-display';
import { TransactionHistoryList } from './components/transaction-history-list';
import { Loader2 } from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

// Cache the data fetching functions for 10 seconds
const getCachedDashboardData = unstable_cache(
  async (userId: string) => {
    // Create tRPC caller with context
    const caller = appRouter.createCaller({ userId, log, db });
    
    // Fetch all data in parallel
    const [
      profile,
      safes,
      alignStatus,
      primarySafeData,
      virtualAccountDetails,
    ] = await Promise.all([
      caller.user.getProfile().catch(() => null),
      caller.settings.userSafes.list().catch(() => []),
      caller.align.getCustomerStatus().catch(() => null),
      caller.user.getPrimarySafeAddress().catch(() => null),
      caller.align.getVirtualAccountDetails().catch(() => null),
    ]);

    // Get primary safe address
    const primarySafe = safes?.find((s) => s.safeType === 'primary');
    const primarySafeAddress = primarySafe?.safeAddress as Address | undefined;

    // Fetch safe-specific data if we have a primary safe
    let transactions = null;
    let balances: Record<string, any> = {};
    
    if (primarySafeAddress) {
      // Fetch transactions and balances in parallel
      const [txData, ...balanceResults] = await Promise.all([
        caller.safe.getTransactions({ safeAddress: primarySafeAddress }).catch(() => null),
        ...safes.map(safe => 
          caller.safe.getBalance({
            safeAddress: safe.safeAddress,
            tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC
          }).catch(() => null)
        )
      ]);
      
      transactions = txData;
      
      // Map balance results to safe addresses
      safes.forEach((safe, index) => {
        if (balanceResults[index]) {
          balances[safe.safeAddress] = balanceResults[index];
        }
      });
    }

    return {
      profile,
      safes,
      alignStatus,
      primarySafeData,
      primarySafeAddress,
      transactions,
      balances,
      virtualAccountDetails,
      hasCompletedOnboarding: profile?.hasCompletedOnboarding || false,
    };
  },
  ['dashboard-data'],
  {
    revalidate: 10, // Cache for 10 seconds
    tags: ['dashboard'],
  }
);

// Server Components for each section with their own Suspense boundary
async function OnboardingSection({ userId }: { userId: string }) {
  const data = await getCachedDashboardData(userId);
  
  // Pass pre-fetched data to the component
  return (
    <OnboardingTasksCard 
      initialData={{
        profile: data.profile,
        kyc: data.alignStatus,
        safes: data.safes || [],
        hasCompletedOnboarding: data.hasCompletedOnboarding,
      }}
    />
  );
}

async function FundingSection({ userId }: { userId: string }) {
  // FundingSourceDisplay uses server actions, so we let it handle its own data
  const data = await getCachedDashboardData(userId);
  return <FundingSourceDisplay />;
}

async function TransactionSection({ userId }: { userId: string }) {
  // TransactionHistoryList can be optimized separately if needed
  const data = await getCachedDashboardData(userId);
  return <TransactionHistoryList />;
}

export default async function DashboardPage() {
  // Check authentication server-side
  const userId = await getUserId();
  
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="">
      <div className="space-y-6">
        {/* Each section loads independently with its own Suspense boundary */}
        <Suspense fallback={<LoadingCard />}>
          <OnboardingSection userId={userId} />
        </Suspense>
        
        <Suspense fallback={<LoadingCard />}>
          <FundingSection userId={userId} />
        </Suspense>
        
        <Suspense fallback={<LoadingCard />}>
          <TransactionSection userId={userId} />
        </Suspense>
        
        <Suspense fallback={null}>
          <ActiveAgents />
        </Suspense>
      </div>
    </div>
  );
}
