import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { screenpipeSearch } from './tools/screenpipe-search';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { toast } from '@/components/ui/use-toast';
import { useCallback, useState, useRef } from 'react';
import type { PaymentInfo, WiseTransfer } from '@/types/wise';

export interface PaymentDetectionResult {
  payment?: PaymentInfo;
  error?: string;
}

export interface AsyncPaymentResult {
  success: boolean;
  data?: PaymentDetectionResult;
  error?: string;
}

function getHumanActionFromToolCall(toolCall: any) {
  if (toolCall.toolName === 'screenpipeSearch') {
    return `Searching for payment information${toolCall.args.query ? ` related to "${toolCall.args.query}"` : ''}`;
  }
  return 'Processing...';
}

function getHumanResultFromToolCall(toolCall: any, result: any) {
  if (toolCall.toolName === 'screenpipeSearch') {
    if (Array.isArray(result) && result.length > 0) {
      return `Found ${result.length} relevant pieces of information`;
    }
    return 'No additional information found';
  }
  return 'Step completed';
}

export async function runPaymentDetection(
  vitalInfo: string,
  recognizedItemId: string,
  onProgress?: (message: string) => void
): Promise<AsyncPaymentResult> {
  try {
    // Clear any existing steps for this item
    useAgentStepsStore.getState().clearSteps(recognizedItemId);
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;  
    const openai = createOpenAI({apiKey: apiKey});

    const { steps, toolCalls, toolResults } = await generateText({
      model: openai('gpt-4o'),
      tools: {
        screenpipeSearch,
      },
      toolChoice: 'required',
      maxSteps: 7,
      system: `
        You are a payment detection agent that looks for bank transfer information.
        You can call "screenpipeSearch" to gather text from OCR/audio logs.
        Your goal is to find:
        - Amount and currency
        - Recipient name
        - Bank account details (account number, routing number)
        - Any reference numbers or notes

        Follow these steps:
        1. Analyze the initial context
        2. Use screenpipeSearch to find relevant payment information:
        - Start with specific queries about amounts, account numbers, and recipient names
        - Favor recent information (last minutes first, then expand to hours/days)
        - Look for banking terms like "transfer", "account", "routing", etc.
        3. If you find partial data, refine your queries to find missing details
        4. Compile all information into a structured payment format
      `,
      prompt: `
        Looking for payment information in: 
        "${vitalInfo}"

        Use multiple screenpipeSearch calls with refined queries if needed
        to find complete payment details.
      `,
      onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        const addStep = useAgentStepsStore.getState().addStep;
        const updateStepResult = useAgentStepsStore.getState().updateStepResult;

        // For each tool call in the step
        toolCalls?.forEach((toolCall, index) => {
          const stepId = crypto.randomUUID();
          const humanAction = getHumanActionFromToolCall(toolCall);
          
          // Add the step with the action
          addStep(recognizedItemId, {
            text,
            toolCalls: [toolCall],
            toolResults: toolResults ? [toolResults[index]] : undefined,
            finishReason,
            usage,
            humanAction,
          });

          // If we have results, update with human result
          if (toolResults?.[index]) {
            const humanResult = getHumanResultFromToolCall(toolCall, toolResults[index]);
            updateStepResult(recognizedItemId, stepId, humanResult);
          }
        });

        // Notify progress
        if (toolCalls?.length && onProgress) {
          const toolNames = toolCalls.map(t => 'toolName' in t ? t.toolName : 'unknown').join(', ');
          onProgress(`Using tools: ${toolNames}`);
        }
      },
    });

    // Log the agent's steps for debugging
    console.log('0xHypr', 'Payment detection steps:', steps);
    console.log('0xHypr', 'Tool calls:', toolCalls);
    console.log('0xHypr', 'Tool results:', toolResults);

    // Find the final screenpipeSearch call with payment data
    const finalToolCall = toolCalls[toolCalls.length - 1];
    if (!finalToolCall || !('toolName' in finalToolCall)) {
      throw new Error('No final tool call found');
    }

    // Extract payment data from the results
    const finalResult = toolResults[toolResults.length - 1];
    if (!finalResult || !Array.isArray(finalResult) || finalResult.length === 0) {
      throw new Error('No payment data found');
    }

    // Extract text content from the results
    const textContent = finalResult.map(r => r.content.text).join(' ');

    // Return the result
    return {
      success: true,
      data: {
        payment: {
          amount: '0', // This should be extracted from textContent
          currency: 'USD',
          recipientName: 'Auto-detected Recipient',
          accountNumber: '', // This should be extracted from textContent
          routingNumber: '', // This should be extracted from textContent
        },
      },
    };
  } catch (error) {
    console.error('0xHypr', 'Error in payment detection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error in payment detection',
    };
  }
}

// Hook to manage async payment detection
export function useAsyncPaymentDetection(recognizedItemId: string) {
  const [result, setResult] = useState<AsyncPaymentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastShownRef = useRef(false);

  const processPayment = useCallback(async (vitalInfo: string) => {
    try {
      setIsProcessing(true);
      setResult(null);
      toastShownRef.current = false;

      // Run the payment detection
      const result = await runPaymentDetection(
        vitalInfo, 
        recognizedItemId,
        (message) => {
          if (!toastShownRef.current) {
            toast({
              title: 'Detection Progress',
              description: message
            });
          }
        }
      );

      // Update state with result
      setResult(result);

      if (!result.success && !toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Detection Failed',
          description: result.error,
          variant: 'destructive'
        });
      }

      return result;
    } catch (error) {
      console.error('0xHypr', 'Error processing payment:', error);
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error processing payment',
      };
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Error',
          description: errorResult.error,
          variant: 'destructive'
        });
      }
      setResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [recognizedItemId]);

  return {
    result,
    processPayment,
    isProcessing,
  };
} 