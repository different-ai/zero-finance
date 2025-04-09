import { z } from 'zod';

// Define the possible account types matching the database enum
const accountTypes = z.enum(['us_ach', 'iban', 'uk_details', 'other']);

// Base schema with common fields
const baseSchema = z.object({
  sourceAccountType: accountTypes,
  sourceCurrency: z.string().min(3, "Currency code required (e.g., USD)").max(5),
  sourceBankName: z.string().min(2, "Bank name is required"),
  sourceBankAddress: z.string().optional(),
  sourceBankBeneficiaryName: z.string().min(2, "Beneficiary name is required"),
  sourceBankBeneficiaryAddress: z.string().optional(),
  sourcePaymentRail: z.string().optional(), // Might be inferred or optional initially
  // Destination details
  destinationCurrency: z.string().min(3).max(5).toUpperCase().default('USDC'),
  destinationPaymentRail: z.string().min(2).default('base'), // Default to base?
  destinationAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

// Schema specific to US ACH
const usAchSchema = baseSchema.extend({
  sourceAccountType: z.literal('us_ach'),
  sourceRoutingNumber: z.string().regex(/^[0-9]{9}$/, "Invalid routing number (must be 9 digits)"),
  sourceAccountNumber: z.string().min(4, "Account number seems too short").max(17), // Common US account number length range
  sourceIban: z.string().optional().nullable(), // Ensure other types are null/optional
  sourceBicSwift: z.string().optional().nullable(),
  sourceSortCode: z.string().optional().nullable(),
});

// Schema specific to IBAN
const ibanSchema = baseSchema.extend({
  sourceAccountType: z.literal('iban'),
  sourceIban: z.string().min(15, "IBAN seems too short").max(34, "IBAN seems too long"), // Basic IBAN length check
  sourceBicSwift: z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid BIC/SWIFT code").optional(), // Optional BIC
  sourceRoutingNumber: z.string().optional().nullable(),
  sourceAccountNumber: z.string().optional().nullable(),
  sourceSortCode: z.string().optional().nullable(),
});

// Schema specific to UK Details (Example)
const ukDetailsSchema = baseSchema.extend({
  sourceAccountType: z.literal('uk_details'),
  sourceAccountNumber: z.string().regex(/^[0-9]{8}$/, "Invalid UK account number (must be 8 digits)"),
  sourceSortCode: z.string().regex(/^[0-9]{6}$/, "Invalid sort code (must be 6 digits)"),
  sourceIban: z.string().optional().nullable(),
  sourceBicSwift: z.string().optional().nullable(),
  sourceRoutingNumber: z.string().optional().nullable(),
});

// Schema for 'other' - minimal validation
const otherSchema = baseSchema.extend({
  sourceAccountType: z.literal('other'),
  // Allow potentially any other fields, maybe add a description field?
  // Make sure specific fields are optional/nullable
  sourceIban: z.string().optional().nullable(),
  sourceBicSwift: z.string().optional().nullable(),
  sourceRoutingNumber: z.string().optional().nullable(),
  sourceAccountNumber: z.string().optional().nullable(),
  sourceSortCode: z.string().optional().nullable(),
});

// Discriminated union based on sourceAccountType
export const addFundingSourceSchema = z.discriminatedUnion("sourceAccountType", [
  usAchSchema,
  ibanSchema,
  ukDetailsSchema,
  otherSchema,
]);

// Type helper for form usage
export type AddFundingSourceFormValues = z.infer<typeof addFundingSourceSchema>; 