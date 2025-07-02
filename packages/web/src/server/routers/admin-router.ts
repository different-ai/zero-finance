import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { userService } from '@/lib/user-service';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { users, userFundingSources, userProfilesTable, userSafes } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { alignApi, AlignCustomer } from '@/server/services/align-api';
import { getSafeBalance } from '@/server/services/safe.service';

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

  // Platform total deposited query (live on-chain)
  getTotalDeposited: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
      }),
    )
    .query(async ({ input }) => {
      if (!validateAdminToken(input.adminToken)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin token',
        });
      }

      // 1. Fetch all distinct safe addresses stored in DB
      const safes = await db.select({ safeAddress: userSafes.safeAddress }).from(userSafes);

      // Deduplicate addresses and filter invalid ones
      const uniqueAddresses = Array.from(new Set(safes.map((s) => s.safeAddress).filter(Boolean)));

      // 2. Query on-chain balances concurrently
      const balanceResults = await Promise.all(
        uniqueAddresses.map(async (addr) => {
          try {
            const bal = await getSafeBalance({ safeAddress: addr });
            return bal?.raw ?? 0n;
          } catch (err) {
            console.error('admin.getTotalDeposited: failed to fetch balance for', addr, err);
            return 0n;
          }
        }),
      );

      // 3. Sum BigInt balances
      const grandTotal = balanceResults.reduce((acc, b) => acc + b, 0n);

      return {
        totalDeposited: grandTotal.toString(), // in smallest unit (assumes USDC 6 decimals)
      };
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

  /**
   * Create/restart a KYC session for a user in Align
   */
  createKycSession: protectedProcedure
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
      const logPayload = { procedure: 'createKycSession', targetUserDid: privyDid, adminUserDid: ctx.userId };
      ctx.log.info(logPayload, 'Attempting to create KYC session...');

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
            message: 'User does not have an Align Customer ID. Cannot create KYC session.' 
          });
        }

        // Create KYC session in Align
        const kycSession = await alignApi.createKycSession(user.alignCustomerId);

        // Update user's KYC status and flow link in DB
        await db
          .update(users)
          .set({
            kycStatus: kycSession.status === 'pending' ? 'pending' : kycSession.status,
            kycProvider: 'align',
            kycFlowLink: kycSession.kyc_flow_link || null,
          })
          .where(eq(users.privyDid, privyDid));

        ctx.log.info({ 
          ...logPayload, 
          result: { 
            kycStatus: kycSession.status,
            hasFlowLink: !!kycSession.kyc_flow_link
          } 
        }, 'Successfully created KYC session.');

        return { 
          success: true, 
          message: `KYC session created successfully. Status: ${kycSession.status}`,
          kycStatus: kycSession.status,
          kycFlowLink: kycSession.kyc_flow_link
        };
      } catch (error) {
        ctx.log.error({ ...logPayload, error: (error as Error).message }, 'Failed to create KYC session.');
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create KYC session: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Create an Align customer for a user who doesn't have one
   */
  createAlignCustomer: protectedProcedure
    .input(
      z.object({
        adminToken: adminTokenSchema,
        privyDid: z.string().min(1, 'Privy DID is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        beneficiaryType: z.enum(['individual', 'corporate']).default('individual'),
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
      const logPayload = { procedure: 'createAlignCustomer', targetUserDid: privyDid, adminUserDid: ctx.userId };
      ctx.log.info(logPayload, 'Attempting to create Align customer...');

      try {
        // Get user from DB with profile information
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' });
        }

        if (user.alignCustomerId) {
          ctx.log.info({ ...logPayload, alignCustomerId: user.alignCustomerId }, 'User already has an Align Customer ID.');
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'User already has an Align Customer ID.' 
          });
        }

        // Get user profile to access email and other profile fields
        const userProfile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.privyDid, privyDid),
        });

        if (!userProfile?.email) {
          ctx.log.warn({ ...logPayload }, 'User does not have an email address in their profile.');
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'User must have an email address in their profile to create Align customer.' 
          });
        }

        // Create customer in Align
        const alignCustomer = await alignApi.createCustomer(
          userProfile.email,
          input.firstName,
          input.lastName,
          userProfile.businessName || undefined,
          input.beneficiaryType
        );

        // Update user's Align customer ID in DB
        await db
          .update(users)
          .set({
            alignCustomerId: alignCustomer.customer_id,
          })
          .where(eq(users.privyDid, privyDid));

        ctx.log.info({ 
          ...logPayload, 
          result: { 
            alignCustomerId: alignCustomer.customer_id,
            email: alignCustomer.email
          } 
        }, 'Successfully created Align customer.');

        return { 
          success: true, 
          message: `Align customer created successfully. Customer ID: ${alignCustomer.customer_id}`,
          alignCustomerId: alignCustomer.customer_id,
          email: alignCustomer.email
        };
      } catch (error) {
        ctx.log.error({ ...logPayload, error: (error as Error).message }, 'Failed to create Align customer.');
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create Align customer: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Sync user with Align remote information (customer ID and KYC status)
   */
  syncAlignCustomer: protectedProcedure
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
      const logPayload = { procedure: 'syncAlignCustomer', targetUserDid: privyDid, adminUserDid: ctx.userId };
      ctx.log.info(logPayload, 'Attempting to sync user with Align...');

      try {
        // Get user from DB
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' });
        }

        // Get user profile to access email
        const userProfile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.privyDid, privyDid),
        });

        if (!userProfile?.email) {
          ctx.log.warn({ ...logPayload }, 'User does not have an email address in their profile.');
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'User must have an email address in their profile to sync with Align.' 
          });
        }

        let alignCustomer: AlignCustomer | null = null;
        let wasCustomerFound = false;

        // If user already has an Align customer ID, fetch directly
        if (user.alignCustomerId) {
          try {
            alignCustomer = await alignApi.getCustomer(user.alignCustomerId);
            wasCustomerFound = true;
          } catch (error) {
            ctx.log.warn({ ...logPayload, error: (error as Error).message }, 'Failed to fetch customer by ID, will try searching by email.');
          }
        }

        // If no customer ID or fetch failed, search by email
        if (!alignCustomer) {
          alignCustomer = await alignApi.searchCustomerByEmail(userProfile.email);
          if (alignCustomer) {
            wasCustomerFound = true;
          }
        }

        if (!alignCustomer) {
          ctx.log.info({ ...logPayload }, 'No Align customer found for this user.');
          throw new TRPCError({ 
            code: 'NOT_FOUND', 
            message: 'No Align customer found for this user. Please create an Align customer first.' 
          });
        }

        // Extract KYC status from Align customer
        const latestKyc = alignCustomer.kycs && alignCustomer.kycs.length > 0 ? alignCustomer.kycs[0] : null;
        let newKycStatus: 'none' | 'pending' | 'approved' | 'rejected' = 'none';
        let kycFlowLink = null;

        if (latestKyc) {
          if (latestKyc.status === 'approved') {
            newKycStatus = 'approved';
          } else if (latestKyc.status === 'pending') {
            newKycStatus = 'pending';
          } else if (latestKyc.status === 'rejected') {
            newKycStatus = 'rejected';
          }
          kycFlowLink = latestKyc.kyc_flow_link || null;
        }

        // Update user in DB
        const updateData: any = {
          alignCustomerId: alignCustomer.customer_id,
          kycStatus: newKycStatus,
          kycProvider: 'align',
        };

        if (kycFlowLink) {
          updateData.kycFlowLink = kycFlowLink;
        }

        await db
          .update(users)
          .set(updateData)
          .where(eq(users.privyDid, privyDid));

        const syncResults = {
          alignCustomerId: alignCustomer.customer_id,
          kycStatus: newKycStatus,
          hadCustomerId: !!user.alignCustomerId,
          wasFoundByEmail: !user.alignCustomerId && wasCustomerFound,
        };

        ctx.log.info({ 
          ...logPayload, 
          result: syncResults 
        }, 'Successfully synced user with Align.');

        return { 
          success: true, 
          message: `Successfully synced with Align. Customer ID: ${alignCustomer.customer_id}, KYC Status: ${newKycStatus}`,
          ...syncResults
        };
      } catch (error) {
        ctx.log.error({ ...logPayload, error: (error as Error).message }, 'Failed to sync with Align.');
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to sync with Align: ${(error as Error).message}`,
        });
      }
    }),
});
