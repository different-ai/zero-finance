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
      openSavings?: OnboardingStep;
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

  const isKycComplete = kycStep?.isCompleted ?? false;
  const kycStatus = kycStep?.status;
  const kycMarkedDone = kycStep?.kycMarkedDone ?? false;
  const kycSubStatus = kycStep?.kycSubStatus;

  // If KYC is complete, don't show the card
  if (isKycComplete) return null;
  let kycContent: {
    icon: React.ReactNode;
    title: string;
    description: string;
    button: React.ReactNode | null;
  };

  if (kycStatus === 'rejected') {
    kycContent = {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      title: 'Verification Failed',
      description: 'Please review and resubmit your information.',
      button: (
        <Button asChild className="w-full">
          <Link href="/onboarding/info">Retry Verification</Link>
        </Button>
      ),
    };
  } else if (
    kycStatus === 'pending' &&
    (kycMarkedDone || kycSubStatus === 'kyc_form_submission_accepted')
  ) {
    kycContent = {
      icon: <Loader2 className="h-6 w-6 animate-spin text-[#0050ff]" />,
      title: 'Verification Pending',
      description:
        'Your verification is being reviewed. This usually takes a few minutes.',
      button: null,
    };
  } else if (kycStatus === 'pending') {
    kycContent = {
      icon: <Circle className="h-6 w-6 text-[#0050ff]" />,
      title: 'Continue Identity Verification',
      description:
        "You started verification but haven't finished. Continue where you left off.",
      button: (
        <Button asChild className="w-full">
          <Link href="/onboarding/info">Continue Verification</Link>
        </Button>
      ),
    };
  } else {
    kycContent = {
      icon: <Circle className="h-6 w-6 text-gray-400" />,
      title: 'Complete Identity Verification',
      description:
        'Verify your identity to unlock bank deposits and ACH transfers.',
      button: (
        <Button asChild className="w-full">
          <Link href="/onboarding/info">Start Verification</Link>
        </Button>
      ),
    };
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">
          {kycContent.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{kycContent.icon}</div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{kycContent.description}</p>
          </div>
        </div>
        {kycContent.button && <div className="pt-2">{kycContent.button}</div>}
      </CardContent>
    </Card>
  );
}
