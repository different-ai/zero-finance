'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  resetDemo: () => void;
  demoBalance: number;
  setDemoBalance: (balance: number) => void;
  demoSavingsBalance: number;
  setDemoSavingsBalance: (balance: number) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(
  undefined,
);

const DEMO_MODE_KEY = 'zero-finance-demo-mode';
const DEMO_STEP_KEY = 'zero-finance-demo-step';

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(5); // Start at step 5 to show savings
  const [demoBalance, setDemoBalance] = useState(2500000); // $2.5M in checking
  const [demoSavingsBalance, setDemoSavingsBalance] = useState(2500000); // $2.5M in savings

  // Load demo mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    const storedStep = localStorage.getItem(DEMO_STEP_KEY);
    if (stored === 'true') {
      setIsDemoMode(true);
      // Always show full demo data
      setDemoStep(5); // Step 5 shows savings
      setDemoBalance(2500000); // $2.5M in checking
      setDemoSavingsBalance(2500000); // $2.5M in savings
    }
  }, []);

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    localStorage.setItem(DEMO_MODE_KEY, enabled ? 'true' : 'false');
    if (enabled) {
      // Set demo balances when enabling demo mode
      setDemoStep(5);
      setDemoBalance(2500000);
      setDemoSavingsBalance(2500000);
      localStorage.setItem(DEMO_STEP_KEY, '5');
    } else {
      // Reset demo state when disabling
      setDemoStep(0);
      setDemoBalance(0);
      setDemoSavingsBalance(0);
      localStorage.removeItem(DEMO_STEP_KEY);
    }
  };

  const updateDemoStep = (step: number) => {
    setDemoStep(step);
    localStorage.setItem(DEMO_STEP_KEY, step.toString());

    // Always show full demo balances
    if (step >= 3) {
      setDemoBalance(2500000); // $2.5M in checking
    }
    if (step >= 5) {
      setDemoSavingsBalance(2500000); // $2.5M in savings
    }
  };

  const toggleDemoMode = () => {
    setDemoMode(!isDemoMode);
  };

  const nextDemoStep = () => {
    if (demoStep < 7) {
      updateDemoStep(demoStep + 1);
    }
  };

  const prevDemoStep = () => {
    if (demoStep > 0) {
      updateDemoStep(demoStep - 1);
    }
  };

  const resetDemo = () => {
    updateDemoStep(0);
    setDemoBalance(0);
    setDemoSavingsBalance(0);
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        toggleDemoMode,
        demoStep,
        setDemoStep: updateDemoStep,
        nextDemoStep,
        prevDemoStep,
        resetDemo,
        demoBalance,
        setDemoBalance,
        demoSavingsBalance,
        setDemoSavingsBalance,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}

// Helper hook for components to check if they should show demo data
export function useDemoData<T>(realData: T, demoData: T): T {
  const { isDemoMode } = useDemoMode();
  return isDemoMode ? demoData : realData;
}
