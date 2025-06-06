import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export function useSkipOnboarding() {
  const router = useRouter();
  const utils = api.useUtils();
  
  const skipOnboardingMutation = api.onboarding.skipOnboarding.useMutation({
    async onSuccess() {
      // Invalidate relevant queries to reflect the update
      await utils.onboarding.getOnboardingStatus.invalidate();
      // If you have a general user profile query that includes onboarding status, invalidate it too.
      // await utils.user.getProfile.invalidate(); 
      
      // Navigate to dashboard after successful update
      router.push('/dashboard');
    },
    // Optional: Add onError handling
    onError: (error) => {
      console.error("Failed to skip onboarding:", error);
      // Here you could show a toast notification to the user
    }
  });

  const skipOnboarding = async () => {
    // The skipOnboarding mutation doesn't require any parameters
    await skipOnboardingMutation.mutateAsync();
  };

  return {
    skipOnboarding,
    isSkipping: skipOnboardingMutation.isPending,
  };
} 