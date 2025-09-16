'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { InsuranceWarning } from '@/components/insurance-warning';
import { toast } from 'sonner';

export function InsuranceActivationHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activateInsurance = api.user.activateInsurance.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    const shouldActivate = searchParams.get('activate_insurance');

    if (shouldActivate === 'true') {
      // Activate insurance for this user
      activateInsurance.mutate(undefined, {
        onSuccess: () => {
          toast.success(
            'Insurance coverage activated! All risk warnings have been removed.',
          );
          // Refresh user profile
          utils.user.getProfile.invalidate();
          // Remove query param from URL
          router.replace('/dashboard');
        },
        onError: (error) => {
          toast.error(
            'Failed to activate insurance. Please try again or contact support.',
          );
          console.error('Insurance activation error:', error);
        },
      });
    }
  }, [searchParams]);

  return <InsuranceWarning variant="dashboard" />;
}
