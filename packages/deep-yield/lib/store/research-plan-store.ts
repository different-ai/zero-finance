import { create } from 'zustand';
import { ResearchPlan } from '@/lib/ai/tools/plan-yield-research';

interface ResearchPlanState {
  plan: ResearchPlan | null;
  isActive: boolean;
  isVisible: boolean;
  
  // Actions
  setPlan: (plan: ResearchPlan) => void;
  clearPlan: () => void;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
}

const defaultPlan: ResearchPlan = {
  title: '',
  description: '',
  steps: [],
  status: 'planning',
  context: {},
};

export const useResearchPlanStore = create<ResearchPlanState>((set) => ({
  plan: null,
  isActive: false,
  isVisible: true,
  
  setPlan: (plan) => set(() => ({ 
    plan,
    isActive: true,
    isVisible: true,
  })),
  
  clearPlan: () => set(() => ({ 
    plan: null,
    isActive: false,
  })),
  
  toggleVisibility: () => set((state) => ({ 
    isVisible: !state.isVisible,
  })),
  
  setVisibility: (visible) => set(() => ({ 
    isVisible: visible,
  })),
})); 