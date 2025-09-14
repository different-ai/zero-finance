'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Wallet,
  ArrowRight,
  Building2,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';

export function EmptyCheckingAccount() {
  // Get onboarding status to determine what action to show
  const { data: onboardingData } = api.onboarding.getOnboardingSteps.useQuery(
    undefined,
    {
      staleTime: 30 * 1000,
    },
  );

  const safeComplete = onboardingData?.steps?.createSafe?.isCompleted;
  const kycComplete = onboardingData?.steps?.verifyIdentity?.isCompleted;

  // Determine primary action based on onboarding status
  let primaryAction = {
    href: '/onboarding/create-safe',
    text: 'Complete Setup',
  };

  if (safeComplete && !kycComplete) {
    primaryAction = {
      href: '/onboarding/kyc',
      text: 'Verify Identity',
    };
  } else if (safeComplete && kycComplete) {
    primaryAction = {
      href: '/dashboard/earn',
      text: 'Make Deposit',
    };
  }

  return (
    <Card className="border border-[#101010]/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#F7F7F2] rounded-lg">
                <Wallet className="h-5 w-5 text-[#101010]/60" />
              </div>
              <div>
                <p className="text-sm text-[#101010]/60">Balance</p>
                <p className="text-2xl font-semibold text-[#101010]">$0.00</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-[#101010]/70">
                {!safeComplete
                  ? 'Complete your account setup to start receiving funds.'
                  : !kycComplete
                    ? 'Verify your identity to unlock all features.'
                    : 'Your account is ready. Make a deposit to get started.'}
              </p>

              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#1B29FF] hover:bg-[#1B29FF]/90"
                >
                  <Link href={primaryAction.href}>
                    {primaryAction.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/settings">View Account Details</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="ml-6 text-right">
            <p className="text-xs text-[#101010]/60 mb-1">Account Status</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {safeComplete && kycComplete
                ? 'Ready'
                : safeComplete
                  ? 'Pending KYC'
                  : 'Pending Setup'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptySavingsAccount() {
  return (
    <div className="bg-white border border-[#101010]/10 rounded-[12px] p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="p-3 bg-[#F7F7F2] rounded-full w-fit mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-[#1B29FF]" />
        </div>

        <h3 className="text-xl font-semibold text-[#101010] mb-2">
          Activate Savings to Earn 8% APY
        </h3>

        <p className="text-sm text-[#101010]/70 mb-6">
          Your idle cash could be earning $200,000+ per year on a $2.5M balance.
          Activate your savings account in one click.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1B29FF]">8%</p>
            <p className="text-xs text-[#101010]/60">APY</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#101010]">$0</p>
            <p className="text-xs text-[#101010]/60">Minimum</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">24/7</p>
            <p className="text-xs text-[#101010]/60">Access</p>
          </div>
        </div>

        <Button className="bg-[#1B29FF] hover:bg-[#1B29FF]/90">
          Activate Savings Account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="text-xs text-[#101010]/50 mt-4">
          Non-custodial • Audited smart contracts • Withdraw anytime
        </p>
      </div>
    </div>
  );
}

export function EmptyTransactions() {
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="p-3 bg-[#F7F7F2] rounded-full w-fit mx-auto mb-4">
          <Clock className="h-8 w-8 text-[#101010]/40" />
        </div>

        <h3 className="text-lg font-semibold text-[#101010] mb-2">
          No Transactions Yet
        </h3>

        <p className="text-sm text-[#101010]/70 mb-6">
          Your transaction history will appear here once you start using your
          account.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-5 w-5 text-[#1B29FF]" />
              <p className="text-sm font-medium">ACH & Wire</p>
            </div>
            <p className="text-xs text-[#101010]/60">
              Transfer funds via ACH or wire
            </p>
          </Card>

          <Card className="p-4 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium">Secure</p>
            </div>
            <p className="text-xs text-[#101010]/60">Bank-grade encryption</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OnboardingTasks() {
  // Use the API to get dynamic onboarding tasks
  const { data, isLoading } = api.onboarding.getOnboardingTasks.useQuery(
    undefined,
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 10 * 1000, // 10 seconds
    },
  );

  if (isLoading) {
    return (
      <Card className="border border-[#101010]/10">
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#101010]/40" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If onboarding is complete, don't show the card
  if (data?.isCompleted) {
    return null;
  }

  const taskList = data?.tasks || [];
  const completedCount = data?.completedCount || 0;
  const totalCount = data?.totalCount || taskList.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="border border-[#101010]/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#101010]">
              Get Started
            </h3>
            <p className="text-sm text-[#101010]/60 mt-1">
              Complete these steps to unlock your account
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#1B29FF]">
              {completedCount}/{totalCount}
            </p>
            <p className="text-xs text-[#101010]/60">completed</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-[#F7F7F2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B29FF] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {taskList.map((task: any) => (
            <Link
              key={task.id}
              href={task.action}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg transition-colors',
                task.status === 'completed'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-[#F7F7F2] hover:bg-[#F7F7F2]/80 border border-transparent',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center',
                    task.status === 'completed'
                      ? 'border-green-600 bg-green-600'
                      : task.status === 'in_progress'
                        ? 'border-[#1B29FF] bg-[#1B29FF]'
                        : task.status === 'failed'
                          ? 'border-red-600 bg-red-600'
                          : 'border-[#101010]/20',
                  )}
                >
                  {task.status === 'completed' && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {task.status === 'in_progress' && (
                    <Loader2 className="h-3 w-3 text-white animate-spin" />
                  )}
                  {task.status === 'failed' && (
                    <span className="text-white text-xs font-bold">!</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#101010]">
                    {task.title}
                  </p>
                  <p className="text-xs text-[#101010]/60 mt-0.5">
                    {task.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-[#101010]/40" />
            </Link>
          ))}
        </div>

        {completedCount === totalCount && totalCount > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              🎉 All setup complete! You're ready to start using all features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
