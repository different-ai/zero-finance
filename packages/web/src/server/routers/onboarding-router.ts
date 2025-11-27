import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db/index';
import { userProfilesTable, userSafes, users, workspaces } from '@/db/schema';
import { alignRouter } from './align-router';
import { earnRouter } from './earn-router';
import { eq, and } from 'drizzle-orm';
import { type Address } from 'viem';
import { AUTO_EARN_MODULE_ADDRESS } from '@/lib/earn-module-constants';
import { featureConfig } from '@/lib/feature-config';

export const onboardingRouter = router({
  /**
   * Checks if the user has completed onboarding by checking for a primary safe address.
   * Also checks the legacy user_profiles table.
   */
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const workspaceId = ctx.workspaceId;

    try {
      // 1. Check for a primary safe in the new userSafes table (workspace-scoped)
      const primarySafe = await db.query.userSafes.findFirst({
        where: (table) =>
          workspaceId
            ? eq(table.userDid, userId) &&
              eq(table.safeType, 'primary') &&
              eq(table.workspaceId, workspaceId)
            : eq(table.userDid, userId) && eq(table.safeType, 'primary'),
      });

      const profile = await db.query.userProfilesTable.findFirst({
        where: eq(userProfilesTable.privyDid, userId),
        columns: {
          skippedOrCompletedOnboardingStepper: true,
          primarySafeAddress: true,
        },
      });

      if (primarySafe) {
        return {
          skippedOrCompletedOnboardingStepper: true,
          primarySafeAddress: primarySafe.safeAddress,
          onboardingCompletedFlag:
            profile?.skippedOrCompletedOnboardingStepper ?? false,
        };
      }

      if (profile?.primarySafeAddress && !primarySafe) {
        // Found a legacy user, let's sync them to the new tables
        console.log(
          `0xHypr - Syncing legacy user ${userId} with safe ${profile.primarySafeAddress}`,
        );
        try {
          // Ensure user exists in users table
          if (workspaceId) {
            await db
              .insert(users)
              .values({ privyDid: userId, primaryWorkspaceId: workspaceId })
              .onConflictDoNothing();
          }
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
        onboardingCompletedFlag:
          profile?.skippedOrCompletedOnboardingStepper ?? false,
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
      const workspaceId = ctx.workspaceId;

      if (!workspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Workspace context is unavailable.',
        });
      }

      try {
        // Upsert into `users` table first
        await db
          .insert(users)
          .values({ privyDid: userId, primaryWorkspaceId: workspaceId })
          .onConflictDoNothing();

        // Upsert into `user_profiles` table (with workspace)
        await db
          .insert(userProfilesTable)
          .values({
            privyDid: userId,
            email: userEmail,
            workspaceId: workspaceId,
            primarySafeAddress: primarySafeAddress,
            skippedOrCompletedOnboardingStepper: true,
          })
          .onConflictDoUpdate({
            target: userProfilesTable.privyDid,
            set: {
              workspaceId: workspaceId,
              primarySafeAddress: primarySafeAddress,
              skippedOrCompletedOnboardingStepper: true,
              updatedAt: new Date(),
            },
          });

        // Upsert into `userSafes` table (with workspace)
        await db
          .insert(userSafes)
          .values({
            userDid: userId,
            workspaceId: workspaceId,
            safeAddress: primarySafeAddress,
            safeType: 'primary',
          })
          .onConflictDoUpdate({
            target: [userSafes.userDid, userSafes.safeType],
            set: {
              safeAddress: primarySafeAddress,
              workspaceId: workspaceId,
            },
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

    const workspaceId = ctx.workspaceId;
    if (!workspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Workspace context is unavailable.',
      });
    }

    const workspacePromise = db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      columns: { kycMarkedDone: true, kycSubStatus: true },
    });

    const primarySafePromise = db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary'),
        eq(userSafes.workspaceId, workspaceId),
      ),
      columns: { safeAddress: true },
    });

    // Only fetch Align data if it's enabled
    let alignCustomer = null;
    if (featureConfig.align.enabled) {
      const alignCaller = alignRouter.createCaller(ctx);
      alignCustomer = await alignCaller.getCustomerStatus();
    }

    const [workspace, primarySafe] = await Promise.all([
      workspacePromise,
      primarySafePromise,
    ]);

    const kycStatus = featureConfig.align.enabled
      ? alignCustomer && alignCustomer.kycStatus
        ? alignCustomer.kycStatus
        : 'not_started'
      : 'not_required';
    const kycSubStatus = alignCustomer?.kycSubStatus;
    const hasBankAccount = !!alignCustomer?.alignVirtualAccountId;
    const kycMarkedDone = workspace?.kycMarkedDone ?? false;

    // Check if savings account is enabled
    let hasSavingsAccount = false;
    if (primarySafe?.safeAddress) {
      try {
        const earnCaller = earnRouter.createCaller(ctx);
        const [moduleStatus, initStatus] = await Promise.all([
          earnCaller.isSafeModuleActivelyEnabled({
            safeAddress: primarySafe.safeAddress as Address,
            moduleAddress: AUTO_EARN_MODULE_ADDRESS,
          }),
          earnCaller.getEarnModuleOnChainInitializationStatus({
            safeAddress: primarySafe.safeAddress as Address,
          }),
        ]);
        hasSavingsAccount =
          (moduleStatus?.isEnabled || false) &&
          (initStatus?.isInitializedOnChain || false);
      } catch (error) {
        console.error('Error checking savings account status:', error);
      }
    }

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
      openSavings: {
        isCompleted: hasSavingsAccount,
        status: hasSavingsAccount
          ? ('completed' as const)
          : ('not_started' as const),
      },
      // Keep setupBankAccount for backward compatibility but it's not shown in UI
      setupBankAccount: {
        isCompleted: hasBankAccount,
        status: hasBankAccount
          ? ('completed' as const)
          : ('not_started' as const),
      },
    };

    // Onboarding is complete when:
    // - Safe is created
    // - KYC is approved (if required)
    // - Savings is opened (if enabled)
    const isCompleted =
      steps.createSafe.isCompleted &&
      (!featureConfig.kyc.required || steps.verifyIdentity.isCompleted) &&
      (!featureConfig.earn.enabled || steps.openSavings.isCompleted);

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
    const workspaceId = ctx.workspaceId;
    if (!workspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Workspace context is unavailable.',
      });
    }

    const workspacePromise = db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      columns: { kycMarkedDone: true, kycSubStatus: true },
    });

    const primarySafePromise = db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary'),
        eq(userSafes.workspaceId, workspaceId),
      ),
      columns: { safeAddress: true },
    });

    // Only fetch Align data if it's enabled
    let alignCustomer = null;
    if (featureConfig.align.enabled) {
      const alignCaller = alignRouter.createCaller(ctx);
      alignCustomer = await alignCaller.getCustomerStatus();
    }

    const [workspace, primarySafe] = await Promise.all([
      workspacePromise,
      primarySafePromise,
    ]);

    const alignKycStatus = featureConfig.align.enabled
      ? alignCustomer && alignCustomer.kycStatus
        ? alignCustomer.kycStatus
        : 'not_started'
      : 'not_required';
    const kycSubStatus = alignCustomer?.kycSubStatus;
    const kycMarkedDone = workspace?.kycMarkedDone ?? false;

    // Check if savings account is enabled
    let hasSavingsAccount = false;
    if (primarySafe?.safeAddress) {
      try {
        const earnCaller = earnRouter.createCaller(ctx);
        const [moduleStatus, initStatus] = await Promise.all([
          earnCaller.isSafeModuleActivelyEnabled({
            safeAddress: primarySafe.safeAddress as Address,
            moduleAddress: AUTO_EARN_MODULE_ADDRESS,
          }),
          earnCaller.getEarnModuleOnChainInitializationStatus({
            safeAddress: primarySafe.safeAddress as Address,
          }),
        ]);
        hasSavingsAccount =
          (moduleStatus?.isEnabled || false) &&
          (initStatus?.isInitializedOnChain || false);
      } catch (error) {
        console.error('Error checking savings account status:', error);
      }
    }

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

    // Task 3: Open Savings Account (show after KYC)
    if (isKycApproved) {
      tasks.push({
        id: 'open-savings',
        title: 'Open Savings Account',
        description: hasSavingsAccount
          ? 'Your savings account is active - earning 8% APY'
          : 'Activate savings to earn 8% APY on idle funds',
        status: hasSavingsAccount ? 'completed' : 'pending',
        action: '/dashboard/earn',
        actionType: hasSavingsAccount ? undefined : 'open-savings', // Special flag for custom action
      });
    }

    return {
      tasks,
      isCompleted: isSafeComplete && isKycApproved && hasSavingsAccount,
      completedCount: tasks.filter((t) => t.status === 'completed').length,
      totalCount: tasks.length,
      primarySafeAddress: primarySafe?.safeAddress, // Include safe address for actions
    };
  }),
});
