'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { useUserSafes } from '@/hooks/use-user-safes';

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
}

interface OnboardingTasksProps {
  initialData?: {
    steps: {
      addEmail: OnboardingStep;
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
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Verify Your Identity</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const kycStep = onboardingStatus?.steps?.verifyIdentity;

  if (!kycStep || kycStep.isCompleted) {
    return null;
  }

  const { status } = kycStep;

  let title: string;
  let description: string;
  let buttonText: string | null = null;
  const buttonHref = '/onboarding/kyc';

  switch (status) {
    case 'pending':
      title = 'Verification in Review';
      description =
        'Your identity verification is currently being reviewed. This usually takes a few minutes.';
      break;
    case 'rejected':
      title = 'Action Required';
      description =
        'There was an issue with your identity verification. Please review the details and resubmit.';
      buttonText = 'Retry Verification';
      break;
    default:
      title = 'Verify Your Identity';
      description =
        'To unlock all features and secure your account, please complete identity verification.';
      buttonText = 'Start Verification';
      break;
  }

  return (
    <Card className="w-full bg-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Circle className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-lg text-blue-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-blue-800/80 text-sm max-w-prose">
            {description}
          </p>
          {buttonText && (
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0">
              <Link href={buttonHref}>{buttonText}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
