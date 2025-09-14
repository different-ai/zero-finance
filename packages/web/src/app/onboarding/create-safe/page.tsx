'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreateSafeCard } from '@/components/onboarding/create-safe-card';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';
import { steps } from '../constants';
import { FileText, Percent, ShieldCheck } from 'lucide-react';

export default function CreateSafePage() {
  const router = useRouter();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();

  const currentStepPath = '/onboarding/create-safe';
  const currentStepIndex = steps.findIndex(
    (step) => step.path === currentStepPath,
  );
  const nextStep =
    currentStepIndex !== -1 && currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1]
      : { path: '/onboarding/complete', name: 'Complete' };

  const handleSuccess = () => {
    if (nextStep) {
      router.push(nextStep.path);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Activate Your Secure Account
        </h1>
        <p className="text-gray-600 mt-2">
          First, let&apos;s set up your smart account to enable these features:
        </p>
      </div>

      <div className="space-y-4 mb-8 text-left p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-gray-700">
            <span className="font-semibold text-gray-800">
              Professional Invoicing:
            </span>{' '}
            Create and send invoices to get paid in USD, EUR, or crypto.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <Percent className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-gray-700">
            <span className="font-semibold text-gray-800">
              High-Yield Savings:
            </span>{' '}
            Earn attractive returns on your idle assets automatically.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <ShieldCheck className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-gray-700">
            <span className="font-semibold text-gray-800">Self-Custody:</span>{' '}
            Your funds are protected with a secure, self-custodial smart
            account.
          </p>
        </div>
      </div>

      <CreateSafeCard
        onSuccess={handleSuccess}
        onSkip={skipOnboarding}
        showSkipButton={true}
      />
    </div>
  );
}
