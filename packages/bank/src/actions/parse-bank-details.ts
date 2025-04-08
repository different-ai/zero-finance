'use server';

import { z } from 'zod';
import { CoreMessage, generateObject, streamObject } from 'ai';
import { openai } from '@ai-sdk/openai'; // Ensure OpenAI provider is set up
import { parsedBankDetailsSchema, type ParsedBankDetails } from '@/lib/validators/parse-bank-details';

// Define the return type for the action
export type ParseBankDetailsResult = 
  | { success: true; data: ParsedBankDetails }
  | { success: false; error: string };

export async function parseBankDetails(inputText: string): Promise<ParseBankDetailsResult> {
  if (!inputText || inputText.trim().length === 0) {
    return { success: false, error: 'Input text cannot be empty.' };
  }

  // Prepare messages for the AI model
  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: 
        'You are an expert financial assistant. Your task is to parse unstructured bank account details provided by a user and extract the relevant information into a structured JSON object. Focus only on the details present in the text. If a piece of information (like routing number, account number, IBAN, sort code, bank name, currency, or beneficiary name) is not mentioned, do not include its key in the output object. Infer the account type (us_ach, iban, uk_details, other) based on the identifiers found.',
    },
    {
      role: 'user',
      content: `Please parse the following bank details:\n\n${inputText}`,
    },
  ];

  try {
    console.log('Calling generateObject with input:', inputText);
    // Use generateObject to get structured data based on the Zod schema
    const { object: parsedData } = await generateObject({
      model: openai('gpt-4o'), // Use gpt-4o or your preferred model
      schema: parsedBankDetailsSchema,
      messages: messages,
      temperature: 0.1, // Lower temperature for more deterministic extraction
       maxTokens: 500, // Limit response size
       mode: 'json' // Ensure JSON mode
    });

    console.log('Parsed data from AI:', parsedData);
    
    // Optional: Add post-parsing validation or cleanup if needed
    // e.g., basic format check for numbers
    if (parsedData.sourceRoutingNumber && !/^[0-9]{9}$/.test(parsedData.sourceRoutingNumber)) {
        console.warn("AI returned potentially invalid routing number:", parsedData.sourceRoutingNumber);
        // Decide how to handle: remove it, keep it, or return an error?
        // parsedData.sourceRoutingNumber = undefined; 
    }
    // Add similar checks for IBAN, sort code etc. if desired

    return { success: true, data: parsedData };

  } catch (error: any) {
    console.error("Error parsing bank details with AI:", error);
    let errorMessage = "Failed to parse bank details using AI.";
    if (error.message) {
      errorMessage += ` Error: ${error.message}`;
    }
    // Handle potential rate limits or API errors gracefully
    // You might want more specific error handling based on the AI SDK's error types
    return { success: false, error: errorMessage };
  }
} 