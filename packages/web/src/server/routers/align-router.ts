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
  getCustomerStatus: protectedProcedure
    .query(async ({ ctx }) => {
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
    .mutation(async ({ ctx }) => {
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
          const latestKyc = customer.kycs[0]; // Assuming the most recent KYC is first

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

        // Create new customer in Align
        // Extract email from Privy user object
        const email = typeof userFromPrivy.email === 'string' 
          ? userFromPrivy.email 
          : userFromPrivy.email?.address || '';
          
        // Simply use empty strings for names if we can't access them
        // In a real implementation, we would parse the Privy user object correctly 
        // based on its actual structure
        const firstName = '';
        const lastName = '';

        const customer = await alignApi.createCustomer(
          email,
          firstName,
          lastName
        );

        const latestKyc = customer.kycs[0]; // Assuming the most recent KYC is first

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
  refreshKycStatus: protectedProcedure
    .mutation(async ({ ctx }) => {
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
        const latestKyc = customer.kycs[0]; // Assuming the most recent KYC is first

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
    .input(z.object({
      sourceCurrency: z.enum(['usd', 'eur']),
      destinationToken: z.enum(['usdc', 'usdt']),
      destinationNetwork: z.enum(['polygon', 'ethereum', 'base', 'solana', 'avalanche']),
      destinationAddress: z.string().length(42),
    }))
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

      if (user.kycStatus !== 'verified') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'User KYC is not verified',
        });
      }

      try {
        // Create virtual account in Align
        const virtualAccount = await alignApi.createVirtualAccount(user.alignCustomerId, {
          source_currency: input.sourceCurrency,
          destination_token: input.destinationToken,
          destination_network: input.destinationNetwork,
          destination_address: input.destinationAddress,
        });

        // Determine account type based on deposit instructions
        let accountType: 'iban' | 'us_ach' = 'us_ach';
        if (virtualAccount.deposit_instructions.iban) {
          accountType = 'iban';
        }

        // Store virtual account details in userFundingSources
        const fundingSource = await db.insert(userFundingSources).values({
          userPrivyDid: userFromPrivy.id,
          sourceProvider: 'align',
          alignVirtualAccountIdRef: virtualAccount.id,
          
          sourceAccountType: accountType,
          sourceCurrency: virtualAccount.source_currency,
          sourceBankName: virtualAccount.deposit_instructions.bank_name,
          sourceBankAddress: virtualAccount.deposit_instructions.bank_address,
          sourceBankBeneficiaryName: virtualAccount.deposit_instructions.beneficiary_name,
          sourceBankBeneficiaryAddress: virtualAccount.deposit_instructions.beneficiary_address,
          
          // IBAN specific fields
          sourceIban: virtualAccount.deposit_instructions.iban?.iban_number,
          sourceBicSwift: virtualAccount.deposit_instructions.bic?.bic_code,
          
          // ACH specific fields
          sourceAccountNumber: virtualAccount.deposit_instructions.account_number,
          sourceRoutingNumber: virtualAccount.deposit_instructions.routing_number,
          
          // Destination details
          destinationCurrency: input.destinationToken,
          destinationPaymentRail: input.destinationNetwork,
          destinationAddress: input.destinationAddress,
        }).returning();

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
  getVirtualAccountDetails: protectedProcedure
    .query(async ({ ctx }) => {
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
        source => source.sourceProvider === 'align'
      );

      return alignSources;
    }),
}); 