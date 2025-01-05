import { useCallback, useMemo } from 'react';
import { BusinessAgent } from '@/agents/business-agent';
import { create } from 'zustand';

interface BusinessAgentStore {
  hyperscrollDir: string | null;
  setHyperscrollDir: (dir: string) => void;
}

const useBusinessAgentStore = create<BusinessAgentStore>((set) => ({
  hyperscrollDir: null,
  setHyperscrollDir: (dir) => set({ hyperscrollDir: dir }),
}));

export function useBusinessAgent() {
  const { hyperscrollDir, setHyperscrollDir } = useBusinessAgentStore();

  const agent = useMemo(() => {
    if (!hyperscrollDir) return null;
    return new BusinessAgent(hyperscrollDir);
  }, [hyperscrollDir]);

  const initializeAgent = useCallback(async () => {
    try {
      // Create hyperscroll directory if it doesn't exist
      const dir = await window.api.ensureHyperscrollDir();
      setHyperscrollDir(dir);
    } catch (error) {
      console.error('0xHypr', 'Failed to initialize BusinessAgent:', error);
    }
  }, [setHyperscrollDir]);

  const storeInformation = useCallback(async (content: string, type: 'company' | 'client' | 'invoice' | 'project') => {
    if (!agent) {
      console.error('0xHypr', 'BusinessAgent not initialized');
      return null;
    }
    return agent.storeInformation(content, type);
  }, [agent]);

  const retrieveInformation = useCallback(async (query: string) => {
    if (!agent) {
      console.error('0xHypr', 'BusinessAgent not initialized');
      return null;
    }
    return agent.retrieveInformation(query);
  }, [agent]);

  return {
    agent,
    isInitialized: !!agent,
    initializeAgent,
    storeInformation,
    retrieveInformation,
  };
} 