'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { OnboardingBanner } from '@/components/onboarding-banner';

export function OnboardingChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, user } = usePrivy();
  const [isChecking, setIsChecking] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  // Use tRPC query to check onboarding status
  const { 
    data: onboardingStatus, 
    isLoading: isLoadingStatus,
    error: statusError
  } = api.onboarding.getOnboardingStatus.useQuery(undefined, {
      enabled: ready && authenticated, // Only run when ready and authenticated
      refetchOnWindowFocus: false, // Don't refetch status constantly
      retry: 1, // Retry once on error
  });

  // Check if we're already in the onboarding flow to avoid redirects
  const isOnboardingPath = pathname?.startsWith('/onboarding');

  useEffect(() => {
    // Check onboarding status when data is loaded
    if (ready && authenticated && !isLoadingStatus && onboardingStatus) {
      setIsChecking(false);
      
      // If onboarding is not complete and user is not already in onboarding flow
      if (!onboardingStatus.hasCompletedOnboarding && !isOnboardingPath) {
        // Redirect to onboarding welcome page
        router.push('/onboarding/welcome');
        setShowBanner(false);
      } else if (onboardingStatus.hasCompletedOnboarding) {
        // If completed, maybe show the banner in certain cases
        setShowBanner(true);
      }
    } else if (ready && !authenticated) {
      // If not authenticated, redirect to sign in
      router.push('/sign-in');
      setIsChecking(false);
    } else if (ready && authenticated && statusError) {
      // Handle error but don't block the UI
      console.error("Error checking onboarding status:", statusError);
      setIsChecking(false);
      // Default to showing the banner as a fallback
      setShowBanner(true);
    }
  }, [ready, authenticated, isLoadingStatus, onboardingStatus, statusError, router, isOnboardingPath]);

  // Function to start onboarding from the banner
  const handleStartOnboarding = () => {
    router.push('/onboarding/welcome');
  };

  if (isChecking || isLoadingStatus) {
    return null; // Don't show anything while checking
  }

  return (
    <>
      {showBanner && !isOnboardingPath && <OnboardingBanner onStartOnboarding={handleStartOnboarding} />}
    </>
  );
} 