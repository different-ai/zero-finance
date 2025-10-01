'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { OnboardingTasksCard } from './onboarding-tasks-card';

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

interface OnboardingInitialData {
  steps: {
    createSafe: OnboardingStep;
    verifyIdentity: OnboardingStep;
    setupBankAccount: OnboardingStep;
  };
  isCompleted: boolean;
}

interface Props {
  initialData?: OnboardingInitialData;
}

export function VirtualAccountOnboardingLayer({ initialData }: Props) {
  const [showTasks, setShowTasks] = useState(false);

  const isFullyCompleted = useMemo(() => {
    if (!initialData) return false;
    const s = initialData.steps;
    return Boolean(s?.verifyIdentity?.isCompleted);
  }, [initialData]);

  if (isFullyCompleted) return null;

  if (!showTasks) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">
            Unlock Bank Deposits & ACH Transfers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Complete identity verification to unlock full banking features and
              earn 8-10% on your business savings.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#0040FF] mt-0.5" />
                ACH transfers to and from your bank account
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#0040FF] mt-0.5" />
                Earn 8-10% annually on your business savings, fully insured
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-[#0040FF] mt-0.5" />
                No lock-ups - access your funds whenever you need them
              </li>
            </ul>
          </div>

          <div>
            <Button onClick={() => setShowTasks(true)} className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <OnboardingTasksCard initialData={initialData as any} />;
}
