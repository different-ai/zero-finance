'use client';

import React from 'react';
import { api } from '@/trpc/react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import NoAccountSetupCard from './NoAccountSetupCard';
import SafeCard from './SafeCard';

export default function SolanaPage() {
  // maybe we can redirect to dashboard so we can avoid refetching the onboarding status
  const { data: onboardingStatus, isLoading } =
      api.onboarding.getOnboardingSteps.useQuery(undefined, {
        staleTime: 10 * 1000, // data considered fresh for 10s
        refetchInterval: 10000, // poll every 5 seconds
        refetchOnWindowFocus: false,
      });

  if (isLoading) {
      return (
        <Card className="w-full">
          <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      );
    }

  const bankAccountStep = onboardingStatus?.steps?.setupBankAccount?.isCompleted ?? false;

  // return some message that indicates the user needs to set up a bank account
  if (!bankAccountStep) return <NoAccountSetupCard />
  return <SafeCard />;
} 