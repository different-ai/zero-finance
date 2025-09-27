'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/trpc/react';

export function DashboardRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: onboardingStatus, isLoading } =
    api.onboarding.getOnboardingStatus.useQuery();

  useEffect(() => {
    if (isLoading) return;

    const inviteToken = searchParams.get('invite');
    if (inviteToken) return;

    if (!onboardingStatus?.primarySafeAddress) {
      router.replace('/welcome');
    }
  }, [router, onboardingStatus, isLoading, searchParams]);

  return <>{children}</>;
}
