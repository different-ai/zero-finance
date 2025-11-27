import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../create-router';
import { db } from '../../db';
import {
  users,
  workspaces,
  userSafes,
  userFundingSources,
  userDestinationBankAccounts,
  offrampTransfers,
  onrampTransfers,
} from '@/db/schema';
import {
  alignApi,
  /* alignOfframpTransferSchema, */ AlignDestinationBankAccount,
} from '../services/align-api';
import { loopsApi, LoopsEvent } from '../services/loops-service';
import { eq, and, desc } from 'drizzle-orm';
import { getUser } from '@/lib/auth';
import {
  prepareTokenTransferData,
  TOKEN_ADDRESSES,
} from '../services/safe-token-service';
import type { Address } from 'viem';
import { featureConfig } from '@/lib/feature-config';

/**
 * Helper function to fetch fresh KYC status from Align API and update user DB
 * DEPRECATED: Use fetchAndUpdateWorkspaceKycStatus for new code
 * @param alignCustomerId - The Align customer ID
 * @param userId - The user's Privy DID
 * @returns The latest KYC information or null if not found
 */
async function fetchAndUpdateKycStatus(
  alignCustomerId: string,
  userId: string,
) {
  console.log(
    '[fetchAndUpdateKycStatus] Starting for customerId:',
    alignCustomerId,
    'userId:',
    userId,
  );
  try {
    const customer = await alignApi.getCustomer(alignCustomerId);
    const latestKyc =
      customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

    if (latestKyc) {
      // Update user DB with latest status (legacy behavior)
      await db
        .update(users)
        .set({
          kycStatus: latestKyc.status,
          kycFlowLink: latestKyc.kyc_flow_link,
          kycSubStatus: latestKyc.sub_status,
          kycProvider: 'align',
          firstName: customer.first_name || null,
          lastName: customer.last_name || null,
          companyName: customer.company_name || null,
          beneficiaryType: customer.beneficiary_type || null,
        })
        .where(eq(users.privyDid, userId));
    }

    return latestKyc;
  } catch (error) {
    console.error('[fetchAndUpdateKycStatus] Error:', error);
    throw error;
  }
}

/**
 * Helper function to fetch fresh KYC status from Align API and update workspace DB
 * @param alignCustomerId - The Align customer ID
 * @param workspaceId - The workspace UUID
 * @returns The latest KYC information or null if not found
 */
async function fetchAndUpdateWorkspaceKycStatus(
  alignCustomerId: string,
  workspaceId: string,
) {
  console.log(
    '[fetchAndUpdateWorkspaceKycStatus] Starting for customerId:',
    alignCustomerId,
    'workspaceId:',
    workspaceId,
  );
  try {
    const customer = await alignApi.getCustomer(alignCustomerId);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        '[fetchAndUpdateWorkspaceKycStatus] Customer payload meta',
        {
          alignCustomerId,
          workspaceId,
          kycCount: Array.isArray(customer.kycs) ? customer.kycs.length : 0,
        },
      );
    }
    const latestKyc =
      customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

    if (latestKyc) {
      // Update WORKSPACE with latest status and customer details
      await db
        .update(workspaces)
        .set({
          kycStatus: latestKyc.status,
          kycFlowLink: latestKyc.kyc_flow_link,
          kycSubStatus: latestKyc.sub_status,
          kycProvider: 'align',
          // Store customer name details
          firstName: customer.first_name || null,
          lastName: customer.last_name || null,
          companyName: customer.company_name || null,
          beneficiaryType: customer.beneficiary_type || null,
        })
        .where(eq(workspaces.id, workspaceId));

      console.log(
        `[fetchAndUpdateWorkspaceKycStatus] Updated KYC status for workspace ${workspaceId}: status=${latestKyc.status}, sub_status=${latestKyc.sub_status}`,
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        '[fetchAndUpdateWorkspaceKycStatus] Returning KYC summary',
        latestKyc
          ? {
              status: latestKyc.status,
              subStatus: latestKyc.sub_status,
              flowLink: Boolean(latestKyc.kyc_flow_link),
            }
          : { status: 'missing' },
      );
    }
    return latestKyc;
  } catch (error) {
    console.error('[fetchAndUpdateWorkspaceKycStatus] Error:', error);
    if (error instanceof Error) {
      console.error(
        '[fetchAndUpdateWorkspaceKycStatus] Error message:',
        error.message,
      );
      console.error(
        '[fetchAndUpdateWorkspaceKycStatus] Error stack:',
        error.stack,
      );
    }
    throw error;
  }
}

// Define reusable Zod schema for the bank account object REQUIRED BY ALIGN API
// This is used *internally* now to validate the final payload before sending to Align
const alignDestinationBankAccountSchema = z
  .object({
    bank_name: z.string().min(1, 'Bank name required'),
    account_holder_type: z.enum(['individual', 'business']),
    account_holder_first_name: z.string().optional(),
    account_holder_last_name: z.string().optional(),
    account_holder_business_name: z.string().optional(),
    account_holder_address: z.object({
      country: z.string().min(1, 'Country required'),
      city: z.string().min(1, 'City required'),
      street_line_1: z.string().min(1, 'Street required'),
      postal_code: z.string().min(1, 'Postal code required'),
      state: z.string().optional(),
      street_line_2: z.string().optional(),
    }),
    account_type: z.enum(['us', 'iban']),
    iban: z
      .object({
        bic: z.string().min(1, 'BIC required for IBAN'),
        iban_number: z.string().min(1, 'IBAN number required'),
      })
      .optional(),
    us: z
      .object({
        account_number: z.string().min(1, 'Account number required for US'),
        routing_number: z.string().min(1, 'Routing number required for US'),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.account_holder_type === 'individual') {
        return (
          !!data.account_holder_first_name && !!data.account_holder_last_name
        );
      }
      if (data.account_holder_type === 'business') {
        return !!data.account_holder_business_name;
      }
      return false;
    },
    {
      message: 'First/Last name (Individual) or Business name required.',
      path: ['accountHolderFirstName'],
    },
  )
  .refine(
    (data) => {
      if (data.account_type === 'us') return !!data.us;
      if (data.account_type === 'iban') return !!data.iban;
      return false;
    },
    {
      message:
        'US details (Account/Routing) or IBAN details (IBAN/BIC) are required based on type.',
      path: ['accountType'],
    },
  );

/**
 * Router for Align integration
 * Handles customer creation, KYC verification, and virtual/offramp account management
 */
export const alignRouter = router({
  /**
   * Check if Align services are available
   */
  isAvailable: publicProcedure.query(() => {
    return {
      available: featureConfig.align.enabled,
      message: featureConfig.align.enabled
        ? 'Align services are available'
        : 'Banking features not available in Lite mode',
    };
  }),

  /**
   * Get customer status from WORKSPACE and refresh from Align API
   * Always fetches the latest status from Align and updates workspace DB
   */
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    // Return Lite mode response if Align not configured
    if (!featureConfig.align.enabled) {
      return {
        alignCustomerId: null,
        kycStatus: 'not_required' as const,
        kycSubStatus: null,
        hasVirtualAccount: false,
        virtualAccountStatus: 'not_available' as const,
        alignVirtualAccountId: null,
        accountNumber: null,
        routingNumber: null,
        kycFlowLink: null,
        kycMarkedDone: false,
        message: 'KYC not required in Lite mode',
      };
    }

    const userFromPrivy = await getUser();
    if (!userFromPrivy?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user with primary workspace
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userFromPrivy.id),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found in database',
      });
    }

    if (!user.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace - data integrity issue',
      });
    }

    // Get WORKSPACE KYC status - this is the key change
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, user.primaryWorkspaceId),
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }

    // If workspace has alignCustomerId, fetch latest status from Align API
    if (workspace.alignCustomerId) {
      try {
        const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
          workspace.alignCustomerId,
          workspace.id,
        );

        if (latestKyc) {
          // Return the fresh data from Align
          return {
            alignCustomerId: workspace.alignCustomerId,
            kycStatus: latestKyc.status,
            kycFlowLink: latestKyc.kyc_flow_link,
            kycSubStatus: latestKyc.sub_status,
            alignVirtualAccountId: workspace.alignVirtualAccountId,
            kycMarkedDone: workspace.kycMarkedDone,
          };
        }
      } catch (error) {
        // If Align API fails, fall back to DB data but log the error
        ctx.log?.error(
          {
            procedure: 'getCustomerStatus',
            userId: userFromPrivy.id,
            workspaceId: workspace.id,
            alignCustomerId: workspace.alignCustomerId,
            error: (error as Error).message,
          },
          'Failed to fetch latest KYC status from Align API, returning cached data',
        );
      }
    }

    // Return WORKSPACE DB data if no alignCustomerId or if Align API call failed
    return {
      alignCustomerId: workspace.alignCustomerId,
      kycStatus: workspace.kycStatus,
      kycFlowLink: workspace.kycFlowLink,
      kycSubStatus: workspace.kycSubStatus,
      alignVirtualAccountId: workspace.alignVirtualAccountId,
      kycMarkedDone: workspace.kycMarkedDone,
    };
  }),

  /**
   * Initiate KYC process
   * Creates a customer in Align if not already created
   */
  initiateKyc: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        businessName: z.string().optional(),
        accountType: z.enum(['individual', 'corporate']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if Align is available
      if (!featureConfig.align.enabled) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Banking features not available in Lite mode. Upgrade to enable KYC.',
        });
      }

      const userFromPrivy = await getUser();
      const userId = userFromPrivy?.id;
      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      // Get user with workspace
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userId),
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found in database',
        });
      }

      if (!user.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace - data integrity issue',
        });
      }

      // Get workspace
      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        });
      }

      // --- TEST‑KYC SHORT‑CIRCUIT via env var ------------------------------------
      if (process.env.ALIGN_KYC_TEST_MODE === 'true') {
        // Update WORKSPACE for test mode
        try {
          await db
            .update(workspaces)
            .set({
              alignCustomerId: 'test-customer-id',
              kycStatus: 'pending',
              kycFlowLink: 'https://example.com/test-kyc',
              kycProvider: 'align',
            })
            .where(eq(workspaces.id, workspace.id));
          ctx.log?.info(
            {
              procedure: 'initiateKyc',
              userId,
              workspaceId: workspace.id,
              testMode: true,
            },
            'Updated workspace with test KYC data.',
          );
        } catch (dbError) {
          ctx.log?.error(
            {
              procedure: 'initiateKyc',
              userId,
              workspaceId: workspace.id,
              testMode: true,
              error: (dbError as Error).message,
            },
            'Failed to update workspace with test KYC data.',
          );
        }
        return {
          alignCustomerId: 'test-customer-id',
          kycStatus: 'pending' as const,
          kycFlowLink: 'https://example.com/test-kyc',
        };
      }
      // ---------------------------------------------------------------------------

      // Add logging
      const logPayload = {
        procedure: 'initiateKyc',
        userId,
        workspaceId: workspace.id,
        input,
      };
      ctx.log?.info(logPayload, 'Initiating KYC process...');

      try {
        // If workspace already has an Align customer ID, refresh status
        if (workspace.alignCustomerId) {
          const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
            workspace.alignCustomerId,
            workspace.id,
          );

          if (latestKyc) {
            ctx.log?.info(
              {
                ...logPayload,
                result: {
                  alignCustomerId: workspace.alignCustomerId,
                  status: latestKyc.status,
                },
              },
              'KYC initiation successful (existing customer).',
            );

            return {
              alignCustomerId: workspace.alignCustomerId,
              kycStatus: latestKyc.status,
              kycFlowLink: latestKyc.kyc_flow_link,
              kycSubStatus: latestKyc.sub_status,
            };
          }
        }

        // Extract email from Privy user object
        const email =
          typeof userFromPrivy.email === 'string'
            ? userFromPrivy.email
            : userFromPrivy.email?.address || '';

        // Determine beneficiary type based on input
        const beneficiaryType = input.accountType;

        const customer = await alignApi.createCustomer(
          email,
          input.firstName,
          input.lastName,
          input.businessName,
          beneficiaryType,
        );

        // --- ENSURE KYC SESSION ALWAYS EXISTS ---
        let latestKyc =
          customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

        // If no KYC session or missing flow link, create one now
        let kycSession: typeof latestKyc = latestKyc;
        if (!latestKyc || !latestKyc.kyc_flow_link) {
          const newSession = await alignApi.createKycSession(
            customer.customer_id,
          );
          kycSession = {
            status: newSession.status,
            kyc_flow_link: newSession.kyc_flow_link || null,
            sub_status: newSession.sub_status,
          };
        }

        const kycStatusToSet = kycSession?.status ?? 'pending';
        const kycFlowLinkToSet = kycSession?.kyc_flow_link || null;

        // Update WORKSPACE with new customer ID, KYC status, and name details
        await db
          .update(workspaces)
          .set({
            alignCustomerId: customer.customer_id,
            kycStatus: kycStatusToSet,
            kycFlowLink: kycFlowLinkToSet,
            kycProvider: 'align',
            firstName: input.firstName,
            lastName: input.lastName,
            companyName: input.businessName || null,
            beneficiaryType:
              beneficiaryType === 'corporate' ? 'business' : beneficiaryType,
          })
          .where(eq(workspaces.id, workspace.id));

        ctx.log?.info(
          {
            ...logPayload,
            result: {
              alignCustomerId: customer.customer_id,
              status: kycStatusToSet,
            },
          },
          'KYC initiation successful (new customer).',
        );

        return {
          alignCustomerId: customer.customer_id,
          kycStatus: kycStatusToSet,
          kycFlowLink: kycFlowLinkToSet,
          kycSubStatus: kycSession?.sub_status,
        };
      } catch (error) {
        console.error('Error initiating KYC:', error);
        ctx.log?.error(
          { ...logPayload, error: (error as Error).message },
          'KYC initiation failed.',
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to initiate KYC: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Refresh KYC status
   * Polls Align API for the latest KYC status from WORKSPACE
   */
  refreshKycStatus: protectedProcedure.mutation(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    const userId = userFromPrivy?.id;
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user with workspace
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found in database',
      });
    }

    if (!user.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace - data integrity issue',
      });
    }

    // Get workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, user.primaryWorkspaceId),
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }

    if (!workspace.alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Workspace does not have an Align customer ID',
      });
    }

    // Add logging
    const logPayload = {
      procedure: 'refreshKycStatus',
      userId,
      workspaceId: workspace.id,
    };
    ctx.log?.info(logPayload, 'Refreshing KYC status...');

    try {
      const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
        workspace.alignCustomerId,
        workspace.id,
      );

      if (latestKyc) {
        ctx.log?.info(
          {
            ...logPayload,
            result: {
              alignCustomerId: workspace.alignCustomerId,
              status: latestKyc.status,
            },
          },
          'KYC status refresh successful.',
        );

        return {
          alignCustomerId: workspace.alignCustomerId,
          kycStatus: latestKyc.status,
          kycFlowLink: latestKyc.kyc_flow_link,
          kycSubStatus: latestKyc.sub_status,
        };
      }

      return {
        alignCustomerId: workspace.alignCustomerId,
        kycStatus: workspace.kycStatus,
        kycFlowLink: workspace.kycFlowLink,
      };
    } catch (error) {
      console.error('Error refreshing KYC status:', error);
      ctx.log?.error(
        { ...logPayload, error: (error as Error).message },
        'KYC status refresh failed.',
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to refresh KYC status: ${(error as Error).message}`,
      });
    }
  }),

  /**
   * Request a virtual account
   * Creates a virtual account in Align and stores the details in the database
   */
  requestVirtualAccount: protectedProcedure
    .input(
      z.object({
        sourceCurrency: z.enum(['usd', 'eur']),
        destinationToken: z.enum(['usdc', 'usdt']),
        destinationNetwork: z.enum([
          'polygon',
          'ethereum',
          'base',
          'solana',
          'avalanche',
        ]),
        destinationAddress: z.string().length(42),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userFromPrivy = await getUser();
      if (!userFromPrivy?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      // Get user from DB
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userFromPrivy.id),
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found in database',
        });
      }

      if (!user.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace - data integrity issue',
        });
      }

      // Get workspace
      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        });
      }

      if (!workspace.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Workspace does not have an Align customer ID',
        });
      }

      // Fetch fresh KYC status from Align API before checking
      try {
        const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
          workspace.alignCustomerId,
          workspace.id,
        );

        if (latestKyc) {
          // Check if KYC is approved
          if (latestKyc.status !== 'approved') {
            throw new TRPCError({
              code: 'PRECONDITION_FAILED',
              message: 'Workspace KYC is not approved',
            });
          }
        } else {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'No KYC information found',
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error verifying KYC status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to verify KYC status: ${(error as Error).message}`,
        });
      }

      try {
        // Create virtual account in Align
        console.log(
          'Creating virtual account in Align',
          input.destinationToken,
          input.destinationNetwork,
          input.destinationAddress,
        );
        const virtualAccount = await alignApi.createVirtualAccount(
          workspace.alignCustomerId,
          {
            source_currency: input.sourceCurrency,
            destination_token: input.destinationToken,
            destination_network: input.destinationNetwork,
            destination_address: input.destinationAddress,
          },
        );

        // Determine account type based on deposit instructions
        let accountType: 'iban' | 'us_ach' = 'us_ach';
        if (virtualAccount.deposit_instructions.iban) {
          accountType = 'iban';
        }

        // Store virtual account details in userFundingSources
        const fundingSource = await db
          .insert(userFundingSources)
          .values({
            userPrivyDid: userFromPrivy.id,
            workspaceId: workspace.id,
            sourceProvider: 'align',
            alignVirtualAccountIdRef: virtualAccount.id,

            sourceAccountType: accountType,
            sourceCurrency: virtualAccount.source_currency,
            sourceBankName: virtualAccount.deposit_instructions.bank_name,
            sourceBankAddress: virtualAccount.deposit_instructions.bank_address,

            // Handle both field naming conventions
            sourceBankBeneficiaryName:
              virtualAccount.deposit_instructions.beneficiary_name ||
              virtualAccount.deposit_instructions.account_beneficiary_name,
            sourceBankBeneficiaryAddress:
              virtualAccount.deposit_instructions.beneficiary_address ||
              virtualAccount.deposit_instructions.account_beneficiary_address,

            // IBAN specific fields
            sourceIban: virtualAccount.deposit_instructions.iban?.iban_number,
            sourceBicSwift:
              virtualAccount.deposit_instructions.iban?.bic ||
              virtualAccount.deposit_instructions.bic?.bic_code,

            // ACH specific fields - try both direct fields and nested us object
            sourceAccountNumber:
              virtualAccount.deposit_instructions.us?.account_number ||
              virtualAccount.deposit_instructions.account_number,
            sourceRoutingNumber:
              virtualAccount.deposit_instructions.us?.routing_number ||
              virtualAccount.deposit_instructions.routing_number,

            // Payment rails
            sourcePaymentRails:
              virtualAccount.deposit_instructions.payment_rails,

            // Destination details
            destinationCurrency: input.destinationToken,
            destinationPaymentRail: input.destinationNetwork,
            destinationAddress: input.destinationAddress,
          })
          .returning();

        // Update workspace with virtual account ID
        await db
          .update(workspaces)
          .set({
            alignVirtualAccountId: virtualAccount.id,
          })
          .where(eq(workspaces.id, workspace.id));

        // Optional: keep legacy user column in sync while it still exists
        await db
          .update(users)
          .set({ alignVirtualAccountId: virtualAccount.id })
          .where(eq(users.privyDid, userFromPrivy.id));

        return {
          id: fundingSource[0].id,
          virtualAccountId: virtualAccount.id,
          accountType,
          status: virtualAccount.status,
        };
      } catch (error) {
        console.error('Error requesting virtual account:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to request virtual account: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Get virtual account details
   * Returns the details of the workspace's virtual account
   */
  createStarterAccountsRetroactively: protectedProcedure.mutation(
    async ({ ctx }) => {
      const userFromPrivy = await getUser();
      if (!userFromPrivy?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      const workspaceId = ctx.workspaceId;
      if (!workspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Workspace context is unavailable.',
        });
      }

      const primarySafe = await db.query.userSafes.findFirst({
        where: and(
          eq(userSafes.userDid, userFromPrivy.id),
          eq(userSafes.safeType, 'primary'),
          eq(userSafes.workspaceId, workspaceId),
        ),
      });

      if (!primarySafe?.safeAddress) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'No primary Safe found for current workspace',
        });
      }

      const { createStarterVirtualAccounts } = await import(
        '@/server/services/align-starter-accounts'
      );

      const result = await createStarterVirtualAccounts({
        userId: userFromPrivy.id,
        workspaceId,
        destinationAddress: primarySafe.safeAddress,
      });

      if (!result) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create starter accounts',
        });
      }

      return { success: true, accounts: result };
    },
  ),

  getVirtualAccountDetails: protectedProcedure.query(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    if (!userFromPrivy?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    const workspaceId = ctx.workspaceId;
    if (!workspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Workspace context is unavailable.',
      });
    }

    // Get workspace funding sources from DB (filtered by workspace only)
    // All workspace members should see the same funding sources
    const fundingSources = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.workspaceId, workspaceId),
    });

    // Filter for Align-provided sources
    const alignSources = fundingSources.filter(
      (source) => source.sourceProvider === 'align',
    );

    // Get workspace details for beneficiary information and KYC status
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      columns: {
        firstName: true,
        lastName: true,
        companyName: true,
        beneficiaryType: true,
        kycStatus: true,
      },
    });

    const hasCompletedKyc = workspace?.kycStatus === 'approved';

    // Filter accounts based on KYC status
    // If no KYC, show only starter accounts
    // If KYC approved, show all accounts (starter + full)
    const filteredSources = hasCompletedKyc
      ? alignSources
      : alignSources.filter((source) => source.accountTier === 'starter');

    return {
      fundingSources: filteredSources,
      userData: workspace,
      hasCompletedKyc,
    };
  }),

  /**
   * Get all virtual accounts from Align API
   */
  getAllVirtualAccounts: protectedProcedure.query(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    if (!userFromPrivy?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userFromPrivy.id),
    });

    if (!user?.primaryWorkspaceId) {
      return [];
    }

    // Get workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, user.primaryWorkspaceId),
    });

    if (!workspace?.alignCustomerId) {
      return [];
    }

    try {
      // Fetch virtual accounts from Align API
      const response = await alignApi.listVirtualAccounts(
        workspace.alignCustomerId,
      );

      // Return the items array from the response
      return response.items || [];
    } catch (error) {
      console.error('Error fetching virtual accounts from Align:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch virtual accounts',
      });
    }
  }),

  /**
   * Recover customer from Align when they exist in Align but not in our database
   * This is useful when a user has started KYC in Align but the data wasn't saved in our db
   * Updates WORKSPACE with recovered data
   */
  recoverCustomer: protectedProcedure.mutation(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    const userId = userFromPrivy?.id;
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found in database',
      });
    }

    if (!user.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace - data integrity issue',
      });
    }

    // Get workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, user.primaryWorkspaceId),
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }

    // Add logging
    const logPayload = {
      procedure: 'recoverCustomer',
      userId,
      workspaceId: workspace.id,
    };
    ctx.log?.info(logPayload, 'Attempting Align customer recovery...');

    // If workspace already has alignCustomerId, nothing to recover
    if (workspace.alignCustomerId) {
      // Just refresh the status and return
      try {
        const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
          workspace.alignCustomerId,
          workspace.id,
        );

        if (latestKyc) {
          ctx.log?.info(
            {
              ...logPayload,
              result: {
                recovered: false,
                alignCustomerId: workspace.alignCustomerId,
                status: latestKyc.status,
              },
            },
            'Align customer recovery successful.',
          );

          return {
            recovered: false, // No recovery needed
            alignCustomerId: workspace.alignCustomerId,
            kycStatus: latestKyc.status,
            kycFlowLink: latestKyc.kyc_flow_link,
            kycSubStatus: latestKyc.sub_status,
          };
        }
      } catch (error) {
        console.error('Error refreshing KYC status during recovery:', error);
      }

      return {
        recovered: false,
        alignCustomerId: workspace.alignCustomerId,
        kycStatus: workspace.kycStatus,
        kycFlowLink: workspace.kycFlowLink,
      };
    }

    // Extract email from Privy user
    const email =
      typeof userFromPrivy.email === 'string'
        ? userFromPrivy.email
        : userFromPrivy.email?.address || '';

    if (!email) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User email is required for recovery',
      });
    }

    // Try to find the customer in Align by email
    const customer = await alignApi.searchCustomerByEmail(email);

    if (!customer) {
      // No customer found in Align with this email
      return {
        recovered: false,
        alignCustomerId: null,
        kycStatus: 'none',
        kycFlowLink: null,
      };
    }

    // Customer found in Align! Get full details including KYC info
    const customerDetails = await alignApi.getCustomer(customer.customer_id);
    const latestKyc =
      customerDetails.kycs && customerDetails.kycs.length > 0
        ? customerDetails.kycs[0]
        : null;

    // Update WORKSPACE with recovered customer ID and KYC status
    await db
      .update(workspaces)
      .set({
        alignCustomerId: customer.customer_id,
        kycStatus: latestKyc ? latestKyc.status : 'pending',
        kycFlowLink: latestKyc ? latestKyc.kyc_flow_link : null,
        kycProvider: 'align',
      })
      .where(eq(workspaces.id, workspace.id));

    // Add success logging
    ctx.log?.info(
      {
        ...logPayload,
        result: {
          recovered: true,
          alignCustomerId: customer.customer_id,
          status: latestKyc?.status,
        },
      },
      'Align customer recovery successful.',
    );

    return {
      recovered: true,
      alignCustomerId: customer.customer_id,
      kycStatus: latestKyc ? latestKyc.status : 'pending',
      kycFlowLink: latestKyc ? latestKyc.kyc_flow_link : null,
      kycSubStatus: latestKyc ? latestKyc.sub_status : null,
    };
  }),

  /**
   * Create a new KYC session
   * This is used when a customer exists but doesn't have an active KYC flow
   * Updates WORKSPACE with new session details
   */
  createKycSession: protectedProcedure.mutation(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    const userId = userFromPrivy?.id;
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found in database',
      });
    }

    if (!user.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace - data integrity issue',
      });
    }

    // Get workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, user.primaryWorkspaceId),
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }

    if (!workspace.alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Workspace does not have an Align customer ID',
      });
    }

    // Add logging
    const logPayload = {
      procedure: 'createKycSession',
      userId,
      workspaceId: workspace.id,
    };
    ctx.log?.info(logPayload, 'Creating new KYC session...');

    try {
      // Create a new KYC session in Align
      const kycSession = await alignApi.createKycSession(
        workspace.alignCustomerId,
      );

      // Update WORKSPACE with new KYC status and flow link
      await db
        .update(workspaces)
        .set({
          kycStatus: kycSession.status as
            | 'pending'
            | 'none'
            | 'approved'
            | 'rejected',
          kycFlowLink: kycSession.kyc_flow_link,
          kycSubStatus: kycSession.sub_status,
        })
        .where(eq(workspaces.id, workspace.id));

      ctx.log?.info(
        { ...logPayload, result: { status: kycSession.status } },
        'New KYC session creation successful.',
      );

      return {
        kycStatus: kycSession.status,
        kycFlowLink: kycSession.kyc_flow_link,
        kycSubStatus: kycSession.sub_status,
      };
    } catch (error) {
      console.error('Error creating KYC session:', error);
      ctx.log?.error(
        { ...logPayload, error: (error as Error).message },
        'New KYC session creation failed.',
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to create KYC session: ${(error as Error).message}`,
      });
    }
  }),

  /**
   * Mark that the user has finished their KYC submission steps
   * Updates WORKSPACE kycMarkedDone flag
   */
  markKycDone: protectedProcedure.mutation(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    const userId = userFromPrivy?.id;
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    if (!user?.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace',
      });
    }

    await db
      .update(workspaces)
      .set({ kycMarkedDone: true })
      .where(eq(workspaces.id, user.primaryWorkspaceId));

    // Send email notification that KYC is pending review
    const email = userFromPrivy.email?.address;
    if (email) {
      await loopsApi.sendEvent(email, LoopsEvent.KYC_PENDING_REVIEW, userId);
    } else {
      ctx.log?.warn(
        { procedure: 'markKycDone', userId },
        'User has no email, cannot send KYC pending notification.',
      );
    }

    return { success: true };
  }),

  /**
   * Unmark the KYC done state (if user clicked by mistake)
   * Updates WORKSPACE kycMarkedDone flag
   */
  unmarkKycDone: protectedProcedure.mutation(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    const userId = userFromPrivy?.id;
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    if (!user?.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace',
      });
    }

    await db
      .update(workspaces)
      .set({ kycMarkedDone: false })
      .where(eq(workspaces.id, user.primaryWorkspaceId));

    return { success: true };
  }),

  // --- OFFRAMP TRANSFER PROCEDURES ---

  /**
   * Create an offramp transfer request in Align.
   * Accepts either a saved bank account ID or manual details from the frontend.
   * Performs validation and constructs the payload for Align API.
   */
  createOfframpTransfer: protectedProcedure
    .input(
      z.union([
        // Option 1: Manual bank account details (less strict input from FE)
        z.object({
          type: z.literal('manual'), // Discriminating literal
          amount: z
            .string()
            .regex(
              /^\d+(\.\d{1,6})?$/,
              'Invalid amount format (max 6 decimals)',
            ),
          sourceToken: z.enum(['usdc', 'usdt', 'eurc']),
          sourceNetwork: z.enum([
            'polygon',
            'ethereum',
            'base',
            'tron',
            'solana',
            'avalanche',
          ]),
          destinationCurrency: z.enum([
            'usd',
            'eur',
            'mxn',
            'ars',
            'brl',
            'cny',
            'hkd',
            'sgd',
          ]),
          destinationPaymentRails: z.enum([
            'ach',
            'wire',
            'sepa',
            'swift',
            'instant_sepa',
          ]),
          destinationSelection: z.string(), // Will be '--manual--'
          bankName: z.string().optional(),
          accountHolderType: z.enum(['individual', 'business']).optional(),
          accountHolderFirstName: z.string().optional(),
          accountHolderLastName: z.string().optional(),
          accountHolderBusinessName: z.string().optional(),
          country: z.string().optional(),
          city: z.string().optional(),
          streetLine1: z.string().optional(),
          streetLine2: z.string().optional(),
          postalCode: z.string().optional(),
          accountType: z.enum(['us', 'iban']).optional(),
          accountNumber: z.string().optional(),
          routingNumber: z.string().optional(),
          ibanNumber: z.string().optional(),
          bicSwift: z.string().optional(), // FE sends bicSwift
        }),
        // Option 2: Saved bank account ID
        z.object({
          type: z.literal('saved'), // Discriminating literal
          amount: z
            .string()
            .regex(
              /^\d+(\.\d{1,6})?$/,
              'Invalid amount format (max 6 decimals)',
            ),
          sourceToken: z.enum(['usdc', 'usdt', 'eurc']),
          sourceNetwork: z.enum([
            'polygon',
            'ethereum',
            'base',
            'tron',
            'solana',
            'avalanche',
          ]),
          destinationCurrency: z.enum([
            'usd',
            'eur',
            'mxn',
            'ars',
            'brl',
            'cny',
            'hkd',
            'sgd',
          ]),
          destinationPaymentRails: z.enum([
            'ach',
            'wire',
            'sepa',
            'swift',
            'instant_sepa',
          ]),
          destinationBankAccountId: z.string().uuid('Invalid saved account ID'),
        }),
      ]),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userId),
      });

      if (!user?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace',
        });
      }

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace?.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Workspace Align Customer ID not found.',
        });
      }

      // Fetch fresh KYC status from Align API before checking
      console.log(
        '[createOfframpTransfer] Fetching KYC status for user:',
        userId,
        'workspaceId:',
        workspace.id,
        'alignCustomerId:',
        workspace.alignCustomerId,
      );
      try {
        const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
          workspace.alignCustomerId,
          workspace.id,
        );
        console.log(
          '[createOfframpTransfer] KYC status fetched:',
          JSON.stringify(latestKyc, null, 2),
        );

        if (latestKyc) {
          // Check if KYC is approved
          if (latestKyc.status !== 'approved') {
            throw new TRPCError({
              code: 'PRECONDITION_FAILED',
              message: 'Workspace KYC must be approved.',
            });
          }
        } else {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'No KYC information found.',
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error fetching KYC status from Align:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to verify KYC status: ${(error as Error).message}`,
        });
      }

      // Access common fields first, as they exist in both union types
      const {
        amount,
        sourceToken,
        sourceNetwork,
        destinationCurrency,
        destinationPaymentRails,
      } = input;

      try {
        // Helper function for country code mapping (defined within the mutation scope)
        function mapCountryToISO(
          countryName: string | null | undefined,
        ): string {
          if (!countryName) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Bank account holder country is required.',
            });
          }

          const lowerCaseCountry = countryName.toLowerCase().trim();
          console.log(
            '[mapCountryToISO] Input country:',
            countryName,
            '-> lowercase:',
            lowerCaseCountry,
          );

          const mapping: { [key: string]: string } = {
            // Common variations for United States
            'united states': 'US',
            'united states of america': 'US',
            usa: 'US',
            us: 'US',
            'u.s.': 'US',
            'u.s.a.': 'US',
            america: 'US',

            // Common variations for United Kingdom
            'united kingdom': 'GB',
            uk: 'GB',
            'u.k.': 'GB',
            'great britain': 'GB',
            britain: 'GB',
            england: 'GB',
            scotland: 'GB',
            wales: 'GB',
            'northern ireland': 'GB',

            // Canada
            canada: 'CA',
            ca: 'CA',

            // European countries
            germany: 'DE',
            de: 'DE',
            deutschland: 'DE',
            france: 'FR',
            fr: 'FR',
            spain: 'ES',
            es: 'ES',
            españa: 'ES',
            italy: 'IT',
            it: 'IT',
            italia: 'IT',
            netherlands: 'NL',
            nl: 'NL',
            holland: 'NL',
            belgium: 'BE',
            be: 'BE',
            switzerland: 'CH',
            ch: 'CH',
            austria: 'AT',
            at: 'AT',
            portugal: 'PT',
            pt: 'PT',
            ireland: 'IE',
            ie: 'IE',
            poland: 'PL',
            pl: 'PL',
            sweden: 'SE',
            se: 'SE',
            norway: 'NO',
            no: 'NO',
            denmark: 'DK',
            dk: 'DK',
            finland: 'FI',
            fi: 'FI',

            // Other major countries
            australia: 'AU',
            au: 'AU',
            'new zealand': 'NZ',
            nz: 'NZ',
            japan: 'JP',
            jp: 'JP',
            china: 'CN',
            cn: 'CN',
            india: 'IN',
            in: 'IN',
            brazil: 'BR',
            br: 'BR',
            mexico: 'MX',
            mx: 'MX',
            argentina: 'AR',
            ar: 'AR',
            'south africa': 'ZA',
            za: 'ZA',
            singapore: 'SG',
            sg: 'SG',
            'hong kong': 'HK',
            hk: 'HK',
            'south korea': 'KR',
            korea: 'KR',
            kr: 'KR',
            israel: 'IL',
            il: 'IL',
            'united arab emirates': 'AE',
            uae: 'AE',
            ae: 'AE',
            'saudi arabia': 'SA',
            sa: 'SA',
          };

          // First check if it's already a 2-letter ISO code
          if (
            countryName.length === 2 &&
            countryName === countryName.toUpperCase()
          ) {
            console.log('[mapCountryToISO] Already ISO code:', countryName);
            return countryName;
          }

          const isoCode = mapping[lowerCaseCountry];

          if (!isoCode) {
            console.error(
              '[mapCountryToISO] No mapping found for country:',
              countryName,
            );
            // If no mapping found and it's not a 2-letter code, throw an error
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Invalid country "${countryName}". Please use a valid country name or ISO code (e.g., "United States" or "US").`,
            });
          }

          console.log('[mapCountryToISO] Mapped to ISO code:', isoCode);
          return isoCode;
        }

        let validatedAlignPayloadBankAccount: AlignDestinationBankAccount;
        let originalBankAccountSnapshot: any; // For DB logging

        // --- Determine Bank Account Details --- \
        if (input.type === 'saved') {
          // Fetch details from DB using the provided ID
          const dbBankAccount =
            await db.query.userDestinationBankAccounts.findFirst({
              where: and(
                eq(
                  userDestinationBankAccounts.id,
                  input.destinationBankAccountId,
                ),
                eq(userDestinationBankAccounts.userId, userId), // Ensure ownership
              ),
              // Select columns needed
              columns: {
                bankName: true,
                accountHolderType: true,
                accountHolderBusinessName: true,
                accountHolderFirstName: true,
                accountHolderLastName: true,
                country: true,
                city: true,
                streetLine1: true,
                streetLine2: true,
                postalCode: true,
                accountType: true,
                accountNumber: true, // Assuming it's stored unencrypted or decrypted here
                routingNumber: true,
                ibanNumber: true,
                bicSwift: true, // DB uses bicSwift
              },
            });

          if (!dbBankAccount) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message:
                'Saved destination bank account not found or does not belong to user.',
            });
          }
          originalBankAccountSnapshot = { ...dbBankAccount };

          // Construct the Align payload from DB data
          validatedAlignPayloadBankAccount = {
            bank_name: dbBankAccount.bankName,
            account_holder_type: dbBankAccount.accountHolderType,
            account_holder_address: {
              country: dbBankAccount.country, // Assume DB stores ISO code or valid name
              city: dbBankAccount.city,
              street_line_1: dbBankAccount.streetLine1,
              postal_code: dbBankAccount.postalCode,
              ...(dbBankAccount.streetLine2 && {
                street_line_2: dbBankAccount.streetLine2,
              }),
            },
            account_type: dbBankAccount.accountType,
            ...(dbBankAccount.accountHolderType === 'individual' && {
              account_holder_first_name:
                dbBankAccount.accountHolderFirstName ?? undefined,
              account_holder_last_name:
                dbBankAccount.accountHolderLastName ?? undefined,
            }),
            ...(dbBankAccount.accountHolderType === 'business' && {
              account_holder_business_name:
                dbBankAccount.accountHolderBusinessName ?? undefined,
            }),
            ...(dbBankAccount.accountType === 'us' && {
              us: {
                account_number: dbBankAccount.accountNumber!, // Assert non-null based on DB constraints
                routing_number: dbBankAccount.routingNumber!, // Assert non-null
              },
            }),
            ...(dbBankAccount.accountType === 'iban' && {
              iban: {
                iban_number: dbBankAccount.ibanNumber!, // Assert non-null
                bic: dbBankAccount.bicSwift!, // Map bicSwift from DB to bic
              },
            }),
          };
        } else {
          // input.type === 'manual'
          // Store for logging
          originalBankAccountSnapshot = {
            // Capture relevant manual fields
            bankName: input.bankName,
            accountHolderType: input.accountHolderType,
            accountHolderFirstName: input.accountHolderFirstName,
            accountHolderLastName: input.accountHolderLastName,
            accountHolderBusinessName: input.accountHolderBusinessName,
            country: input.country,
            city: input.city,
            streetLine1: input.streetLine1,
            streetLine2: input.streetLine2,
            postalCode: input.postalCode,
            accountType: input.accountType,
            accountNumber: input.accountNumber,
            routingNumber: input.routingNumber,
            ibanNumber: input.ibanNumber,
            bicSwift: input.bicSwift,
          };

          // Construct and VALIDATE the Align payload from manual input
          validatedAlignPayloadBankAccount = {
            bank_name: input.bankName!, // Use non-null assertion, validated by schema below
            account_holder_type: input.accountHolderType!,
            account_holder_address: {
              country: input.country!, // Use non-null assertion
              city: input.city!,
              street_line_1: input.streetLine1!,
              postal_code: input.postalCode!,
              ...(input.streetLine2 && { street_line_2: input.streetLine2 }),
            },
            account_type: input.accountType!,
            ...(input.accountHolderType === 'individual' && {
              account_holder_first_name: input.accountHolderFirstName,
              account_holder_last_name: input.accountHolderLastName,
            }),
            ...(input.accountHolderType === 'business' && {
              account_holder_business_name: input.accountHolderBusinessName,
            }),
            ...(input.accountType === 'us' && {
              us: {
                account_number: input.accountNumber!,
                routing_number: input.routingNumber!,
              },
            }),
            ...(input.accountType === 'iban' && {
              iban: {
                iban_number: input.ibanNumber!,
                bic: input.bicSwift!, // Map bicSwift from input to bic
              },
            }),
          };
        }

        // --- Apply Country Code Mapping (before final validation) ---\
        console.log(
          '[createOfframpTransfer] Country before mapping:',
          validatedAlignPayloadBankAccount.account_holder_address?.country,
        );

        if (validatedAlignPayloadBankAccount.account_holder_address?.country) {
          validatedAlignPayloadBankAccount.account_holder_address.country =
            mapCountryToISO(
              validatedAlignPayloadBankAccount.account_holder_address.country,
            );

          console.log(
            '[createOfframpTransfer] Country after mapping:',
            validatedAlignPayloadBankAccount.account_holder_address.country,
          );
        }

        // --- Final Validation & API Call --- \
        try {
          alignDestinationBankAccountSchema.parse(
            validatedAlignPayloadBankAccount,
          ); // Parse for validation side-effects
        } catch (validationError) {
          console.error(
            'Final bank account payload validation failed:',
            validationError,
          );
          if (validationError instanceof z.ZodError) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Internal Error: Bank account data failed validation: ${validationError.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
              cause: validationError,
            });
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                'Internal Error: Unexpected error during final bank account validation.',
            });
          }
        }

        // Use the destructured common fields here
        const alignParams = {
          amount: amount,
          source_token: sourceToken,
          source_network: sourceNetwork,
          destination_currency: destinationCurrency,
          destination_payment_rails: destinationPaymentRails,
          destination_bank_account: validatedAlignPayloadBankAccount, // Use the validated payload
        };

        // Log the exact payload being sent to Align
        console.log(
          '[createOfframpTransfer] Final payload to Align API:',
          JSON.stringify(alignParams, null, 2),
        );
        console.log(
          '[createOfframpTransfer] Specifically, destination_bank_account:',
          JSON.stringify(alignParams.destination_bank_account, null, 2),
        );

        // Create offramp transfer in Align
        const alignTransfer = await alignApi.createOfframpTransfer(
          workspace.alignCustomerId,
          alignParams,
        );

        // Save transfer details to our database
        // Use destructured common fields for DB insert as well
        await db.insert(offrampTransfers).values({
          userId: userId,
          workspaceId: workspace.id,
          alignTransferId: alignTransfer.id,
          status: alignTransfer.status as any,
          amountToSend: amount,
          destinationCurrency: destinationCurrency,
          destinationPaymentRails: destinationPaymentRails,
          // Store snapshot of bank details used (handle both input types)
          destinationBankAccountSnapshot: JSON.stringify(
            originalBankAccountSnapshot,
          ),
          // Store quote details
          depositAmount: alignTransfer.quote.deposit_amount,
          depositToken: alignTransfer.quote.deposit_token,
          depositNetwork: alignTransfer.quote.deposit_network,
          depositAddress: alignTransfer.quote.deposit_blockchain_address,
          feeAmount: alignTransfer.quote.fee_amount,
          quoteExpiresAt: alignTransfer.quote.expires_at
            ? new Date(alignTransfer.quote.expires_at)
            : null,
        });

        console.log(
          `Saved offramp transfer ${alignTransfer.id} to DB for user ${userId}`,
        );

        // Return details needed for the next step
        return {
          alignTransferId: alignTransfer.id,
          status: alignTransfer.status,
          depositAddress: alignTransfer.quote.deposit_blockchain_address,
          depositAmount: alignTransfer.quote.deposit_amount,
          depositNetwork: alignTransfer.quote.deposit_network,
          depositToken: alignTransfer.quote.deposit_token,
          fee: alignTransfer.quote.fee_amount,
          expiresAt: alignTransfer.quote.expires_at,
        };
      } catch (error) {
        console.error('Error creating offramp transfer:', error);
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create off-ramp transfer: ${message}`,
          cause: error,
        });
      }
    }),

  /**
   * Complete an offramp transfer in Align & update DB.
   */
  completeOfframpTransfer: protectedProcedure
    .input(
      z.object({
        alignTransferId: z.string(),
        depositTransactionHash: z
          .string()
          .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userId),
      });

      if (!user?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace',
        });
      }

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace?.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Workspace Align Customer ID not found.',
        });
      }

      // Fetch our internal record first to verify ownership & status
      const internalTransfer = await db.query.offrampTransfers.findFirst({
        where: and(
          eq(offrampTransfers.alignTransferId, input.alignTransferId),
          eq(offrampTransfers.userId, userId),
        ),
      });

      if (!internalTransfer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Off-ramp transfer not found or does not belong to user.',
        });
      }

      // Optional: Check internal status before calling Align (e.g., ensure it's pending)
      // if (internalTransfer.status !== 'pending') { ... }

      try {
        // Complete offramp transfer in Align
        const alignTransfer = await alignApi.completeOfframpTransfer(
          workspace.alignCustomerId,
          input.alignTransferId,
          input.depositTransactionHash,
        );

        // Update the transfer status and hash in our database
        await db
          .update(offrampTransfers)
          .set({
            status: alignTransfer.status as any, // Cast status if needed
            transactionHash: input.depositTransactionHash,
            updatedAt: new Date(),
          })
          .where(eq(offrampTransfers.id, internalTransfer.id)); // Use internal ID

        console.log(
          `Updated offramp transfer ${internalTransfer.id} in DB. New status: ${alignTransfer.status}`,
        );

        // Return the Align response (or just status)
        return {
          alignTransferId: alignTransfer.id,
          status: alignTransfer.status,
        };
      } catch (error) {
        console.error('Error completing offramp transfer:', error);
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to complete off-ramp transfer: ${message}`,
          cause: error,
        });
      }
    }),

  /**
   * Get details of a specific offramp transfer (fetches from Align & maybe DB).
   */
  getOfframpTransfer: protectedProcedure
    .input(z.object({ alignTransferId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userId),
      });

      if (!user?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace',
        });
      }

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace?.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Workspace Align Customer ID not found.',
        });
      }

      // 1. Verify ownership by checking our DB first
      const internalTransfer = await db.query.offrampTransfers.findFirst({
        where: and(
          eq(offrampTransfers.alignTransferId, input.alignTransferId),
          eq(offrampTransfers.userId, userId),
        ),
        columns: { id: true, status: true }, // Only fetch needed columns
      });

      if (!internalTransfer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Off-ramp transfer not found or does not belong to user.',
        });
      }

      // 2. Fetch latest details from Align API
      try {
        const alignTransfer = await alignApi.getOfframpTransfer(
          workspace.alignCustomerId,
          input.alignTransferId,
        );

        // Optional: Update our DB status if Align's is different & status is not final
        const isFinalStatus = ['completed', 'failed', 'canceled'].includes(
          internalTransfer.status,
        );
        if (
          !isFinalStatus &&
          internalTransfer.status !== alignTransfer.status
        ) {
          await db
            .update(offrampTransfers)
            .set({
              status: alignTransfer.status as any, // Cast if needed
              // Potentially update other fields if Align provides them (e.g., failure reason)
              updatedAt: new Date(),
            })
            .where(eq(offrampTransfers.id, internalTransfer.id));
          console.log(
            `Synced status for transfer ${internalTransfer.id} to ${alignTransfer.status}`,
          );
        }

        // Return the data fetched from Align (which is the most up-to-date)
        return alignTransfer;
      } catch (error) {
        console.error('Error getting offramp transfer details:', error);
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        // Handle specific errors e.g., 404 Not Found from Align
        // Type guard for AlignApiError if needed
        // if (error instanceof AlignApiError && error.statusCode === 404) { ... }
        if (error instanceof TRPCError) throw error; // Re-throw known errors
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get off-ramp transfer details: ${message}`,
          cause: error,
        });
      }
    }),

  /**
   * Prepares the MetaTransactionData for the user to send funds.
   * Fetches details from our DB first to check status and ownership.
   */
  prepareOfframpTokenTransfer: protectedProcedure
    .input(z.object({ alignTransferId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      // No need to fetch userCustomerId separately if only checking internal DB

      // 1. Fetch internal transfer record for verification & details
      const internalTransfer = await db.query.offrampTransfers.findFirst({
        where: and(
          eq(offrampTransfers.alignTransferId, input.alignTransferId),
          eq(offrampTransfers.userId, userId),
        ),
        // Select fields needed for prepareTokenTransferData
        // columns: { status: true, depositToken: true, depositNetwork: true, depositAddress: true, depositAmount: true }
      });

      if (!internalTransfer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Off-ramp transfer not found or does not belong to user.',
        });
      }

      // 2. Check status - only prepare if pending
      if (internalTransfer.status !== 'pending') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `Transfer is not in pending state (current: ${internalTransfer.status}). Cannot prepare transaction.`,
        });
      }

      // Use stored quote details from our DB
      const quote = internalTransfer;

      // Check for required quote details
      if (
        !quote.depositToken ||
        !quote.depositNetwork ||
        !quote.depositAddress ||
        !quote.depositAmount
      ) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'Missing required deposit details in stored transfer record.',
        });
      }

      try {
        // Prepare the ERC20 transfer data using the service
        const lowerCaseNetwork = quote.depositNetwork.toLowerCase();
        // Validate the network name is a key in TOKEN_ADDRESSES
        if (!(lowerCaseNetwork in TOKEN_ADDRESSES)) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Unsupported network found in stored transfer record: ${quote.depositNetwork}`,
          });
        }

        const tokenTransferData = prepareTokenTransferData({
          tokenSymbol: quote.depositToken,
          tokenNetwork: lowerCaseNetwork as keyof typeof TOKEN_ADDRESSES, // Use validated key
          recipientAddress: quote.depositAddress as Address,
          amount: quote.depositAmount,
        });

        console.log(
          `Prepared MetaTransactionData for Align transfer ${input.alignTransferId}:`,
          tokenTransferData,
        );

        return tokenTransferData;
      } catch (error) {
        console.error('Error preparing offramp token transfer:', error);
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to prepare off-ramp token transfer: ${message}`,
          cause: error,
        });
      }
    }),

  /**
   * Create all virtual accounts (USD + EUR) for the user
   * Uses the user's primary safe address as the destination
   */
  createAllVirtualAccounts: protectedProcedure.mutation(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    if (!userFromPrivy?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userFromPrivy.id),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found in database',
      });
    }

    if (!user.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User has no workspace - data integrity issue',
      });
    }

    // Get workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, user.primaryWorkspaceId),
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }

    if (!workspace.alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Please complete KYC verification first',
      });
    }

    // Fetch fresh KYC status from Align API before checking
    try {
      const latestKyc = await fetchAndUpdateWorkspaceKycStatus(
        workspace.alignCustomerId,
        workspace.id,
      );

      if (latestKyc) {
        // Check if KYC is approved
        if (latestKyc.status !== 'approved') {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'KYC verification must be approved',
          });
        }
      } else {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'No KYC information found',
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error('Error verifying KYC status:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to verify KYC status: ${(error as Error).message}`,
      });
    }

    // Get primary safe (workspace-scoped)
    const workspaceId = ctx.workspaceId;
    if (!workspaceId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Workspace context is unavailable.',
      });
    }

    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userFromPrivy.id),
        eq(userSafes.safeType, 'primary'),
        eq(userSafes.workspaceId, workspaceId),
      ),
    });

    if (!primarySafe?.safeAddress) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'No primary safe address found for current workspace',
      });
    }

    const destinationAddress = primarySafe.safeAddress as Address;
    const results = [];
    const errors = [];

    // Create USD (ACH) account
    try {
      const usdAccount = await alignApi.createVirtualAccount(
        workspace.alignCustomerId,
        {
          source_currency: 'usd',
          destination_token: 'usdc',
          destination_network: 'base',
          destination_address: destinationAddress,
        },
      );

      // Store USD account
      await db.insert(userFundingSources).values({
        userPrivyDid: userFromPrivy.id,
        workspaceId: workspace.id,
        sourceProvider: 'align',
        alignVirtualAccountIdRef: usdAccount.id,
        sourceAccountType: 'us_ach',
        sourceCurrency: 'usd',
        sourceBankName: usdAccount.deposit_instructions.bank_name,
        sourceBankAddress: usdAccount.deposit_instructions.bank_address,
        sourceBankBeneficiaryName:
          usdAccount.deposit_instructions.beneficiary_name ||
          usdAccount.deposit_instructions.account_beneficiary_name,
        sourceBankBeneficiaryAddress:
          usdAccount.deposit_instructions.beneficiary_address ||
          usdAccount.deposit_instructions.account_beneficiary_address,
        sourceAccountNumber:
          usdAccount.deposit_instructions.us?.account_number ||
          usdAccount.deposit_instructions.account_number,
        sourceRoutingNumber:
          usdAccount.deposit_instructions.us?.routing_number ||
          usdAccount.deposit_instructions.routing_number,
        sourcePaymentRails: usdAccount.deposit_instructions.payment_rails,
        destinationCurrency: 'usdc',
        destinationPaymentRail: 'base',
        destinationAddress: destinationAddress,
      });

      results.push({ currency: 'USD', status: 'created', id: usdAccount.id });
    } catch (error) {
      console.error('Error creating USD account:', error);
      errors.push({ currency: 'USD', error: (error as Error).message });
    }

    // Create EUR (IBAN) account
    try {
      const eurAccount = await alignApi.createVirtualAccount(
        workspace.alignCustomerId,
        {
          source_currency: 'eur',
          destination_token: 'usdc',
          destination_network: 'base',
          destination_address: destinationAddress,
        },
      );

      // Store EUR account
      await db.insert(userFundingSources).values({
        userPrivyDid: userFromPrivy.id,
        workspaceId: workspace.id,
        sourceProvider: 'align',
        alignVirtualAccountIdRef: eurAccount.id,
        sourceAccountType: 'iban',
        sourceCurrency: 'eur',
        sourceBankName: eurAccount.deposit_instructions.bank_name,
        sourceBankAddress: eurAccount.deposit_instructions.bank_address,
        sourceBankBeneficiaryName:
          eurAccount.deposit_instructions.beneficiary_name ||
          eurAccount.deposit_instructions.account_beneficiary_name,
        sourceBankBeneficiaryAddress:
          eurAccount.deposit_instructions.beneficiary_address ||
          eurAccount.deposit_instructions.account_beneficiary_address,
        sourceIban: eurAccount.deposit_instructions.iban?.iban_number,
        sourceBicSwift:
          eurAccount.deposit_instructions.iban?.bic ||
          eurAccount.deposit_instructions.bic?.bic_code,
        sourcePaymentRails: eurAccount.deposit_instructions.payment_rails,
        destinationCurrency: 'usdc',
        destinationPaymentRail: 'base',
        destinationAddress: destinationAddress,
      });

      results.push({ currency: 'EUR', status: 'created', id: eurAccount.id });
    } catch (error) {
      console.error('Error creating EUR account:', error);
      errors.push({ currency: 'EUR', error: (error as Error).message });
    }

    // Update user if any account was created
    if (results.length > 0) {
      await db
        .update(users)
        .set({
          alignVirtualAccountId: results[0].id, // Store the first account ID
        })
        .where(eq(users.privyDid, userFromPrivy.id));
    }

    return {
      success: results.length > 0,
      results,
      errors,
      message:
        results.length === 2
          ? 'Both USD and EUR accounts created successfully!'
          : results.length === 1
            ? `${results[0].currency} account created successfully. ${errors[0]?.currency} account failed.`
            : 'Failed to create virtual accounts',
    };
  }),

  listOfframpTransfers: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional(),
          skip: z.number().min(0).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const limit = input?.limit ?? 20;
      const skip = input?.skip ?? 0;

      // Get user's workspace to filter transfers
      const userRecord = await db.query.users.findFirst({
        where: eq(users.privyDid, userId),
        columns: { primaryWorkspaceId: true },
      });

      if (!userRecord?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'User has no primary workspace',
        });
      }

      // Read from database - workspace-scoped only
      const transfers = await db.query.offrampTransfers.findMany({
        where: eq(offrampTransfers.workspaceId, userRecord.primaryWorkspaceId),
        orderBy: (transfers, { desc }) => [desc(transfers.createdAt)],
        limit,
        offset: skip,
      });

      // Transform to match API response format
      return transfers.map((transfer) => {
        let destinationSnapshot: unknown =
          transfer.destinationBankAccountSnapshot ?? {};

        if (
          typeof transfer.destinationBankAccountSnapshot === 'string' &&
          transfer.destinationBankAccountSnapshot.length
        ) {
          try {
            destinationSnapshot = JSON.parse(
              transfer.destinationBankAccountSnapshot,
            );
          } catch (error) {
            console.warn(
              '[listOfframpTransfers] Failed to parse destinationBankAccountSnapshot',
              {
                alignTransferId: transfer.alignTransferId,
                error,
              },
            );
            destinationSnapshot = {};
          }
        }

        return {
          id: transfer.alignTransferId,
          status: transfer.status,
          amount: transfer.amountToSend,
          source_token: transfer.depositToken as 'usdc' | 'usdt' | 'eurc',
          source_network: transfer.depositNetwork as any,
          destination_currency: transfer.destinationCurrency as any,
          destination_bank_account: destinationSnapshot,
          created_at: transfer.createdAt?.toISOString(),
          updated_at: transfer.updatedAt?.toISOString(),
        };
      });
    }),

  listOnrampTransfers: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional(),
          skip: z.number().min(0).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const limit = input?.limit ?? 20;
      const skip = input?.skip ?? 0;

      // Get user's workspace to filter transfers
      const userRecord = await db.query.users.findFirst({
        where: eq(users.privyDid, userId),
        columns: { primaryWorkspaceId: true },
      });

      if (!userRecord?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'User has no primary workspace',
        });
      }

      // Read from database - workspace-scoped only
      const transfers = await db.query.onrampTransfers.findMany({
        where: eq(onrampTransfers.workspaceId, userRecord.primaryWorkspaceId),
        orderBy: (transfers, { desc }) => [desc(transfers.createdAt)],
        limit,
        offset: skip,
      });

      // Transform to match API response format
      return transfers.map((transfer) => ({
        id: transfer.alignTransferId,
        status: transfer.status,
        amount: transfer.amount,
        source_currency: transfer.sourceCurrency as 'usd' | 'eur',
        source_rails: transfer.sourceRails as 'ach' | 'sepa' | 'wire',
        destination_network: transfer.destinationNetwork as any,
        destination_token: transfer.destinationToken as 'usdc' | 'usdt',
        destination_address: transfer.destinationAddress,
        quote: {
          deposit_rails: transfer.depositRails as any,
          deposit_currency: transfer.depositCurrency as any,
          deposit_bank_account: transfer.depositBankAccount,
          deposit_amount: transfer.depositAmount,
          deposit_message: transfer.depositMessage || '',
          fee_amount: transfer.feeAmount,
        },
        created_at: transfer.createdAt?.toISOString(),
        updated_at: transfer.updatedAt?.toISOString(),
      }));
    }),

  syncOnrampTransfers: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    const userRecord = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
      columns: { primaryWorkspaceId: true, alignCustomerId: true },
    });

    if (!userRecord?.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'User has no primary workspace',
      });
    }

    const primaryWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, userRecord.primaryWorkspaceId),
      columns: { alignCustomerId: true },
    });

    const alignCustomerId =
      primaryWorkspace?.alignCustomerId ?? userRecord.alignCustomerId;

    if (!alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'No Align customer ID found for user or workspace',
      });
    }

    try {
      // Fetch all transfers from Align API
      const transfers = await alignApi.getAllOnrampTransfers(
        alignCustomerId as string,
        { limit: 100, skip: 0 },
      );

      // Upsert each transfer into the database
      for (const transfer of transfers) {
        await db
          .insert(onrampTransfers)
          .values({
            userId,
            workspaceId: userRecord.primaryWorkspaceId,
            alignTransferId: transfer.id,
            status: transfer.status,
            amount: transfer.amount,
            sourceCurrency: transfer.source_currency,
            sourceRails: transfer.source_rails,
            destinationNetwork: transfer.destination_network,
            destinationToken: transfer.destination_token,
            destinationAddress: transfer.destination_address,
            depositRails: transfer.quote.deposit_rails,
            depositCurrency: transfer.quote.deposit_currency,
            depositBankAccount: transfer.quote.deposit_bank_account,
            depositAmount: transfer.quote.deposit_amount,
            depositMessage: transfer.quote.deposit_message,
            feeAmount: transfer.quote.fee_amount,
          })
          .onConflictDoUpdate({
            target: onrampTransfers.alignTransferId,
            set: {
              status: transfer.status,
              workspaceId: userRecord.primaryWorkspaceId,
              updatedAt: new Date(),
            },
          });
      }

      return { synced: transfers.length };
    } catch (error) {
      console.error('Error syncing onramp transfers:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to sync onramp transfers',
      });
    }
  }),

  syncOfframpTransfers: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    const userRecord = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
      columns: { primaryWorkspaceId: true, alignCustomerId: true },
    });

    if (!userRecord?.primaryWorkspaceId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'User has no primary workspace',
      });
    }

    const primaryWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, userRecord.primaryWorkspaceId),
      columns: { alignCustomerId: true },
    });

    const alignCustomerId =
      primaryWorkspace?.alignCustomerId ?? userRecord.alignCustomerId;

    if (!alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'No Align customer ID found for user or workspace',
      });
    }

    try {
      // Fetch all transfers from Align API
      const transfers = await alignApi.getAllOfframpTransfers(
        alignCustomerId as string,
        { limit: 100, skip: 0 },
      );

      let updatedCount = 0;
      let insertedCount = 0;

      for (const transfer of transfers) {
        const existingTransfer = await db.query.offrampTransfers.findFirst({
          where: eq(offrampTransfers.alignTransferId, transfer.id),
        });

        if (existingTransfer) {
          // Update basic fields based on latest Align payload
          await db
            .update(offrampTransfers)
            .set({
              status: transfer.status,
              amountToSend: transfer.amount,
              destinationCurrency: transfer.destination_currency,
              depositToken: transfer.source_token,
              depositNetwork: transfer.source_network,
              workspaceId: userRecord.primaryWorkspaceId,
              updatedAt: new Date(),
            })
            .where(eq(offrampTransfers.alignTransferId, transfer.id));
          updatedCount++;
          continue;
        }

        try {
          // Fetch full transfer details so we can persist quote/deposit fields
          const fullTransfer = await alignApi.getOfframpTransfer(
            alignCustomerId as string,
            transfer.id,
          );

          const destinationPaymentRails =
            'destination_payment_rails' in fullTransfer
              ? (fullTransfer as { destination_payment_rails: string })
                  .destination_payment_rails
              : null;

          await db.insert(offrampTransfers).values({
            userId,
            workspaceId: userRecord.primaryWorkspaceId,
            alignTransferId: fullTransfer.id,
            status: fullTransfer.status as any,
            amountToSend: fullTransfer.amount,
            destinationCurrency: fullTransfer.destination_currency,
            destinationPaymentRails,
            destinationBankAccountSnapshot: JSON.stringify(
              fullTransfer.destination_bank_account,
            ),
            depositAmount: fullTransfer.quote.deposit_amount,
            depositToken: fullTransfer.quote.deposit_token,
            depositNetwork: fullTransfer.quote.deposit_network,
            depositAddress: fullTransfer.quote.deposit_blockchain_address,
            feeAmount: fullTransfer.quote.fee_amount,
            quoteExpiresAt: fullTransfer.quote.expires_at
              ? new Date(fullTransfer.quote.expires_at)
              : null,
            transactionHash: fullTransfer.deposit_transaction_hash ?? null,
          });
          insertedCount++;
        } catch (detailError) {
          console.error(
            '[syncOfframpTransfers] Failed to ingest transfer from Align',
            {
              alignCustomerId,
              transferId: transfer.id,
              error: detailError,
            },
          );
        }
      }

      return {
        synced: updatedCount,
        inserted: insertedCount,
        total: transfers.length,
      };
    } catch (error) {
      console.error('Error syncing offramp transfers:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to sync offramp transfers',
      });
    }
  }),

  /**
   * Create a virtual account for experiments (simplified version)
   */
  createVirtualAccount: protectedProcedure
    .input(
      z.object({
        source_currency: z.enum(['usd', 'eur']),
        destination_token: z.enum(['usdc', 'usdt']),
        destination_network: z.enum(['polygon', 'ethereum', 'solana', 'base']),
        destination_address: z
          .string()
          .min(1, 'Destination address is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userFromPrivy = await getUser();
      if (!userFromPrivy?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userFromPrivy.id),
      });

      if (!user?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace',
        });
      }

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace?.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Please complete KYC verification first',
        });
      }

      try {
        const virtualAccount = await alignApi.createVirtualAccount(
          workspace.alignCustomerId,
          input,
        );

        return virtualAccount;
      } catch (error) {
        console.error('Error creating virtual account:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create virtual account: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Create an onramp transfer for experiments
   */
  createOnrampTransfer: protectedProcedure
    .input(
      z.object({
        amount: z
          .string()
          .regex(/^[0-9]+(\.[0-9]+)?$/, 'Invalid amount format'),
        source_currency: z.enum(['usd', 'eur']),
        source_rails: z.enum(['swift', 'ach', 'sepa', 'wire']),
        destination_network: z.enum(['polygon', 'ethereum', 'tron', 'solana']),
        destination_token: z.enum(['usdc', 'usdt']),
        destination_address: z
          .string()
          .min(1, 'Destination address is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userFromPrivy = await getUser();
      if (!userFromPrivy?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, userFromPrivy.id),
      });

      if (!user?.primaryWorkspaceId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has no workspace',
        });
      }

      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, user.primaryWorkspaceId),
      });

      if (!workspace?.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Please complete KYC verification first',
        });
      }

      try {
        const onrampTransfer = await alignApi.createOnrampTransfer(
          workspace.alignCustomerId,
          input,
        );

        // Store the transfer in our database
        await db.insert(onrampTransfers).values({
          userId: userFromPrivy.id,
          workspaceId: workspace.id,
          alignTransferId: onrampTransfer.id,
          status: onrampTransfer.status,
          amount: onrampTransfer.amount,
          sourceCurrency: onrampTransfer.source_currency,
          sourceRails: onrampTransfer.source_rails,
          destinationNetwork: onrampTransfer.destination_network,
          destinationToken: onrampTransfer.destination_token,
          destinationAddress: onrampTransfer.destination_address,
          depositRails: onrampTransfer.quote.deposit_rails,
          depositCurrency: onrampTransfer.quote.deposit_currency,
          depositBankAccount: onrampTransfer.quote.deposit_bank_account,
          depositAmount: onrampTransfer.quote.deposit_amount,
          depositMessage: onrampTransfer.quote.deposit_message,
          feeAmount: onrampTransfer.quote.fee_amount,
        });

        return onrampTransfer;
      } catch (error) {
        console.error('Error creating onramp transfer:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create onramp transfer: ${(error as Error).message}`,
        });
      }
    }),
});
