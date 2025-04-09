'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { SafeManagementCard } from "@/components/dashboard/safe-management-card";
import { AllocationSummaryCard } from "@/components/dashboard/allocation-summary-card";
import { SwapCard } from "./components/dashboard/swap-card";
import { useUserSafes } from '@/hooks/use-user-safes';
import { ActiveAgents } from "./components/agents/active-agents";
import { AddFundingSourceForm } from "./components/add-funding-source-form";
// import { getUserFundingSources, type UserFundingSourceDisplayData } from '../actions/get-user-funding-sources';
// import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { transactions } from "@/lib/mock-data";
import { BarChart4, Loader2 } from "lucide-react";
import { type Address } from 'viem';
import { AllocationManagement } from './components/allocation-management';

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  const primarySafeAddress = userSafesData?.find(s => s.safeType === 'primary')?.safeAddress as Address | undefined;

  const recentTransactions = transactions.slice(0, 5);

  if (!ready || !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AllocationSummaryCard />
      
      <AllocationManagement />

      <SafeManagementCard />

      {isLoadingSafes ? (
        <div className="flex items-center justify-center p-4 border rounded-md bg-white">
           <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" /> Loading Safe Info for Swap...
        </div>
      ) : (
        <SwapCard primarySafeAddress={primarySafeAddress} />
      )}

      <ActiveAgents />

      <AddFundingSourceForm />

      <div className="bg-white border border-primary/20 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <BarChart4 className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
        </div>
        {/* <RecentTransactions transactions={recentTransactions} /> */}
        <p className="text-sm text-gray-500">Displaying {recentTransactions.length} mock transactions.</p> 
      </div>
    </div>
  );
}