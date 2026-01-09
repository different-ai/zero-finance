import { Suspense } from 'react';
import { TransactionTabsDemo } from './components/dashboard/transaction-tabs-demo';
import { redirect } from 'next/navigation';
import { VirtualAccountOnboardingLayer } from './components/dashboard/virtual-account-onboarding-layer';
import { DashboardRedirect } from './dashboard-redirect';
import { OnboardingTasks } from './components/dashboard/empty-states';
import { LoadingCard } from './components/loading-card';
import { appRouter } from '@/server/routers/_app';
import { getUserId } from '@/lib/auth';
import { db } from '@/db';
import { userSafes, userProfilesTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { SavingsSection } from './components/savings-section';
import { DashboardHeader } from './components/dashboard-header';

// Create a simple log object
const log = {
  info: (payload: any, message: string) =>
    console.log(`[INFO] ${message}`, JSON.stringify(payload, null, 2)),
  error: (payload: any, message: string) =>
    console.error(`[ERROR] ${message}`, JSON.stringify(payload, null, 2)),
  warn: (payload: any, message: string) =>
    console.warn(`[WARN] ${message}`, JSON.stringify(payload, null, 2)),
};

// Server components for data fetching
async function OnboardingData() {
  // Hide onboarding in lite mode (no Align API)
  const isLiteMode =
    !process.env.ALIGN_API_KEY || process.env.LITE_MODE === 'true';
  if (isLiteMode) {
    return null;
  }

  const userId = await getUserId();

  if (!userId) return <OnboardingTasks />;

  const caller = appRouter.createCaller({ userId, db, log });

  try {
    const onboardingData = await caller.onboarding.getOnboardingSteps();

    // If we have onboarding data, check if it's complete
    if (onboardingData && onboardingData.isCompleted) {
      // If completed, don't show onboarding tasks
      return null;
    }

    // Fetch the primary safe address
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userId),
        eq(userSafes.safeType, 'primary'),
      ),
      columns: { safeAddress: true },
    });

    return (
      <VirtualAccountOnboardingLayer
        initialData={onboardingData}
        safeAddress={primarySafe?.safeAddress || null}
      />
    );
  } catch (error) {
    // If there's an error fetching onboarding data, show default tasks
    return <OnboardingTasks />;
  }
}

type DashboardSearchParams = {
  invite?: string;
  token?: string;
  [key: string]: string | string[] | undefined;
};

export default async function DashboardPage(props: {
  searchParams?: Promise<DashboardSearchParams>;
}) {
  const searchParams = await props.searchParams;
  const userId = await getUserId();

  // Redirect if no user
  if (!userId) {
    redirect('/signin');
  }

  const params = await searchParams;
  const inviteToken = params?.invite || params?.token;

  if (!inviteToken) {
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userId),
        eq(userSafes.safeType, 'primary'),
      ),
      columns: { safeAddress: true },
    });

    const profile = await db.query.userProfilesTable.findFirst({
      where: eq(userProfilesTable.privyDid, userId),
      columns: { skippedOrCompletedOnboardingStepper: true },
    });

    if (
      !primarySafe?.safeAddress &&
      !profile?.skippedOrCompletedOnboardingStepper
    ) {
      redirect('/welcome');
    }
  }

  if (inviteToken) {
    redirect(`/join-team?token=${inviteToken}`);
  }

  const caller = appRouter.createCaller({ userId, db, log });
  const onboardingStatus = await caller.onboarding.getOnboardingSteps();

  if (
    onboardingStatus?.isCompleted === false &&
    !(searchParams && 'showOnboarding' in searchParams)
  ) {
    // continue rendering onboarding layer below
  }

  const onboardingStatusForCard = await caller.onboarding.getOnboardingStatus();

  if (!onboardingStatusForCard?.primarySafeAddress && !inviteToken) {
    redirect('/welcome');
  }

  return (
    <DashboardRedirect>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Main Content */}
        <div className="bg-white max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ">
          {/* Insurance Warning and Activation Handler */}

          <DashboardHeader />

          <div className="space-y-6 ">
            {/* Onboarding Section */}
            <Suspense fallback={<LoadingCard />}>
              <OnboardingData />
            </Suspense>

            {/* Savings/Yield Section */}
            {(() => {
              console.log(
                '[Dashboard] userId:',
                userId,
                'isDemoUser:',
                userId === 'did:privy:demo_user',
              );
              return null;
            })()}
            <SavingsSection
              mode={userId === 'did:privy:demo_user' ? 'demo' : 'real'}
            />

            {/* Transactions Section */}
            <div className="">
              <div className="py-5 sm:py-6 px-0">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  RECENT ACTIVITY
                </p>
              </div>
              <Suspense fallback={<LoadingCard />}>
                <TransactionTabsDemo />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardRedirect>
  );
}
