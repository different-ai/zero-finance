import { openai, createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { useAgentStepsStore } from '@/stores/agent-steps-store';

// Planning worker schemas
export const planningInputSchema = z.object({
  context: z.object({
    type: z.enum(['search', 'classification']),
    query: z.string().optional(),
    timeframe: z.string(),
  }),
  purpose: z.string(),
  apiKey: z.string(),
  classificationId: z.string(),
});

export const planningResultSchema = z.object({
  steps: z.array(z.string()),
  rationale: z.string(),
  estimatedTimeSeconds: z.number(),
  recommendations: z.array(z.string()),
});

export type PlanningInput = z.infer<typeof planningInputSchema>;
export type PlanningResult = z.infer<typeof planningResultSchema>;

// Schema for step descriptions
const stepDescriptionSchema = z.object({
  humanAction: z.string(),
  text: z.string(),
});

class PlanningWorker {
  async execute(input: PlanningInput): Promise<PlanningResult> {
    console.log('0xHypr', 'planningWorker.execute', input);

    const openai = createOpenAI({ apiKey: input.apiKey });
    const addStep = useAgentStepsStore.getState().addStep;

    // Generate start step description
    const { object: startStep } = await generateObject({
      model: openai('o3-mini'),
      schema: stepDescriptionSchema,
      system: 'You are an expert at describing planning activities in clear, human-readable terms.',
      prompt: `Create a human-readable description for starting the planning phase.
      Context:
      - Purpose: ${input.purpose}
      - Type: ${input.context.type}
      - Query: ${input.context.query || 'N/A'}
      
      Return a natural description of what we're about to do.`
    });

    addStep(input.classificationId, {
      humanAction: startStep.humanAction,
      text: startStep.text,
      finishReason: 'complete',
    });

    const { object: plan } = await generateObject({
      model: openai('o3-mini'),
      schema: planningResultSchema,
      system: 'You are an expert planner specializing in content classification strategies.',
      prompt: `Create a detailed plan for: ${input.purpose}
      
      Context:
      - Type: ${input.context.type}
      - Query: ${input.context.query || 'N/A'}
      - Timeframe: ${input.context.timeframe}
      
      Focus on creating an efficient and thorough plan that maximizes accuracy.`
    });

    // Generate completion step description
    const { object: completionStep } = await generateObject({
      model: openai('o3-mini'),
      schema: stepDescriptionSchema,
      system: 'You are an expert at describing planning outcomes in clear, human-readable terms.',
      prompt: `Create a human-readable description of the completed planning phase.
      Context:
      - Steps created: ${plan.steps.length}
      - Rationale: ${plan.rationale}
      - Estimated time: ${plan.estimatedTimeSeconds}s
      - Recommendations: ${plan.recommendations.join(', ')}
      
      Return a natural summary of what was accomplished.`
    });

    addStep(input.classificationId, {
      humanAction: completionStep.humanAction,
      text: completionStep.text,
      finishReason: 'complete',
    });

    return plan;
  }
}

export const planningWorker = new PlanningWorker(); 