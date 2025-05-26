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
        // First check for primary safe in userSafes table
        const primarySafe = await db.query.userSafes.findFirst({
          where: (table) => 
            eq(table.userDid, userId) && eq(table.safeType, 'primary')
        });
        
        // If we found a primary safe, the user has completed onboarding
        if (primarySafe) {
          console.log(`0xHypr - Found primary safe for user ${userId}: ${primarySafe.safeAddress}. Onboarding is complete.`);
          return {
            hasCompletedOnboarding: true,
            primarySafeAddress: primarySafe.safeAddress,
          };
        }
        
        // Fall back to the user profile table if no safe is found
        const profile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.privyDid, userId),
          columns: {
            hasCompletedOnboarding: true,
            primarySafeAddress: true,
          },
        });
        
        console.log(`0xHypr - Onboarding status from profile for user ${userId}: ${profile?.hasCompletedOnboarding}`);
        console.log(`0xHypr - Primary safe address from profile: ${profile?.primarySafeAddress || 'none'}`);
        
        // If we have a primary safe address in the user profile, try to ensure it's in the userSafes table
        if (profile?.primarySafeAddress && !primarySafe) {
          console.log(`0xHypr - User ${userId} has a primary safe address ${profile.primarySafeAddress} in profile but not in userSafes table. Will sync.`);
          
          try {
            // Make sure user exists in users table
            const existingUser = await db.query.users.findFirst({
              where: eq(users.privyDid, userId),
            });
            
            if (!existingUser) {
              // Create user first
              console.log(`0xHypr - User ${userId} not found in users table, creating now for safe sync...`);
              await db.insert(users)
                .values({
                  privyDid: userId,
                  createdAt: new Date()
                });
            }
            
            // Add the safe to userSafes table
            await db.insert(userSafes)
              .values({
                userDid: userId,
                safeAddress: profile.primarySafeAddress,
                safeType: 'primary',
                createdAt: new Date()
              })
              .onConflictDoNothing(); // If the safe already exists somehow, don't error
            
            console.log(`0xHypr - Synchronized primary safe ${profile.primarySafeAddress} to userSafes table for user ${userId}`);
          } catch (syncError) {
            console.error(`0xHypr - Error synchronizing primary safe to userSafes: `, syncError);
            // Continue - we'll still return the correct status even if sync fails
          }
        }
        
        return {
          hasCompletedOnboarding: !!profile?.hasCompletedOnboarding,
          primarySafeAddress: profile?.primarySafeAddress,
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
        console.log(`0xHypr - Starting onboarding completion for user ${userId} with safe ${primarySafeAddress}`);
        
        // 0. Make sure the user exists in the users table (required for userSafes foreign key)
        try {
          const existingUser = await db.query.users.findFirst({
            where: eq(users.privyDid, userId),
          });
          
          if (!existingUser) {
            console.log(`0xHypr - User ${userId} not found in users table, creating now...`);
            try {
              await db.insert(users)
                .values({
                  privyDid: userId,
                  createdAt: new Date(),
                });
              console.log(`0xHypr - Created user record in users table for ${userId}`);
            } catch (insertError: any) {
              // Check if this is a duplicate key error
              if (insertError?.code === '23505' && insertError?.constraint === 'users_pkey') {
                // This is fine - another concurrent request probably just created the user
                console.log(`0xHypr - User ${userId} was created by another process, continuing...`);
              } else {
                // It's another type of error, rethrow it
                throw insertError;
              }
            }
          } else {
            console.log(`0xHypr - User ${userId} already exists in users table`);
          }
        } catch (userError) {
          console.error(`0xHypr - Error checking/creating user ${userId}:`, userError);
          // We can continue since the user might exist despite the error
        }
        
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
           console.error(`0xHypr - Onboarding upsert failed for user ${userId}`);
           throw new TRPCError({
               code: 'INTERNAL_SERVER_ERROR',
               message: 'Failed to create or update user profile during onboarding.'
           });
        }
        
        console.log(`0xHypr - Upserted profile and saved Safe address ${primarySafeAddress} for user ${userId}`);

        // 2. Register the safe in the userSafes table
        // First check if this safe already exists for ANY user (not just this user)
        const existingSafe = await db.query.userSafes.findFirst({
          where: eq(userSafes.safeAddress, primarySafeAddress),
        });

        if (!existingSafe) {
          // Safe doesn't exist for any user, create it
          await db.insert(userSafes)
            .values({
              userDid: userId,
              safeAddress: primarySafeAddress,
              safeType: 'primary',
              createdAt: new Date(),
            });
          console.log(`0xHypr - Registered safe ${primarySafeAddress} in userSafes table for user ${userId}`);
        } else if (existingSafe.userDid !== userId) {
          // Safe exists but for a different user - update it to belong to this user
          console.log(`0xHypr - Safe ${primarySafeAddress} exists but for user ${existingSafe.userDid}, updating to ${userId}`);
          await db.update(userSafes)
            .set({ userDid: userId })
            .where(eq(userSafes.id, existingSafe.id));
        } else {
          console.log(`0xHypr - Safe ${primarySafeAddress} already registered for user ${userId}`);
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

  /**
   * Marks onboarding as skipped/completed without requiring a safe address.
   * This allows users to skip the onboarding flow and access the dashboard.
   */
  skipOnboarding: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.user.id;
      const userEmail = ctx.user.email?.address;
      
      try {
        console.log(`0xHypr - User ${userId} is skipping onboarding`);
        
        // Upsert user profile with hasCompletedOnboarding = true
        const profile = await db.insert(userProfilesTable)
          .values({
            privyDid: userId,
            email: userEmail || '',
            hasCompletedOnboarding: true,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: userProfilesTable.privyDid,
            set: { 
              hasCompletedOnboarding: true,
              updatedAt: new Date()
            },
          })
          .returning({ updatedId: userProfilesTable.id });

        if (!profile || profile.length === 0) {
           console.error(`0xHypr - Failed to update profile for user ${userId} when skipping onboarding`);
           throw new TRPCError({
               code: 'INTERNAL_SERVER_ERROR',
               message: 'Failed to skip onboarding.'
           });
        }
        
        console.log(`0xHypr - User ${userId} has skipped onboarding successfully`);
        
        // Also clear any local storage indicators if needed
        return { 
          success: true,
          message: 'Onboarding skipped successfully'
        };

      } catch (error) {
        console.error("Error skipping onboarding:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to skip onboarding.',
        });
      }
    }),
}); 