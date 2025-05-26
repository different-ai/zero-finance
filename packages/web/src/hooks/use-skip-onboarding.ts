import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export function useSkipOnboarding() {
  const router = useRouter();
  const utils = api.useUtils();
  
  const updateProfile = api.user.updateProfile.useMutation({
    async onSuccess() {
      // Invalidate cached profile to reflect the update
      await utils.user.getProfile.invalidate();
      // Navigate to dashboard after successful update
      router.push('/dashboard');
    },
  });

  const skipOnboarding = async () => {
    await updateProfile.mutateAsync({
      skippedOrCompletedOnboardingStepper: true,
    });
  };

  return {
    skipOnboarding,
    isSkipping: updateProfile.isPending,
  };
} 