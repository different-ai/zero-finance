'use client';

import Link from 'next/link';
import { toast } from 'sonner';

type AutoSavingsStatusProps = {
  enabled: boolean;
  allocation: number;
  isDemoMode: boolean;
};

export function AutoSavingsStatus({
  enabled,
  allocation,
  isDemoMode,
}: AutoSavingsStatusProps) {
  if (!enabled) return null;

  return (
    <div className="bg-[#F6F5EF] border border-[#101010]/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
            Auto-Savings Active
          </p>
          <p className="text-[16px] text-[#101010]">
            Automatically saving {allocation}% of incoming deposits
          </p>
        </div>
        {isDemoMode ? (
          <button
            onClick={() =>
              toast(
                'Configure auto-savings once your live account is activated.',
              )
            }
            className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
          >
            Configure →
          </button>
        ) : (
          <Link
            href="/dashboard/savings/settings"
            className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
          >
            Configure →
          </Link>
        )}
      </div>
    </div>
  );
}
