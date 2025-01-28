import { z } from 'zod';
import { tool } from 'ai';

export interface PlanningResult {
  steps: string[];
  rationale?: string;
  timestamp: string;
}

/**
 * A tool for generating a structured plan before taking other actions.
 * Used to outline the approach for classification and other multi-step processes.
 */
export const planningTool = tool({
  description: `
Create or refine a step-by-step plan before taking other actions.
Use this to outline your approach in a structured way.
The plan should focus on classification-related steps and be concise but clear.
`,
  parameters: z.object({
    steps: z.array(z.string()).describe('List of step descriptions in the plan'),
    rationale: z.string().optional().describe('Short explanation for why this plan makes sense'),
  }),
  async execute({ steps, rationale }): Promise<PlanningResult> {
    console.log('0xHypr', 'planningTool', { steps, rationale });
    
    return {
      steps,
      rationale,
      timestamp: new Date().toISOString(),
    };
  },
}); 