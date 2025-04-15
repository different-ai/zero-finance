import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db/index';
import { userProfilesTable, userSafes, users } from '@/db/schema';

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
          where: eq(userProfilesTable.privyDid, userId),
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
      const userEmail = ctx.user.email?.address;
      
      try {
        // 1. Upsert user profile
        const profile = await db.insert(userProfilesTable)
          .values({
            privyDid: userId,
            email: userEmail ?? 'unknown@example.com',
            primarySafeAddress: primarySafeAddress,
            hasCompletedOnboarding: true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: userProfilesTable.privyDid,
            set: { 
              primarySafeAddress: primarySafeAddress, 
              hasCompletedOnboarding: true,
              updatedAt: new Date()
            },
          })
          .returning({ updatedId: userProfilesTable.id });

        if (!profile || profile.length === 0) {
           console.error(`Onboarding upsert failed for user ${userId}`);
           throw new TRPCError({
               code: 'INTERNAL_SERVER_ERROR',
               message: 'Failed to create or update user profile during onboarding.'
           });
        }
        
        console.log(`0xHypr - Upserted profile and saved Safe address ${primarySafeAddress} for user ${userId}`);

        // 2. Register the safe in the userSafes table (existing logic seems okay, assuming userSafes uses privyDid correctly)
        const existingSafe = await db.query.userSafes.findFirst({
          where: eq(userSafes.safeAddress, primarySafeAddress),
          columns: { id: true },
        });

        if (!existingSafe) {
          await db
            .insert(userSafes)
            .values({
              userDid: userId,
              safeAddress: primarySafeAddress,
              safeType: 'primary',
              createdAt: new Date(),
            });
          console.log(`0xHypr - Registered safe ${primarySafeAddress} in userSafes table for user ${userId}`);
        } else {
          console.log(`0xHypr - Safe ${primarySafeAddress} already registered in userSafes for user ${userId}`);
        }

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