'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { useQueryClient } from '@tanstack/react-query';

export default function CompletePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const utils = api.useUtils();
  
  // Use tRPC query to get the onboarding status
  const { data: onboardingStatus, isLoading } = api.onboarding.getOnboardingStatus.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  
  // Get safes from settings
  const { data: userSafes } = api.settings.userSafes.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  
  // Primary safe is the one created during onboarding
  const primarySafe = userSafes?.find(safe => safe.safeType === 'primary');

  // When this page loads, refresh data to ensure we have the latest state
  useEffect(() => {
    const refreshData = async () => {
      // Invalidate the onboarding status and user safes queries
      await utils.onboarding.getOnboardingStatus.invalidate();
      await utils.settings.userSafes.list.invalidate();
      
      // Also invalidate any allocation state if relevant
      await queryClient.invalidateQueries({ queryKey: ['allocationState'] });
    };
    
    refreshData();
  }, [utils, queryClient]);

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToInvoices = () => {
    router.push('/dashboard/create-invoice');
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Loading...</h3>
      </div>
    );
  }

  // If somehow the user reached this page without completing onboarding, send them back
  if (!onboardingStatus?.hasCompletedOnboarding) {
    return (
      <div className="py-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Onboarding Not Complete</h3>
        <p className="mb-4 text-muted-foreground">
          It seems that your onboarding process is not complete. Let&apos;s go back and finish it.
        </p>
        <Link
          href="/onboarding/welcome"
          className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Start
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Setup Complete!</h3>
        <p className="mb-4 text-muted-foreground">
          Your Primary Safe is deployed and ready to use. You can now start managing your finances with HyprSQRL.
        </p>
        {primarySafe && (
          <p className="text-sm text-muted-foreground mb-6">
            Your Primary Safe address is <strong className="font-mono break-all">{primarySafe.safeAddress}</strong>.
            This address will be used for receiving invoice payments.
          </p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={navigateToDashboard}
            className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={navigateToInvoices}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your First Invoice
          </button>
        </div>
      </div>
    </div>
  );
}