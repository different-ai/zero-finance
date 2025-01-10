import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { screenpipeSearch } from './tools/screenpipe-search';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { toast } from '@/components/ui/use-toast';
import { useCallback, useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import type { PaymentInfo } from '@/types/wise';
import { getScreenpipeSettings } from '../../lib/screenpipe';
import { useSettings } from '@/hooks/use-settings';

// Zod schemas
const detectionSnippetSchema = z.object({
  snippet: z.string().describe('Short text snippet with relevant keywords'),
  label: z
    .string()
    .describe('Small descriptor, e.g., "Possible invoice from X"'),
  confidence: z.number().min(0).max(100),
  timestamp: z.string().describe('When this payment-like text was detected'),
  source: z
    .object({
      app: z.string().optional(),
      window: z.string().optional(),
    })
    .optional(),
});

const detectionAnswerSchema = z
  .object({
    detections: z.array(detectionSnippetSchema),
  })
  .describe('Submit the final list of detected payment-like snippets');

// Types derived from Zod schemas
export type DetectionSnippet = z.infer<typeof detectionSnippetSchema>;
export type DetectionAnswer = z.infer<typeof detectionAnswerSchema>;

export interface PaymentDetectionResult {
  detections: DetectionSnippet[];
  error?: string;
}

// Tool definition
const detectionAnswer = {
  description: 'Submit the final list of detected payment-like snippets',
  parameters: detectionAnswerSchema,
};

function getHumanActionFromToolCall(toolCall: any) {
  if (toolCall.toolName === 'screenpipeSearch') {
    return `Scanning for payment information${
      toolCall.args.query ? ` related to "${toolCall.args.query}"` : ''
    }`;
  }
  if (toolCall.toolName === 'detectionAnswer') {
    return 'Analyzing detected payment snippets';
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
  if (toolCall.toolName === 'detectionAnswer') {
    const data = result as DetectionAnswer;
    return `Detected ${data.detections.length} potential payment(s)`;
  }
  return 'Step completed';
}

export async function runPaymentDetector(
  recognizedItemId: string,
  openaiApiKey: string,
  addStep: (recognizedItemId: string, step: any) => void,
  updateStepResult: (
    recognizedItemId: string,
    stepId: string,
    result: string
  ) => void,
  onProgress?: (message: string) => void,
  signal?: AbortSignal
): Promise<PaymentDetectionResult> {
  try {
    const openai = createOpenAI({ apiKey: openaiApiKey });

    // Check if already aborted
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    const { steps, toolCalls, toolResults } = await generateText({
      model: openai('gpt-4o'),
      tools: {
        screenpipeSearch,
        detectionAnswer,
      },
      toolChoice: 'required',
      maxSteps: 5,
      abortSignal: signal,
      system: `
      Time Today: ${new Date().toISOString()}
        You are a payment detection agent that looks for potential payments that need to be made.
        Your goal is to find mentions of payment-related information in recent screen activity.

        IMPORTANT: You should only detect and extract minimal snippets. DO NOT try to extract full payment details.
        
        Focus on finding keywords like:
        - Invoice
        - Amount Due
        - Due Date
        - Payable
        - Outstanding Balance
        
        Bank and Transfer Details:
        - IBAN
        - SWIFT
        - Routing Number
        - Account Number
        - Bank Transfer
        - Wire Transfer
        - ACH
        - Sort Code
        For each potential payment mention:
        1. Extract a SHORT snippet (100-200 chars) containing the relevant text
        2. Create a brief label describing what it might be
        3. Assign a confidence score based on how likely this is a payment
        
        Keep each potential payment separate - do not combine multiple payments into one.
        
        Search Strategy:
        1. Start with recent activity (last 10 minutes)
        2. If nothing found, gradually expand (30min, 1h, 2h, etc.)
        3. Use single-word queries that will match exactly
        4. When you find something, do focused searches around it
        
        Remember:
        - Keep snippets short and focused
        - Don't try to extract full payment details yet
        - Each detection should be separate
        - Focus on accuracy over speed
      `,
      prompt: `
        Search through recent screen activity to find any payment-related information.
        Start with the last 10 minutes and expand if needed.
        Return short, focused snippets of any payment-like text you find.
      `,
      onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        const addStep = useAgentStepsStore.getState().addStep;
        const updateStepResult = useAgentStepsStore.getState().updateStepResult;

        toolCalls?.forEach((toolCall, index) => {
          const stepId = crypto.randomUUID();
          const humanAction = getHumanActionFromToolCall(toolCall);

          addStep(recognizedItemId, {
            text,
            toolCalls: [toolCall],
            toolResults: toolResults ? [toolResults[index]] : undefined,
            finishReason,
            usage,
            humanAction,
            tokenCount: usage?.totalTokens || 0,
          });

          if (toolResults?.[index]) {
            const humanResult = getHumanResultFromToolCall(
              toolCall,
              toolResults[index]
            );
            updateStepResult(recognizedItemId, stepId, humanResult);
          }

          if (onProgress) {
            const toolName =
              'toolName' in toolCall ? toolCall.toolName : 'unknown';
            onProgress(`Using tool: ${toolName}`);
          }
        });
      },
    });

    // Find the final detectionAnswer call
    const finalToolCall = toolCalls.find(
      (t) => 'toolName' in t && t.toolName === 'detectionAnswer'
    );
    if (!finalToolCall) {
      return {
        detections: [],
        error: 'No payments detected by the agent',
      };
    }

    // Get the detection results
    const answer = finalToolCall.args as DetectionAnswer;

    return {
      detections: answer.detections,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        detections: [],
        error: 'Payment detection was cancelled',
      };
    }
    console.error('0xHypr', 'Error in payment detection:', error);
    return {
      detections: [],
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error in payment detection',
    };
  }
}

// Hook to manage payment detection
export function usePaymentDetector(recognizedItemId: string) {
  const [result, setResult] = useState<PaymentDetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastShownRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { settings } = useSettings();
  const addStep = useAgentStepsStore((state) => state.addStep);
  const updateStepResult = useAgentStepsStore(
    (state) => state.updateStepResult
  );

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
      toastShownRef.current = true;
      toast({
        title: 'Detection Aborted',
        description: 'Payment detection was cancelled.',
      });
    }
  }, []);

  const detectPayments = useCallback(async () => {
    try {
      setIsProcessing(true);
      setResult(null);
      toastShownRef.current = false;

      abortControllerRef.current = new AbortController();

      const result = await runPaymentDetector(
        recognizedItemId,
        settings?.openaiApiKey || '',
        addStep,
        updateStepResult,
        (message) => {
          if (!toastShownRef.current) {
            toast({
              title: 'Detection Progress',
              description: message,
            });
          }
        },
        abortControllerRef.current.signal
      );

      setResult(result);

      if (result.error && !toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Detection Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.detections.length === 0 && !toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'No Payments Found',
          description: 'No pending payments were detected in recent activity.',
        });
      } else if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Payments Detected',
          description: `Found ${result.detections.length} potential payment(s).`,
        });
      }

      return result;
    } catch (error) {
      console.error('0xHypr', 'Error detecting payments:', error);
      const errorResult = {
        detections: [],
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error detecting payments',
      };
      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: 'Error',
          description: errorResult.error,
          variant: 'destructive',
        });
      }
      setResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [recognizedItemId, settings?.openaiApiKey, addStep, updateStepResult]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    result,
    detectPayments,
    isProcessing,
    abort,
  };
}
