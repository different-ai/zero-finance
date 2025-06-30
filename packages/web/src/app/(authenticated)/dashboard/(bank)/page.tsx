import AccountCard from "@/components/dashboard/account-card"
import TransactionHistory from "@/components/dashboard/transaction-history"
import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { redirect } from 'next/navigation';

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

  // Fetch balance and primary safe address
  const fundsData = await caller.dashboard.getBalance().catch(() => ({
    totalBalance: 0,
    primarySafeAddress: undefined,
  }));

  const userBalance = fundsData.totalBalance || 0
  const safeAddress = fundsData.primarySafeAddress || "0x0000000000000000000000000000000000000000"

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
      <AccountCard initialBalance={userBalance} safeAddress={safeAddress} />
      <TransactionHistory />
    </div>
  )
}
