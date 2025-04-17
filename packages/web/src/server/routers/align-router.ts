import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '../../db';
import { users, userFundingSources } from '../../db/schema';
import { alignApi } from '../services/align-api';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth';

/**
 * Router for Align integration
 * Handles customer creation, KYC verification, and virtual account management
 */
export const alignRouter = router({
  /**
   * Get customer status from DB
   */
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
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

    return {
      alignCustomerId: user.alignCustomerId,
      kycStatus: user.kycStatus,
      kycFlowLink: user.kycFlowLink,
      alignVirtualAccountId: user.alignVirtualAccountId,
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

      try {
        // If already has an Align customer ID, refresh status
        if (user.alignCustomerId) {
          const customer = await alignApi.getCustomer(user.alignCustomerId);
          const latestKyc =
            customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null; // Safely access kycs array

          if (latestKyc) {
            await db
              .update(users)
              .set({
                kycStatus: latestKyc.status,
                kycFlowLink: latestKyc.kyc_flow_link,
                kycProvider: 'align',
              })
              .where(eq(users.privyDid, userFromPrivy.id));

            return {
              alignCustomerId: user.alignCustomerId,
              kycStatus: latestKyc.status,
              kycFlowLink: latestKyc.kyc_flow_link,
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
          input.businessName, // Pass business name if provided
          beneficiaryType,
        );

        const latestKyc =
          customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null; // Safely access kycs array

        // Update user with new customer ID and KYC status
        await db
          .update(users)
          .set({
            alignCustomerId: customer.customer_id,
            kycStatus: latestKyc ? latestKyc.status : 'pending',
            kycFlowLink: latestKyc ? latestKyc.kyc_flow_link : undefined,
            kycProvider: 'align',
          })
          .where(eq(users.privyDid, userFromPrivy.id));

        return {
          alignCustomerId: customer.customer_id,
          kycStatus: latestKyc ? latestKyc.status : 'pending',
          kycFlowLink: latestKyc ? latestKyc.kyc_flow_link : undefined,
        };
      } catch (error) {
        console.error('Error initiating KYC:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to initiate KYC: ${(error as Error).message}`,
        });
      }
    }),

  /**
   * Refresh KYC status
   * Polls Align API for the latest KYC status
   */
  refreshKycStatus: protectedProcedure.mutation(async ({ ctx }) => {
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

    if (!user.alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'User does not have an Align customer ID',
      });
    }

    try {
      const customer = await alignApi.getCustomer(user.alignCustomerId);
      const latestKyc =
        customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null; // Safely access kycs array

      if (latestKyc) {
        await db
          .update(users)
          .set({
            kycStatus: latestKyc.status,
            kycFlowLink: latestKyc.kyc_flow_link,
          })
          .where(eq(users.privyDid, userFromPrivy.id));

        return {
          alignCustomerId: user.alignCustomerId,
          kycStatus: latestKyc.status,
          kycFlowLink: latestKyc.kyc_flow_link,
        };
      }

      return {
        alignCustomerId: user.alignCustomerId,
        kycStatus: user.kycStatus,
        kycFlowLink: user.kycFlowLink,
      };
    } catch (error) {
      console.error('Error refreshing KYC status:', error);
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

      if (!user.alignCustomerId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'User does not have an Align customer ID',
        });
      }

      if (user.kycStatus !== 'approved') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'User KYC is not approved',
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
          user.alignCustomerId,
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
            sourceProvider: 'align',
            alignVirtualAccountIdRef: virtualAccount.id,

            sourceAccountType: accountType,
            sourceCurrency: virtualAccount.source_currency,
            sourceBankName: virtualAccount.deposit_instructions.bank_name,
            sourceBankAddress: virtualAccount.deposit_instructions.bank_address,
            sourceBankBeneficiaryName:
              virtualAccount.deposit_instructions.beneficiary_name,
            sourceBankBeneficiaryAddress:
              virtualAccount.deposit_instructions.beneficiary_address,

            // IBAN specific fields
            sourceIban: virtualAccount.deposit_instructions.iban?.iban_number,
            sourceBicSwift: virtualAccount.deposit_instructions.bic?.bic_code,

            // ACH specific fields
            sourceAccountNumber:
              virtualAccount.deposit_instructions.account_number,
            sourceRoutingNumber:
              virtualAccount.deposit_instructions.routing_number,

            // Destination details
            destinationCurrency: input.destinationToken,
            destinationPaymentRail: input.destinationNetwork,
            destinationAddress: input.destinationAddress,
          })
          .returning();

        // Update user with virtual account ID
        await db
          .update(users)
          .set({
            alignVirtualAccountId: virtualAccount.id,
          })
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
   * Returns the details of the user's virtual account
   */
  getVirtualAccountDetails: protectedProcedure.query(async ({ ctx }) => {
    const userFromPrivy = await getUser();
    if (!userFromPrivy?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Get user funding sources from DB
    const fundingSources = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.userPrivyDid, userFromPrivy.id),
    });

    // Filter for Align-provided sources
    const alignSources = fundingSources.filter(
      (source) => source.sourceProvider === 'align',
    );

    return alignSources;
  }),

  /**
   * Recover customer from Align when they exist in Align but not in our database
   * This is useful when a user has started KYC in Align but the data wasn't saved in our db
   */
  recoverCustomer: protectedProcedure.mutation(async ({ ctx }) => {
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

    // If already has alignCustomerId, nothing to recover
    if (user.alignCustomerId) {
      // Just refresh the status and return
      const customer = await alignApi.getCustomer(user.alignCustomerId);
      const latestKyc =
        customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

      if (latestKyc) {
        await db
          .update(users)
          .set({
            kycStatus: latestKyc.status,
            kycFlowLink: latestKyc.kyc_flow_link,
            kycProvider: 'align',
          })
          .where(eq(users.privyDid, userFromPrivy.id));

        return {
          recovered: false, // No recovery needed
          alignCustomerId: user.alignCustomerId,
          kycStatus: latestKyc.status,
          kycFlowLink: latestKyc.kyc_flow_link,
        };
      }
      return {
        recovered: false,
        alignCustomerId: user.alignCustomerId,
        kycStatus: user.kycStatus,
        kycFlowLink: user.kycFlowLink,
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

    // Update user with recovered customer ID and KYC status
    await db
      .update(users)
      .set({
        alignCustomerId: customer.customer_id,
        kycStatus: latestKyc ? latestKyc.status : 'pending',
        kycFlowLink: latestKyc ? latestKyc.kyc_flow_link : null,
        kycProvider: 'align',
      })
      .where(eq(users.privyDid, userFromPrivy.id));

    return {
      recovered: true,
      alignCustomerId: customer.customer_id,
      kycStatus: latestKyc ? latestKyc.status : 'pending',
      kycFlowLink: latestKyc ? latestKyc.kyc_flow_link : null,
    };
  }),

  /**
   * Create a new KYC session
   * This is used when a customer exists but doesn't have an active KYC flow
   */
  createKycSession: protectedProcedure.mutation(async ({ ctx }) => {
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

    if (!user.alignCustomerId) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'User does not have an Align customer ID',
      });
    }

    try {
      // Create a new KYC session in Align
      const kycSession = await alignApi.createKycSession(user.alignCustomerId);

      // Update user with new KYC status and flow link
      await db
        .update(users)
        .set({
          kycStatus: kycSession.status as
            | 'pending'
            | 'none'
            | 'approved'
            | 'rejected',
          kycFlowLink: kycSession.kyc_flow_link,
        })
        .where(eq(users.privyDid, userFromPrivy.id));

      return {
        kycStatus: kycSession.status,
        kycFlowLink: kycSession.kyc_flow_link,
      };
    } catch (error) {
      console.error('Error creating KYC session:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to create KYC session: ${(error as Error).message}`,
      });
    }
  }),
});
