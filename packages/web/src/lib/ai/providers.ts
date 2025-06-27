import { createOpenAI } from '@ai-sdk/openai';

// Placeholder for AI model providers
// This should be configured with your actual API keys and desired models for packages/web

// Create OpenAI provider with API key from environment
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  // Add other configurations if needed
  // organization: process.env.OPENAI_ORG_ID,
});

// Export the configured OpenAI instance
export { openai };

// Also export as myProvider for backward compatibility
export const myProvider = openai;

// Log warning if API key is not configured
if (!process.env.OPENAI_API_KEY) {
  console.error('[AI Provider] WARNING: OPENAI_API_KEY is not set in environment variables. AI features will not work.');
}

console.warn('[Placeholder] Using placeholder myProvider in @/lib/ai/providers.ts. Configure API keys.'); 