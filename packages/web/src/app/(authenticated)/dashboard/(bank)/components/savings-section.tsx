import { HydrationBoundary } from '@tanstack/react-query';
import { getUserId } from '@/lib/auth';
import { getSavingsOverview } from '@/server/savings/get-savings-overview';
import SavingsPageWrapper from '../../savings/page-wrapper';
import type { SavingsExperienceMode } from '@/hooks/use-demo-savings';

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

  return (
    <section>
      <div className="mb-4">
        <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          Savings
        </h2>
        <p className="mt-1 text-[14px] text-[#101010]/60">
          Earn 8% APY on your idle cash reserves
        </p>
      </div>

      <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <HydrationBoundary state={dehydratedState}>
          <div className="p-6 sm:p-8">
            <SavingsPageWrapper
              mode={mode}
              initialSafeAddress={safeAddress}
              initialCheckingBalance={checkingBalance}
            />
          </div>
        </HydrationBoundary>
      </div>
    </section>
  );
}
