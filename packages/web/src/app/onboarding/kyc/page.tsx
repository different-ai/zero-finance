'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { AlignKycStatus } from '@/components/settings/align-integration';
import { steps as onboardingSteps } from '../layout';


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
    router.push('/onboarding/complete'); 
  };

  const handleKycUserAwaitingReview = () => {
    console.log('User has finished KYC external steps. Navigating to pending review page.');
    completeOnboardingStep('kyc_submitted');
    router.push('/onboarding/kyc-pending-review');
  };

  const handleContinue = () => {
    const currentPath = '/onboarding/kyc'; // Current page's path
    const currentIndex = onboardingSteps.findIndex(step => step.path === currentPath);

    if (currentIndex !== -1 && currentIndex < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentIndex + 1];
      console.log(`Navigating from ${currentPath} to next step: ${nextStep.name} (${nextStep.path})`);
      router.push(nextStep.path);
    } else {
      console.warn(`Could not determine next step from ${currentPath}, or it's the last step. Navigating to /onboarding/complete as a fallback.`);
      router.push('/onboarding/complete'); // Fallback to complete page
    }
  };

  const handleBack = () => {
    const currentPath = '/onboarding/kyc'; // Current page's path
    const currentIndex = onboardingSteps.findIndex(step => step.path === currentPath);

    if (currentIndex > 0) {
      const prevStep = onboardingSteps[currentIndex - 1];
      console.log(`Navigating from ${currentPath} to previous step: ${prevStep.name} (${prevStep.path})`);
      router.push(prevStep.path);
    } else {
      console.warn(`Could not determine previous step from ${currentPath}, or it's the first step. Staying on current page.`);
    }
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
            onKycUserAwaitingReview={handleKycUserAwaitingReview}
            variant="embedded"
          />
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-white dark:bg-slate-800 border-t dark:border-slate-200 dark:border-slate-700">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            variant="ghost"
            onClick={handleContinue}
            className="dark:text-slate-400 dark:hover:text-slate-200"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
      <div className="text-center mt-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}
