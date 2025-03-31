import { tool } from 'ai';
import { z } from 'zod';

export interface Step {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: string;
  dependsOn?: string[];
}

export interface ResearchPlan {
  title: string;
  description: string;
  steps: Step[];
  status: 'planning' | 'in-progress' | 'completed' | 'failed';
  context: {
    inputAmount?: number;
    inputToken?: string;
    targetChain?: string;
    riskPreference?: string;
    timeHorizon?: string;
    additionalFilters?: string[];
    [key: string]: any;
  };
}

// State management - use a more robust approach for production
// For real applications, consider using a database or Redis
export class PlanStateManager {
  private static instance: PlanStateManager;
  private plans: Map<string, ResearchPlan> = new Map();
  private currentPlanId: string | null = null;
  
  private constructor() {}
  
  public static getInstance(): PlanStateManager {
    if (!PlanStateManager.instance) {
      PlanStateManager.instance = new PlanStateManager();
    }
    return PlanStateManager.instance;
  }
  
  createPlan(plan: ResearchPlan): string {
    const planId = `plan_${Date.now()}`;
    this.plans.set(planId, plan);
    this.currentPlanId = planId;
    return planId;
  }
  
  getCurrentPlan(): ResearchPlan | null {
    if (!this.currentPlanId) return null;
    return this.plans.get(this.currentPlanId) || null;
  }
  
  getPlanById(planId: string): ResearchPlan | null {
    return this.plans.get(planId) || null;
  }
  
  updatePlan(updatedPlan: Partial<ResearchPlan>): boolean {
    if (!this.currentPlanId) return false;
    
    const currentPlan = this.plans.get(this.currentPlanId);
    if (!currentPlan) return false;
    
    this.plans.set(this.currentPlanId, {
      ...currentPlan,
      ...updatedPlan,
      steps: updatedPlan.steps || currentPlan.steps,
      context: {
        ...currentPlan.context,
        ...(updatedPlan.context || {})
      }
    });
    
    return true;
  }
  
  updateStep(stepId: string, status?: Step['status'], result?: string): boolean {
    if (!this.currentPlanId) return false;
    
    const currentPlan = this.plans.get(this.currentPlanId);
    if (!currentPlan) return false;
    
    const stepIndex = currentPlan.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return false;
    
    const updatedSteps = [...currentPlan.steps];
    
    if (status) {
      updatedSteps[stepIndex].status = status;
    }
    
    if (result !== undefined) {
      updatedSteps[stepIndex].result = result;
    }
    
    this.plans.set(this.currentPlanId, {
      ...currentPlan,
      steps: updatedSteps
    });
    
    return true;
  }
  
  resetState() {
    this.currentPlanId = null;
    // Optionally clear the map if you want to wipe all history for the instance
    // this.plans.clear(); 
    console.log("Plan state reset.");
  }
}

export const planYieldResearch = tool({
  description: `Plan and track a yield research process. Use this tool to create, update, or retrieve a structured research plan for finding yield opportunities. This tool should be used first when researching yield opportunities to create a clear sequence of steps.`,
  parameters: z.object({
    action: z.enum(['create', 'update', 'get']).describe("The action to perform on the research plan."),
    title: z.string().nullable().describe("Title for the research plan (only for 'create')."),
    description: z.string().nullable().describe("Description of the research plan (only for 'create')."),
    inputAmount: z.number().nullable().describe("The amount of tokens the user wants to invest (only for 'create')."),
    inputToken: z.string().nullable().describe("The token symbol the user wants to invest (only for 'create')."),
    targetChain: z.string().nullable().describe("The blockchain where the user wants to find yield (only for 'create')."),
    riskPreference: z.string().nullable().describe("User's risk preference (e.g., 'low', 'medium', 'high') (only for 'create')."),
    steps: z.array(
      z.object({
        id: z.string(),
        description: z.string(),
        dependsOn: z.array(z.string()).nullable()
      })
    ).nullable().describe("Array of steps for the research plan (only for 'create')."),
    stepId: z.string().nullable().describe("ID of the step to update (only for 'update')."),
    stepStatus: z.enum(['pending', 'in-progress', 'completed', 'failed']).nullable().describe("New status for the step (only for 'update')."),
    stepResult: z.string().nullable().describe("Result of the completed step (only for 'update')."),
    planStatus: z.enum(['planning', 'in-progress', 'completed', 'failed']).nullable().describe("New status for the entire plan (only for 'update')."),
    additionalContext: z.record(z.string(), z.string()).nullable().describe("Any additional context to add to the plan (only for 'update')."),
  }),
  execute: async ({ 
    action, 
    title, 
    description, 
    inputAmount, 
    inputToken, 
    targetChain,
    riskPreference,
    steps,
    stepId,
    stepStatus,
    stepResult,
    planStatus,
    additionalContext,
  }) => {
    console.log(`Executing planYieldResearch with action: ${action}`);
    
    const stateManager = PlanStateManager.getInstance();
    
    // CREATE a new research plan
    if (action === 'create') {
      if (!title || !description || !steps || steps.length === 0) {
        return {
          success: false,
          message: "Cannot create plan: Missing required fields (title, description, steps)"
        };
      }
      
      const newPlan: ResearchPlan = {
        title,
        description,
        steps: steps.map(step => ({
          ...step,
          dependsOn: step.dependsOn || [],
          status: 'pending'
        })),
        status: 'planning',
        context: {
          inputAmount: inputAmount ?? undefined,
          inputToken: inputToken ?? undefined,
          targetChain: targetChain ?? undefined,
          riskPreference: riskPreference ?? undefined,
          createdAt: new Date().toISOString()
        }
      };
      
      stateManager.createPlan(newPlan);
      
      return {
        success: true,
        plan: newPlan,
        message: `Created research plan: "${title}" with ${steps.length} steps.`
      };
    }
    
    // UPDATE an existing plan or step
    else if (action === 'update') {
      const currentPlan = stateManager.getCurrentPlan();
      
      if (!currentPlan || !currentPlan.title) {
        return {
          success: false,
          message: "Cannot update: No research plan exists. Create one first."
        };
      }
      
      // Update a specific step
      if (stepId) {
        const success = stateManager.updateStep(stepId, stepStatus ?? undefined, stepResult ?? undefined);
        
        if (!success) {
          return {
            success: false,
            message: `Cannot update: Step with ID "${stepId}" not found.`
          };
        }
      }
      
      // Update plan status or context
      if (planStatus || additionalContext) {
        stateManager.updatePlan({
          status: planStatus ?? undefined,
          context: additionalContext ?? undefined
        });
      }
      
      const updatedPlan = stateManager.getCurrentPlan();
      
      return {
        success: true,
        plan: updatedPlan,
        message: `Updated research plan: "${updatedPlan?.title}"`
      };
    }
    
    // GET the current plan
    else if (action === 'get') {
      const currentPlan = stateManager.getCurrentPlan();
      
      if (!currentPlan || !currentPlan.title) {
        return {
          success: false,
          message: "No research plan exists. Create one first."
        };
      }
      
      return {
        success: true,
        plan: currentPlan,
        message: `Retrieved research plan: "${currentPlan.title}"`
      };
    }
    
    return {
      success: false,
      message: `Invalid action: ${action}`
    };
  },
}); 