import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../../create-router';
import { db } from '@/db';
import { userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { isAddress, type Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Minimal ABI for Safe's isOwner function
const safeAbiIsOwner = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'isOwner',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Router for managing user safes
 */
export const userSafesRouter = router({
  /**
   * Get all safes for the authenticated user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id;
    console.log(`Fetching safes for user DID: ${privyDid}`);

    try {
      const safes = await db.query.userSafes.findMany({
        where: eq(userSafes.userDid, privyDid),
        orderBy: (userSafes, { desc }) => [desc(userSafes.createdAt)],
      });

      console.log(`Found ${safes.length} safes for user DID: ${privyDid}`);
      return safes;
    } catch (error) {
      console.error(`Error fetching safes for user DID ${privyDid}:`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user safes.',
        cause: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }),

  /**
   * Get the primary safe for the authenticated user
   */
  getPrimary: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id;
    console.log(`Fetching primary safe for user DID: ${privyDid}`);

    try {
      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.safeType, 'primary')
        ),
      });

      if (!primarySafe) {
        console.log(`No primary safe found for user DID: ${privyDid}`);
        return null;
      }

      console.log(`Found primary safe ${primarySafe.safeAddress} for user DID: ${privyDid}`);
      return primarySafe;
    } catch (error) {
      console.error(`Error fetching primary safe for user DID ${privyDid}:`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch primary safe.',
        cause: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }),

  /**
   * Get just the primary safe address for the authenticated user
   */
  getPrimarySafeAddress: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id;
    console.log(`Fetching primary safe address for user DID: ${privyDid}`);

    try {
      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.safeType, 'primary')
        ),
        columns: {
          safeAddress: true,
        },
      });

      if (!primarySafe) {
        console.log(`No primary safe found for user DID: ${privyDid}`);
        return null;
      }

      console.log(`Found primary safe address ${primarySafe.safeAddress} for user DID: ${privyDid}`);
      return primarySafe.safeAddress;
    } catch (error) {
      console.error(`Error fetching primary safe address for user DID ${privyDid}:`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch primary safe address.',
        cause: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }),

  /**
   * Get just the primary safe address for the authenticated user
   */
  getPrimarySafeAddress: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id;
    console.log(`Fetching primary safe address for user DID: ${privyDid}`);

    try {
      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, privyDid),
          eq(userSafes.safeType, 'primary')
        ),
        columns: {
          safeAddress: true,
        },
      });

      if (!primarySafe) {
        console.log(`No primary safe found for user DID: ${privyDid}`);
        return null;
      }

      console.log(`Found primary safe address ${primarySafe.safeAddress} for user DID: ${privyDid}`);
      return primarySafe.safeAddress;
    } catch (error) {
      console.error(`Error fetching primary safe address for user DID ${privyDid}:`, error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch primary safe address.',
        cause: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }),

  /**
   * Store a safe address for the authenticated user
   * Note: Safe creation happens on the client side
   */
  create: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().refine(isAddress, {
          message: "Invalid Ethereum address provided.",
        }),
        safeType: z.enum(['primary', 'tax', 'liquidity', 'yield']).default('primary'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      const { safeAddress, safeType } = input;
      console.log(`Storing ${safeType} safe ${safeAddress} for user DID: ${privyDid}`);

      try {
        // Check if a primary safe already exists (if creating primary)
        if (safeType === 'primary') {
          const existingPrimary = await db.query.userSafes.findFirst({
            where: and(
              eq(userSafes.userDid, privyDid),
              eq(userSafes.safeType, 'primary')
            ),
          });

          if (existingPrimary) {
            console.warn(`User ${privyDid} already has a primary safe.`);
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A primary safe already exists for this user.',
            });
          }
        }

        // Store the safe in the database
        const [insertedSafe] = await db
          .insert(userSafes)
          .values({
            userDid: privyDid,
            safeAddress: safeAddress,
            safeType: safeType,
          })
          .returning();

        console.log(`Successfully stored ${safeType} safe ${safeAddress} for user DID: ${privyDid}`);
        return insertedSafe;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error(`Error storing ${safeType} safe for user DID ${privyDid}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to store ${safeType} safe.`,
          cause: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),

  /**
   * Registers an existing Safe address as the primary safe for the user.
   */
  registerPrimary: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().refine(isAddress, {
          message: "Invalid Ethereum address provided.",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      const { safeAddress } = input;
      console.log(`Attempting to register primary safe ${safeAddress} for user DID: ${privyDid}`);

      // TODO: Get user's wallet address from Privy linkedAccounts
      // For now, skip wallet ownership verification on the server side
      // The client should ensure only valid safes are registered

      try {
        // 1. Check if a primary safe already exists for this user
        const existingPrimary = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.userDid, privyDid),
            eq(userSafes.safeType, 'primary')
          ),
          columns: { id: true },
        });

        if (existingPrimary) {
          console.warn(`User ${privyDid} already has a primary safe.`);
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A primary safe is already registered for this user.',
          });
        }

        // 2. Skip Safe Ownership verification for now
        // TODO: Implement ownership check once we can get wallet address from Privy linkedAccounts
        // For now, trust that the client only sends valid safes the user owns
        console.log(`Skipping ownership verification for Safe ${safeAddress} - TODO: implement with linkedAccounts`);

        // 3. Insert the new primary safe record
        const [insertedSafe] = await db
          .insert(userSafes)
          .values({
            userDid: privyDid,
            safeAddress: safeAddress,
            safeType: 'primary',
          })
          .returning();
          
        console.log(`Successfully registered primary safe ${safeAddress} (ID: ${insertedSafe.id}) for user DID: ${privyDid}`);

        return {
          success: true,
          safe: insertedSafe,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error(`Error registering primary safe for user DID ${privyDid}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register primary safe.',
          cause: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),

  /**
   * Delete a safe for the authenticated user
   */
  delete: protectedProcedure
    .input(
      z.object({
        safeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      const { safeId } = input;
      console.log(`Deleting safe ${safeId} for user DID: ${privyDid}`);

      try {
        // Verify the safe belongs to the user
        const safe = await db.query.userSafes.findFirst({
          where: and(
            eq(userSafes.id, safeId),
            eq(userSafes.userDid, privyDid)
          ),
        });

        if (!safe) {
          console.warn(`Safe ${safeId} not found or doesn't belong to user ${privyDid}`);
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Safe not found or does not belong to the user.',
          });
        }

        // Delete the safe
        await db
          .delete(userSafes)
          .where(eq(userSafes.id, safeId));

        console.log(`Successfully deleted safe ${safeId} for user DID: ${privyDid}`);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error(`Error deleting safe ${safeId} for user DID ${privyDid}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete safe.',
          cause: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),
});