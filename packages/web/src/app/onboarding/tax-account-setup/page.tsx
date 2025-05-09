'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TaxAccountSetupForm } from '@/components/onboarding/tax-account-setup-form';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TaxAccountSetupPage() {
  const router = useRouter();

  const handleSetupComplete = () => {
    // Navigate to the next step in onboarding or the dashboard
    console.log('Tax account setup complete, navigating next...');
    router.push('/onboarding/kyc'); // Navigate to the KYC step
  };

  // Calculate progress based on onboarding step (2nd step out of 4)

  return (
    <div className="w-full mx-auto">
      {/* Progress indicator */}
    

      <Card className="w-full shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center mb-2">
            <Link href="/onboarding/create-safe">
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-xl">Set Up Your Tax Reserve</CardTitle>
          </div>
          <CardDescription>
            This dedicated account automatically sets aside funds for tax obligations, helping you stay compliant with minimal effort.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaxAccountSetupForm onSetupComplete={handleSetupComplete} />
        </CardContent>
      </Card>
    </div>
  );
} 