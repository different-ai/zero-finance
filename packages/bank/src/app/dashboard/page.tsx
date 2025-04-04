import { SafeManagementCard } from "@/components/dashboard/safe-management-card";
import { AllocationSummaryCard } from "@/components/dashboard/allocation-summary-card";
import { ActiveAgents } from "@/components/agents/active-agents";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { transactions } from "@/lib/mock-data";
import { BarChart4 } from "lucide-react";

export default function DashboardPage() {
  // Mock data for transactions (can be replaced later)
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Allocation Summary - Uses real data via useAllocationState hook */}
      <AllocationSummaryCard />

      {/* Safe Management - Handles displaying/creating safes */}
      <SafeManagementCard />

      {/* Active Agents section - will only render when agents exist */}
      <ActiveAgents />

      {/* Transactions - Still using mock data for now */}
      <div className="bg-white border border-primary/20 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <BarChart4 className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}