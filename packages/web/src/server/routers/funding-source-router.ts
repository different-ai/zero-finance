import { z } from 'zod';
import { db } from '@/db';
import { userFundingSources } from '@/db/schema';
import { addFundingSourceSchema } from '@/app/dashboard/(bank)/lib/validators/add-funding-source'; // Adjust path as needed
import { protectedProcedure, router } from '../create-router';
import { TRPCError } from '@trpc/server';
import { revalidatePath } from 'next/cache';

export const fundingSourceRouter = router({
  addFundingSource: protectedProcedure
    .input(addFundingSourceSchema) // .input() handles validation automatically
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id; // Get user ID from authenticated context

      // Database insertion logic - input is already validated by the middleware
      try {
        const valuesToInsert = {
          userPrivyDid: privyDid,
          sourceAccountType: input.sourceAccountType,
          sourceCurrency: input.sourceCurrency,
          sourceBankName: input.sourceBankName,
          sourceBankAddress: input.sourceBankAddress ?? null,
          sourceBankBeneficiaryName: input.sourceBankBeneficiaryName,
          sourceBankBeneficiaryAddress: input.sourceBankBeneficiaryAddress ?? null,
          sourcePaymentRail: input.sourcePaymentRail ?? null,
          sourceIban: input.sourceAccountType === 'iban' ? input.sourceIban : null,
          sourceBicSwift: input.sourceAccountType === 'iban' ? input.sourceBicSwift : null,
          sourceRoutingNumber: input.sourceAccountType === 'us_ach' ? input.sourceRoutingNumber : null,
          sourceAccountNumber:
            input.sourceAccountType === 'us_ach' ? input.sourceAccountNumber :
            input.sourceAccountType === 'uk_details' ? input.sourceAccountNumber :
            null,
          sourceSortCode: input.sourceAccountType === 'uk_details' ? input.sourceSortCode : null,
          destinationCurrency: input.destinationCurrency,
          destinationPaymentRail: input.destinationPaymentRail,
          destinationAddress: input.destinationAddress,
        };

        await db.insert(userFundingSources).values(valuesToInsert);

        // Revalidation
        try {
          revalidatePath('/dashboard/(bank)', 'layout'); 
        } catch (revalError) {
            console.warn("Revalidation failed in tRPC mutation:", revalError);
        }

        return { success: true, message: "Funding source added successfully." };

      } catch (error) {
        console.error("Error adding funding source via tRPC:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Failed to add funding source. Please try again.",
          cause: error,
        });
      }
    }),

    // Potentially add a 'getFundingSources' procedure here later
});

// Export type definition of this router (optional but good practice)
export type FundingSourceRouter = typeof fundingSourceRouter; 