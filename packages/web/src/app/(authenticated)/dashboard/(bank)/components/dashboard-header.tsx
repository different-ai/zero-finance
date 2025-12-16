'use client';

import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  const { isTechnical } = useBimodal();

  return (
    <div className="mb-8">
      <p
        className={cn(
          'uppercase tracking-[0.14em] text-[11px]',
          isTechnical ? 'text-[#1B29FF] font-mono' : 'text-[#101010]/60',
        )}
      >
        {isTechnical ? 'TREASURY::OVERVIEW' : 'ACCOUNT'}
      </p>
      <h1
        className={cn(
          'mt-2 leading-[1.1] tracking-[-0.01em] text-[#101010]',
          isTechnical
            ? 'font-mono text-[28px] sm:text-[32px]'
            : 'font-serif text-[32px] sm:text-[40px]',
        )}
      >
        {isTechnical ? 'Treasury Dashboard' : 'Your Account'}
      </h1>
      <p
        className={cn(
          'mt-3 text-[15px] max-w-[600px]',
          isTechnical ? 'text-[#101010]/60 font-mono' : 'text-[#101010]/70',
        )}
      >
        {isTechnical
          ? 'View your balances, manage deposits, and track your financial activity.'
          : 'View your balances, manage deposits, and track your financial activity.'}
      </p>
    </div>
  );
}
