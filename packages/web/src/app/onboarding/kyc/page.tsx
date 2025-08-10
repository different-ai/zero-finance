'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { AlignKycStatus } from '@/components/settings/align-integration';
import { steps as onboardingSteps } from '../layout';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';


// Helper to manage onboarding step completion
const completeOnboardingStep = (step: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`onboarding_step_${step}_completed`, 'true');
  }
};

export default function KycOnboardingPage() {
  const router = useRouter();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();

  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false);
  const createAccountsMutation = api.align.createAllVirtualAccounts.useMutation();

  const handleCreateVirtualAccounts = async () => {
    setIsCreatingAccounts(true);
    try {
      const res = await createAccountsMutation.mutateAsync();
      if (res?.success) {
        toast.success(res.message || 'Virtual accounts created');
      } else {
        toast.error(res?.message || 'Failed to create virtual accounts');
      }
    } catch (err) {
      console.error('Create virtual accounts failed', err);
      toast.error('Failed to create virtual accounts');
    } finally {
      setIsCreatingAccounts(false);
    }
  };

  const handleKycApproved = () => {
    console.log('KYC Approved! User can now continue manually.');
    completeOnboardingStep('kyc');
    // Note: No automatic redirect - user must click continue
  };

  const handleKycUserAwaitingReview = () => {
    console.log('User has finished KYC external steps. User can now continue manually.');
    completeOnboardingStep('kyc_submitted');
    // Note: No automatic redirect - user must click continue
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
        <CardContent className="p-6 bg-slate-50 dark:bg-slate-800/50 space-y-6">
          <AlignKycStatus
            onKycApproved={handleKycApproved}
            onKycUserAwaitingReview={handleKycUserAwaitingReview}
            variant="embedded"
          />

          <div className="h-px bg-slate-200 dark:bg-slate-700" />

          {/* Smart Account Section */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-100">Create Smart Account</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Create your smart account to manage crypto transactions and payments.</p>
            <Button asChild size="sm" className="mt-1">
              <Link href="/onboarding/create-safe">Create Smart Account</Link>
            </Button>
          </div>

          {/* Virtual Accounts Section */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-100">Create Virtual Accounts (USD & EUR)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Set up virtual bank accounts to receive USD (ACH/Wire) and EUR (SEPA/IBAN) deposits that auto-convert to stablecoins.</p>
            <Button size="sm" onClick={handleCreateVirtualAccounts} disabled={isCreatingAccounts}>
              {isCreatingAccounts ? 'Creating...' : 'Set Up Accounts'}
            </Button>
          </div>

          {/* Off-ramp note */}
          <p className="text-xs text-slate-500 dark:text-slate-400">Off-ramping (Crypto → Fiat) coming soon.</p>
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
        <Button 
          variant="ghost" 
          onClick={skipOnboarding}
          disabled={isSkipping}
        >
          {isSkipping ? 'Skipping...' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}
