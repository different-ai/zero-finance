'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { SafeManagementCard } from "@/components/dashboard/safe-management-card";
import { AllocationSummaryCard } from "@/components/dashboard/allocation-summary-card";
import { AllocationManagement } from "@/components/allocation-management";
import { SwapCard } from "@/components/dashboard/swap-card";
import { useUserSafes } from '@/hooks/use-user-safes';
import { ActiveAgents } from "@/components/agents/active-agents";
import { FundingSourceDisplay } from "@/components/dashboard/funding-source-display";
import { AddFundingSourceForm } from '@/components/dashboard/add-funding-source-form';
import { getUserFundingSources, type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
// import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { transactions } from "@/lib/mock-data";
import { BarChart4, Loader2 } from "lucide-react";
import { type Address } from 'viem';

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  
  const [fundingSources, setFundingSources] = useState<UserFundingSourceDisplayData[]>([]);
  const [isLoadingFundingSources, setIsLoadingFundingSources] = useState(true);
  const [fundingSourceError, setFundingSourceError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    async function fetchSources() {
      if (ready && authenticated && user?.id) {
        setIsLoadingFundingSources(true);
        setFundingSourceError(null);
        try {
          const sources = await getUserFundingSources(user.id);
          setFundingSources(sources);
        } catch (err) {
          console.error("Failed to fetch funding sources on dashboard:", err);
          setFundingSourceError("Failed to load funding information.");
        } finally {
          setIsLoadingFundingSources(false);
        }
      } else if (ready && !authenticated) {
        setIsLoadingFundingSources(false);
        setFundingSources([]);
      }
    }
    fetchSources();
  }, [ready, authenticated, user?.id]);

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

      {isLoadingFundingSources ? (
        <div className="flex items-center justify-center p-4 border rounded-md bg-white">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" /> Loading Funding Sources...
        </div>
      ) : fundingSourceError ? (
         <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
           Error loading funding sources: {fundingSourceError}
         </div>
      ) : fundingSources.length > 0 ? (
        <FundingSourceDisplay />
      ) : (
        <AddFundingSourceForm />
      )}

      <div className="bg-white border border-primary/20 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <BarChart4 className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
        </div>
        {/* <RecentTransactions transactions={recentTransactions} /> */}
      </div>
    </div>
  );
}