'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlignKycStatus } from '@/components/settings/align-integration/align-kyc-status';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function KycOnboardingPage() {
  const router = useRouter();

  const handleKycApproved = () => {
    console.log('KYC Approved in onboarding, navigating to complete...');
    // Add a small delay to allow user to see the success state briefly
    setTimeout(() => {
      router.push('/onboarding/complete');
    }, 1500); 
  };

  return (
    <div className="w-full max-w-lg mx-auto"> {/* Increased max-width slightly */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Verify Your Identity</CardTitle>
          <CardDescription>
            As a final security step, we need to verify your identity using our partner Align.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2"> {/* Reduced padding at bottom */}
          {/* Use embedded variant to avoid nested card look */}
          <AlignKycStatus 
            onKycApproved={handleKycApproved}
            variant="embedded"
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t border-gray-100">
          <Button variant="outline" size="sm" asChild>
            <Link href="/onboarding/tax-account-setup">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Button
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => router.push('/onboarding/complete')}
          >
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 