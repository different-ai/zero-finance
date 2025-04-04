import { AccountSummaryCard } from "@/components/dashboard/account-summary-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ActiveAgents } from "@/components/agents/active-agents";
import { SafeManagementCard } from "@/components/dashboard/safe-management-card";
import { accounts, transactions } from "@/lib/mock-data";
import { Wallet, BarChart4 } from "lucide-react";

export default function DashboardPage() {
  // In a real app, this would fetch data from an API
  const userAccounts = accounts;
  const recentTransactions = transactions.slice(0, 5);

  // Calculate total balance
  const totalBalance = userAccounts.reduce((sum, account) => {
    // Convert crypto to USD
    if (account.type === 'crypto') {
      if (account.currency === 'BTC') {
        return sum + account.balance * 65000;
      } else if (account.currency === 'ETH') {
        return sum + account.balance * 3000;
      } else {
        return sum + account.balance; // Stablecoins
      }
    }
    return sum + account.balance;
  }, 0);

  // Get fiat accounts
  const fiatAccounts = userAccounts.filter(account => 
    account.type !== 'crypto'
  );

  // Get crypto accounts
  const cryptoAccounts = userAccounts.filter(account => 
    account.type === 'crypto'
  );

  return (
    <div className="space-y-6">
      {/* Safe Management */}
      <SafeManagementCard />

      {/* Active Agents section - will only render when agents exist */}
      <ActiveAgents />

      {/* Balances summary */}
      <div className="bg-white border border-primary/20 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <Wallet className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Your Balances</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-gray-600">Total Balance (USD)</p>
            <p className="text-2xl font-bold text-gray-800">${totalBalance.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-600">Accounts Distribution</p>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                {fiatAccounts.length} Fiat · {cryptoAccounts.length} Crypto
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${(cryptoAccounts.reduce((sum, a) => sum + (a.balance * (a.currency === 'BTC' ? 65000 : a.currency === 'ETH' ? 3000 : 1)), 0) / totalBalance) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {userAccounts.map((account) => (
            <AccountSummaryCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      {/* Transactions */}
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