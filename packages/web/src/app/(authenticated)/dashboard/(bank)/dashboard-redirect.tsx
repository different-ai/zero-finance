'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export function DashboardRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: onboardingStatus, isLoading } =
    api.onboarding.getOnboardingStatus.useQuery();

  useEffect(() => {
    if (isLoading) return;

    if (!onboardingStatus?.primarySafeAddress) {
      router.replace('/welcome');
    }
  }, [router, onboardingStatus, isLoading]);

  return <>{children}</>;
}
