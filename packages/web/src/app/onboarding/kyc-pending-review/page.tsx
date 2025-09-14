'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';
import { steps as onboardingSteps } from '../constants';
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';

export default function KycPendingReviewPage() {
  const router = useRouter();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();

  const handleContinueOnboarding = () => {
    const currentPath = '/onboarding/kyc-pending-review';
    const currentIndex = onboardingSteps.findIndex(
      (step) => step.path === currentPath,
    );

    if (currentIndex !== -1 && currentIndex < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentIndex + 1];
      router.push(nextStep.path);
    } else {
      // Fallback or final step, e.g., dashboard or completion if something is wrong
      console.warn(
        'Could not determine next onboarding step, or already at the last defined step. Navigating to /onboarding/complete.',
      );
      router.push('/onboarding/complete');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Verification Submitted
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Thank you for completing the identity verification steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start text-sm text-muted-foreground bg-blue-50 p-4 rounded-md border border-blue-200">
            <Clock className="h-5 w-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
            <div>
              Your documents are now under review by our verification partner.
              This process can take from a few minutes up to 12 hours. We will
              notify you once the review is complete. You can safely continue
              setting up your account in the meantime.
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleContinueOnboarding}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Continue Onboarding
          </Button>
        </CardFooter>
      </Card>
      <div className="text-center mt-4">
        <Button variant="ghost" onClick={skipOnboarding} disabled={isSkipping}>
          {isSkipping ? 'Skipping...' : 'Skip for now'}
        </Button>
      </div>
      <p className="mt-6 text-xs text-gray-500">
        If you have any questions, please contact support.
      </p>
    </div>
  );
}
