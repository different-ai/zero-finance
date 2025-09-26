'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function LoadingCard() {
  return (
    <div className="border border-[#101010]/10 bg-white rounded-md">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 bg-[#101010]/5" />
          <Skeleton className="h-10 w-48 bg-[#101010]/5" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 bg-[#101010]/5" />
          <Skeleton className="h-12 w-32 bg-[#101010]/5" />
        </div>
      </div>
    </div>
  );
}
