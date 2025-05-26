'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { useUserSafes } from '@/hooks/use-user-safes';

export function OnboardingTasksCard() {
  const { data: profile } = api.user.getProfile.useQuery();
  const { data: kyc } = api.align.getCustomerStatus.useQuery();
  const { data: safes } = useUserSafes();
  
  const utils = api.useUtils();
  const updateProfile = api.user.updateProfile.useMutation({
    async onSuccess() {
      // Invalidate cached profile to reflect the update
      await utils.user.getProfile.invalidate();
    },
  });

  const handleHide = async () => {
    await updateProfile.mutateAsync({
      skippedOrCompletedOnboardingStepper: true,
    });
  };

  // Hide if the user has already skipped or completed the stepper
  if (profile?.skippedOrCompletedOnboardingStepper) return null;

  const hasEmail = !!profile?.email;
  const hasSafe = safes?.some((s) => s.safeType === 'primary');
  const kycDone = kyc?.kycStatus === 'approved';

  const steps = [
    { name: 'Add Email', href: '/onboarding/add-email', done: hasEmail },
    { name: 'Activate Account', href: '/onboarding/create-safe', done: hasSafe },
    { name: 'Verify Identity', href: '/onboarding/kyc', done: kycDone },
  ];

  const allDone = steps.every((s) => s.done);
  if (allDone) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Finish setting up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div key={step.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step.done ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span
                className={step.done ? 'text-muted-foreground line-through' : ''}
              >
                {step.name}
              </span>
            </div>
            {!step.done && (
              <Button asChild size="sm" variant="outline">
                <Link href={step.href}>Start</Link>
              </Button>
            )}
          </div>
        ))}
        <div className="text-center pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleHide}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Skipping...' : 'Skip for now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
