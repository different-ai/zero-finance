import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/trpc/react';
/**
 * Hook to handle phone number collection after authentication
 * Checks sessionStorage for pending phone number and saves it to user profile
 */
export function usePhoneCollection() {
  const { authenticated, user } = usePrivy();
  const posthog = usePostHog();
  const updateUserProfile = api.user.updateProfile.useMutation();

  useEffect(() => {
    if (!authenticated || !user) return;

    // Check for pending phone number in sessionStorage
    const pendingPhone = sessionStorage.getItem('pending_phone_number');
    
    if (pendingPhone) {
      // Track that we're saving the phone number
      if (posthog) {
        posthog.capture('phone_number_saved', {
          user_id: user.id,
          email: user.email?.address,
          phone_country_code: pendingPhone.startsWith('+') ? pendingPhone.slice(0, 3) : 'unknown',
        });
      }

      // Save phone number to user profile
      updateUserProfile.mutate(
        { phoneNumber: pendingPhone },
        {
          onSuccess: () => {
            console.log('0xHypr', 'Phone number saved successfully');
            // Clear from sessionStorage after successful save
            sessionStorage.removeItem('pending_phone_number');
          },
          onError: (error) => {
            console.error('0xHypr', 'Failed to save phone number:', error);
          },
        }
      );
    }
  }, [authenticated, user, posthog, updateUserProfile]);

  return {
    isUpdating: updateUserProfile.isLoading,
    error: updateUserProfile.error,
  };
}