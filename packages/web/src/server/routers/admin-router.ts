import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { userService } from '@/lib/user-service';
import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import {
  users,
  userFundingSources,
  userProfilesTable,
  userSafes,
  platformTotals,
  userFeatures,
  workspaces,
  workspaceMembers,
  workspaceFeatures,
  admins,
  autoEarnConfigs,
  earnDeposits,
  earnWithdrawals,
} from '../../db/schema';
import type { WorkspaceFeatureName } from '../../db/schema/workspace-features';
import { eq, and } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { alignApi, AlignCustomer } from '@/server/services/align-api';
import {
  getSafeBalance,
  getBatchSafeBalances,
} from '@/server/services/safe.service';
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';

// Custom ID generator
const generateId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

// ERC4626 vault ABI for reading balances
const ERC4626_VAULT_ABI = parseAbi([
  'function balanceOf(address owner) public view returns (uint256)',
  'function convertToAssets(uint256 shares) public view returns (uint256 assets)',
]);

// Public client for reading on-chain vault positions
const publicClient = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl(), {
    batch: {
      batchSize: 100,
      wait: 16,
    },
  }),
  batch: {
    multicall: true,
  },
});

// Cache for platform stats (60 second TTL)
let platformStatsCache: {
  data: {
    totalValue: string;
    inSafes: string;
    inVaults: string;
  } | null;
  expiresAt: number;
} = {
  data: null,
  expiresAt: 0,
};

/**
 * Helper to verify if a user is an admin
 * @param privyDid Privy DID of the user to check
 * @returns true if user is an admin, false otherwise
 */
async function checkIsUserAdmin(privyDid: string): Promise<boolean> {
  // Normalize ID
  const normalizedId = privyDid.trim();
  console.log(`Admin check: Checking privileges for '${normalizedId}'`);

  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.privyDid, normalizedId),
    });

    if (admin) {
      console.log('Admin check: User found in database');
      return true;
    }

    console.log('Admin check: User NOT found in database');
    return false;
  } catch (error) {
    console.error('Admin check: Database error:', error);
    return false;
  }
}

/**
 * Helper to verify admin status and throw if not admin
 * @param privyDid Privy DID of the user to check
 */
async function requireAdmin(privyDid: string): Promise<void> {
  const isAdmin = await checkIsUserAdmin(privyDid);
  if (!isAdmin) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Admin privileges required',
    });
  }
}

// Zod schema for the direct Align customer details - updated to match Align API more closely
const alignCustomerDirectDetailsSchema = z.object({
  customer_id: z.string(),
  email: z.string().email(),
  kycs: z
    .object({
      status: z.enum(['pending', 'approved', 'rejected']).nullable(), // Adjusted enum
      kyc_flow_link: z.string().url().nullable(),
    })
    .nullable(),
});

/**
 * Router for admin operations
 */
export const adminRouter = router({
  /**
   * Check if the current user is an admin
   */
  checkIsAdmin: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      console.log('Admin check: No userId in context');
      return { isAdmin: false };
    }
    const isAdmin = await checkIsUserAdmin(ctx.userId);
    console.log(`Admin check for ${ctx.userId}: ${isAdmin}`);
    return { isAdmin };
  }),

  /**
   * List all users in the system
   */
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User ID not found',
      });
    }
    await requireAdmin(ctx.userId);
    return await userService.listUsers();
  }),

  getTotalDeposited: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User ID not found',
      });
    }
    await requireAdmin(ctx.userId);

    try {
      const allDeposits = await db.select().from(earnDeposits);
      const allWithdrawals = await db.select().from(earnWithdrawals);

      const totalDepositsAmount = allDeposits.reduce(
        (sum, deposit) => sum + BigInt(deposit.assetsDeposited),
        0n,
      );

      const totalWithdrawalsAmount = allWithdrawals.reduce(
        (sum, withdrawal) => sum + BigInt(withdrawal.assetsWithdrawn),
        0n,
      );

      const netDepositedInVaults = totalDepositsAmount - totalWithdrawalsAmount;

      const safes = await db
        .select({ safeAddress: userSafes.safeAddress })
        .from(userSafes);

      const uniqueAddresses = Array.from(
        new Set(safes.map((s) => s.safeAddress).filter(Boolean)),
      ) as `0x${string}`[];

      const balanceMap = await getBatchSafeBalances({
        safeAddresses: uniqueAddresses,
      });

      const totalInSafes = Object.values(balanceMap).reduce(
        (acc, balance) => acc + (balance?.raw ?? 0n),
        0n,
      );

      const grandTotal = totalInSafes + netDepositedInVaults;

      try {
        await db.delete(platformTotals).where(eq(platformTotals.token, 'USDC'));
        await db.insert(platformTotals).values({
          token: 'USDC',
          totalDeposited: grandTotal.toString(),
          updatedAt: new Date(),
        });
      } catch (persistErr) {
        console.error(
          'admin.getTotalDeposited: failed to persist totalDeposited',
          persistErr,
        );
      }

      return {
        totalDeposited: grandTotal.toString(),
        breakdown: {
          inSafes: totalInSafes.toString(),
          inVaults: netDepositedInVaults.toString(),
          totalDeposits: totalDepositsAmount.toString(),
          totalWithdrawals: totalWithdrawalsAmount.toString(),
          depositCount: allDeposits.length,
          withdrawalCount: allWithdrawals.length,
          uniqueVaults: new Set(allDeposits.map((d) => d.vaultAddress)).size,
        },
      };
    } catch (error) {
      console.error('admin.getTotalDeposited: error calculating totals', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to calculate total deposited: ${(error as Error).message}`,
      });
    }
  }),

  /**
   * Get platform stats with on-chain vault reading and caching
   * Uses 60-second cache to avoid rate limiting
   */
  getPlatformStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User ID not found',
      });
    }
    await requireAdmin(ctx.userId);

    // Check cache first
    if (platformStatsCache.data && platformStatsCache.expiresAt > Date.now()) {
      return platformStatsCache.data;
    }

    try {
      const { BASE_USDC_VAULTS } = require('@/server/earn/base-vaults');

      // Get all safes
      const safes = await db
        .select({ safeAddress: userSafes.safeAddress })
        .from(userSafes);

      const uniqueSafeAddresses = Array.from(
        new Set(safes.map((s) => s.safeAddress).filter(Boolean)),
      ) as `0x${string}`[];

      if (uniqueSafeAddresses.length === 0) {
        const result = {
          totalValue: '0',
          inSafes: '0',
          inVaults: '0',
        };
        platformStatsCache = {
          data: result,
          expiresAt: Date.now() + 60_000,
        };
        return result;
      }

      // Read safe balances using existing batch function
      const balanceMap = await getBatchSafeBalances({
        safeAddresses: uniqueSafeAddresses,
      });

      const totalInSafes = Object.values(balanceMap).reduce(
        (acc, balance) => acc + (balance?.raw ?? 0n),
        0n,
      );

      // Read actual vault positions on-chain for ALL vaults
      let totalInVaults = 0n;

      // Use multicall to batch all vault reads
      const vaultCalls = BASE_USDC_VAULTS.flatMap((vaultInfo: any) => {
        const vaultAddress = vaultInfo.address as `0x${string}`;
        return uniqueSafeAddresses.flatMap((safeAddress) => [
          {
            address: vaultAddress,
            abi: ERC4626_VAULT_ABI,
            functionName: 'balanceOf' as const,
            args: [safeAddress],
          },
        ]);
      });

      // Execute all balanceOf calls in parallel with multicall
      const sharesResults = await publicClient.multicall({
        contracts: vaultCalls,
      });

      // Now convert shares to assets
      const assetCalls: any[] = [];
      for (let i = 0; i < sharesResults.length; i++) {
        const result = sharesResults[i];
        if (
          result.status === 'success' &&
          result.result &&
          typeof result.result === 'bigint' &&
          result.result > 0n
        ) {
          const vaultIndex = Math.floor(i / uniqueSafeAddresses.length);
          const vaultAddress = BASE_USDC_VAULTS[vaultIndex]
            .address as `0x${string}`;
          assetCalls.push({
            vaultAddress,
            shares: result.result,
            callData: {
              address: vaultAddress,
              abi: ERC4626_VAULT_ABI,
              functionName: 'convertToAssets' as const,
              args: [result.result],
            },
          });
        }
      }

      // Execute all convertToAssets calls
      if (assetCalls.length > 0) {
        const assetsResults = await publicClient.multicall({
          contracts: assetCalls.map((c) => c.callData),
        });

        for (const result of assetsResults) {
          if (result.status === 'success' && result.result) {
            totalInVaults += result.result as bigint;
          }
        }
      }

      const grandTotal = totalInSafes + totalInVaults;

      const result = {
        totalValue: grandTotal.toString(),
        inSafes: totalInSafes.toString(),
        inVaults: totalInVaults.toString(),
      };

      // Cache for 60 seconds
      platformStatsCache = {
        data: result,
        expiresAt: Date.now() + 60_000,
      };

      return result;
    } catch (error) {
      console.error('admin.getPlatformStats: error calculating stats', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to calculate platform stats: ${(error as Error).message}`,
      });
    }
  }),

  /**
   * Get Align Customer details directly from Align
   */
  getAlignCustomerDirectDetails: protectedProcedure
    .input(
      z.object({
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .output(alignCustomerDirectDetailsSchema.nullable())
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { privyDid } = input;
      const logPayload = {
        procedure: 'getAlignCustomerDirectDetails',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(
        logPayload,
        'Attempting to get direct Align customer details...',
      );

      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, privyDid),
      });

      if (!user) {
        ctx.log.warn({ ...logPayload }, 'User not found in DB.');
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' });
      }

      if (!user.alignCustomerId) {
        ctx.log.info(
          { ...logPayload },
          'User does not have an Align Customer ID.',
        );
        return null;
      }

      try {
        const alignDetails: AlignCustomer = await alignApi.getCustomer(
          user.alignCustomerId,
        );

        if (!alignDetails) {
          ctx.log.warn(
            { ...logPayload, alignCustomerId: user.alignCustomerId },
            'No details returned from Align API.',
          );
          return null;
        }

        // Map AlignCustomer to alignCustomerDirectDetailsSchema structure
        const firstKyc =
          alignDetails.kycs && alignDetails.kycs.length > 0
            ? alignDetails.kycs[0]
            : null;

        const result = {
          customer_id: alignDetails.customer_id,
          email: alignDetails.email,
          kycs: firstKyc
            ? {
                status: firstKyc.status as
                  | 'pending'
                  | 'approved'
                  | 'rejected'
                  | null, // Cast to ensure compatibility with schema
                kyc_flow_link: firstKyc.kyc_flow_link || null,
              }
            : null,
        };

        // Validate with Zod before returning, primarily for development reassurance
        const parsedResult = alignCustomerDirectDetailsSchema
          .nullable()
          .safeParse(result);
        if (!parsedResult.success) {
          ctx.log.error(
            {
              ...logPayload,
              alignCustomerId: user.alignCustomerId,
              error: parsedResult.error.flatten(),
            },
            'Failed to parse mapped Align data against schema.',
          );
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not process Align data.',
          });
        }

        ctx.log.info(
          { ...logPayload, alignCustomerId: user.alignCustomerId },
          'Successfully fetched and mapped direct Align customer details.',
        );
        return parsedResult.data;
      } catch (error) {
        ctx.log.error(
          {
            ...logPayload,
            alignCustomerId: user.alignCustomerId,
            error: (error as Error).message,
          },
          'Failed to fetch/process direct Align customer details.',
        );
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
        privyDid: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

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
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);
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
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { privyDid } = input;
      const logPayload = {
        procedure: 'overrideKycStatusFromAlign',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(
        logPayload,
        'Attempting to override KYC status from Align...',
      );

      try {
        // Get user from DB
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.',
          });
        }

        if (!user.alignCustomerId) {
          ctx.log.info(
            { ...logPayload },
            'User does not have an Align Customer ID.',
          );
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'User does not have an Align Customer ID. Cannot fetch KYC status.',
          });
        }

        // Fetch customer details from Align
        const alignCustomer = await alignApi.getCustomer(user.alignCustomerId);
        const latestKyc =
          alignCustomer.kycs && alignCustomer.kycs.length > 0
            ? alignCustomer.kycs[0]
            : null;

        if (!latestKyc) {
          ctx.log.warn(
            { ...logPayload, alignCustomerId: user.alignCustomerId },
            'No KYC information found in Align.',
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No KYC information found in Align for this user.',
          });
        }

        const alignKycStatus = latestKyc.status;
        const currentDbStatus = user.kycStatus;

        ctx.log.info(
          {
            ...logPayload,
            alignKycStatus,
            currentDbStatus,
          },
          'Comparing KYC statuses...',
        );

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

        ctx.log.info(
          {
            ...logPayload,
            result: {
              previousStatus: currentDbStatus,
              newStatus: newKycStatus,
              alignStatus: alignKycStatus,
            },
          },
          'Successfully overrode KYC status from Align.',
        );

        return {
          success: true,
          message: `KYC status updated from '${currentDbStatus}' to '${newKycStatus}' based on Align status: '${alignKycStatus}'`,
          previousStatus: currentDbStatus,
          newStatus: newKycStatus,
          alignStatus: alignKycStatus,
        };
      } catch (error) {
        ctx.log.error(
          { ...logPayload, error: (error as Error).message },
          'Failed to override KYC status from Align.',
        );
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
    .input(z.object({ privyDid: z.string().min(1, 'Privy DID is required') }))
    .mutation(async ({ ctx, input }) => {
      const { privyDid } = input;
      const logPayload = {
        procedure: 'simulateKycApproval',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(logPayload, 'Attempting to simulate KYC approval...');
      const targetUser = await db.query.users.findFirst({
        where: eq(users.privyDid, privyDid),
      });
      if (!targetUser) {
        ctx.log.error({ ...logPayload }, 'Target user not found.');
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Target user not found.',
        });
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
        ctx.log.info(
          { ...logPayload, result: { kycStatus: 'approved' } },
          'Successfully simulated KYC approval.',
        );
        return {
          success: true,
          message: `KYC status for user ${privyDid} set to approved.`,
        };
      } catch (error) {
        ctx.log.error(
          { ...logPayload, error: (error as Error).message },
          'Failed to simulate KYC approval.',
        );
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
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { privyDid } = input;
      const logPayload = {
        procedure: 'createKycSession',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(logPayload, 'Attempting to create KYC session...');

      try {
        // Get user from DB
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.',
          });
        }

        if (!user.alignCustomerId) {
          ctx.log.info(
            { ...logPayload },
            'User does not have an Align Customer ID.',
          );
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'User does not have an Align Customer ID. Cannot create KYC session.',
          });
        }

        // Create KYC session in Align
        const kycSession = await alignApi.createKycSession(
          user.alignCustomerId,
        );

        // Update user's KYC status and flow link in DB
        await db
          .update(users)
          .set({
            kycStatus:
              kycSession.status === 'pending' ? 'pending' : kycSession.status,
            kycProvider: 'align',
            kycFlowLink: kycSession.kyc_flow_link || null,
          })
          .where(eq(users.privyDid, privyDid));

        ctx.log.info(
          {
            ...logPayload,
            result: {
              kycStatus: kycSession.status,
              hasFlowLink: !!kycSession.kyc_flow_link,
            },
          },
          'Successfully created KYC session.',
        );

        return {
          success: true,
          message: `KYC session created successfully. Status: ${kycSession.status}`,
          kycStatus: kycSession.status,
          kycFlowLink: kycSession.kyc_flow_link,
        };
      } catch (error) {
        ctx.log.error(
          { ...logPayload, error: (error as Error).message },
          'Failed to create KYC session.',
        );
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
        privyDid: z.string().min(1, 'Privy DID is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        beneficiaryType: z
          .enum(['individual', 'corporate'])
          .default('individual'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { privyDid } = input;
      const logPayload = {
        procedure: 'createAlignCustomer',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(logPayload, 'Attempting to create Align customer...');

      try {
        // Get user from DB with profile information
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.',
          });
        }

        if (user.alignCustomerId) {
          ctx.log.info(
            { ...logPayload, alignCustomerId: user.alignCustomerId },
            'User already has an Align Customer ID.',
          );
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User already has an Align Customer ID.',
          });
        }

        // Get user profile to access email and other profile fields
        const userProfile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.privyDid, privyDid),
        });

        if (!userProfile?.email) {
          ctx.log.warn(
            { ...logPayload },
            'User does not have an email address in their profile.',
          );
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'User must have an email address in their profile to create Align customer.',
          });
        }

        // Create customer in Align
        const alignCustomer = await alignApi.createCustomer(
          userProfile.email,
          input.firstName,
          input.lastName,
          userProfile.businessName || undefined,
          input.beneficiaryType,
        );

        // Update user's Align customer ID in DB
        await db
          .update(users)
          .set({
            alignCustomerId: alignCustomer.customer_id,
          })
          .where(eq(users.privyDid, privyDid));

        ctx.log.info(
          {
            ...logPayload,
            result: {
              alignCustomerId: alignCustomer.customer_id,
              email: alignCustomer.email,
            },
          },
          'Successfully created Align customer.',
        );

        return {
          success: true,
          message: `Align customer created successfully. Customer ID: ${alignCustomer.customer_id}`,
          alignCustomerId: alignCustomer.customer_id,
          email: alignCustomer.email,
        };
      } catch (error) {
        ctx.log.error(
          { ...logPayload, error: (error as Error).message },
          'Failed to create Align customer.',
        );
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
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { privyDid } = input;
      const logPayload = {
        procedure: 'syncAlignCustomer',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(logPayload, 'Attempting to sync user with Align...');

      try {
        // Get user from DB
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          ctx.log.warn({ ...logPayload }, 'User not found in DB.');
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.',
          });
        }

        // Get user profile to access email
        const userProfile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.privyDid, privyDid),
        });

        if (!userProfile?.email) {
          ctx.log.warn(
            { ...logPayload },
            'User does not have an email address in their profile.',
          );
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'User must have an email address in their profile to sync with Align.',
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
            ctx.log.warn(
              { ...logPayload, error: (error as Error).message },
              'Failed to fetch customer by ID, will try searching by email.',
            );
          }
        }

        // If no customer ID or fetch failed, search by email
        if (!alignCustomer) {
          alignCustomer = await alignApi.searchCustomerByEmail(
            userProfile.email,
          );
          if (alignCustomer) {
            wasCustomerFound = true;
          }
        }

        if (!alignCustomer) {
          ctx.log.info(
            { ...logPayload },
            'No Align customer found for this user.',
          );
          throw new TRPCError({
            code: 'NOT_FOUND',
            message:
              'No Align customer found for this user. Please create an Align customer first.',
          });
        }

        // Extract KYC status from Align customer
        const latestKyc =
          alignCustomer.kycs && alignCustomer.kycs.length > 0
            ? alignCustomer.kycs[0]
            : null;
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

        ctx.log.info(
          {
            ...logPayload,
            result: syncResults,
          },
          'Successfully synced user with Align.',
        );

        return {
          success: true,
          message: `Successfully synced with Align. Customer ID: ${alignCustomer.customer_id}, KYC Status: ${newKycStatus}`,
          ...syncResults,
        };
      } catch (error) {
        ctx.log.error(
          { ...logPayload, error: (error as Error).message },
          'Failed to sync with Align.',
        );
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to sync with Align: ${(error as Error).message}`,
        });
      }
    }),

  getUserDetails: protectedProcedure
    .input(
      z.object({
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { privyDid } = input;
      const logPayload = {
        procedure: 'getUserDetails',
        targetUserDid: privyDid,
        adminUserDid: ctx.userId,
      };
      ctx.log.info(logPayload, 'Fetching detailed user information...');

      try {
        const user = await db.query.users.findFirst({
          where: eq(users.privyDid, privyDid),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.',
          });
        }

        const features = await db
          .select()
          .from(userFeatures)
          .where(eq(userFeatures.userPrivyDid, privyDid));

        const primaryWorkspace = user.primaryWorkspaceId
          ? await db.query.workspaces.findFirst({
              where: eq(workspaces.id, user.primaryWorkspaceId),
            })
          : null;

        const memberships = await db
          .select({
            workspaceId: workspaceMembers.workspaceId,
            role: workspaceMembers.role,
            isPrimary: workspaceMembers.isPrimary,
            joinedAt: workspaceMembers.joinedAt,
            workspaceName: workspaces.name,
          })
          .from(workspaceMembers)
          .leftJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
          .where(eq(workspaceMembers.userId, privyDid));

        const hasSavings = features.some(
          (f) => f.featureName === 'savings' && f.isActive,
        );

        ctx.log.info(
          { ...logPayload, result: 'success' },
          'Successfully fetched user details.',
        );

        return {
          user: {
            privyDid: user.privyDid,
            createdAt: user.createdAt,
            firstName: user.firstName,
            lastName: user.lastName,
            companyName: user.companyName,
            beneficiaryType: user.beneficiaryType,
            alignCustomerId: user.alignCustomerId,
            kycProvider: user.kycProvider,
            kycStatus: user.kycStatus,
            kycFlowLink: user.kycFlowLink,
            alignVirtualAccountId: user.alignVirtualAccountId,
            kycMarkedDone: user.kycMarkedDone,
            kycSubStatus: user.kycSubStatus,
            loopsContactSynced: user.loopsContactSynced,
            userRole: user.userRole,
            contractorInviteCode: user.contractorInviteCode,
            primaryWorkspaceId: user.primaryWorkspaceId,
          },
          features: features.map((f) => ({
            featureName: f.featureName,
            isActive: f.isActive,
            purchaseSource: f.purchaseSource,
            activatedAt: f.activatedAt,
            expiresAt: f.expiresAt,
          })),
          hasSavings,
          primaryWorkspace: primaryWorkspace
            ? {
                id: primaryWorkspace.id,
                name: primaryWorkspace.name,
                createdAt: primaryWorkspace.createdAt,
              }
            : null,
          workspaceMemberships: memberships.map((m) => ({
            workspaceId: m.workspaceId,
            workspaceName: m.workspaceName || 'Unknown',
            role: m.role,
            isPrimary: m.isPrimary,
            joinedAt: m.joinedAt,
          })),
        };
      } catch (error) {
        ctx.log.error(
          { ...logPayload, error: (error as Error).message },
          'Failed to fetch user details.',
        );
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch user details: ${(error as Error).message}`,
        });
      }
    }),

  listWorkspacesWithMembers: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User ID not found',
      });
    }
    await requireAdmin(ctx.userId);

    try {
      const allWorkspaces = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
          createdAt: workspaces.createdAt,
          workspaceType: workspaces.workspaceType,
          kycStatus: workspaces.kycStatus,
          kycProvider: workspaces.kycProvider,
          alignCustomerId: workspaces.alignCustomerId,
          alignVirtualAccountId: workspaces.alignVirtualAccountId,
          beneficiaryType: workspaces.beneficiaryType,
          companyName: workspaces.companyName,
          firstName: workspaces.firstName,
          lastName: workspaces.lastName,
          createdBy: workspaces.createdBy,
        })
        .from(workspaces)
        .orderBy(workspaces.createdAt);

      const workspacesWithData = await Promise.all(
        allWorkspaces.map(async (workspace) => {
          const members = await db
            .select({
              userId: workspaceMembers.userId,
              role: workspaceMembers.role,
              isPrimary: workspaceMembers.isPrimary,
              joinedAt: workspaceMembers.joinedAt,
              email: userProfilesTable.email,
              businessName: userProfilesTable.businessName,
            })
            .from(workspaceMembers)
            .leftJoin(
              userProfilesTable,
              eq(workspaceMembers.userId, userProfilesTable.privyDid),
            )
            .where(eq(workspaceMembers.workspaceId, workspace.id));

          const safes = await db
            .select({
              safeAddress: userSafes.safeAddress,
              safeType: userSafes.safeType,
            })
            .from(userSafes)
            .where(eq(userSafes.workspaceId, workspace.id));

          let totalSafeBalance = 0n;
          if (safes.length > 0) {
            const safeAddresses = safes
              .map((s) => s.safeAddress)
              .filter(Boolean) as `0x${string}`[];
            const balanceMap = await getBatchSafeBalances({
              safeAddresses,
            });
            totalSafeBalance = Object.values(balanceMap).reduce(
              (sum, balance) => sum + (balance?.raw ?? 0n),
              0n,
            );
          }

          const deposits = await db
            .select()
            .from(earnDeposits)
            .where(eq(earnDeposits.workspaceId, workspace.id));

          const withdrawals = await db
            .select()
            .from(earnWithdrawals)
            .where(eq(earnWithdrawals.workspaceId, workspace.id));

          const totalDepositsAmount = deposits.reduce(
            (sum, d) => sum + BigInt(d.assetsDeposited),
            0n,
          );
          const totalWithdrawalsAmount = withdrawals.reduce(
            (sum, w) => sum + BigInt(w.assetsWithdrawn),
            0n,
          );
          const netInVaults = totalDepositsAmount - totalWithdrawalsAmount;
          const totalBalance = totalSafeBalance + netInVaults;

          return {
            ...workspace,
            members,
            memberCount: members.length,
            safeCount: safes.length,
            totalBalance: totalBalance.toString(),
            balanceInSafes: totalSafeBalance.toString(),
            balanceInVaults: netInVaults.toString(),
            depositCount: deposits.length,
            withdrawalCount: withdrawals.length,
          };
        }),
      );

      return workspacesWithData;
    } catch (error) {
      ctx.log.error(
        { error: (error as Error).message },
        'Failed to list workspaces with members.',
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to list workspaces: ${(error as Error).message}`,
      });
    }
  }),

  getWorkspaceDetails: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid('Invalid workspace ID'),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { workspaceId } = input;

      try {
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, workspaceId),
        });

        if (!workspace) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Workspace not found.',
          });
        }

        const members = await db
          .select({
            userId: workspaceMembers.userId,
            role: workspaceMembers.role,
            isPrimary: workspaceMembers.isPrimary,
            joinedAt: workspaceMembers.joinedAt,
            userFirstName: users.firstName,
            userLastName: users.lastName,
            userEmail: users.privyDid,
          })
          .from(workspaceMembers)
          .leftJoin(users, eq(workspaceMembers.userId, users.privyDid))
          .where(eq(workspaceMembers.workspaceId, workspaceId));

        const safes = await db.query.userSafes.findMany({
          where: eq(userSafes.workspaceId, workspaceId),
        });

        const autoEarnConfigsList = await db.query.autoEarnConfigs.findMany({
          where: eq(autoEarnConfigs.workspaceId, workspaceId),
        });

        const safeAddresses = safes.map((s) => s.safeAddress);

        const earnDepositsList = await db.query.earnDeposits.findMany({
          where: (tbl, { and, eq, or, isNull, inArray }) =>
            safeAddresses.length > 0
              ? and(
                  inArray(tbl.safeAddress, safeAddresses),
                  or(eq(tbl.workspaceId, workspaceId), isNull(tbl.workspaceId)),
                )
              : eq(tbl.workspaceId, workspaceId),
        });

        const totalDeposited = earnDepositsList.reduce(
          (sum: bigint, d) => sum + BigInt(d.assetsDeposited),
          0n,
        );

        // Get vault breakdown for this workspace
        let vaultBreakdown: any[] = [];
        try {
          const { BASE_USDC_VAULTS } = require('@/server/earn/base-vaults');

          if (safeAddresses.length === 0) {
            vaultBreakdown = [];
          } else {
            // Solution 1A: Read actual on-chain vault positions
            // This works even if database tracking is incomplete/missing
            const vaultStats = await Promise.all(
              BASE_USDC_VAULTS.map(async (vaultInfo: any) => {
                try {
                  const vaultAddress = vaultInfo.address as `0x${string}`;

                  // Read vault positions for all safes in this workspace
                  let totalAssets = 0n;

                  for (const safeAddress of safeAddresses) {
                    // Read ERC4626 vault shares for this Safe
                    const shares = await publicClient.readContract({
                      address: vaultAddress,
                      abi: ERC4626_VAULT_ABI,
                      functionName: 'balanceOf',
                      args: [safeAddress as `0x${string}`],
                    });

                    // Convert shares to assets (USDC)
                    if (shares > 0n) {
                      const assets = await publicClient.readContract({
                        address: vaultAddress,
                        abi: ERC4626_VAULT_ABI,
                        functionName: 'convertToAssets',
                        args: [shares],
                      });
                      totalAssets += assets;
                    }
                  }

                  // Only include vaults with non-zero balances
                  if (totalAssets === 0n) {
                    return null;
                  }

                  return {
                    vaultAddress: vaultInfo.address,
                    vaultName: vaultInfo.name || 'Unknown Vault',
                    displayName: vaultInfo.displayName || vaultInfo.address,
                    balance: totalAssets.toString(),
                    balanceUsd: Number(totalAssets) / 1_000_000,
                  };
                } catch (error) {
                  console.error(
                    `Error reading on-chain balance for ${vaultInfo.address}:`,
                    error,
                  );
                  return null;
                }
              }),
            );

            // Filter out null values (vaults with zero balance or errors)
            vaultBreakdown = vaultStats.filter((v) => v !== null);
          }
        } catch (error) {
          console.error('Error getting vault breakdown:', error);
        }

        // Get virtual account details if workspace has one
        let virtualAccount: any = null;
        if (workspace.alignCustomerId && workspace.alignVirtualAccountId) {
          try {
            virtualAccount = await alignApi.getVirtualAccount(
              workspace.alignCustomerId,
              workspace.alignVirtualAccountId,
            );
          } catch (error) {
            console.error('Error fetching virtual account details:', error);
          }
        }

        // Get funding sources (starter accounts) for workspace members
        const memberUserIds = members.map((m) => m.userId);
        const fundingSources = await db.query.userFundingSources.findMany({
          where: (tbl, { inArray }) =>
            memberUserIds.length > 0
              ? inArray(tbl.userPrivyDid, memberUserIds)
              : undefined,
        });

        // Get user-owned virtual accounts for workspace members
        const memberVirtualAccounts: any[] = [];
        for (const member of members) {
          const memberUser = await db.query.users.findFirst({
            where: eq(users.privyDid, member.userId),
          });

          if (
            memberUser?.alignCustomerId &&
            memberUser?.alignVirtualAccountId
          ) {
            try {
              const userVirtualAccount = await alignApi.getVirtualAccount(
                memberUser.alignCustomerId,
                memberUser.alignVirtualAccountId,
              );
              memberVirtualAccounts.push({
                userId: member.userId,
                firstName: memberUser.firstName,
                lastName: memberUser.lastName,
                virtualAccount: userVirtualAccount,
              });
            } catch (error) {
              console.error(
                `Error fetching virtual account for user ${member.userId}:`,
                error,
              );
            }
          }
        }

        return {
          workspace: {
            id: workspace.id,
            name: workspace.name,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            createdBy: workspace.createdBy,
            workspaceType: workspace.workspaceType,
            kycStatus: workspace.kycStatus,
            kycProvider: workspace.kycProvider,
            kycSubStatus: workspace.kycSubStatus,
            kycFlowLink: workspace.kycFlowLink,
            alignCustomerId: workspace.alignCustomerId,
            alignVirtualAccountId: workspace.alignVirtualAccountId,
            beneficiaryType: workspace.beneficiaryType,
            companyName: workspace.companyName,
            firstName: workspace.firstName,
            lastName: workspace.lastName,
          },
          members: members.map((m) => ({
            userId: m.userId,
            role: m.role,
            isPrimary: m.isPrimary,
            joinedAt: m.joinedAt,
            firstName: m.userFirstName,
            lastName: m.userLastName,
          })),
          safes: safes.map((s) => ({
            safeAddress: s.safeAddress,
            safeType: s.safeType,
            isEarnModuleEnabled: s.isEarnModuleEnabled,
            createdAt: s.createdAt,
          })),
          autoEarn: {
            configs: autoEarnConfigsList.map((c) => ({
              safeAddress: c.safeAddress,
              percentage: c.pct,
              lastTrigger: c.lastTrigger,
            })),
            enabled: autoEarnConfigsList.length > 0,
          },
          finances: {
            totalDeposited: totalDeposited.toString(),
            depositCount: earnDepositsList.length,
            safeCount: safes.length,
            vaultBreakdown,
          },
          virtualAccount,
          fundingSources: fundingSources.map((fs) => ({
            id: fs.id,
            userPrivyDid: fs.userPrivyDid,
            accountTier: fs.accountTier,
            sourceAccountType: fs.sourceAccountType,
            sourceCurrency: fs.sourceCurrency,
            sourceBankName: fs.sourceBankName,
            sourceBankBeneficiaryName: fs.sourceBankBeneficiaryName,
            sourceIban: fs.sourceIban,
            sourceBicSwift: fs.sourceBicSwift,
            sourceRoutingNumber: fs.sourceRoutingNumber,
            sourceAccountNumber: fs.sourceAccountNumber,
            sourceSortCode: fs.sourceSortCode,
            destinationCurrency: fs.destinationCurrency,
            destinationAddress: fs.destinationAddress,
            createdAt: fs.createdAt,
          })),
          memberVirtualAccounts,
        };
      } catch (error) {
        ctx.log.error(
          { workspaceId, error: (error as Error).message },
          'Failed to fetch workspace details.',
        );
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch workspace details: ${(error as Error).message}`,
        });
      }
    }),

  getUserDepositBreakdown: protectedProcedure
    .input(
      z.object({
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      try {
        const userDeposits = await db
          .select()
          .from(earnDeposits)
          .where(eq(earnDeposits.userDid, input.privyDid));

        const userWithdrawals = await db
          .select()
          .from(earnWithdrawals)
          .where(eq(earnWithdrawals.userDid, input.privyDid));

        const totalDepositsAmount = userDeposits.reduce(
          (sum, deposit) => sum + BigInt(deposit.assetsDeposited),
          0n,
        );

        const totalWithdrawalsAmount = userWithdrawals.reduce(
          (sum, withdrawal) => sum + BigInt(withdrawal.assetsWithdrawn),
          0n,
        );

        const netDeposited = totalDepositsAmount - totalWithdrawalsAmount;

        const userSafe = await db.query.userSafes.findFirst({
          where: eq(userSafes.userDid, input.privyDid),
        });

        let safeBalance = 0n;
        if (userSafe?.safeAddress) {
          try {
            const bal = await getSafeBalance({
              safeAddress: userSafe.safeAddress as `0x${string}`,
            });
            safeBalance = bal?.raw ?? 0n;
          } catch (err) {
            console.error('Failed to fetch safe balance:', err);
          }
        }

        const totalDeposited = safeBalance + netDeposited;

        return {
          totalDeposited: totalDeposited.toString(),
          breakdown: {
            inSafe: safeBalance.toString(),
            inVaults: netDeposited.toString(),
            totalDeposits: totalDepositsAmount.toString(),
            totalWithdrawals: totalWithdrawalsAmount.toString(),
            depositCount: userDeposits.length,
            withdrawalCount: userWithdrawals.length,
            uniqueVaults: new Set(userDeposits.map((d) => d.vaultAddress)).size,
          },
        };
      } catch (error) {
        console.error('getUserDepositBreakdown: error', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get user deposit breakdown: ${(error as Error).message}`,
        });
      }
    }),

  listAdmins: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User ID not found',
      });
    }
    await requireAdmin(ctx.userId);

    try {
      const adminList = await db
        .select({
          privyDid: admins.privyDid,
          createdAt: admins.createdAt,
          addedBy: admins.addedBy,
          notes: admins.notes,
          email: userProfilesTable.email,
        })
        .from(admins)
        .leftJoin(
          userProfilesTable,
          eq(admins.privyDid, userProfilesTable.privyDid),
        )
        .orderBy(admins.createdAt);

      return adminList;
    } catch (error) {
      console.error('listAdmins: error', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to list admins: ${(error as Error).message}`,
      });
    }
  }),

  addAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().email('Valid email required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      try {
        const targetUser = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.email, input.email),
        });

        if (!targetUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User with this email not found',
          });
        }

        const existingAdmin = await db.query.admins.findFirst({
          where: eq(admins.privyDid, targetUser.privyDid),
        });

        if (existingAdmin) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is already an admin',
          });
        }

        await db.insert(admins).values({
          privyDid: targetUser.privyDid,
          addedBy: ctx.userId,
          notes: `Added via admin panel by ${ctx.userId}`,
        });

        return {
          success: true,
          message: `Admin access granted to ${input.email}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('addAdmin: error', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to add admin: ${(error as Error).message}`,
        });
      }
    }),

  removeAdmin: protectedProcedure
    .input(
      z.object({
        privyDid: z.string().min(1, 'Privy DID is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      if (input.privyDid === ctx.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot remove yourself as admin',
        });
      }

      try {
        const result = await db
          .delete(admins)
          .where(eq(admins.privyDid, input.privyDid))
          .returning();

        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Admin not found',
          });
        }

        return {
          success: true,
          message: 'Admin removed successfully',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('removeAdmin: error', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to remove admin: ${(error as Error).message}`,
        });
      }
    }),

  getWorkspaceVaultBreakdown: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid('Invalid workspace ID'),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { workspaceId } = input;

      try {
        // Get workspace info
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, workspaceId),
        });

        if (!workspace) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Workspace not found',
          });
        }

        // Get primary Safe for this workspace by finding any userSafe with this workspaceId
        const userSafe = await db.query.userSafes.findFirst({
          where: eq(userSafes.workspaceId, workspaceId),
        });

        if (!userSafe?.safeAddress) {
          return {
            vaultBreakdown: [],
            totalBalance: '0',
            workspaceName: workspace.name,
          };
        }

        const safeAddress = userSafe.safeAddress;

        // Import base vaults to get vault list and info
        const { BASE_USDC_VAULTS } = require('@/server/earn/base-vaults');
        const vaultAddresses = BASE_USDC_VAULTS.map(
          (vault: any) => vault.address,
        );

        // Get vault balances for each vault
        const vaultStats = await Promise.all(
          vaultAddresses.map(async (vaultAddress: string) => {
            try {
              // Get deposits for this vault and workspace
              const deposits = await db.query.earnDeposits.findMany({
                where: and(
                  eq(earnDeposits.safeAddress, safeAddress),
                  eq(earnDeposits.vaultAddress, vaultAddress),
                  eq(earnDeposits.workspaceId, workspaceId),
                ),
              });

              // Get withdrawals for this vault and workspace
              const withdrawals = await db.query.earnWithdrawals.findMany({
                where: and(
                  eq(earnWithdrawals.safeAddress, safeAddress),
                  eq(earnWithdrawals.vaultAddress, vaultAddress),
                  eq(earnWithdrawals.workspaceId, workspaceId),
                ),
              });

              let totalDeposited = 0n;
              let shares = 0n;

              for (const deposit of deposits) {
                totalDeposited += BigInt(deposit.assetsDeposited);
                shares += BigInt(deposit.sharesReceived);
              }

              let totalWithdrawn = 0n;
              for (const withdrawal of withdrawals) {
                totalWithdrawn += BigInt(withdrawal.assetsWithdrawn);
                shares -= BigInt(withdrawal.sharesBurned);
              }

              const netBalance = totalDeposited - totalWithdrawn;

              // Find vault info from base vaults
              const vaultInfo = BASE_USDC_VAULTS.find(
                (vault: any) =>
                  vault.address.toLowerCase() === vaultAddress.toLowerCase(),
              );

              return {
                vaultAddress,
                vaultName: vaultInfo?.name || 'Unknown Vault',
                displayName: vaultInfo?.displayName || 'Unknown Vault',
                balance: netBalance.toString(),
                shares: shares.toString(),
              };
            } catch (error) {
              console.error(
                `Error getting vault stats for ${vaultAddress}:`,
                error,
              );
              return {
                vaultAddress,
                vaultName: 'Error',
                displayName: 'Error',
                balance: '0',
                shares: '0',
              };
            }
          }),
        );

        // Filter out vaults with zero balance and calculate totals
        const nonZeroVaults = vaultStats.filter(
          (vault) => vault.balance !== '0',
        );
        const totalBalance = vaultStats.reduce(
          (sum, vault) => sum + BigInt(vault.balance),
          0n,
        );

        return {
          vaultBreakdown: nonZeroVaults,
          totalBalance: totalBalance.toString(),
          workspaceName: workspace.name,
        };
      } catch (error) {
        console.error('getWorkspaceVaultBreakdown: error', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get vault breakdown: ${(error as Error).message}`,
        });
      }
    }),

  // ============================================
  // Workspace Feature Management
  // ============================================

  /**
   * Grant a feature to a workspace
   */
  grantWorkspaceFeature: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        featureName: z.enum([
          'multi_chain',
          'advanced_analytics',
          'auto_categorization',
          'workspace_automation',
        ]),
        grantReference: z.string().optional(),
        expiresAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { workspaceId, featureName, grantReference, expiresAt } = input;

      // Verify workspace exists
      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, workspaceId),
      });

      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Workspace ${workspaceId} not found`,
        });
      }

      try {
        // Upsert the feature (insert or update if exists)
        await db
          .insert(workspaceFeatures)
          .values({
            workspaceId,
            featureName: featureName as WorkspaceFeatureName,
            isActive: true,
            grantedBy: ctx.userId,
            grantSource: 'admin',
            grantReference,
            expiresAt,
            activatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [
              workspaceFeatures.workspaceId,
              workspaceFeatures.featureName,
            ],
            set: {
              isActive: true,
              grantedBy: ctx.userId,
              grantSource: 'admin',
              grantReference,
              expiresAt,
              activatedAt: new Date(),
              updatedAt: new Date(),
            },
          });

        ctx.log.info(
          {
            workspaceId,
            featureName,
            grantedBy: ctx.userId,
          },
          'Workspace feature granted',
        );

        return {
          success: true,
          message: `Feature ${featureName} granted to workspace ${workspace.name}`,
        };
      } catch (error) {
        ctx.log.error(
          {
            workspaceId,
            featureName,
            error: (error as Error).message,
          },
          'Failed to grant workspace feature',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to grant feature: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Revoke a feature from a workspace
   */
  revokeWorkspaceFeature: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        featureName: z.enum([
          'multi_chain',
          'advanced_analytics',
          'auto_categorization',
          'workspace_automation',
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { workspaceId, featureName } = input;

      try {
        // Set feature to inactive
        const result = await db
          .update(workspaceFeatures)
          .set({
            isActive: false,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(workspaceFeatures.workspaceId, workspaceId),
              eq(
                workspaceFeatures.featureName,
                featureName as WorkspaceFeatureName,
              ),
            ),
          )
          .returning();

        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Feature ${featureName} not found for workspace`,
          });
        }

        ctx.log.info(
          {
            workspaceId,
            featureName,
            revokedBy: ctx.userId,
          },
          'Workspace feature revoked',
        );

        return {
          success: true,
          message: `Feature ${featureName} revoked from workspace`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        ctx.log.error(
          {
            workspaceId,
            featureName,
            error: (error as Error).message,
          },
          'Failed to revoke workspace feature',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to revoke feature: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * List all features for a workspace
   */
  listWorkspaceFeatures: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const features = await db.query.workspaceFeatures.findMany({
        where: eq(workspaceFeatures.workspaceId, input.workspaceId),
      });

      return features;
    }),

  /**
   * List all workspaces with a specific feature enabled
   */
  listWorkspacesWithFeature: protectedProcedure
    .input(
      z.object({
        featureName: z.enum([
          'multi_chain',
          'advanced_analytics',
          'auto_categorization',
          'workspace_automation',
        ]),
        activeOnly: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { featureName, activeOnly } = input;

      const features = await db.query.workspaceFeatures.findMany({
        where: activeOnly
          ? and(
              eq(
                workspaceFeatures.featureName,
                featureName as WorkspaceFeatureName,
              ),
              eq(workspaceFeatures.isActive, true),
            )
          : eq(
              workspaceFeatures.featureName,
              featureName as WorkspaceFeatureName,
            ),
        with: {
          workspace: true,
        },
      });

      return features.map((f) => ({
        workspaceId: f.workspaceId,
        workspaceName: f.workspace?.name || 'Unknown',
        isActive: f.isActive,
        activatedAt: f.activatedAt,
        expiresAt: f.expiresAt,
        grantedBy: f.grantedBy,
        grantSource: f.grantSource,
      }));
    }),

  /**
   * Check if a workspace has a specific feature
   */
  checkWorkspaceFeature: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        featureName: z.enum([
          'multi_chain',
          'advanced_analytics',
          'auto_categorization',
          'workspace_automation',
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User ID not found',
        });
      }
      await requireAdmin(ctx.userId);

      const { workspaceId, featureName } = input;

      const feature = await db.query.workspaceFeatures.findFirst({
        where: and(
          eq(workspaceFeatures.workspaceId, workspaceId),
          eq(
            workspaceFeatures.featureName,
            featureName as WorkspaceFeatureName,
          ),
          eq(workspaceFeatures.isActive, true),
        ),
      });

      // Check if expired
      const isExpired = feature?.expiresAt
        ? new Date(feature.expiresAt) < new Date()
        : false;

      return {
        hasFeature: !!feature && !isExpired,
        feature: feature
          ? {
              isActive: feature.isActive,
              activatedAt: feature.activatedAt,
              expiresAt: feature.expiresAt,
              isExpired,
            }
          : null,
      };
    }),
});
