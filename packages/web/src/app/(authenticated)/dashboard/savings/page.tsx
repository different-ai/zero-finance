import { Suspense } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';
import { getUserId } from '@/lib/auth';
import { getSavingsOverview } from '@/server/savings/get-savings-overview';
import SavingsPageWrapper from './page-wrapper';
import { redirect } from 'next/navigation';

// Loading state skeleton
function SavingsLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-3 w-28 bg-[#101010]/5 rounded animate-pulse" />
        <div className="h-10 w-64 bg-[#101010]/5 rounded animate-pulse" />
        <div className="h-4 w-full max-w-[440px] bg-[#101010]/5 rounded animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10 rounded-lg overflow-hidden">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 space-y-3">
              <div className="h-3 w-20 bg-[#101010]/5 rounded animate-pulse" />
              <div className="h-8 w-28 bg-[#101010]/5 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-lg p-6 space-y-4">
          <div className="h-3 w-36 bg-[#101010]/5 rounded animate-pulse" />
          <div className="h-12 w-52 bg-[#101010]/5 rounded animate-pulse" />
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-lg">
          <div className="p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
            <div className="h-4 w-full bg-[#101010]/5 rounded animate-pulse" />
          </div>
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border-b border-[#101010]/5">
              <div className="h-6 w-full bg-[#101010]/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server component for data fetching
async function SavingsContent() {
  const userId = await getUserId();

  if (!userId) {
    redirect('/signin');
  }

  const { safeAddress, checkingBalance, dehydratedState } =
    await getSavingsOverview({
      userId,
      mode: 'real',
    });

  return (
    <HydrationBoundary state={dehydratedState}>
      <SavingsPageWrapper
        mode="real"
        initialSafeAddress={safeAddress}
        initialCheckingBalance={checkingBalance}
      />
    </HydrationBoundary>
  );
}

export default async function SavingsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            SAVINGS
          </p>
          <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Savings & Yield
          </h1>
          <p className="mt-3 text-[15px] text-[#101010]/70 max-w-[600px]">
            Manage your savings, view vault performance, and optimize your yield
            across all positions.
          </p>
        </div>

        {/* Savings Content */}
        <Suspense fallback={<SavingsLoadingSkeleton />}>
          <SavingsContent />
        </Suspense>
      </div>
    </div>
  );
}
