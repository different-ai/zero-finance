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
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { AlignKycStatus } from '@/components/settings/align-integration';
import { steps as onboardingSteps } from '../constants';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';
import { usePrivy } from '@privy-io/react-auth';

const completeOnboardingStep = (step: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`onboarding_step_${step}_completed`, 'true');
  }
};

export default function KycOnboardingPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();
  const [kycApproved, setKycApproved] = React.useState(false);

  React.useEffect(() => {
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  const handleKycApproved = () => {
    console.log('KYC Approved! User can now continue manually.');
    completeOnboardingStep('kyc');
    setKycApproved(true);
  };

  const handleKycUserAwaitingReview = () => {
    console.log(
      'User has finished KYC external steps. User can now continue manually.',
    );
    completeOnboardingStep('kyc_submitted');
  };

  const handleContinue = () => {
    const currentPath = '/onboarding/kyc';
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
      router.push('/onboarding/complete');
    }
  };

  const handleBack = () => {
    const currentPath = '/onboarding/kyc';
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
    <div className="w-full space-y-4">
      {/* Sidebar callout - highly visible */}
      <div className="bg-gradient-to-r from-[#0050ff] to-[#0040dd] text-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,80,255,0.15)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-[14px] font-semibold">
                Need Help? Check the Sidebar
              </h3>
            </div>
            <p className="text-[13px] text-white/90 leading-[1.5]">
              Look to the right for detailed FAQs, an AI assistant to answer
              questions, and a cap table converter tool. All your resources are
              there to help you through each step.
            </p>
          </div>
        </div>
      </div>

      {/* Verification partners info */}
      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-4 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0050ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="h-4 w-4 text-[#0050ff]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-[#101010] mb-1">
              About Our Partners
            </h3>
            <p className="text-[12px] text-[#101010]/70 leading-[1.5]">
              <span className="font-semibold">AiPrise</span> handles your
              business and identity verification.{' '}
              <span className="font-semibold">Align</span> is our financial
              services provider for deposits and transfers. Both are regulated
              providers with strict security standards.
            </p>
          </div>
        </div>
      </div>

      <Card className="w-full bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-[#101010]/10">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
            VERIFICATION
          </p>
          <CardTitle className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Verify Your Identity
          </CardTitle>
          <CardDescription className="text-[14px] text-[#101010]/70 mt-3">
            Complete the verification process to unlock all banking features.
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
          {kycApproved ? (
            <Button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue to Next Step
            </Button>
          ) : (
            <Button
              onClick={skipOnboarding}
              variant="outline"
              disabled={isSkipping}
              className="border-[#101010]/10 text-[#101010] hover:bg-white"
            >
              {isSkipping ? 'Skipping...' : 'Skip KYC for now'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
