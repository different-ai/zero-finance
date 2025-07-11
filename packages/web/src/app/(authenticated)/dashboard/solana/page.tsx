'use client';

import React from 'react';
import { api } from '@/trpc/react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import NoAccountSetupCard from './no-account-setup-card';
import SafeCard from './safe-card';

export default function SolanaPage() {
  // maybe we can redirect to dashboard so we can avoid refetching the onboarding status
  const { data: onboardingStatus, isLoading } =
    api.onboarding.getOnboardingSteps.useQuery(undefined);
  const { ready } = useSolanaWallets();
  if (isLoading || !ready) {
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