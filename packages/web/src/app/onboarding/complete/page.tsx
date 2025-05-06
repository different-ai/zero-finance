'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, ExternalLink, AlertTriangle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CompletePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Fetch Align KYC status
  const { data: kycStatusData, isLoading: isLoadingKyc } = api.align.getCustomerStatus.useQuery(undefined, {
    refetchOnWindowFocus: false, // Keep this false for onboarding context
  });

  const isKycApproved = kycStatusData?.kycStatus === 'approved';
  
  // When this page loads, refresh data to ensure we have the latest state
  useEffect(() => {
    const refreshData = async () => {
      // Invalidate user safes and any allocation state
      await queryClient.invalidateQueries({ queryKey: ['allocationState'] });
      // Invalidate Align status too, just in case
      await queryClient.invalidateQueries({ queryKey: [['align', 'getCustomerStatus']] });
    };
    
    refreshData();
  }, [queryClient]);

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToInvoices = () => {
    router.push('/dashboard/create-invoice');
  };

  // Add a loading state while fetching KYC status
  if (isLoadingKyc) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-24 w-24 rounded-full bg-[#F9FAFB] flex items-center justify-center animate-pulse">
          <div className="h-12 w-12 rounded-full bg-[#E5E7EB]"></div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-2 text-[#111827]">Loading...</h3>
        <p className="text-[#6B7280]">Finalizing setup...</p>
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
              {isKycApproved ? 'Setup Complete!' : 'Account Activated!'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mb-4">
              {isKycApproved 
                ? 'Your identity is verified and your secure account is ready to use.'
                : 'Your secure account is active. You can complete identity verification later.'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Confused about &quot;self-custodial&quot;?{' '}
              <Link href="/how-it-works" className="text-primary hover:underline inline-flex items-center gap-1">
                Learn how it works <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          </div>

          {/* Conditionally show KYC reminder if not approved */}
          {!isKycApproved && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="font-semibold">Identity Verification Pending</AlertTitle>
              <AlertDescription className="text-sm">
                You can start using your account, but some features like receiving fiat payments require identity verification. 
                Complete this later in your <Link href="/dashboard/settings" className="underline hover:text-amber-900">Settings</Link>.
              </AlertDescription>
            </Alert>
          )}

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