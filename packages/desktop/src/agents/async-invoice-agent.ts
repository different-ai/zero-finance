import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { screenpipeSearch } from './tools/screenpipe-search';
import { invoiceAnswer, InvoiceParserResult } from './tools/invoice-answer';
import { useClassificationStore } from '@/stores/classification-store';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { toast } from 'sonner';
import { useCallback } from 'react';

export interface AsyncInvoiceResult {
  success: boolean;
  data?: InvoiceParserResult;
  error?: string;
}

export async function runInvoiceAgent(
  vitalInfo: string,
  recognizedItemId: string,
): Promise<AsyncInvoiceResult> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Please set your OpenAI API key in settings');
    }

    // Clear any existing steps for this item
    useAgentStepsStore.getState().clearSteps(recognizedItemId);

    const openai = createOpenAI({ apiKey });

    const { steps, toolCalls, toolResults } = await generateText({
      model: openai('gpt-4o'),
      tools: {
        screenpipeSearch,
        invoiceAnswer,
      },
      toolChoice: 'required',
      maxSteps: 10,
      system: `
        You are an invoice-filling agent. 
        You can call "screenpipeSearch" to gather extra text from OCR/audio logs. 
        Then refine your invoice. 
        You must produce a final invoice object by calling "invoiceAnswer".

        Follow these steps:
        1. Analyze the initial context from vitalInfo
        2. Use screenpipeSearch to find relevant information about:
           - The client/buyer (name, email, business details)
           - Invoice items and amounts
           - Any payment terms or conditions
        3. Compile all information into a well-structured invoice
        4. Call invoiceAnswer with the complete invoice object
      `,
      prompt: `
        The user wants an invoice for: 
        "${vitalInfo}"

        Please gather additional info from screenpipe if needed.
        Then fill out the invoice in the Request Network Format (RNF).
      `,
      onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        // Add step to store
        useAgentStepsStore.getState().addStep(recognizedItemId, {
          text,
          toolCalls,
          toolResults,
          finishReason,
          usage,
        });

        // Show toast for significant events
        if (toolCalls?.length) {
          const toolNames = toolCalls.map(t => 'toolName' in t ? t.toolName : 'unknown').join(', ');
          toast.info(`Agent using tools: ${toolNames}`);
        }
      },
    });

    // Log the agent's steps for debugging
    console.log('0xHypr', 'Invoice agent steps:', steps);
    console.log('0xHypr', 'Tool calls:', toolCalls);
    console.log('0xHypr', 'Tool results:', toolResults);

    // Find the final invoiceAnswer call
    const finalToolCall = toolCalls.find(t => 
      'toolName' in t && t.toolName === 'invoiceAnswer'
    );
    if (!finalToolCall) {
      throw new Error('No final invoice returned by the agent');
    }

    // The args should match our InvoiceParserResult type
    return {
      success: true,
      data: finalToolCall.args as InvoiceParserResult,
    };
  } catch (error) {
    console.error('0xHypr', 'Error in invoice agent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in invoice agent',
    };
  }
}

// Hook to manage async invoice processing
export function useAsyncInvoice(recognizedItemId: string) {
  const { setPendingInvoice, pendingInvoices } = useInvoiceStore();
  const result = pendingInvoices[recognizedItemId];

  const processInvoice = useCallback(async (vitalInfo: string) => {
    try {
      // Start processing
      setPendingInvoice(recognizedItemId, null);

      // Run the invoice agent
      const result = await runInvoiceAgent(vitalInfo, recognizedItemId);

      // Update store with result
      setPendingInvoice(recognizedItemId, result);

      if (!result.success) {
        toast.error('Failed to process invoice: ' + result.error);
      }

      return result;
    } catch (error) {
      console.error('0xHypr', 'Error processing invoice:', error);
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error processing invoice',
      };
      setPendingInvoice(recognizedItemId, errorResult);
      return errorResult;
    }
  }, [recognizedItemId, setPendingInvoice]);

  return {
    result,
    processInvoice,
    isProcessing: result === null,
  };
} 