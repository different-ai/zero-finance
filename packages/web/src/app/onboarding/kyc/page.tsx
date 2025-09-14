'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { AlignKycStatus } from '@/components/settings/align-integration';
import { steps as onboardingSteps } from '../constants';
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

  const handleKycApproved = () => {
    console.log('KYC Approved! User can now continue manually.');
    completeOnboardingStep('kyc');
    // Note: No automatic redirect - user must click continue
  };

  const handleKycUserAwaitingReview = () => {
    console.log(
      'User has finished KYC external steps. User can now continue manually.',
    );
    completeOnboardingStep('kyc_submitted');
    // Note: No automatic redirect - user must click continue
  };

  const handleContinue = () => {
    const currentPath = '/onboarding/kyc'; // Current page's path
    const currentIndex = onboardingSteps.findIndex(
      (step) => step.path === currentPath,
    );

    if (currentIndex !== -1 && currentIndex < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentIndex + 1];
      console.log(
        `Navigating from ${currentPath} to next step: ${nextStep.name} (${nextStep.path})`,
      );
      router.push(nextStep.path);
    } else {
      console.warn(
        `Could not determine next step from ${currentPath}, or it's the last step. Navigating to /onboarding/complete as a fallback.`,
      );
      router.push('/onboarding/complete'); // Fallback to complete page
    }
  };

  const handleBack = () => {
    const currentPath = '/onboarding/kyc'; // Current page's path
    const currentIndex = onboardingSteps.findIndex(
      (step) => step.path === currentPath,
    );

    if (currentIndex > 0) {
      const prevStep = onboardingSteps[currentIndex - 1];
      console.log(
        `Navigating from ${currentPath} to previous step: ${prevStep.name} (${prevStep.path})`,
      );
      router.push(prevStep.path);
    } else {
      console.warn(
        `Could not determine previous step from ${currentPath}, or it's the first step. Staying on current page.`,
      );
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-[#101010]/10">
          <CardTitle className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Verify Your Identity
          </CardTitle>
          <CardDescription className="text-[14px] text-[#101010]/70 mt-2">
            To ensure the security of your account and comply with regulations,
            we need to verify your identity. This process is handled by our
            trusted partner, Align.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <AlignKycStatus
            onKycApproved={handleKycApproved}
            onKycUserAwaitingReview={handleKycUserAwaitingReview}
            variant="embedded"
          />
        </CardContent>
        <CardFooter className="flex justify-between p-5 sm:p-6 bg-[#F7F7F2] border-t border-[#101010]/10">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-[#101010]/10 text-[#101010] hover:bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-[#1B29FF] hover:bg-[#1B29FF]/90 text-white"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
      <div className="text-center mt-6">
        <Button
          variant="ghost"
          onClick={skipOnboarding}
          disabled={isSkipping}
          className="text-[#101010]/60 hover:text-[#101010]"
        >
          {isSkipping ? 'Skipping...' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}
