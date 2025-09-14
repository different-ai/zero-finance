'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

type OnboardingStepStatus =
  | 'not_started'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'none';

interface OnboardingStep {
  isCompleted: boolean;
  status: OnboardingStepStatus;
  kycMarkedDone?: boolean;
  kycSubStatus?: string | null;
}

interface OnboardingTasksProps {
  initialData?: {
    steps: {
      createSafe: OnboardingStep;
      verifyIdentity: OnboardingStep;
      setupBankAccount: OnboardingStep;
    };
    isCompleted: boolean;
  };
}

export function OnboardingTasksCard({ initialData }: OnboardingTasksProps) {
  const { data: onboardingStatus, isLoading } =
    api.onboarding.getOnboardingSteps.useQuery(undefined, {
      initialData: initialData as any,
      staleTime: 10 * 1000,
      refetchInterval: 5000,
      refetchOnWindowFocus: false,
    });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const kycStep = onboardingStatus?.steps?.verifyIdentity;
  const safeStep = onboardingStatus?.steps?.createSafe;

  if (!onboardingStatus) {
    return null;
  }

  const isSafeComplete = safeStep?.isCompleted ?? false;
  const isKycComplete = kycStep?.isCompleted ?? false;
  const kycStatus = kycStep?.status;
  const kycMarkedDone = kycStep?.kycMarkedDone ?? false;

  // Check if all steps are complete
  const isAllComplete = isSafeComplete && isKycComplete;

  // If onboarding is complete, don't show the card
  if (isAllComplete) return null;

  // Step 1: Activate Primary Account
  const safeContent = {
    icon: isSafeComplete ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400" />
    ),
    title: 'Activate Primary Account',
    description: isSafeComplete
      ? 'Your primary account is activated and ready.'
      : 'Set up your secure smart account to get started.',
    button: !isSafeComplete ? (
      <Button asChild size="sm" className="w-full sm:w-auto">
        <Link href="/onboarding/create-safe">Get Started</Link>
      </Button>
    ) : null,
  };

  // Step 2: Verify Identity
  let kycContent: {
    disabled?: boolean;
    icon: React.ReactNode;
    title: string;
    description: string;
    button: React.ReactNode | null;
  };

  if (isKycComplete) {
    kycContent = {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: 'Identity Verified',
      description: 'Your identity has been successfully verified.',
      button: null,
    };
  } else if (kycStatus === 'rejected') {
    kycContent = {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      title: 'Verification Failed',
      description: 'Please review and resubmit your information.',
      button: (
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/onboarding/kyc">Retry</Link>
        </Button>
      ),
    };
  } else if (
    kycStatus === 'pending' ||
    kycStep?.kycSubStatus === 'kyc_form_submission_accepted' ||
    kycMarkedDone
  ) {
    kycContent = {
      icon: <Loader2 className="h-6 w-6 animate-spin text-[#0050ff]" />,
      title: 'Verification Pending',
      description: 'Your verification is being reviewed.',
      button: null,
    };
  } else {
    kycContent = {
      disabled: !isSafeComplete,
      icon: <Circle className="h-6 w-6 text-gray-400" />,
      title: 'Verify Identity',
      description: !isSafeComplete
        ? 'Complete account setup first.'
        : 'Verify your identity to unlock all features.',
      button: isSafeComplete ? (
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/onboarding/kyc">Verify</Link>
        </Button>
      ) : null,
    };
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">
          Complete Your Account Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Step 1: Activate Primary Account */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="flex items-start gap-3 flex-1 w-full">
              <div className="flex-shrink-0 mt-0.5">{safeContent.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {safeContent.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {safeContent.description}
                </p>
              </div>
            </div>
            {safeContent.button && (
              <div className="flex-shrink-0 w-full sm:w-auto sm:ml-9">
                {safeContent.button}
              </div>
            )}
          </div>

          {/* Step 2: Verify Identity */}
          <div
            className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${kycContent.disabled ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-3 flex-1 w-full">
              <div className="flex-shrink-0 mt-0.5">{kycContent.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {kycContent.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {kycContent.description}
                </p>
              </div>
            </div>
            {kycContent.button && (
              <div className="flex-shrink-0 w-full sm:w-auto sm:ml-9">
                {kycContent.button}
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {!isSafeComplete && (
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href="/onboarding/create-safe">Continue Setup →</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
