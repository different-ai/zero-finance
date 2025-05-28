'use client';

import React from 'react';
import { CreateSafeCard } from '@/components/onboarding/create-safe-card';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';
import { steps } from '../layout';

export default function CreateSafePage() {
  const { skipOnboarding, isSkipping } = useSkipOnboarding();

  // Determine the next step for navigation
  const currentStepPath = '/onboarding/create-safe';
  const currentStepIndex = steps.findIndex(
    (step) => step.path === currentStepPath,
  );
  const nextStep =
    currentStepIndex !== -1 && currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1]
      : null;

  return (
    <div className="w-full max-w-lg mx-auto">
      <CreateSafeCard
        showSkipButton={true}
        onSkip={skipOnboarding}
        nextStepPath={nextStep?.path}
        nextStepName={nextStep?.name}
      />
    </div>
  );
}
