import { z } from 'zod';
import { tool } from 'ai';
import { AgentType } from '@/agents/base-agent';

export interface ClassificationSerializerConfig {
  description?: string;
}

export function createClassificationSerializer(config?: ClassificationSerializerConfig) {
  return tool({
    description: config?.description || 'Serialize a classification result into a structured format',
    parameters: z.object({
      title: z.string(),
      type: z.enum(['task', 'event', 'invoice', 'goal', 'business']) as z.ZodType<AgentType>,
      vitalInformation: z.string(),
    }),
    execute: async ({ title, type, vitalInformation }) => {
      return {
        title,
        type,
        vitalInformation,
      };
    },
  });
}

// Export the default instance for backward compatibility
export const classificationSerializer = createClassificationSerializer();

// Example usage:
// const customSerializer = createClassificationSerializer({
//   description: 'Serialize invoice-specific classifications'
// }); 