import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { screenpipeSearch } from './tools/screenpipe-search';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { toast } from '@/components/ui/use-toast';
import { useCallback, useState, useRef } from 'react';

export interface DetectedPayment {
  id: string;
  timestamp: string;
  summary: string;
  vitalInfo: string;
  confidence: number;
  source: {
    text: string;
    app: string;
    window: string;
  };
}

export interface PaymentDetectionResult {
  payments: DetectedPayment[];
  error?: string;
}

function getHumanActionFromToolCall(toolCall: any) {
  if (toolCall.toolName === 'screenpipeSearch') {
    return `Scanning for payment information${toolCall.args.query ? ` related to "${toolCall.args.query}"` : ''}`;
  }
  return 'Processing...';
}

function getHumanResultFromToolCall(toolCall: any, result: any) {
  if (toolCall.toolName === 'screenpipeSearch') {
    if (Array.isArray(result) && result.length > 0) {
      return `Found ${result.length} potential matches`;
    }
    return 'No matches found';
  }
  return 'Step completed';
}

export async function runPaymentDetector(
  recognizedItemId: string,
  onProgress?: (message: string) => void
): Promise<PaymentDetectionResult> {
  try {
    // Clear any existing steps for this item
    useAgentStepsStore.getState().clearSteps(recognizedItemId);
    const openai = createOpenAI({apiKey: process.env.OPENAI_API_KEY});

    const { steps, toolCalls, toolResults } = await generateText({
      model: openai('gpt-4o'),
      tools: {
        screenpipeSearch,
      },
      toolChoice: 'required',
      maxSteps: 7,
      system: `
        You are a payment detection agent that looks for potential payments that need to be made.
        You can call "screenpipeSearch" to gather text from OCR/audio logs.
        Your goal is to find any mentions of:
        - Payments that need to be made
        - Invoices that need to be paid
        - Bank transfer requests
        - IBAN numbers or bank details
        - Payment amounts and currencies
        - Payment deadlines or due dates

        Follow these steps:
        1. Start with broad searches for payment-related terms
        2. When you find something, do focused searches to gather context:
        - Look for amounts, dates, and recipient info
        - Check surrounding text for payment context
        - Verify if it's a payment that needs to be made (not already paid)
        3. For each potential payment found, extract:
        - A clear summary of what needs to be paid
        - The vital information (amounts, dates, recipient details)
        - The source context where it was found
        4. Assign a confidence score (0-100) based on:
        - How clearly it indicates a needed payment
        - How much payment information is available
        - How recent the information is
      `,
      prompt: `
        Search through recent screen activity to find any payments that need to be made.
        Focus on the last hour first, then expand if needed.
        Look for clear indicators of pending payments.
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

    // Extract detected payments from the results
    const detectedPayments: DetectedPayment[] = [];
    
    toolResults.forEach((result, index) => {
      if (Array.isArray(result)) {
        result.forEach(item => {
          if (item.type === 'OCR' && item.content.text.length > 0) {
            detectedPayments.push({
              id: crypto.randomUUID(),
              timestamp: item.content.timestamp,
              summary: 'Payment detected', // This should be extracted from the content
              vitalInfo: item.content.text,
              confidence: 70, // This should be calculated based on the content
              source: {
                text: item.content.text,
                app: item.content.app_name || '',
                window: item.content.window_name || '',
              }
            });
          }
        });
      }
    });

    return {
      payments: detectedPayments,
    };
  } catch (error) {
    console.error('0xHypr', 'Error in payment detection:', error);
    return {
      payments: [],
      error: error instanceof Error ? error.message : 'Unknown error in payment detection',
    };
  }
}

// Hook to manage payment detection
export function usePaymentDetector(recognizedItemId: string) {
  const [result, setResult] = useState<PaymentDetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastShownRef = useRef(false);

  const detectPayments = useCallback(async () => {
    try {
      setIsProcessing(true);
      setResult(null);
      toastShownRef.current = false;

      // Run the payment detection
      const result = await runPaymentDetector(
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

      if (result.error && !toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Detection Failed',
          description: result.error,
          variant: 'destructive'
        });
      } else if (result.payments.length === 0 && !toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'No Payments Found',
          description: 'No pending payments were detected in recent activity.',
        });
      } else if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Payments Detected',
          description: `Found ${result.payments.length} potential payment(s).`,
        });
      }

      return result;
    } catch (error) {
      console.error('0xHypr', 'Error detecting payments:', error);
      const errorResult = {
        payments: [],
        error: error instanceof Error ? error.message : 'Unknown error detecting payments',
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
    detectPayments,
    isProcessing,
  };
} 