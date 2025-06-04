// import type { AIModelId } from '@ai-sdk/provider'; // Simplified to string

interface SystemPromptParams {
  selectedChatModel: string; // Model ID is typically a string
  isResearchRequest?: boolean;
  // Add any other params your actual system prompt might need
}

export const systemPrompt = ({ selectedChatModel, isResearchRequest }: SystemPromptParams): string => {
  console.warn('[Placeholder] Using placeholder systemPrompt() in @/lib/ai/prompts.ts');
  let basePrompt = "You are a helpful financial assistant for ZeroFinance. Be concise and clear.";
  if (isResearchRequest) {
    basePrompt += " You are currently in research mode.";
  }
  basePrompt += `\nModel in use: ${selectedChatModel}`;
  
  // Instructions for invoice creation tool:
  basePrompt += "\n\nWhen the user wants to create or update an invoice, clearly ask for or confirm all necessary details such as buyer email, seller email, line items (name, quantity, unit price), and currency. Once you have these, confirm with the user and then use the 'createOrUpdateInvoice' tool.";

  return basePrompt;
}; 