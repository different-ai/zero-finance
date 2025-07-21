import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { usePostHog } from 'posthog-js/react';
/**
 * Hook to handle phone number collection after authentication
 * Checks sessionStorage for pending phone number and saves it to user profile
 */
export function usePhoneCollection() {
  const { authenticated, user } = usePrivy();
  const posthog = usePostHog();

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

      // For now, we'll just log and clear the pending phone number
      // TODO: Implement phone number storage once the backend supports it
      console.log('0xHypr', 'Phone number collected:', pendingPhone);
      sessionStorage.removeItem('pending_phone_number');
    }
  }, [authenticated, user, posthog]);

  return {
    isUpdating: false,
    error: null,
  };
}