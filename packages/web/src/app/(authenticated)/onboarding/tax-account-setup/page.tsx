'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxAccountSetupForm } from '@/components/onboarding/tax-account-setup-form';

export default function TaxAccountSetupPage() {
  const router = useRouter();

  const handleSetupComplete = () => {
    // Navigate to the next step in onboarding or the dashboard
    // TODO: Determine the correct next step route
    console.log('Tax account setup complete, navigating next...');
    router.push('/onboarding/info'); // Navigate to the Info step
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Up Your Tax Reserve</CardTitle>
          <CardDescription>
            Automatically set aside funds for taxes. This dedicated account helps you stay prepared by reserving a portion of your income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaxAccountSetupForm onSetupComplete={handleSetupComplete} />
        </CardContent>
      </Card>
    </div>
  );
} 