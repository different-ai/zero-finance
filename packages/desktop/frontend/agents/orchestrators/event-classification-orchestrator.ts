import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { planningWorker } from '../workers/planning-worker';
import { searchWorker } from '../workers/search-worker';
import { classificationWorker } from '../workers/classification-worker';
import { useAgentStepsStore } from '@/stores/agent-steps-store';

// Types for orchestration
export const orchestrationPlanSchema = z.object({
  type: z.enum(['search', 'classification']),
  query: z.string().optional(),
  timeframe: z.string(),
  steps: z.array(
    z.object({
      type: z.enum(['planning', 'search', 'classification']),
      purpose: z.string(),
      context: z.record(z.any()).optional(),
    })
  ),
  estimatedComplexity: z.enum(['low', 'medium', 'high']),
});

export type OrchestrationPlan = z.infer<typeof orchestrationPlanSchema>;

export async function orchestrateClassification(
  searchQuery?: string,
  systemInstructions?: string,
  apiKey?: string,
  classificationId?: string
) {
  if (!apiKey) {
    throw new Error('API key is required for classification');
  }

  if (!classificationId) {
    throw new Error('Classification ID is required for tracking steps');
  }

  console.log('0xHypr', 'orchestrateClassification', { searchQuery });
  
  const openai = createOpenAI({ apiKey });
  const addStep = useAgentStepsStore.getState().addStep;

  // Add initial orchestration step
  addStep(classificationId, {
    humanAction: 'Starting classification orchestration',
    text: 'Planning the classification process...',
    finishReason: 'complete',
  });

  // 1. Generate orchestration plan
  const { object: plan } = await generateObject({
    model: openai('o3-mini'),
    schema: orchestrationPlanSchema,
    system: 'You are a senior orchestrator planning the classification process.',
    prompt: `Create a plan for ${searchQuery ? 'searching and ' : ''}classifying content.
    ${systemInstructions || ''}
    Consider the search query: ${searchQuery || 'N/A'}`,
  });

  console.log('0xHypr', 'orchestrateClassification', { plan });
  // Add plan step
  addStep(classificationId, {
    humanAction: 'Generated classification plan',
    text: `Plan complexity: ${plan.estimatedComplexity}\nSteps: ${plan.steps.map(s => s.purpose).join(' → ')}`,
    finishReason: 'complete',
  });

  // 2. Execute each step with specialized workers
  const results = [];
  for (const step of plan.steps) {
    let result;
    switch (step.type) {
      case 'planning':
        result = await planningWorker.execute({
          context: {
            type: plan.type,
            query: plan.query,
            timeframe: plan.timeframe,
          },
          purpose: step.purpose,
          apiKey,
          classificationId,
        });
        break;

      case 'search':
        result = await searchWorker.execute({
          query: plan.query,
          timeframe: plan.timeframe,
          purpose: step.purpose,
          context: step.context,
          apiKey,
          classificationId,
        });
        break;

      case 'classification':
        result = await classificationWorker.execute({
          searchResults: results[results.length - 1], // Use previous step's results
          purpose: step.purpose,
          context: {
            type: plan.type,
            query: plan.query,
            timeframe: plan.timeframe,
          },
          apiKey,
          classificationId,
        });
        break;
    }
    results.push(result);
  }

  // Add completion step
  addStep(classificationId, {
    humanAction: 'Classification process completed',
    text: `Processed ${plan.steps.length} steps successfully`,
    finishReason: 'complete',
  });

  return {
    plan,
    results,
  };
}
