import { z } from 'zod';
import { tool } from 'ai';

// Define the schema for planning context and results
export const planningContextSchema = z.object({
  type: z.enum(['search', 'classification']),
  query: z.string().optional(),
  timeframe: z.string(),
});

export const planningResultSchema = z.object({
  steps: z.array(z.string()),
  rationale: z.string().optional(),
  timestamp: z.string(),
  context: planningContextSchema,
});

export type PlanningContext = z.infer<typeof planningContextSchema>;
export type PlanningResult = z.infer<typeof planningResultSchema>;

/**
 * A tool for generating a structured plan before taking other actions.
 * Used to outline the approach for classification and other multi-step processes.
 * Can be used for both targeted searches and general classification.
 */
export const planningTool = tool({
  description: `
Create or refine a step-by-step plan before taking other actions.
Use this to outline your approach in a structured way.
The plan should adapt based on whether we're doing a targeted search or general classification.
For searches, focus steps on finding content matching the search query.
For general classification, focus on broad content analysis.
`,
  parameters: z.object({
    steps: z.array(z.string()).describe('List of step descriptions in the plan'),
    rationale: z.string().optional().describe('Short explanation for why this plan makes sense'),
    context: planningContextSchema.describe('Context about what kind of planning we are doing'),
  }),
  async execute(params) {
    console.log('0xHypr', 'planningTool', params);
    
    const result = planningResultSchema.parse({
      steps: params.steps,
      rationale: params.rationale,
      timestamp: new Date().toISOString(),
      context: params.context,
    });

    return result;
  },
}); 