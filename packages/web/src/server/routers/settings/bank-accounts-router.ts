import { z } from 'zod';
import { router, protectedProcedure } from '../../create-router';
import { db } from '@/db';
import { userDestinationBankAccounts, users } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
// Context type isn't strictly needed here anymore as protectedProcedure guarantees ctx.user
// import type { Context } from '@/server/context'; 

// Schema for validating bank account input
const bankAccountSchema = z.object({
  accountName: z.string().min(1, 'Account nickname is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolderType: z.enum(['individual', 'business']),
  accountHolderFirstName: z.string().optional(),
  accountHolderLastName: z.string().optional(),
  accountHolderBusinessName: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  streetLine1: z.string().min(1, 'Street address is required'),
  streetLine2: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  accountType: z.enum(['us', 'iban']),
  
  // Conditionally required fields based on accountType (handled in mutation)
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  ibanNumber: z.string().optional(),
  bicSwift: z.string().optional(),
  
  isDefault: z.boolean().default(false),
}).refine(data => {
    // Custom validation for conditional fields
    if (data.accountType === 'us') {
      return !!data.accountNumber && !!data.routingNumber;
    }
    if (data.accountType === 'iban') {
      return !!data.ibanNumber && !!data.bicSwift;
    }
    return false; // Should not happen with enum type
}, {
    message: "Account/Routing number (for US) or IBAN/BIC (for IBAN) are required.",
    // Specify path if needed, e.g., path: ["accountNumber"] or handle multiple paths
});

// Schema for updating bank accounts (only allow specific fields)
const updateBankAccountSchema = z.object({
    accountId: z.string().uuid(), // Use UUID
    accountName: z.string().min(1, 'Account name is required').optional(),
    bankName: z.string().min(1, 'Bank name is required').optional(),
    isDefault: z.boolean().optional(),
    // Add other updateable fields here if needed, ensuring they are optional
    // e.g., accountHolderType, address fields, etc. but NOT sensitive numbers
});


export const bankAccountsRouter = router({
  
  addBankAccount: protectedProcedure
    .input(bankAccountSchema)
    // Access ctx.user directly, guaranteed by protectedProcedure
    .mutation(async ({ ctx, input }) => { 
      const userFromPrivy = ctx.user; // User object added by middleware
      if (!userFromPrivy || !userFromPrivy.id) {
        // This check is technically redundant due to protectedProcedure, but safe
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User context missing.'});
      }
      const userId = userFromPrivy.id; // This is the privyDid

      // Validate based on account type
      if (input.accountType === 'us') {
        if (!input.accountNumber || !input.routingNumber) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Account number and routing number are required for US accounts.',
          });
        }
        // Clear IBAN fields if US type
        input.ibanNumber = undefined;
        input.bicSwift = undefined;
      } else if (input.accountType === 'iban') {
        if (!input.ibanNumber || !input.bicSwift) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'IBAN number and BIC/SWIFT are required for IBAN accounts.',
          });
        }
        // Clear US fields if IBAN type
        input.accountNumber = undefined;
        input.routingNumber = undefined;
      }

      // Validate individual vs business names
      if (input.accountHolderType === 'individual' && (!input.accountHolderFirstName || !input.accountHolderLastName)) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'First and last name required for individual account holder.' });
      }
      if (input.accountHolderType === 'business' && !input.accountHolderBusinessName) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Business name required for business account holder.' });
      }

      // If setting this account as default, unset any existing default for this user
      if (input.isDefault) {
        await db
          .update(userDestinationBankAccounts)
          .set({ isDefault: false })
          .where(eq(userDestinationBankAccounts.userId, userId)); // Use userId
      }

      try {
        // Insert the new bank account
        const [newAccount] = await db
          .insert(userDestinationBankAccounts)
          .values({
            userId: userId, // Use userId
            accountName: input.accountName,
            bankName: input.bankName,
            accountHolderType: input.accountHolderType,
            accountHolderFirstName: input.accountHolderType === 'individual' ? input.accountHolderFirstName : null,
            accountHolderLastName: input.accountHolderType === 'individual' ? input.accountHolderLastName : null,
            accountHolderBusinessName: input.accountHolderType === 'business' ? input.accountHolderBusinessName : null,
            country: input.country,
            city: input.city,
            streetLine1: input.streetLine1,
            streetLine2: input.streetLine2 ?? null,
            postalCode: input.postalCode,
            accountType: input.accountType,
            // Store sensitive info - consider encryption later
            accountNumber: input.accountNumber, 
            routingNumber: input.routingNumber,
            ibanNumber: input.ibanNumber, 
            bicSwift: input.bicSwift,
            isDefault: input.isDefault,
          })
          .returning({ 
            id: userDestinationBankAccounts.id,
            accountName: userDestinationBankAccounts.accountName,
            isDefault: userDestinationBankAccounts.isDefault,
          });

        return newAccount;

      } catch (error) {
          console.error("Error adding bank account:", error);
          throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to add bank account.',
              cause: error,
          });
      }
    }),

  listBankAccounts: protectedProcedure
    .query(async ({ ctx }) => { 
      const userFromPrivy = ctx.user;
      if (!userFromPrivy || !userFromPrivy.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User context missing.'});
      }
      const userId = userFromPrivy.id;

      const bankAccounts = await db.query.userDestinationBankAccounts.findMany({
        where: eq(userDestinationBankAccounts.userId, userId), // Use userId
        orderBy: [
          desc(userDestinationBankAccounts.isDefault),
          asc(userDestinationBankAccounts.createdAt), // Use createdAt for stable sort
        ],
        columns: { // Explicitly select columns to return, excluding sensitive ones
          id: true,
          accountName: true,
          bankName: true,
          accountHolderType: true,
          accountType: true,
          isDefault: true,
          country: true,
          createdAt: true,
          updatedAt: true,
          // Mask account numbers for security
          accountNumber: true, // Keep temporarily for masking logic below
          ibanNumber: true,    // Keep temporarily for masking logic below
          bicSwift: true,      // BIC/SWIFT is generally not considered highly sensitive
        }
      });

      // Mask sensitive information before returning
      return bankAccounts.map(account => ({
        ...account,
        maskedAccountNumber: account.accountNumber ? 
          `****${account.accountNumber.slice(-4)}` : undefined,
        maskedIbanNumber: account.ibanNumber ? 
          `${account.ibanNumber.substring(0, 4)} **** **** ${account.ibanNumber.slice(-4)}` : undefined,
        accountNumber: undefined, // Remove original from response
        ibanNumber: undefined,    // Remove original from response
      }));
    }),

  getBankAccountDetails: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ ctx, input }) => { 
      const userFromPrivy = ctx.user;
      if (!userFromPrivy || !userFromPrivy.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User context missing.'});
      }
      const userId = userFromPrivy.id;

      const bankAccount = await db.query.userDestinationBankAccounts.findFirst({
        where: and(
          eq(userDestinationBankAccounts.id, input.accountId),
          eq(userDestinationBankAccounts.userId, userId),
        ),
         // Select all necessary columns, including sensitive ones
         columns: {
             id: true,
             userId: true,
             accountName: true,
             bankName: true,
             accountHolderType: true,
             accountHolderFirstName: true,
             accountHolderLastName: true,
             accountHolderBusinessName: true,
             country: true,
             city: true,
             streetLine1: true,
             streetLine2: true,
             postalCode: true,
             accountType: true,
             bicSwift: true,
             isDefault: true,
             createdAt: true,
             updatedAt: true,
             accountNumber: true, // Select the real field
             routingNumber: true, // Select the real field
             ibanNumber: true,    // Select the real field
         }
      });

      if (!bankAccount) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Bank account not found.',
        });
      }

      // Return the full, unmasked details
      // The frontend (InitiateTransferForm) will handle populating its fields
      // The final submission (createOfframpTransfer) uses these unmasked details.
      return bankAccount; 
      /* // Removed masking logic
      return {
        ...bankAccount,
        maskedAccountNumber: bankAccount.accountNumber ? 
          `****${bankAccount.accountNumber.slice(-4)}` : undefined,
        maskedRoutingNumber: bankAccount.routingNumber ? 
          `****${bankAccount.routingNumber.slice(-4)}` : undefined,
        maskedIbanNumber: bankAccount.ibanNumber ?
           `${bankAccount.ibanNumber.substring(0, 4)} **** **** ${bankAccount.ibanNumber.slice(-4)}` : undefined,
        accountNumber: undefined, 
        routingNumber: undefined, 
        ibanNumber: undefined,    
      };
      */
    }),

  deleteBankAccount: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => { 
      const userFromPrivy = ctx.user;
      if (!userFromPrivy || !userFromPrivy.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User context missing.'});
      }
      const userId = userFromPrivy.id;

      // Verify the account belongs to the user before deleting
      const [deletedAccount] = await db
        .delete(userDestinationBankAccounts)
        .where(and(
          eq(userDestinationBankAccounts.id, input.accountId),
          eq(userDestinationBankAccounts.userId, userId), // Use userId
        ))
        .returning({ id: userDestinationBankAccounts.id }); 

      if (!deletedAccount) {
          throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Bank account not found or you do not have permission to delete it.',
          });
      }
      
      return { success: true, deletedAccountId: deletedAccount.id };
    }),

  updateBankAccount: protectedProcedure
    .input(updateBankAccountSchema)
    .mutation(async ({ ctx, input }) => { 
      const userFromPrivy = ctx.user;
      if (!userFromPrivy || !userFromPrivy.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User context missing.'});
      }
      const userId = userFromPrivy.id;
      const { accountId, ...updateData } = input;

      // Find the account first to ensure it exists and belongs to the user
      const existingAccount = await db.query.userDestinationBankAccounts.findFirst({
        where: and(
          eq(userDestinationBankAccounts.id, accountId),
          eq(userDestinationBankAccounts.userId, userId), // Use userId
        ),
         columns: { id: true } // Only need ID for existence check
      });

      if (!existingAccount) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Bank account not found or you do not have permission to update it.',
        });
      }
      
      // If setting this account as default, unset any existing default first
      if (updateData.isDefault === true) { 
        await db
          .update(userDestinationBankAccounts)
          .set({ isDefault: false })
          .where(and(
              eq(userDestinationBankAccounts.userId, userId), // Use userId
              eq(userDestinationBankAccounts.isDefault, true),
          ));
      }
      
      if (Object.keys(updateData).length === 0) {
         throw new TRPCError({ code: 'BAD_REQUEST', message: 'No fields provided for update.' });
      }

      try {
        // Update the bank account
        const [updatedAccount] = await db
          .update(userDestinationBankAccounts)
          .set({
              ...updateData,
              updatedAt: new Date(), // Manually set updatedAt
          })
          .where(eq(userDestinationBankAccounts.id, accountId)) // Already verified ownership
          .returning({
            id: userDestinationBankAccounts.id,
            accountName: userDestinationBankAccounts.accountName,
            isDefault: userDestinationBankAccounts.isDefault,
            updatedAt: userDestinationBankAccounts.updatedAt,
          });
          
        if (!updatedAccount) {
           // Should not happen if existence check passed, but good practice
           throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update bank account after verification.' });
        }

        return updatedAccount;
      } catch (error) {
          console.error("Error updating bank account:", error);
           throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to update bank account.',
              cause: error,
          });
      }
    }),
}); 