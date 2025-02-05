import { openai, createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { AgentType } from '@/agents/base-agent';
import type { SearchResult } from './search-worker';
import { useAgentStepsStore } from '@/stores/agent-steps-store';

// Classification worker schemas
export const classificationInputSchema = z.object({
  searchResults: z.any(), // Type from search worker
  purpose: z.string(),
  context: z.object({
    type: z.enum(['search', 'classification']),
    query: z.string().optional(),
    timeframe: z.string(),
  }),
  apiKey: z.string(),
  classificationId: z.string(),
});

export const classificationItemSchema = z.object({
  title: z.string(),
  type: z.enum(['task', 'event', 'invoice', 'goal', 'business']) as z.ZodType<AgentType>,
  vitalInformation: z.string(),
  confidence: z.number(),
  date: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  amount: z.string().nullable().optional(),
  source: z.object({
    text: z.string(),
    timestamp: z.string(),
    context: z.string().optional(),
  }),
});

export const classificationResultSchema = z.object({
  items: z.array(classificationItemSchema),
  summary: z.string(),
  confidence: z.number(),
  metadata: z.record(z.any()).optional(),
});

export type ClassificationInput = z.infer<typeof classificationInputSchema>;
export type ClassificationResult = z.infer<typeof classificationResultSchema>;
export type ClassificationItem = z.infer<typeof classificationItemSchema>;

// Schema for step descriptions
const stepDescriptionSchema = z.object({
  humanAction: z.string(),
  text: z.string(),
});

class ClassificationWorker {
  async execute(input: ClassificationInput): Promise<ClassificationResult> {
    console.log('0xHypr', 'classificationWorker.execute', input);

    const openai = createOpenAI({ apiKey: input.apiKey });
    const addStep = useAgentStepsStore.getState().addStep;

    // Generate start step description
    const { object: startStep } = await generateObject({
      model: openai('o3-mini'),
      schema: stepDescriptionSchema,
      system: 'You are an expert at describing classification activities in clear, human-readable terms.',
      prompt: `Create a human-readable description for starting the classification phase.
      Context:
      - Purpose: ${input.purpose}
      - Type: ${input.context.type}
      - Query: ${input.context.query || 'N/A'}
      - Search Results: ${JSON.stringify(input.searchResults).length} bytes
      
      Return a natural description of what we're about to do.`
    });

    addStep(input.classificationId, {
      humanAction: startStep.humanAction,
      text: startStep.text,
      finishReason: 'complete',
    });

    // 1. Generate classification strategy
    const { object: strategy } = await generateObject({
      model: openai('o3-mini'),
      schema: z.object({
        focusAreas: z.array(z.string()),
        requiredConfidence: z.number(),
        specialConsiderations: z.array(z.string()),
      }),
      system: 'You are an expert at content classification and pattern recognition.',
      prompt: `Create a classification strategy for: ${input.purpose}
      
      Context:
      - Type: ${input.context.type}
      - Query: ${input.context.query || 'N/A'}
      - Timeframe: ${input.context.timeframe}`
    });

    // Generate strategy step description
    const { object: strategyStep } = await generateObject({
      model: openai('o3-mini'),
      schema: stepDescriptionSchema,
      system: 'You are an expert at describing classification strategies in clear, human-readable terms.',
      prompt: `Create a human-readable description of our classification strategy.
      Context:
      - Focus Areas: ${strategy.focusAreas.join(', ')}
      - Required Confidence: ${strategy.requiredConfidence}
      - Special Considerations: ${strategy.specialConsiderations.length}
      - Purpose: ${input.purpose}
      
      Return a natural description of our classification approach.`
    });

    addStep(input.classificationId, {
      humanAction: strategyStep.humanAction,
      text: strategyStep.text,
      finishReason: 'complete',
    });

    // Generate analysis start step description
    const { object: analysisStartStep } = await generateObject({
      model: openai('o3-mini'),
      schema: stepDescriptionSchema,
      system: 'You are an expert at describing content analysis in clear, human-readable terms.',
      prompt: `Create a human-readable description for starting the content analysis.
      Context:
      - Focus Areas: ${strategy.focusAreas.join(', ')}
      - Purpose: ${input.purpose}
      - Search Results Size: ${JSON.stringify(input.searchResults).length} bytes
      
      Return a natural description of what we're about to analyze.`
    });

    addStep(input.classificationId, {
      humanAction: analysisStartStep.humanAction,
      text: analysisStartStep.text,
      finishReason: 'complete',
    });

    // 2. Analyze and classify content
    const { object: classification } = await generateObject({
      model: openai('o3-mini'),
      schema: classificationResultSchema,
      system: `You are an expert classifier with these focus areas:
      ${strategy.focusAreas.join('\n')}
      
      Special considerations:
      ${strategy.specialConsiderations.join('\n')}
      
      Required confidence: ${strategy.requiredConfidence}`,
      prompt: `Classify this content for: ${input.purpose}
      
      Search results:
      ${JSON.stringify(input.searchResults, null, 2)}
      
      Create detailed classifications with high confidence scores.`
    });

    // Generate completion step description
    const { object: completionStep } = await generateObject({
      model: openai('o3-mini'),
      schema: stepDescriptionSchema,
      system: 'You are an expert at describing classification outcomes in clear, human-readable terms.',
      prompt: `Create a human-readable description of our completed classification phase.
      Context:
      - Items Classified: ${classification.items.length}
      - Overall Confidence: ${classification.confidence}
      - Summary: ${classification.summary}
      - Purpose: ${input.purpose}
      
      Return a natural summary of what we accomplished.`
    });

    addStep(input.classificationId, {
      humanAction: completionStep.humanAction,
      text: completionStep.text,
      finishReason: 'complete',
    });

    return classification;
  }
}

export const classificationWorker = new ClassificationWorker(); 