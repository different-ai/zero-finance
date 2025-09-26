import { z } from 'zod';
import { db } from '@/db';
import { userFundingSources } from '@/db/schema';
import {
  addFundingSourceSchema,
  type AddFundingSourceFormValues,
} from '@/lib/validators/add-funding-source'; // Fixed path
import { protectedProcedure, router } from '../create-router';
import { TRPCError } from '@trpc/server';
import { openai } from '@ai-sdk/openai'; // Import OpenAI provider
import { generateObject } from 'ai'; // Removed experimental_streamObject
import { eq, and, count } from 'drizzle-orm'; // Import eq operator

// Define a flat schema specifically for AI parsing
const aiParsingSchema = z
  .object({
    sourceAccountType: z
      .enum(['us_ach', 'iban', 'uk_details', 'other'])
      .optional()
      .describe(
        'The type of bank account (e.g., us_ach, iban, uk_details). Infer based on details like routing number, IBAN, sort code.',
      ),
    sourceCurrency: z
      .string()
      .optional()
      .describe(
        'Currency code (e.g., USD, EUR, GBP). Infer based on context if possible (e.g., routing number -> USD).',
      ),
    sourceBankName: z.string().optional().describe('Name of the bank.'),
    sourceBankBeneficiaryName: z
      .string()
      .optional()
      .describe('The name of the account holder.'),
    // AI might not reliably get addresses, keep optional
    sourceBankAddress: z
      .string()
      .optional()
      .describe('Address of the bank (optional).'),
    sourceBankBeneficiaryAddress: z
      .string()
      .optional()
      .describe('Address of the account holder (optional).'),
    // Specific account detail fields
    sourceRoutingNumber: z
      .string()
      .optional()
      .describe('US ACH routing number (9 digits).'),
    sourceAccountNumber: z
      .string()
      .optional()
      .describe('The bank account number (can vary in length).'),
    sourceIban: z
      .string()
      .optional()
      .describe('International Bank Account Number (IBAN).'),
    sourceBicSwift: z
      .string()
      .optional()
      .describe('Bank Identifier Code (BIC) or SWIFT code.'),
    sourceSortCode: z
      .string()
      .optional()
      .describe('UK bank sort code (6 digits).'),
    // Destination fields are usually known by the app, but include just in case
    destinationAddress: z
      .string()
      .optional()
      .describe(
        "The user's destination crypto wallet address (usually pre-filled or known).",
      ),
  })
  .describe(
    "User bank account details for funding a crypto account. Extract relevant fields from the user's text, inferring the account type and currency where possible.",
  );

export const fundingSourceRouter = router({
  addFundingSource: protectedProcedure
    .input(addFundingSourceSchema) // Use the original strict schema for the final submission
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;

      try {
        const valuesToInsert = {
          userPrivyDid: privyDid,
          // Ensure required fields are present from the validated input
          sourceAccountType: input.sourceAccountType,
          sourceCurrency: input.sourceCurrency,
          sourceBankName: input.sourceBankName,
          sourceBankBeneficiaryName: input.sourceBankBeneficiaryName,
          destinationAddress: input.destinationAddress,
          // Optional fields
          sourceBankAddress: input.sourceBankAddress ?? null,
          sourceBankBeneficiaryAddress:
            input.sourceBankBeneficiaryAddress ?? null,
          sourcePaymentRail: input.sourcePaymentRail ?? null,
          // Type-specific fields based on validated input
          sourceIban:
            input.sourceAccountType === 'iban' ? input.sourceIban : null,
          sourceBicSwift:
            input.sourceAccountType === 'iban' ? input.sourceBicSwift : null,
          sourceRoutingNumber:
            input.sourceAccountType === 'us_ach'
              ? input.sourceRoutingNumber
              : null,
          sourceAccountNumber:
            input.sourceAccountType === 'us_ach'
              ? input.sourceAccountNumber
              : input.sourceAccountType === 'uk_details'
                ? input.sourceAccountNumber
                : null, // Account number might also exist for other types, adjust if needed
          sourceSortCode:
            input.sourceAccountType === 'uk_details'
              ? input.sourceSortCode
              : null,
          destinationCurrency: input.destinationCurrency,
          destinationPaymentRail: input.destinationPaymentRail,
        };

        await db.insert(userFundingSources).values(valuesToInsert as any); // Use validated input type

        // Note: tRPC mutations automatically trigger re-fetches through React Query
        // No need for manual revalidation

        return { success: true, message: 'Funding source added successfully.' };
      } catch (error) {
        console.error('Error adding funding source via tRPC:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add funding source. Please try again.',
          cause: error,
        });
      }
    }),

  // New procedure for AI parsing
  parseFundingDetails: protectedProcedure
    .input(
      z.object({
        rawDetails: z.string().min(10, 'Please provide more details.'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      console.log(
        `User ${privyDid} requested AI parsing for: ${input.rawDetails.substring(0, 50)}...`,
      );

      try {
        const { object } = await generateObject({
          model: openai('gpt-4o'),
          schema: aiParsingSchema, // Use the flat schema for AI generation
          prompt: `Parse the following bank account details provided by the user. Extract the information according to the schema, paying close attention to identifying numbers like routing numbers, IBANs, sort codes, and account numbers to correctly determine the 'sourceAccountType'. Infer currency if possible (e.g., routing number implies USD, sort code implies GBP). If details are ambiguous or missing, leave the corresponding fields null or undefined. User input: "${input.rawDetails}"`,
          // maxTokens: 1024, // maxTokens is not a direct property here, it should be part of model-specific options if supported
        });

        console.log(`AI parsing result for user ${privyDid}:`, object);
        // Return the parsed object. Client needs to handle potential partial data.
        return object as Partial<AddFundingSourceFormValues>;
      } catch (error) {
        console.error(
          `Error parsing funding details with AI for user ${privyDid}:`,
          error,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'AI failed to parse the provided details. Please fill the form manually.',
          cause: error,
        });
      }
    }),

  // Procedure to list funding sources for the current user
  listFundingSources: protectedProcedure.query(async ({ ctx }) => {
    const privyDid = ctx.user.id;

    try {
      const sources = await db
        .select({
          // Select only necessary fields for listing/selection
          id: userFundingSources.id,
          accountType: userFundingSources.sourceAccountType,
          currency: userFundingSources.sourceCurrency,
          bankName: userFundingSources.sourceBankName,
          beneficiaryName: userFundingSources.sourceBankBeneficiaryName,
          // Include masked details for display purposes
          // TODO: Add masked fields to schema and select them here later if needed
          // Include full details needed to populate bankDetails if selected
          accountHolder: userFundingSources.sourceBankBeneficiaryName, // Map to common field name
          // US details
          accountNumber: userFundingSources.sourceAccountNumber, // Needed if selected
          routingNumber: userFundingSources.sourceRoutingNumber, // Needed if selected
          // IBAN details
          iban: userFundingSources.sourceIban, // Needed if selected
          bic: userFundingSources.sourceBicSwift, // Needed if selected
        })
        .from(userFundingSources)
        .where(eq(userFundingSources.userPrivyDid, privyDid));

      // TODO: Add masking logic here if not done at DB level
      // e.g., sources.forEach(s => { s.maskedAccountNumber = mask(s.accountNumber); });

      return sources;
    } catch (error) {
      console.error(
        `Error fetching funding sources for user ${privyDid}:`,
        error,
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch funding sources.',
        cause: error,
      });
    }
  }),

  countFundingSources: protectedProcedure
    .input(
      z.object({
        network: z
          .enum(['solana', 'base', 'ethereum'])
          .optional()
          .describe(
            'Filter by network if needed, but not required for listing all sources.',
          ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;
      try {
        const sources = await db
          .select({
            count: count(),
          })
          .from(userFundingSources)
          .where(
            input.network
              ? and(
                  eq(userFundingSources.userPrivyDid, privyDid),
                  eq(userFundingSources.destinationPaymentRail, input.network),
                )
              : eq(userFundingSources.userPrivyDid, privyDid), // No network filter if not provided
          );
        // Return count or 0 if no sources found
        return sources.length > 0 ? sources[0].count : 0;
      } catch (error) {
        console.error(
          `Error fetching count funding sources for user ${privyDid}:`,
          error,
        );
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch count funding sources.',
          cause: error,
        });
      }
    }),
});

// export type FundingSourceRouter = typeof fundingSourceRouter; // Removed type export
