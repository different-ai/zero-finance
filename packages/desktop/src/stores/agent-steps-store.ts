import { create } from 'zustand';
import { CoreToolCallUnion } from 'ai';

export interface AgentStep {
  id: string;
  timestamp: number;
  text?: string;
  toolCalls?: CoreToolCallUnion[];
  toolResults?: unknown[];
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface AgentStepsState {
  // Map of recognizedItemId to array of steps
  steps: Record<string, AgentStep[]>;
  // Actions
  addStep: (recognizedItemId: string, step: Omit<AgentStep, 'id' | 'timestamp'>) => void;
  clearSteps: (recognizedItemId: string) => void;
  clearAllSteps: () => void;
}

export const useAgentStepsStore = create<AgentStepsState>((set) => ({
  steps: {},

  addStep: (recognizedItemId, step) =>
    set((state) => {
      const currentSteps = state.steps[recognizedItemId] || [];
      const newStep: AgentStep = {
        ...step,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      console.log('0xHypr', 'Adding agent step:', {
        recognizedItemId,
        step: newStep,
      });

      return {
        steps: {
          ...state.steps,
          [recognizedItemId]: [...currentSteps, newStep],
        },
      };
    }),

  clearSteps: (recognizedItemId) =>
    set((state) => ({
      steps: {
        ...state.steps,
        [recognizedItemId]: [],
      },
    })),

  clearAllSteps: () =>
    set({
      steps: {},
    }),
})); 