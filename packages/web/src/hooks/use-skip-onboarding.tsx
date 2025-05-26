'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

export function useSkipOnboarding() {
  const router = useRouter();
  const utils = api.useUtils();
  
  const skipOnboardingMutation = api.onboarding.skipOnboarding.useMutation({
    onSuccess: async () => {
      // Invalidate any cached user profile data
      await utils.user.getProfile.invalidate();
      await utils.onboarding.getOnboardingStatus.invalidate();
      
      // Clear any onboarding-related localStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hide_onboarding_card');
      }
      
      // Navigate to dashboard
      router.push('/dashboard');
      
      // Show success toast
      toast.success('Onboarding skipped. You can complete setup anytime from the dashboard.');
    },
    onError: (error) => {
      console.error('Failed to skip onboarding:', error);
      toast.error('Failed to skip onboarding. Please try again.');
    }
  });

  const handleSkipOnboarding = () => {
    skipOnboardingMutation.mutate();
  };

  return {
    skipOnboarding: handleSkipOnboarding,
    isSkipping: skipOnboardingMutation.isPending,
  };
}