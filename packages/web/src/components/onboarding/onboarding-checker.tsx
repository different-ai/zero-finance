'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { trpc } from '@/utils/trpc';
import { OnboardingFlow } from '@/components/onboarding-flow';
import { OnboardingBanner } from '@/components/onboarding-banner';
import { Loader2 } from 'lucide-react';

export function OnboardingChecker() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const [isChecking, setIsChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Use tRPC query to check onboarding status
  const { 
    data: onboardingStatus, 
    isLoading: isLoadingStatus,
    error: statusError
  } = trpc.onboarding.getOnboardingStatus.useQuery(undefined, {
      enabled: ready && authenticated, // Only run when ready and authenticated
      refetchOnWindowFocus: false, // Don't refetch status constantly
      retry: 1, // Retry once on error
  });

  useEffect(() => {
    // Check onboarding status when data is loaded
    if (ready && authenticated && !isLoadingStatus && onboardingStatus) {
      setIsChecking(false);
      if (!onboardingStatus.hasCompletedOnboarding) {
        setShowOnboarding(true);
        setShowBanner(false);
      } else {
        setShowOnboarding(false);
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
  }, [ready, authenticated, isLoadingStatus, onboardingStatus, statusError, router]);

  // Function to start onboarding from the banner
  const handleStartOnboarding = () => {
    setShowBanner(false);
    setShowOnboarding(true);
  };

  if (isChecking || isLoadingStatus) {
    return null; // Don't show anything while checking
  }

  return (
    <>
      {showOnboarding && <OnboardingFlow />}
      {showBanner && <OnboardingBanner onStartOnboarding={handleStartOnboarding} />}
    </>
  );
} 