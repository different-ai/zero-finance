'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '@/trpc/react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-24 w-24 rounded-full bg-[#F9FAFB] flex items-center justify-center animate-pulse">
          <div className="h-12 w-12 rounded-full bg-[#E5E7EB]"></div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-2 text-[#111827]">Loading...</h3>
        <p className="text-[#6B7280]">Please wait while we complete your setup</p>
      </div>
    );
  }

  // If somehow the user reached this page without completing onboarding, send them back
  if (!onboardingStatus?.hasCompletedOnboarding) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4 border border-yellow-200">
          <CheckCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-[#111827]">Onboarding Not Complete</h3>
        <p className="mb-6 text-[#6B7280] text-center max-w-md">
          It seems that your onboarding process is not complete. Let&apos;s go back and finish it.
        </p>
        <Button
          onClick={() => router.push('/onboarding/welcome')}
          className="bg-[#111827] hover:bg-[#111827]/90 text-white px-6 py-2.5 rounded-md shadow-sm"
        >
          Return to Start
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center py-6">
        <div className="w-20 h-20 bg-[#F0FDF4] border border-[#86EFAC] rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-[#10B981]" />
        </div>
        
        <h2 className="text-2xl font-semibold text-[#111827] mb-3">Setup Complete!</h2>
        <p className="text-[#6B7280] text-lg text-center max-w-lg mb-8">
          Your Primary Safe is deployed and ready to use. You can now start managing your finances with HyprSQRL.
        </p>
      </div>
      
      {primarySafe && (
        <Card className="border border-[#E5E7EB]">
          <CardContent className="p-6">
            <h3 className="font-medium text-[#111827] text-lg mb-3">Your Primary Safe Details</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#6B7280]">Address:</span>
              <code className="bg-[#F9FAFB] px-3 py-1 rounded text-sm font-mono border border-[#E5E7EB] flex-1 break-all">
                {primarySafe.safeAddress}
              </code>
            </div>
            <p className="text-[#6B7280] text-sm mt-3">
              This address will be used for receiving invoice payments and managing your funds.
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-6">
        <h3 className="font-medium text-[#111827] text-lg mb-4">What&apos;s Next?</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] flex flex-col">
            <h4 className="font-medium text-[#111827]">Explore Your Dashboard</h4>
            <p className="text-[#6B7280] text-sm mt-2 mb-4 flex-1">
              Get an overview of your finances, see incoming payments, and manage your funds.
            </p>
            <Button
              onClick={navigateToDashboard}
              className="bg-[#111827] hover:bg-[#111827]/90 text-white mt-auto"
            >
              Go to Dashboard
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] flex flex-col">
            <h4 className="font-medium text-[#111827]">Create Your First Invoice</h4>
            <p className="text-[#6B7280] text-sm mt-2 mb-4 flex-1">
              Start using hyprsqrl by creating an invoice to get paid in crypto or fiat.
            </p>
            <Button
              onClick={navigateToInvoices}
              className="bg-[#10B981] hover:bg-[#10B981]/90 text-white mt-auto"
            >
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <a 
          href="https://docs.hyprsqrl.com/start" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <span>View Documentation</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}