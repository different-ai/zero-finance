import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { screenpipeSearch } from './tools/screenpipe-search';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { toast } from '@/components/ui/use-toast';
import { useCallback, useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import type { PaymentInfo } from '@/types/wise';
import type { Settings } from '@/types/settings';
import { getScreenpipeSettings } from '../../lib/screenpipe';
import { useSettings } from '@/hooks/use-settings';

// Zod schemas
const detectionSnippetSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
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
  amount: z.string().describe('The payment amount'),
  currency: z.string().describe('The payment currency'),
  description: z.string().describe('A description of the payment'),
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
  settings: Settings,
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
    console.log('settings', settings);
    const openai = createOpenAI({
      apiKey: settings.openaiApiKey,
    });

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
      Time (UTC): ${new Date().toISOString()}

You are a specialized Payment Detection Agent. Your objective is to identify potential payment-related information from recent screen logs and captures provided by ScreenPipe. The system will supply you with data within a specific time window (startDate to endDate). Always prioritize the most recent data first.

IMPORTANT GUIDELINES:
• Only detect and extract minimal text snippets (about 100–200 characters)—enough to locate the payment mention.  
• Do NOT extract full payment details (e.g., full IBAN or account number).  
• Each mention should be kept in its own snippet (one snippet per potential payment).  
• Provide each snippet with a label (e.g., "Invoice from X"), a confidence score (0–100), a timestamp, and source metadata if available (app/window).  
• Do not merge multiple mentions into a single snippet.  
• Keep the content concise, focusing on likely payment keywords and short textual context.  

KEYWORDS & INDICATORS:
• Invoice, Amount Due, Due Date, Payable, Outstanding Balance  
• Bank Transfer Details: IBAN, SWIFT, Routing Number, Account Number, Bank Transfer, Wire Transfer, ACH, Sort Code  

SEARCH & DETECTION STRATEGY:
1. Begin with the most recent screen activity (e.g., the past 10 minutes).
2. If no relevant payment text is found, progressively expand the time window (30min → 1h → 2h, etc.).
3. Use single-word or concise queries to pinpoint likely mentions quickly.
4. If relevant text is found, refine your search around that text for similar mentions.  
5. Maintain accuracy over speed, returning only truly payment-like references.  

Your final output must follow the \`detectionAnswer\` tool schema:

Stay mindful of the time constraints (startDate → endDate) and favor data that is most recent. Do not provide more context than necessary—your job is to detect *possible* payment mentions, not to fully parse or expose them.
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
      if (!settings) {
        throw new Error('Settings not available');
      }

      setIsProcessing(true);
      setResult(null);
      toastShownRef.current = false;

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const result = await runPaymentDetector(
        recognizedItemId,
        settings,
        addStep,
        updateStepResult,
        (message) => {
          if (!toastShownRef.current) {
            toast({
              title: 'Detecting Payments',
              description: message,
            });
            toastShownRef.current = true;
          }
        },
        abortControllerRef.current.signal
      );

      setResult(result);

      if (result.error) {
        toast({
          title: 'Detection Error',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.detections.length === 0) {
        toast({
          title: 'No Payments Found',
          description: 'No payment-like content was detected.',
        });
      } else {
        toast({
          title: 'Payments Detected',
          description: `Found ${result.detections.length} potential payment(s).`,
        });
      }
    } catch (error) {
      console.error('0xHypr', 'Error in payment detection:', error);
      toast({
        title: 'Detection Error',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred during payment detection.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [recognizedItemId, settings, addStep, updateStepResult]);

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
