'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '@/trpc/react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

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
  // const primarySafe = userSafes?.find(safe => safe.safeType === 'primary');

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
    <div className="">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Your Self-Custodial Bank Account is Live!
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mb-4">
              You&apos;re all set up. Your funds are secured on the blockchain, under your full control.
            </p>
            <p className="text-sm text-muted-foreground">
              Confused about &quot;self-custodial&quot;?{' '}
              <Link href="/how-it-works" className="text-primary hover:underline inline-flex items-center gap-1">
                Learn how it works <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg border border-border/40 p-6">
            <h3 className="font-medium text-foreground text-lg mb-4 text-center">What&apos;s Next?</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-background p-4 rounded-lg border border-border/40 flex flex-col">
                <h4 className="font-medium text-foreground">Explore Your Dashboard</h4>
                <p className="text-muted-foreground text-sm mt-2 mb-4 flex-1">
                  Get an overview of your finances, see incoming payments, and manage your funds.
                </p>
                <Button
                  onClick={navigateToDashboard}
                  variant="outline"
                  className="mt-auto"
                >
                  Go to Dashboard
                </Button>
              </div>

              <div className="bg-background p-4 rounded-lg border border-border/40 flex flex-col">
                <h4 className="font-medium text-foreground">Create Your First Invoice</h4>
                <p className="text-muted-foreground text-sm mt-2 mb-4 flex-1">
                  Start using hyprsqrl by creating an invoice to get paid in crypto or fiat.
                </p>
                <Button
                  onClick={navigateToInvoices}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground mt-auto"
                >
                  Create Invoice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}