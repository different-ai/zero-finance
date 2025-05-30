'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, FileText, Percent, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { steps } from '../layout'; // Import steps
import { useSkipOnboarding } from '@/hooks/use-skip-onboarding';

export default function WelcomePage() {
  const router = useRouter();
  const { skipOnboarding, isSkipping } = useSkipOnboarding();

  // Determine the next step for navigation
  const currentStepPath = '/onboarding/welcome';
  const currentStepIndex = steps.findIndex(
    (step) => step.path === currentStepPath,
  );
  const nextStep = currentStepIndex !== -1 && currentStepIndex < steps.length - 1
    ? steps[currentStepIndex + 1]
    : null;

  return (
    <div className="">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Welcome to hyperstable!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Get ready to manage your global payments and savings effortlessly.
          </p>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Professional Invoicing:</span> Create and send invoices to get paid in USD, EUR, or crypto.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Percent className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">High-Yield Savings:</span> Earn over 10% on your idle assets automatically.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Secure Account:</span> Your funds are protected with a self-custodial smart account.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            <Button
              onClick={() => {
                if (nextStep) {
                  router.push(nextStep.path);
                } else {
                  // Fallback if next step isn't found (shouldn't happen with correct setup)
                  router.push('/dashboard'); 
                }
              }}
              className="w-full"
              size="lg"
            >
              {nextStep ? `Continue to ${nextStep.name}` : 'Let\'s Get Started'} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <Button 
          variant="ghost" 
          onClick={skipOnboarding}
          disabled={isSkipping}
        >
          {isSkipping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Skipping...
            </>
          ) : (
            'Skip for now'
          )}
        </Button>
      </div>
    </div>
  );
}
