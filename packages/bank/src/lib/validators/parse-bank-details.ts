import { z } from 'zod';

// Zod schema for the object expected from AI parsing
export const parsedBankDetailsSchema = z.object({
  sourceAccountType: z.enum(['us_ach', 'iban', 'uk_details', 'other']).optional()
    .describe("The type of bank account based on the details provided (e.g., US ACH, IBAN, UK). Infer if possible."),
  sourceRoutingNumber: z.string().optional()
    .describe("US ACH routing number (9 digits)."),
  sourceAccountNumber: z.string().optional()
    .describe("Bank account number (variable length, might be US, UK, or other)."),
  sourceIban: z.string().optional()
    .describe("International Bank Account Number."),
  sourceSortCode: z.string().optional()
    .describe("UK sort code (6 digits)."),
  sourceBicSwift: z.string().optional()
    .describe("BIC or SWIFT code."),
  sourceBankName: z.string().optional()
    .describe("The name of the bank."),
  sourceCurrency: z.string().optional()
    .describe("The currency code of the account (e.g., USD, GBP, EUR)."),
  sourceBankBeneficiaryName: z.string().optional()
    .describe("The name of the account holder (beneficiary)."),
  // Add other fields if needed, e.g., addresses, but keep it focused for now
}).describe("Extracted bank account details from free-form text. Only include fields for which data was found.");

export type ParsedBankDetails = z.infer<typeof parsedBankDetailsSchema>; 