import { z } from 'zod';
import { tool } from 'ai';
import { AgentType } from '@/agents/base-agent';

export interface ClassificationResult {
  title: string;
  type: AgentType;
  vitalInformation: string;
  confidence: number;
  source?: {
    text: string;
    timestamp: string;
    context?: string;
  };
}

export interface ClassificationSerializerConfig {
  description?: string;
  minConfidence?: number;
}

export function createClassificationSerializer(config?: ClassificationSerializerConfig) {
  const minConfidence = config?.minConfidence || 0.8;

  return tool({
    description: `
Serialize a classification result into a structured format. Only classify if highly confident (>0.8).
The item MUST be actionable - requiring specific user attention or action.

REQUIREMENTS:
1. Must have clear action items (due dates, amounts, requests)
2. Must be a real event/task (not documentation or discussion)
3. Confidence must be >0.8 for actionable items

Example of GOOD classification:
{
  "title": "Invoice #123 from Acme Corp - Due Mar 31",
  "type": "invoice",
  "vitalInformation": "Amount: $1,500 due by March 31, 2024. Reference: INV-123. Urgent payment requested.",
  "confidence": 0.85,
  "source": {
    "text": "Original matched text showing payment request",
    "timestamp": "2024-03-15T12:00:00Z",
    "context": "Email from accounting@acme.com"
  }
}

Example of what NOT to classify:
- Documentation about invoices
- General discussions about tasks
- Partial or ambiguous matches
- Historical references

If not highly confident or not actionable, return null. Quality over quantity.`,
    parameters: z.object({
      title: z.string().min(1, "Title must not be empty"),
      type: z.enum(['task', 'event', 'invoice', 'goal', 'business']) as z.ZodType<AgentType>,
      vitalInformation: z.string().min(1, "Vital information must not be empty"),
      confidence: z.number().min(0).max(1).default(0.8),
      source: z.object({
        text: z.string(),
        timestamp: z.string(),
        context: z.string().optional()
      }).optional()
    }),
    execute: async ({ title, type, vitalInformation, confidence, source }) => {
      // Early return if confidence is too low
      if (confidence < minConfidence) {
        console.log("0xHypr", "Classification skipped due to low confidence", { confidence, title });
        return null;
      }

      // Early return if vital information doesn't seem actionable
      const hasActionableContent = 
        /\d/.test(vitalInformation) || // Has numbers (dates, amounts)
        /due|by|please|action|required|urgent/i.test(vitalInformation); // Has action words

      if (!hasActionableContent) {
        console.log("0xHypr", "Classification skipped - not actionable enough", { vitalInformation });
        return null;
      }

      const result: ClassificationResult = {
        title,
        type,
        vitalInformation,
        confidence,
        source
      };

      console.log("0xHypr", "Classification created", result);
      return result;
    },
  });
}

// Export the default instance with higher confidence threshold
export const classificationSerializer = createClassificationSerializer({
  minConfidence: 0.8
});

// Example usage:
// const customSerializer = createClassificationSerializer({
//   description: 'Serialize invoice-specific classifications'
// }); 