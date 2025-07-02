'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Circle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

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
  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false);
  
  const { data: onboardingStatus, isLoading } =
    api.onboarding.getOnboardingSteps.useQuery(undefined, {
      initialData: initialData as any,
      staleTime: 10 * 1000, // data considered fresh for 10s
      refetchInterval: 5000, // poll every 5 seconds
      refetchOnWindowFocus: false,
    });

  const utils = api.useUtils();
  const createAccountsMutation = api.align.createAllVirtualAccounts.useMutation();

  const handleCreateVirtualAccounts = async () => {
    setIsCreatingAccounts(true);
    try {
      const result = await createAccountsMutation.mutateAsync();
      
      if (result.success) {
        toast.success(result.message);
        // Invalidate queries to refresh the UI
        await utils.onboarding.getOnboardingSteps.invalidate();
        await utils.align.getVirtualAccountDetails.invalidate();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error creating virtual accounts:', error);
      toast.error('Failed to create virtual accounts. Please try again.');
    } finally {
      setIsCreatingAccounts(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Setting up your account</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  console.log('onboardingStatus', onboardingStatus);

  const kycStep = onboardingStatus?.steps?.verifyIdentity;
  const bankAccountStep = onboardingStatus?.steps?.setupBankAccount;
  const safeStep = onboardingStatus?.steps?.createSafe;

  if (
    !onboardingStatus ||
    (kycStep?.isCompleted && bankAccountStep?.isCompleted && safeStep?.isCompleted)
  ) {
    return null;
  }

  const isSafeComplete = safeStep?.isCompleted ?? false;
  const isKycComplete = kycStep?.isCompleted ?? false;
  const kycStatus = kycStep?.status;
  const kycMarkedDone = kycStep?.kycMarkedDone ?? false;
  const isBankAccountComplete = bankAccountStep?.isCompleted ?? false;

  // Step 1: Smart Account Content (always first, no dependencies)
  const safeContent = {
    disabled: false,
    icon: isSafeComplete ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400" />
    ),
    title: 'Create Smart Account',
    description: isSafeComplete
      ? 'Your smart account is created and ready to use.'
      : 'Create a secure smart account to manage your crypto transactions and payments.',
    button: !isSafeComplete ? (
      <Button asChild size="sm" className="w-full sm:w-auto">
        <Link href="/onboarding/create-safe">Create Smart Account</Link>
      </Button>
    ) : null,
  };

  // Step 2: KYC Content (requires safe account)
  let kycContent;

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
      title: 'Action Required',
      description:
        'There was an issue with your identity verification. Please review the details and resubmit.',
      button: (
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/onboarding/kyc">Retry Verification</Link>
        </Button>
      ),
    };
  } else if (kycStep?.kycSubStatus === 'kyc_form_submission_accepted') {
    kycContent = {
      icon: <Loader2 className="h-6 w-6 animate-spin text-blue-500" />,
      title: 'Verification in Review',
      description:
        "Your verification has been submitted successfully and is under review. This usually takes a few minutes to a few hours.",
      button: (
        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
          <Link href="/onboarding/kyc">Check Status</Link>
        </Button>
      ),
    };
  } else if (kycMarkedDone) {
    kycContent = {
      icon: <Loader2 className="h-6 w-6 animate-spin text-blue-500" />,
      title: 'Verification in Review',
      description:
        "You've marked your KYC as complete. We are actively reviewing your submission, which usually takes up to 24 hours. If you made a mistake, you can go back and correct it.",
      button: (
        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
          <Link href="/onboarding/kyc">Check Status or Correct</Link>
        </Button>
      ),
    };
  } else {
    // KYC not done, not rejected, and not marked as complete by user.
    kycContent = {
      disabled: !isSafeComplete,
      icon: !isSafeComplete ? (
        <Circle className="h-6 w-6 text-gray-400" />
      ) : (
        <Circle className="h-6 w-6 text-gray-400" />
      ),
      title: 'Verify Your Identity',
      description: !isSafeComplete
        ? 'Create your smart account first to unlock identity verification.'
        : 'Complete KYC to verify your identity and unlock banking features.',
      button: isSafeComplete ? (
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/onboarding/kyc">Complete KYC</Link>
        </Button>
      ) : null,
    };
  }

  // Step 3: Bank Account Content (requires KYC completion)
  const bankAccountContent = {
    disabled: !isKycComplete,
    icon: !isKycComplete ? (
      <Circle className="h-6 w-6 text-gray-400" />
    ) : isBankAccountComplete ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400" />
    ),
    title: 'Create Virtual Bank Account',
    description: !isKycComplete
      ? 'Complete identity verification to unlock this step.'
      : isBankAccountComplete
        ? 'Your virtual bank accounts are set up and ready to use.'
        : 'Set up virtual bank accounts to receive USD and EUR payments that automatically convert to stablecoins.',
    button:
      isKycComplete && !isBankAccountComplete ? (
        <Button 
          size="sm" 
          onClick={handleCreateVirtualAccounts}
          disabled={isCreatingAccounts}
          className="w-full sm:w-auto"
        >
          {isCreatingAccounts ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Set Up Accounts'
          )}
        </Button>
      ) : null,
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Finish setting up your account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Step 1: Create Smart Account */}
        <div
          className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${
            safeContent.disabled ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-start gap-3 flex-1 w-full">
            <div className="flex-shrink-0 mt-0.5">{safeContent.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{`1. ${safeContent.title}`}</p>
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
          className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${
            kycContent.disabled ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-start gap-3 flex-1 w-full">
            <div className="flex-shrink-0 mt-0.5">{kycContent.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{`2. ${kycContent.title}`}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{kycContent.description}</p>
            </div>
          </div>
          {kycContent.button && (
            <div className="flex-shrink-0 w-full sm:w-auto sm:ml-9">
              {kycContent.button}
            </div>
          )}
        </div>

        {/* Step 3: Create Virtual Bank Account */}
        <div
          className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${
            bankAccountContent.disabled ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-start gap-3 flex-1 w-full">
            <div className="flex-shrink-0 mt-0.5">{bankAccountContent.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{`3. ${bankAccountContent.title}`}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {bankAccountContent.description}
              </p>
            </div>
          </div>
          {bankAccountContent.button && (
            <div className="flex-shrink-0 w-full sm:w-auto sm:ml-9">
              {bankAccountContent.button}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
