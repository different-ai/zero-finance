'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';

export function PostAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ready, authenticated } = usePrivy();

  const inviteToken = useMemo(() => {
    const token = searchParams.get('invite') || searchParams.get('token');
    return token ?? null;
  }, [searchParams]);

  const shouldCheckOnboarding = !inviteToken;

  const { data: onboardingStatus, isLoading: onboardingLoading } =
    api.onboarding.getOnboardingStatus.useQuery(undefined, {
      enabled: shouldCheckOnboarding && ready && authenticated,
      staleTime: 5_000,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (!ready || !authenticated) return;
    if (!inviteToken) return;

    // Redirect invited users to the dedicated join team flow
    router.replace(`/join-team?token=${inviteToken}`);
  }, [ready, authenticated, inviteToken, router]);

  useEffect(() => {
    if (!ready || !authenticated) return;
    if (inviteToken) return;
    if (onboardingLoading) return;

    const hasPrimarySafe = Boolean(onboardingStatus?.primarySafeAddress);
    const hasCompletedFlag = Boolean(
      onboardingStatus?.skippedOrCompletedOnboardingStepper,
    );

    if (!hasPrimarySafe && !hasCompletedFlag) {
      router.replace('/welcome');
    }
  }, [
    ready,
    authenticated,
    inviteToken,
    onboardingLoading,
    onboardingStatus?.primarySafeAddress,
    onboardingStatus?.skippedOrCompletedOnboardingStepper,
    router,
  ]);

  return null;
}
