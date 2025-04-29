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
    router.push('/onboarding/complete'); // Navigate to the final step
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm"> 
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Set Up Your Tax Reserve</CardTitle>
        <CardDescription>
          Automatically set aside funds for taxes with this dedicated account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TaxAccountSetupForm onSetupComplete={handleSetupComplete} />
      </CardContent>
    </Card>
  );
} 