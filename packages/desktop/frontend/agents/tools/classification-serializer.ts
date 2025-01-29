import { z } from 'zod';
import { tool } from 'ai';
import { AgentType } from '@/agents/base-agent';

/**
 * final structured result from the LLM
 */
export interface ClassificationResult {
  title: string;
  type: AgentType; // 'invoice' | 'task' | 'event' | etc
  vitalInformation: string;
  confidence: number;
  // Add required fields
  date?: string | null;
  time?: string | null;
  amount?: string | null;
  source?: {
    text: string;
    timestamp?: string;
    context?: string;
  };
}

export interface ClassificationSerializerConfig {
  description?: string;
  minConfidence?: number;
}

/**
 * createClassificationSerializer
 * 
 * keeps logic minimal—no pattern matching. 
 * relies on the LLM to do the heavy lifting of deciding if it's "actionable."
 */
export function createClassificationSerializer(config?: ClassificationSerializerConfig) {
  const minConfidence = config?.minConfidence ?? 0.8;

  return tool({
    description: `
A minimal classification serializer that trusts the LLM to decide what's actionable. 
We only enforce 'confidence > ${minConfidence}'. 
If confidence < ${minConfidence}, return null. 
Else, return the classification object exactly as provided (plus optional date/time/amount).
`,
    parameters: z.object({
      title: z.string(),
      type: z.enum(['task', 'event', 'invoice', 'goal', 'business']) as z.ZodType<AgentType>,
      vitalInformation: z.string(),
      confidence: z.number(),
      // optional structured fields
      date: z.string().optional(),
      time: z.string().optional(),
      amount: z.string().optional(),
      source: z.object({
        text: z.string(),
        timestamp: z.string().optional(),
        context: z.string().optional(),
      }).optional(),
    }),
    async execute({
      title,
      type,
      vitalInformation,
      confidence,
      date,
      time,
      amount,
      source,
    }) {
      // 1) skip if confidence is below threshold
      if (confidence < minConfidence) {
        console.log(
          '0xHypr',
          'classificationSerializer => skipping, confidence too low',
          { confidence, title }
        );
        return null;
      }

      // 2) if we trust the LLM to already filter out docs or partial references,
      // we do not do further local checks:
      const result: ClassificationResult = {
        title,
        type,
        vitalInformation,
        confidence,
        date,
        time,
        amount,
        source,
      };

      console.log('0xHypr', 'classificationSerializer => returning result', result);
      return result;
    },
  });
}

/**
 * default classification serializer with confidence = 0.8
 */
export const classificationSerializer = createClassificationSerializer({
  minConfidence: 0.8,
});