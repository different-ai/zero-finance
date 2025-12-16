import { HydrationBoundary } from '@tanstack/react-query';
import { getUserId } from '@/lib/auth';
import { getSavingsOverview } from '@/server/savings/get-savings-overview';
import type { SavingsExperienceMode } from '@/hooks/use-demo-savings';
import { DashboardSummaryWrapper } from './dashboard-summary-wrapper';

type SavingsSectionProps = {
  mode?: SavingsExperienceMode;
};

export async function SavingsSection({ mode = 'real' }: SavingsSectionProps) {
  const userId = await getUserId();

  if (!userId) {
    return null;
  }

  const { safeAddress, checkingBalance, dehydratedState } =
    await getSavingsOverview({
      userId,
      mode,
    });

  // Calculate checking balance in USD
  const checkingBalanceUsd = checkingBalance
    ? Number(checkingBalance.balance) / 1e6
    : 0;

  return (
    <section>
      <HydrationBoundary state={dehydratedState}>
        <DashboardSummaryWrapper
          initialSafeAddress={safeAddress}
          initialCheckingBalance={checkingBalanceUsd}
          isDemoMode={mode === 'demo'}
        />
      </HydrationBoundary>
    </section>
  );
}
