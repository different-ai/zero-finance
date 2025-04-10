import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db/index';
import { userProfilesTable } from '@/db/schema';

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
            primarySafeAddress: true,
          },
        });
        return {
          hasCompletedOnboarding: !!profile?.primarySafeAddress,
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
        const result = await db
          .update(userProfilesTable)
          .set({ primarySafeAddress: primarySafeAddress, updatedAt: new Date() })
          .where(eq(userProfilesTable.clerkId, userId))
          .returning({ updatedId: userProfilesTable.id });

        if (result.length === 0) {
           console.error(`Onboarding complete failed: No profile found for user ${userId}`);
           throw new TRPCError({
               code: 'NOT_FOUND',
               message: 'User profile not found to save Safe address.'
           });
        }

        console.log(`0xHypr - Saved primary Safe address ${primarySafeAddress} for user ${userId}`);
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