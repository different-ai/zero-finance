import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db/index';
import { userProfilesTable, userSafes, users } from '@/db/schema';
import { alignRouter } from './align-router';
import { eq, and } from 'drizzle-orm';
import { type Address } from 'viem';
// import { AlignService } from '../services/align-service';

export const onboardingRouter = router({
  /**
   * Checks if the user has completed onboarding by checking for a primary safe address.
   * Also checks the legacy user_profiles table.
   */
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    try {
      // 1. Check for a primary safe in the new userSafes table
      const primarySafe = await db.query.userSafes.findFirst({
        where: (table) =>
          eq(table.userDid, userId) && eq(table.safeType, 'primary'),
      });

      if (primarySafe) {
        return {
          skippedOrCompletedOnboardingStepper: true,
          primarySafeAddress: primarySafe.safeAddress,
        };
      }

      // 2. Fallback to the old user_profiles table for legacy users
      const profile = await db.query.userProfilesTable.findFirst({
        where: eq(userProfilesTable.privyDid, userId),
        columns: {
          skippedOrCompletedOnboardingStepper: true,
          primarySafeAddress: true,
        },
      });

      if (profile?.primarySafeAddress && !primarySafe) {
        // Found a legacy user, let's sync them to the new tables
        console.log(
          `0xHypr - Syncing legacy user ${userId} with safe ${profile.primarySafeAddress}`,
        );
        try {
          // Ensure user exists in users table
          await db
            .insert(users)
            .values({ privyDid: userId })
            .onConflictDoNothing();
          // Insert safe into userSafes table
          await db
            .insert(userSafes)
            .values({
              userDid: userId,
              safeAddress: profile.primarySafeAddress,
              safeType: 'primary',
            })
            .onConflictDoNothing();
        } catch (syncError) {
          console.error(`0xHypr - Error syncing legacy user:`, syncError);
        }
      }

      return {
        skippedOrCompletedOnboardingStepper:
          !!profile?.skippedOrCompletedOnboardingStepper,
        primarySafeAddress: profile?.primarySafeAddress,
      };
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to check onboarding status.',
      });
    }
  }),

  /**
   * Saves the primary safe address for the user, marking onboarding as complete.
   */
  completeOnboarding: protectedProcedure
    .input(
      z.object({
        primarySafeAddress: z
          .string()
          .refine((val): val is Address => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: 'Invalid Ethereum address',
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { primarySafeAddress } = input;
      const userEmail = ctx.user.email?.address;

      try {
        // Upsert into `users` table first
        await db
          .insert(users)
          .values({ privyDid: userId })
          .onConflictDoNothing();

        // Upsert into `user_profiles` table
        await db
          .insert(userProfilesTable)
          .values({
            privyDid: userId,
            email: userEmail,
            primarySafeAddress: primarySafeAddress,
            skippedOrCompletedOnboardingStepper: true,
          })
          .onConflictDoUpdate({
            target: userProfilesTable.privyDid,
            set: {
              primarySafeAddress: primarySafeAddress,
              skippedOrCompletedOnboardingStepper: true,
              updatedAt: new Date(),
            },
          });

        // Upsert into `userSafes` table
        await db
          .insert(userSafes)
          .values({
            userDid: userId,
            safeAddress: primarySafeAddress,
            safeType: 'primary',
          })
          .onConflictDoUpdate({
            target: [userSafes.userDid, userSafes.safeType],
            set: { safeAddress: primarySafeAddress },
          });

        return { success: true };
      } catch (error) {
        console.error('Error saving primary Safe address:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save primary Safe address.',
        });
      }
    }),

  /**
   * Marks onboarding as skipped/completed.
   */
  skipOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const userEmail = ctx.user.email?.address;

    try {
      // Upsert user profile with skipped flag
      await db
        .insert(userProfilesTable)
        .values({
          privyDid: userId,
          email: userEmail,
          skippedOrCompletedOnboardingStepper: true,
        })
        .onConflictDoUpdate({
          target: userProfilesTable.privyDid,
          set: {
            skippedOrCompletedOnboardingStepper: true,
            updatedAt: new Date(),
          },
        });

      return {
        success: true,
        message: 'Onboarding skipped successfully',
      };
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to skip onboarding.',
      });
    }
  }),

  /**
   * Gets the status of each step in the onboarding flow.
   * Simplified to match the new onboarding UI with just 2 main steps.
   */
  getOnboardingSteps: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.userId;
    if (!privyDid) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userPromise = db.query.users.findFirst({
      where: eq(users.privyDid, privyDid),
      columns: { kycMarkedDone: true, kycSubStatus: true },
    });

    const primarySafePromise = db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary'),
      ),
      columns: { safeAddress: true },
    });

    const alignCaller = alignRouter.createCaller(ctx);
    const alignCustomerPromise = alignCaller.getCustomerStatus();

    const [user, primarySafe, alignCustomer] = await Promise.all([
      userPromise,
      primarySafePromise,
      alignCustomerPromise,
    ]);

    const kycStatus =
      alignCustomer && alignCustomer.kycStatus
        ? alignCustomer.kycStatus
        : 'not_started';
    const kycSubStatus = alignCustomer?.kycSubStatus;
    const hasBankAccount = !!alignCustomer?.alignVirtualAccountId;
    const kycMarkedDone = user?.kycMarkedDone ?? false;

    const steps = {
      createSafe: {
        isCompleted: !!primarySafe,
        status: primarySafe ? ('completed' as const) : ('not_started' as const),
      },
      verifyIdentity: {
        isCompleted: kycStatus === 'approved',
        status: kycStatus as
          | 'pending'
          | 'approved'
          | 'rejected'
          | 'not_started'
          | 'none',
        kycMarkedDone,
        kycSubStatus,
      },
      // Keep setupBankAccount for backward compatibility but it's not shown in UI
      setupBankAccount: {
        isCompleted: hasBankAccount,
        status: hasBankAccount
          ? ('completed' as const)
          : ('not_started' as const),
      },
    };

    // Onboarding is complete when safe is created and KYC is approved
    const isCompleted =
      steps.createSafe.isCompleted && steps.verifyIdentity.isCompleted;

    return {
      steps,
      isCompleted,
    };
  }),

  /**
   * Gets onboarding tasks formatted for the dashboard empty state
   */
  getOnboardingTasks: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.userId;
    if (!privyDid) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Reuse the logic from getOnboardingSteps
    const userPromise = db.query.users.findFirst({
      where: eq(users.privyDid, privyDid),
      columns: { kycMarkedDone: true, kycSubStatus: true },
    });

    const primarySafePromise = db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary'),
      ),
      columns: { safeAddress: true },
    });

    const alignCaller = alignRouter.createCaller(ctx);
    const alignCustomerPromise = alignCaller.getCustomerStatus();

    const [user, primarySafe, alignCustomer] = await Promise.all([
      userPromise,
      primarySafePromise,
      alignCustomerPromise,
    ]);

    const alignKycStatus =
      alignCustomer && alignCustomer.kycStatus
        ? alignCustomer.kycStatus
        : 'not_started';
    const kycSubStatus = alignCustomer?.kycSubStatus;
    const kycMarkedDone = user?.kycMarkedDone ?? false;

    const tasks = [];
    const isSafeComplete = !!primarySafe;
    const isKycApproved = alignKycStatus === 'approved';

    // Task 1: Activate Primary Account
    tasks.push({
      id: 'activate-account',
      title: 'Activate Primary Account',
      description: 'Set up your secure smart account to get started',
      status: isSafeComplete ? 'completed' : 'pending',
      action: '/onboarding/create-safe',
    });

    // Task 2: Verify Identity
    let kycTaskStatus = 'pending';
    if (isKycApproved) {
      kycTaskStatus = 'completed';
    } else if (alignKycStatus === 'pending' || kycMarkedDone) {
      kycTaskStatus = 'in_progress';
    } else if (alignKycStatus === 'rejected') {
      kycTaskStatus = 'failed';
    }

    tasks.push({
      id: 'verify-identity',
      title: 'Verify Identity',
      description: isKycApproved
        ? 'Your identity has been verified'
        : alignKycStatus === 'pending' || kycMarkedDone
          ? 'Verification in progress'
          : alignKycStatus === 'rejected'
            ? 'Verification failed - please retry'
            : 'Complete KYC to unlock all features',
      status: kycTaskStatus,
      action: '/onboarding/kyc',
    });

    // Task 3: Make First Deposit (optional, only show after KYC)
    if (isKycApproved) {
      tasks.push({
        id: 'first-deposit',
        title: 'Make Your First Deposit',
        description: 'Fund your account to start earning 8% APY',
        status: 'pending',
        action: '/dashboard/earn',
      });
    }

    return {
      tasks,
      isCompleted: isSafeComplete && isKycApproved,
      completedCount: tasks.filter((t) => t.status === 'completed').length,
      totalCount: tasks.length,
    };
  }),
});
