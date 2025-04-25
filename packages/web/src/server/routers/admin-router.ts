import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { userService } from '@/lib/user-service';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { users, userFundingSources } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

// Create a validation schema for the admin token
const adminTokenSchema = z.string().min(1);

/**
 * Validates if the given token matches the admin token from environment
 * @param token Token to validate
 */
function validateAdminToken(token: string): boolean {
  const adminToken = process.env.ADMIN_SECRET_TOKEN;

  if (!adminToken) {
    console.error('ADMIN_SECRET_TOKEN not set in environment variables');
    return false;
  }

  return token === adminToken;
}

/**
 * Router for admin operations
 */
export const adminRouter = router({
  /**
   * List all users in the system
   */
  listUsers: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
      }),
    )
    .query(async ({ input }) => {
      // if not admin token set, throw error
      if (!input.adminToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }
      // Validate admin token
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      // Get users
      return await userService.listUsers();
    }),

  /**
   * Delete a user and all associated data
   */
  deleteUser: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
        privyDid: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      // Validate admin token
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      // Delete user
      const result = await userService.deleteUser(input.privyDid);

      if (!result.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.message,
        });
      }

      return result;
    }),

  /**
   * Reset Align KYC and Virtual Account data for a specific user
   */
  resetUserAlignData: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ input }) => {
      // Validate admin token
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      try {
        // 1. Reset User's Align Data in `users` Table
        const updatedUser = await db
          .update(users)
          .set({
            alignCustomerId: null,
            kycStatus: 'none',
            kycFlowLink: null,
            kycProvider: null, // Reset provider as well
            alignVirtualAccountId: null,
          })
          .where(eq(users.privyDid, input.privyDid))
          .returning({ privyDid: users.privyDid }); // Return something to confirm update

        if (updatedUser.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `User with Privy DID ${input.privyDid} not found.`,
          });
        }

        // 2. Delete Align Virtual Account Entry in `userFundingSources` Table
        await db
          .delete(userFundingSources)
          .where(
            and(
              eq(userFundingSources.userPrivyDid, input.privyDid),
              eq(userFundingSources.sourceProvider, 'align'),
            ),
          );

        console.log(`Successfully reset Align data for user ${input.privyDid}`);
        return {
          success: true,
          message: `Successfully reset Align data for user ${input.privyDid}`,
        };
      } catch (error) {
        console.error(
          `Error resetting Align data for user ${input.privyDid}:`,
          error,
        );
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to reset Align data: ${(error as Error).message}`,
          cause: error,
        });
      }
    }),
});
