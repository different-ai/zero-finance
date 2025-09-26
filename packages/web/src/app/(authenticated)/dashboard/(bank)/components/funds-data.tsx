import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { USDC_ADDRESS } from '@/lib/constants';
import { FundsDisplayWithDemo } from './dashboard/funds-display-with-demo';
import { EmptyCheckingAccount } from './dashboard/empty-states';

const log = {
  info: (payload: any, message: string) =>
    console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload: any, message: string) =>
    console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload: any, message: string) =>
    console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
};

export async function FundsData() {
  const userId = await getUserId();

  if (!userId) return <EmptyCheckingAccount />;

  const caller = appRouter.createCaller({ userId, db, log });
  const primarySafe = await caller.user.getPrimarySafeAddress();

  if (!primarySafe?.primarySafeAddress) {
    return <EmptyCheckingAccount />;
  }

  const balanceData = await caller.safe.getBalance({
    safeAddress: primarySafe.primarySafeAddress,
    tokenAddress: USDC_ADDRESS,
  });

  const totalBalance = balanceData ? Number(balanceData.balance) / 1e6 : 0;

  return (
    <FundsDisplayWithDemo
      totalBalance={totalBalance}
      walletAddress={primarySafe.primarySafeAddress}
    />
  );
}
