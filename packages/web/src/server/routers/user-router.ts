import { z } from 'zod';
// import { createTRPCRouter, protectedProcedure } from '@/server/trpc';
import { db } from '@/db';
import { users, userProfilesTable, userSafes, workspaces } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Context } from '@/server/context';
import { protectedProcedure, router, publicProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';

// Define input type explicitly for better clarity
const SyncInputSchema = z.object({
  privyUserId: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
});
type SyncInput = z.infer<typeof SyncInputSchema>;

// Helper function to get or create user profile
async function getOrCreateUserProfile(privyDid: string, email?: string) {
  let userProfile = await db.query.userProfilesTable.findFirst({
    where: eq(userProfilesTable.privyDid, privyDid),
  });

  if (!userProfile) {
    if (!email) {
      // Attempt to get email from Privy if not provided (conceptual - requires Privy SDK call)
      // For now, we'll throw if email is essential and missing for a new profile
      console.warn(
        `Email not available for new user profile ${privyDid}, some features might be limited.`,
      );
      // Fallback: create profile without email or make email nullable in schema if appropriate
    }
    const [newUserProfile] = await db
      .insert(userProfilesTable)
      .values({
        privyDid,
        email: email,
        skippedOrCompletedOnboardingStepper: false,
      })
      .returning();
    userProfile = newUserProfile;
    if (!userProfile) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user profile.',
      });
    }
  }
  return userProfile;
}

export const userRouter = router({
  syncContactToLoops: publicProcedure
    .input(SyncInputSchema)
    .mutation(async ({ input }: { input: SyncInput }) => {
      const { privyUserId, email, name } = input;
      const loopsApiKey = process.env.LOOPS_API_KEY;

      if (!loopsApiKey) {
        console.error(
          'LOOPS_API_KEY is not set. Cannot sync contact to Loops.',
        );
        return { success: false, message: 'Loops API key not configured.' };
      }

      // 1. Check if user exists using privyDid and if already synced
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, privyUserId),
        columns: {
          loopsContactSynced: true,
        },
      });

      // If user not found in DB yet, or already synced, exit early
      if (!user || user.loopsContactSynced) {
        return { success: true, message: 'User not found or already synced.' };
      }

      // Email is required by Loops
      if (!email) {
        console.warn(
          `Cannot sync user ${privyUserId} to Loops without an email.`,
        );
        return {
          success: false,
          message: 'Email is required to sync contact.',
        };
      }

      try {
        // 2. Call Loops API to create or update contact
        const response = await fetch(
          'https://app.loops.so/api/v1/contacts/update',
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${loopsApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              userId: privyUserId, // Use Privy ID as the Loops userId (acts as stable identifier)
              firstName: name?.split(' ')[0] ?? '',
              source: 'zero finance app sync',
              subscribed: true,
              // Loops ignores unknown fields so joinedAt is not required ‑ keep payload minimal
            }),
          },
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`Loops API Error (${response.status}): ${errorBody}`);
          throw new Error(
            `Failed to sync contact to Loops (Status: ${response.status})`,
          );
        }

        // 3. Update sync flag in our database using privyDid
        await db
          .update(users)
          .set({ loopsContactSynced: true })
          .where(eq(users.privyDid, privyUserId));

        console.log(
          `Successfully synced contact ${privyUserId} (${email}) to Loops.`,
        );
        return { success: true, message: 'Contact synced successfully.' };
      } catch (error: any) {
        console.error(`Error syncing contact ${privyUserId} to Loops:`, error);
        // Don't update the flag if the API call failed
        // Consider more specific error handling/retries if needed
        return {
          success: false,
          message: error.message || 'Failed to sync contact.',
        };
      }
    }),

  // Get user profile, create if not exists
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.userId;
    if (!privyDid) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    // In a real scenario, you might get the email from ctx.user if Privy provides it
    // For now, this example assumes email might not be directly in ctx.user
    // const email = ctx.user?.email; // Hypothetical: if Privy user object had email
    const userProfile = await getOrCreateUserProfile(privyDid /*, email */);
    // Ensure insurance fields are included
    return {
      ...userProfile,
      isInsured: userProfile.isInsured || false,
      insuranceActivatedAt: userProfile.insuranceActivatedAt || null,
    };
  }),

  // Update user profile (e.g., primary safe address, business name)
  updateProfile: protectedProcedure
    .input(
      z.object({
        primarySafeAddress: z.string().length(42).optional(),
        businessName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.userId;
      if (!privyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      await db
        .update(userProfilesTable)
        .set(input)
        .where(eq(userProfilesTable.privyDid, privyDid));
      return { success: true };
    }),

  // Update the user's email address
  updateEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.userId;
      if (!privyDid) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      await db
        .update(userProfilesTable)
        .set({ email: input.email, updatedAt: new Date() })
        .where(eq(userProfilesTable.privyDid, privyDid));
      return { success: true };
    }),

  // New procedure to get the primary safe address
  // Workspace-centric: Returns the primary safe for the current workspace,
  // regardless of which user created it. All workspace members share access.
  getPrimarySafeAddress: protectedProcedure.query(async ({ ctx }) => {
    const workspaceId = ctx.workspaceId;
    if (!workspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Workspace context is unavailable.',
      });
    }

    // Query by workspace only - all workspace members share access to the workspace's primary Safe
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.safeType, 'primary'),
        eq(userSafes.workspaceId, workspaceId),
        eq(userSafes.chainId, 8453), // Base chain
      ),
      columns: {
        safeAddress: true,
      },
    });

    return { primarySafeAddress: primarySafe?.safeAddress || null };
  }),

  // New procedure to get KYC status
  getKycStatus: protectedProcedure.query(async ({ ctx }) => {
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

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      columns: {
        kycStatus: true,
      },
    });

    return { status: workspace?.kycStatus || null };
  }),

  // Example: Check if user exists (publicly accessible)
  checkUserExists: publicProcedure
    .input(z.object({ privyDid: z.string() }))
    .query(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, input.privyDid),
      });
      return { exists: !!user };
    }),

  // Activate insurance for user (removes all warnings)
  activateInsurance: protectedProcedure.mutation(async ({ ctx }) => {
    const privyDid = ctx.userId;
    if (!privyDid) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Update the user profile to set isInsured = true
    await db
      .update(userProfilesTable)
      .set({
        isInsured: true,
        insuranceActivatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProfilesTable.privyDid, privyDid));

    return { success: true, message: 'Insurance activated successfully' };
  }),
});
