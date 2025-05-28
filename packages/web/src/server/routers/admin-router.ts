import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { userService } from '@/lib/user-service';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { users, userFundingSources } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { alignApi, AlignCustomer } from '@/server/services/align-api';

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

// Zod schema for the direct Align customer details - updated to match Align API more closely
const alignCustomerDirectDetailsSchema = z.object({
  customer_id: z.string(),
  email: z.string().email(),
  kycs: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).nullable(), // Adjusted enum
    kyc_flow_link: z.string().url().nullable(),
  }).nullable(),
});

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
      if (!input.adminToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }
      return await userService.listUsers();
    }),

  /**
   * Get Align Customer details directly from Align
   */
  getAlignCustomerDirectDetails: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .output(alignCustomerDirectDetailsSchema.nullable()) 
    .query(async ({ ctx, input }) => {
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      const { privyDid } = input;
      const logPayload = { procedure: 'getAlignCustomerDirectDetails', targetUserDid: privyDid, adminUserDid: ctx.userId };
      ctx.log.info(logPayload, 'Attempting to get direct Align customer details...');

      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, privyDid),
      });

      if (!user) {
        ctx.log.warn({ ...logPayload }, 'User not found in DB.');
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' });
      }

      if (!user.alignCustomerId) {
        ctx.log.info({ ...logPayload }, 'User does not have an Align Customer ID.');
        return null; 
      }

      try {
        const alignDetails: AlignCustomer = await alignApi.getCustomer(user.alignCustomerId);
        
        if (!alignDetails) {
            ctx.log.warn({ ...logPayload, alignCustomerId: user.alignCustomerId }, 'No details returned from Align API.');
            return null;
        }

        // Map AlignCustomer to alignCustomerDirectDetailsSchema structure
        const firstKyc = alignDetails.kycs && alignDetails.kycs.length > 0 ? alignDetails.kycs[0] : null;

        const result = {
          customer_id: alignDetails.customer_id,
          email: alignDetails.email,
          kycs: firstKyc ? {
            status: firstKyc.status as 'pending' | 'approved' | 'rejected' | null, // Cast to ensure compatibility with schema
            kyc_flow_link: firstKyc.kyc_flow_link || null,
          } : null,
        };
        
        // Validate with Zod before returning, primarily for development reassurance
        const parsedResult = alignCustomerDirectDetailsSchema.nullable().safeParse(result);
        if (!parsedResult.success) {
            ctx.log.error({ ...logPayload, alignCustomerId: user.alignCustomerId, error: parsedResult.error.flatten() }, 'Failed to parse mapped Align data against schema.');
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not process Align data.'});
        }

        ctx.log.info({ ...logPayload, alignCustomerId: user.alignCustomerId }, 'Successfully fetched and mapped direct Align customer details.');
        return parsedResult.data;

      } catch (error) {
        ctx.log.error({ ...logPayload, alignCustomerId: user.alignCustomerId, error: (error as Error).message }, 'Failed to fetch/process direct Align customer details.');
        if (error instanceof TRPCError) throw error;
        // Consider if AlignApiError should be handled specifically to return different TRPC codes
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch or process Align customer details: ${(error as Error).message}`,
        });
      }
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
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }
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
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }
      try {
        const updatedUser = await db
          .update(users)
          .set({
            alignCustomerId: null,
            kycStatus: 'none',
            kycFlowLink: null,
            kycProvider: null, 
            alignVirtualAccountId: null,
          })
          .where(eq(users.privyDid, input.privyDid))
          .returning({ privyDid: users.privyDid }); 
        if (updatedUser.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `User with Privy DID ${input.privyDid} not found.`,
          });
        }
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
          throw error; 
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to reset Align data: ${(error as Error).message}`,
          cause: error,
        });
      }
    }),

  /**
   * Override DB KYC status based on Align's current KYC status
   */
  overrideKycStatusFromAlign: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      const { privyDid } = input;
      const logPayload = { procedure: 'overrideKycStatusFromAlign', targetUserDid: privyDid, adminUserDid: ctx.userId };
      ctx.log.info(logPayload, 'Attempting to override KYC status from Align...');

      try {
        // Get user from DB
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' });
        }

        if (!user.alignCustomerId) {
          ctx.log.info({ ...logPayload }, 'User does not have an Align Customer ID.');
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'User does not have an Align Customer ID. Cannot fetch KYC status.' 
          });
        }

        // Fetch customer details from Align
        const alignCustomer = await alignApi.getCustomer(user.alignCustomerId);
        const latestKyc = alignCustomer.kycs && alignCustomer.kycs.length > 0 ? alignCustomer.kycs[0] : null;

        if (!latestKyc) {
          ctx.log.warn({ ...logPayload, alignCustomerId: user.alignCustomerId }, 'No KYC information found in Align.');
          throw new TRPCError({ 
            code: 'NOT_FOUND', 
            message: 'No KYC information found in Align for this user.' 
          });
        }

        const alignKycStatus = latestKyc.status;
        const currentDbStatus = user.kycStatus;

        ctx.log.info({ 
          ...logPayload, 
          alignKycStatus, 
          currentDbStatus 
        }, 'Comparing KYC statuses...');

        // Map Align status to our DB status format
        let newKycStatus: 'none' | 'pending' | 'approved' | 'rejected' = 'none';
        if (alignKycStatus === 'approved') {
          newKycStatus = 'approved';
        } else if (alignKycStatus === 'pending') {
          newKycStatus = 'pending';
        } else if (alignKycStatus === 'rejected') {
          newKycStatus = 'rejected';
        }

        // Update the DB with Align's KYC status
        await db
          .update(users)
          .set({
            kycStatus: newKycStatus,
            kycProvider: 'align',
            kycFlowLink: latestKyc.kyc_flow_link || null,
          })
          .where(eq(users.privyDid, privyDid));

        ctx.log.info({ 
          ...logPayload, 
          result: { 
            previousStatus: currentDbStatus, 
            newStatus: newKycStatus,
            alignStatus: alignKycStatus
          } 
        }, 'Successfully overrode KYC status from Align.');

        return { 
          success: true, 
          message: `KYC status updated from '${currentDbStatus}' to '${newKycStatus}' based on Align status: '${alignKycStatus}'`,
          previousStatus: currentDbStatus,
          newStatus: newKycStatus,
          alignStatus: alignKycStatus
        };
      } catch (error) {
        ctx.log.error({ ...logPayload, error: (error as Error).message }, 'Failed to override KYC status from Align.');
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to override KYC status: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Simulates KYC approval for a user.
   * WARNING: This should be protected by admin-only access control.
   */
  simulateKycApproval: protectedProcedure 
    .input(z.object({ privyDid: z.string().min(1, "Privy DID is required") }))
    .mutation(async ({ ctx, input }) => {
      const { privyDid } = input;
      const logPayload = { procedure: 'simulateKycApproval', targetUserDid: privyDid, adminUserDid: ctx.userId }; 
      ctx.log.info(logPayload, 'Attempting to simulate KYC approval...');
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
            kycProvider: 'other', 
            kycFlowLink: null, 
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
});
