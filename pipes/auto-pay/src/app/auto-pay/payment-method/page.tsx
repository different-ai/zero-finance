'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSettings } from '@/hooks/use-settings';
import { OnboardingDialog } from '@/components/onboarding-dialog';

export default function PaymentMethodPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [isOnboardingDialogOpen, setIsOnboardingDialogOpen] = useState(false);
  const handleMethodSelect = useCallback(
    (method: 'mercury' | 'wise') => {
      router.push(`/auto-pay/detect/${method}`);
    },
    [router]
  );

  // show onboarding dialog when no provider is configured
  useEffect(() => {
    if (
      !settings?.customSettings?.['auto-pay']?.mercuryApiKey ||
      !settings?.customSettings?.['auto-pay']?.mercuryAccountId
    ) {
      setIsOnboardingDialogOpen(true);
    }
    // if configured close it
    if (
      settings?.customSettings?.['auto-pay']?.mercuryApiKey &&
      settings?.customSettings?.['auto-pay']?.mercuryAccountId
    ) {
      setIsOnboardingDialogOpen(false);
    }
  }, [settings]);

  const isMercuryConfigured =
    settings?.customSettings?.['auto-pay']?.mercuryApiKey ||
    settings?.customSettings?.['auto-pay']?.mercuryAccountId;

  console.log(settings);

  return (
    <main className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
          <CardDescription>
            Choose how you want to process this payment
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-32"
            onClick={() => handleMethodSelect('mercury')}
            disabled={!isMercuryConfigured}
          >
            <div className="text-center">
              <h3 className="font-medium">Mercury</h3>
              {!isMercuryConfigured && (
                <p className="text-sm text-muted-foreground mt-2">
                  Not configured
                </p>
              )}
            </div>
          </Button>
          <Button variant="outline" size="lg" className="h-32" disabled>
            <div className="text-center">
              <h3 className="font-medium">Wise</h3>
              <p className="text-sm text-muted-foreground mt-2">Coming Soon</p>
            </div>
          </Button>
        </CardContent>
      </Card>
      <OnboardingDialog
        open={isOnboardingDialogOpen}
        onOpenChange={setIsOnboardingDialogOpen}
      />
    </main>
  );
}
