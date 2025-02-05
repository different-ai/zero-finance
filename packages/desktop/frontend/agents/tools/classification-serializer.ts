import { z } from 'zod';
import { tool } from 'ai';
import { AgentType } from '@/agents/base-agent';

// Define the schema for classification results
export const classificationSchema = z.object({
  title: z.string(),
  type: z.enum(['task', 'event', 'invoice', 'goal', 'business']) as z.ZodType<AgentType>,
  vitalInformation: z.string(),
  confidence: z.number(),
  date: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  amount: z.string().nullable().optional(),
  source: z.object({
    text: z.string(),
    timestamp: z.string().optional(),
    context: z.string().optional(),
  }).optional(),
});

export type ClassificationResult = z.infer<typeof classificationSchema>;

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
    parameters: classificationSchema,
    async execute(params) {
      // 1) skip if confidence is below threshold
      if (params.confidence < minConfidence) {
        console.log(
          '0xHypr',
          'classificationSerializer => skipping, confidence too low',
          { confidence: params.confidence, title: params.title }
        );
        return null;
      }

      // 2) validate and return the result
      const result = classificationSchema.parse(params);
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