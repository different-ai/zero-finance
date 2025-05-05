import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { userService } from '@/lib/user-service';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { users, userFundingSources } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

// Create a validation schema for the admin token
const adminTokenSchema = z.string().min(1);

// Custom ID generator
const generateId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

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

  /**
   * Simulates KYC approval for a user.
   * WARNING: This should be protected by admin-only access control.
   */
  simulateKycApproval: protectedProcedure // TODO: Replace with a proper admin-only procedure
    .input(z.object({ privyDid: z.string().min(1, "Privy DID is required") }))
    .mutation(async ({ ctx, input }) => {
      const { privyDid } = input;
      const logPayload = { procedure: 'simulateKycApproval', targetUserDid: privyDid, adminUserDid: ctx.userId }; // Log who performed the action
      ctx.log.info(logPayload, 'Attempting to simulate KYC approval...');

      // Find the target user
      const targetUser = await db.query.users.findFirst({
        where: eq(users.privyDid, privyDid),
      });

      if (!targetUser) {
        ctx.log.error({ ...logPayload }, 'Target user not found.');
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Target user not found.' });
      }

      try {
        await db
          .update(users)
          .set({
            kycStatus: 'approved',
            kycProvider: 'other', // Changed: Use 'other' for admin override
            kycFlowLink: null, // Clear any pending link
            // We don't touch alignCustomerId here, assuming it might exist or isn't strictly needed for override tests
          })
          .where(eq(users.privyDid, privyDid));

        ctx.log.info({ ...logPayload, result: { kycStatus: 'approved' } }, 'Successfully simulated KYC approval.');
        return { success: true, message: `KYC status for user ${privyDid} set to approved.` };
      } catch (error) {
        ctx.log.error({ ...logPayload, error: (error as Error).message }, 'Failed to simulate KYC approval.');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to simulate KYC approval: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Simulate a virtual bank account for a user.
   * This is for testing purposes, allowing admins to quickly set up funding sources.
   */
  simulateVirtualBankAccount: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
        privyDid: z.string().min(1, 'Privy DID is required'),
        accountType: z.enum(['iban', 'us_ach']).default('us_ach'),
        sourceCurrency: z.enum(['usd', 'eur']).default('usd'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate admin token
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      const { privyDid, accountType, sourceCurrency } = input;
      const logPayload = { procedure: 'simulateVirtualBankAccount', targetUserDid: privyDid, adminUserDid: ctx.userId };
      ctx.log?.info(logPayload, 'Attempting to simulate virtual bank account...');

      try {
        // Check if user exists and has KYC status approved
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Ensure user has KYC approved
        if (user.kycStatus !== 'approved') {
          // Approve KYC if not already
          await db
            .update(users)
            .set({
              kycStatus: 'approved',
              kycProvider: 'other', // "other" is a valid value in the schema
            })
            .where(eq(users.privyDid, privyDid));
          
          ctx.log?.info({ ...logPayload }, 'Auto-approved KYC for virtual account setup');
        }

        // Generate a mock virtual account ID
        const mockVirtualAccountId = `align_sim_${generateId()}`;

        // Check if user already has an Align virtual account
        const existingFundingSource = await db.query.userFundingSources.findFirst({
          where: and(
            eq(userFundingSources.userPrivyDid, privyDid),
            eq(userFundingSources.sourceProvider, 'align'),
          ),
        });

        if (existingFundingSource) {
          // Update existing funding source
          await db
            .update(userFundingSources)
            .set({
              alignVirtualAccountIdRef: mockVirtualAccountId,
              sourceAccountType: accountType,
              sourceCurrency: sourceCurrency,
              sourceBankName: 'Simulated Bank',
              sourceBankAddress: 'Simulated Bank Address',
              sourceBankBeneficiaryName: 'Simulated Beneficiary',
              sourceBankBeneficiaryAddress: 'Simulated Beneficiary Address',
              sourceIban: accountType === 'iban' ? `SIM${Math.random().toString().substring(2, 16)}` : null,
              sourceBicSwift: accountType === 'iban' ? 'SIMBICXX' : null,
              sourceAccountNumber: accountType === 'us_ach' ? `${Math.random().toString().substring(2, 10)}` : null,
              sourceRoutingNumber: accountType === 'us_ach' ? '123456789' : null,
              sourcePaymentRails: accountType === 'iban' ? ['sepa'] : ['ach'],
              destinationCurrency: 'usdc',
              destinationPaymentRail: 'base',
              destinationAddress: '0x1234567890123456789012345678901234567890',
              updatedAt: new Date(),
            })
            .where(eq(userFundingSources.id, existingFundingSource.id));

          ctx.log?.info({ ...logPayload, result: { updated: true, accountType } }, 'Successfully updated simulated virtual bank account.');
        } else {
          // Create new funding source
          await db.insert(userFundingSources).values({
            userPrivyDid: privyDid,
            sourceProvider: 'align',
            alignVirtualAccountIdRef: mockVirtualAccountId,
            sourceAccountType: accountType,
            sourceCurrency: sourceCurrency,
            sourceBankName: 'Simulated Bank',
            sourceBankAddress: 'Simulated Bank Address',
            sourceBankBeneficiaryName: 'Simulated Beneficiary',
            sourceBankBeneficiaryAddress: 'Simulated Beneficiary Address',
            sourceIban: accountType === 'iban' ? `SIM${Math.random().toString().substring(2, 16)}` : null,
            sourceBicSwift: accountType === 'iban' ? 'SIMBICXX' : null,
            sourceAccountNumber: accountType === 'us_ach' ? `${Math.random().toString().substring(2, 10)}` : null,
            sourceRoutingNumber: accountType === 'us_ach' ? '123456789' : null,
            sourcePaymentRails: accountType === 'iban' ? ['sepa'] : ['ach'],
            destinationCurrency: 'usdc',
            destinationPaymentRail: 'base',
            destinationAddress: '0x1234567890123456789012345678901234567890',
          });

          // Also update user record with virtual account ID
          await db
            .update(users)
            .set({
              alignVirtualAccountId: mockVirtualAccountId,
            })
            .where(eq(users.privyDid, privyDid));

          ctx.log?.info({ ...logPayload, result: { created: true, accountType } }, 'Successfully created simulated virtual bank account.');
        }

        return {
          success: true,
          message: `Successfully ${existingFundingSource ? 'updated' : 'created'} simulated virtual bank account (${accountType.toUpperCase()})`,
          accountType,
          virtualAccountId: mockVirtualAccountId,
        };
      } catch (error) {
        ctx.log?.error({ ...logPayload, error: (error as Error).message }, 'Failed to simulate virtual bank account.');
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to simulate virtual bank account: ${(error as Error).message}`,
          cause: error,
        });
      }
    }),
});
