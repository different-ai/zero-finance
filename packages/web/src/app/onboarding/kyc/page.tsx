'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { AlignKycStatus } from '@/components/settings/align-integration';

// Helper to manage onboarding step completion
const completeOnboardingStep = (step: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`onboarding_step_${step}_completed`, 'true');
  }
};

export default function KycOnboardingPage() {
  const router = useRouter();

  const handleKycApproved = () => {
    console.log('KYC Approved! Navigating to completion or next step.');
    completeOnboardingStep('kyc');
    // Navigate to the next step or completion page
    router.push('/onboarding/complete'); 
  };

  const handleKycUserAwaitingReview = () => {
    console.log('User has finished KYC external steps. Navigating to pending review page.');
    completeOnboardingStep('kyc_submitted'); // Optional: mark submission step
    router.push('/onboarding/kyc-pending-review');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-900 pt-8 sm:pt-12 px-4">
      <Card className="w-full max-w-lg shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-white dark:bg-slate-800 p-6 border-b dark:border-slate-700">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verify Your Identity</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
            To ensure the security of your account and comply with regulations, we need to verify your identity. This process is handled by our trusted partner, Align.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <AlignKycStatus
            onKycApproved={handleKycApproved}
            onKycUserAwaitingReview={handleKycUserAwaitingReview} // Pass the new callback
            variant="embedded" // Embedded variant is styled to fit within this card
          />
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-white dark:bg-slate-800 border-t dark:border-slate-200 dark:border-slate-700">
          <Button variant="outline" asChild className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
            <Link href="/onboarding/tax-account-setup"> {/* Adjust if previous step is different */}
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          {/* The "Continue" button might be implicitly handled by AlignKycStatus or next step logic */}
          {/* Or, if KYC is optional or can be skipped (not typical for mandatory KYC): */}
          {/* <Button
            variant="ghost"
            onClick={() => router.push('/onboarding/complete')} // Or next step
            className="dark:text-slate-400 dark:hover:text-slate-200"
          >
            Skip for now
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
