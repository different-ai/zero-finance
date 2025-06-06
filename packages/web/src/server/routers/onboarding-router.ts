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
   */
  getOnboardingSteps: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.userId;
    if (!privyDid) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userPromise = db.query.users.findFirst({
      where: eq(users.privyDid, privyDid),
      columns: { kycMarkedDone: true },
    });

    const primarySafePromise = db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary'),
      ),
      columns: { safeAddress: true },
    });

    // We get user from context, so we know email exists if they are authenticated
    const userEmail = ctx.user?.email;

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
    const hasBankAccount = !!alignCustomer?.alignVirtualAccountId;
    const hasEmail = !!userEmail;
    const kycMarkedDone = user?.kycMarkedDone ?? false;

    const steps = {
      createSafe: {
        isCompleted: !!primarySafe,
        status: primarySafe ? ('completed' as const) : ('not_started' as const),
      },
      verifyIdentity: {
        isCompleted: kycStatus === 'approved',
        status:
          (kycStatus as
            | 'pending'
            | 'approved'
            | 'rejected'
            | 'not_started'
            | 'none'),
        kycMarkedDone,
      },
      setupBankAccount: {
        isCompleted: hasBankAccount,
        status: hasBankAccount
          ? ('completed' as const)
          : ('not_started' as const),
      },
    };

    const isCompleted = Object.values(steps).every((step) => step.isCompleted);

    return {
      steps,
      isCompleted,
    };
  }),
}); 