import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db/index';
import { userProfilesTable, userSafes } from '@/db/schema';

import { eq } from 'drizzle-orm';
import { type Address } from 'viem';

export const onboardingRouter = router({
  /**
   * Checks if the user has completed onboarding by checking for a primary safe address.
   */
  getOnboardingStatus: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      try {
        const profile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.clerkId, userId),
          columns: {
            hasCompletedOnboarding: true,
          },
        });
        console.log(`0xHypr - Onboarding status for user ${userId}: ${profile?.hasCompletedOnboarding}`);
        return {
          hasCompletedOnboarding: !!profile?.hasCompletedOnboarding,
        };
      } catch (error) {
        console.error("Error fetching onboarding status:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check onboarding status.',
        });
      }
    }),

  /**
   * Saves the primary safe address for the user, marking onboarding as complete.
   * Also registers the safe in the userSafes table for proper allocation tracking.
   */
  completeOnboarding: protectedProcedure
    .input(
      z.object({
        primarySafeAddress: z.string().refine((val): val is Address => /^0x[a-fA-F0-9]{40}$/.test(val), {
          message: "Invalid Ethereum address",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { primarySafeAddress } = input;

      try {
        // 1. Update the user profile with the primary safe address and mark onboarding as complete
        const result = await db
          .update(userProfilesTable)
          .set({ 
            primarySafeAddress: primarySafeAddress, 
            hasCompletedOnboarding: true,
            updatedAt: new Date() 
          })
          .where(eq(userProfilesTable.clerkId, userId))
          .returning({ updatedId: userProfilesTable.id });

        if (result.length === 0) {
           console.error(`Onboarding complete failed: No profile found for user ${userId}`);
           throw new TRPCError({
               code: 'NOT_FOUND',
               message: 'User profile not found to save Safe address.'
           });
        }

        // 2. Register the safe in the userSafes table for allocation tracking
        // First, check if it's already registered
        const existingSafe = await db.query.userSafes.findFirst({
          where: eq(userSafes.safeAddress, primarySafeAddress),
          columns: { id: true },
        });

        if (!existingSafe) {
          // Register the safe in the userSafes table
          await db
            .insert(userSafes)
            .values({
              userDid: userId, // clerkId is also used as privy DID
              safeAddress: primarySafeAddress,
              safeType: 'primary',
            });

          console.log(`0xHypr - Registered safe ${primarySafeAddress} in userSafes table for user ${userId}`);
        } else {
          console.log(`0xHypr - Safe ${primarySafeAddress} already registered in userSafes for user ${userId}`);
        }

        console.log(`0xHypr - Saved primary Safe address ${primarySafeAddress} for user ${userId} and marked onboarding as completed`);
        return { success: true };

      } catch (error) {
        console.error("Error saving primary Safe address:", error);
         if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save primary Safe address.',
        });
      }
    }),
}); 