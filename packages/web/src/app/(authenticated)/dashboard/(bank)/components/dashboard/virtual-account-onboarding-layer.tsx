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
            Your account is ready for deposits up to $10,000
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5">
          <div className="bg-[#10b981]/5 border border-[#10b981]/20 p-3 rounded-md">
            <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/90 font-medium">
              Start earning today! Deposit USDC or USD to begin.
            </p>
          </div>

          <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/70">
            Want to deposit more than $10,000? Complete verification to unlock:
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3 w-3 text-[#1B29FF]" />
              </div>
              <span className="text-[13px] sm:text-[14px] text-[#101010]/70">
                Unlimited deposit amounts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3 w-3 text-[#1B29FF]" />
              </div>
              <span className="text-[13px] sm:text-[14px] text-[#101010]/70">
                Bank transfers (ACH) in and out
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-3 w-3 text-[#1B29FF]" />
              </div>
              <span className="text-[13px] sm:text-[14px] text-[#101010]/70">
                Full access to all features
              </span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowTasks(true)}
              className="gap-2 bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Complete Verification
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-[#101010]/20 text-[#101010] hover:bg-[#F7F7F2] font-medium px-6 py-3 rounded-md transition-colors"
              onClick={() => {
                // Navigate to deposit page or open deposit modal
                window.location.href = '/dashboard/deposit';
              }}
            >
              Deposit Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <OnboardingTasksCard initialData={initialData as any} />;
}
