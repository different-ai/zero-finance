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
      <Card className="w-full border-[#101010]/10 bg-white shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-[15px] sm:text-[16px] font-medium tracking-[-0.01em] text-[#101010]">
            Unlock unlimited deposits & transfers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5">
          <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
            Complete identity verification to unlock bank transfers and accept
            deposits over $10,000.
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3 w-3 text-[#1B29FF]" />
              </div>
              <span className="text-[13px] sm:text-[14px] text-[#101010]/70">
                Unlimited deposit amounts - no $10,000 cap
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3 w-3 text-[#1B29FF]" />
              </div>
              <span className="text-[13px] sm:text-[14px] text-[#101010]/70">
                Bank transfers to and from your account
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3 w-3 text-[#1B29FF]" />
              </div>
              <span className="text-[13px] sm:text-[14px] text-[#101010]/70">
                Earn 8-10% annually on your business savings
              </span>
            </li>
          </ul>

          <div>
            <Button
              onClick={() => setShowTasks(true)}
              className="gap-2 bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
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
