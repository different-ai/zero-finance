'use server';

import { z } from 'zod';
import { db } from '@/db';
import { userFundingSources } from '@/db/schema';
import { addFundingSourceSchema, type AddFundingSourceFormValues } from '@/lib/validators/add-funding-source';
import { PrivyClient } from '@privy-io/server-auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || '', 
  process.env.PRIVY_APP_SECRET || '',
);

export type AddFundingSourceResult = {
  success: boolean;
  message: string;
  error?: string | z.ZodError<AddFundingSourceFormValues>; // Include ZodError type
};

export async function addFundingSource(
  formData: AddFundingSourceFormValues
): Promise<AddFundingSourceResult> {
  // 1. Authenticate User
  const cookieStore = await cookies();
  const token = cookieStore.get('privy-token')?.value;
  if (!token) {
    return { success: false, message: "Authentication required.", error: "No auth token" };
  }

  let verifiedClaims;
  try {
    verifiedClaims = await privy.verifyAuthToken(token);
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return { success: false, message: "Authentication failed.", error: 'Token verification failed' };
  }

  const privyDid = verifiedClaims.userId;
  if (!privyDid) {
    return { success: false, message: "Could not verify user identity.", error: 'Missing userId in token' };
  }

  // 2. Validate Form Data Server-Side
  const validationResult = addFundingSourceSchema.safeParse(formData);

  if (!validationResult.success) {
    console.error("Server-side validation failed:", validationResult.error.flatten());
    return { 
      success: false, 
      message: "Invalid form data.", 
      error: validationResult.error // Send back Zod error details
    };
  }

  const validatedData = validationResult.data;

  // 3. Insert into Database
  try {
    // Create the object with the exact structure expected by the table schema
    const valuesToInsert = {
      userPrivyDid: privyDid,
      sourceAccountType: validatedData.sourceAccountType,
      sourceCurrency: validatedData.sourceCurrency,
      sourceBankName: validatedData.sourceBankName,
      sourceBankAddress: validatedData.sourceBankAddress ?? null, // Ensure optional fields are null if undefined
      sourceBankBeneficiaryName: validatedData.sourceBankBeneficiaryName,
      sourceBankBeneficiaryAddress: validatedData.sourceBankBeneficiaryAddress ?? null,
      sourcePaymentRail: validatedData.sourcePaymentRail ?? null,
      // Set type-specific fields explicitly to null if the type doesn't match
      sourceIban: validatedData.sourceAccountType === 'iban' ? validatedData.sourceIban : null,
      sourceBicSwift: validatedData.sourceAccountType === 'iban' ? validatedData.sourceBicSwift : null,
      sourceRoutingNumber: validatedData.sourceAccountType === 'us_ach' ? validatedData.sourceRoutingNumber : null,
      sourceAccountNumber:
        validatedData.sourceAccountType === 'us_ach' ? validatedData.sourceAccountNumber :
        validatedData.sourceAccountType === 'uk_details' ? validatedData.sourceAccountNumber :
        null,
      sourceSortCode: validatedData.sourceAccountType === 'uk_details' ? validatedData.sourceSortCode : null,
      // Destination fields
      destinationCurrency: validatedData.destinationCurrency,
      destinationPaymentRail: validatedData.destinationPaymentRail,
      destinationAddress: validatedData.destinationAddress,
    };

    // Now pass the correctly typed object
    await db.insert(userFundingSources).values(valuesToInsert);

    // 4. Revalidate Cache/Path
    // Revalidate the cache tag used by getUserFundingSources
    revalidatePath('/dashboard/settings', 'page'); // Revalidate settings page specifically

    return { success: true, message: "Funding source added successfully." };

  } catch (error) {
    console.error("Error adding funding source to database:", error);
    // Provide a generic error message to the user
    return { 
      success: false, 
      message: "Failed to add funding source. Please try again.",
      error: error instanceof Error ? error.message : "Database error"
    };
  }
} 