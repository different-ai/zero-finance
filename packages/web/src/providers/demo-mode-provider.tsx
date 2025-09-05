'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

// Demo steps that map to your actual app flow
type DemoStep =
  | 'intro'
  | 'signup'
  | 'empty-dashboard'
  | 'deposit-instructions'
  | 'processing-deposit'
  | 'funded-dashboard'
  | 'savings-page'
  | 'activate-savings'
  | 'savings-active'
  | 'withdrawal'
  | 'summary';

interface DemoTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  description: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending';
  category?: string;
  merchant?: string;
}

interface DemoModeContextType {
  isDemo: boolean;
  currentStep: DemoStep;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: DemoStep) => void;
  resetDemo: () => void;

  // Demo data that overrides real data
  demoBalance: number;
  demoTransactions: DemoTransaction[];
  demoSavingsBalance: number;
  demoSavingsEnabled: boolean;
  demoYieldEarned: number;

  // Control functions
  simulateDeposit: () => void;
  enableSavings: () => void;
  simulateYieldAccrual: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(
  undefined,
);

const DEMO_STEPS: DemoStep[] = [
  'intro',
  'signup',
  'empty-dashboard',
  'deposit-instructions',
  'processing-deposit',
  'funded-dashboard',
  'savings-page',
  'activate-savings',
  'savings-active',
  'withdrawal',
  'summary',
];

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState<DemoStep>('intro');
  const [demoBalance, setDemoBalance] = useState(0);
  const [demoSavingsBalance, setDemoSavingsBalance] = useState(0);
  const [demoSavingsEnabled, setDemoSavingsEnabled] = useState(false);
  const [demoYieldEarned, setDemoYieldEarned] = useState(0);
  const [demoTransactions, setDemoTransactions] = useState<DemoTransaction[]>(
    [],
  );

  // Check if we're in demo mode from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const demoParam = urlParams.get('demo');
      setIsDemo(demoParam === 'true');
    }
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = DEMO_STEPS.indexOf(currentStep);
    if (currentIndex < DEMO_STEPS.length - 1) {
      setCurrentStep(DEMO_STEPS[currentIndex + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = DEMO_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(DEMO_STEPS[currentIndex - 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: DemoStep) => {
    setCurrentStep(step);
  }, []);

  const resetDemo = useCallback(() => {
    setCurrentStep('intro');
    setDemoBalance(0);
    setDemoSavingsBalance(0);
    setDemoSavingsEnabled(false);
    setDemoYieldEarned(0);
    setDemoTransactions([]);
  }, []);

  const simulateDeposit = useCallback(() => {
    setDemoBalance(2500000); // $2.5M

    // Add demo transactions
    const newTransactions: DemoTransaction[] = [
      {
        id: 'demo-1',
        type: 'deposit',
        description: 'Wire Transfer - Series A Funding',
        amount: 2500000,
        date: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'completed',
      },
      {
        id: 'demo-2',
        type: 'payment',
        description: 'Payroll - October 2024',
        amount: -125000,
        date: new Date(Date.now() - 86400000 * 2),
        status: 'completed',
        category: 'Payroll',
        merchant: 'Gusto',
      },
      {
        id: 'demo-3',
        type: 'payment',
        description: 'AWS - Cloud Services',
        amount: -15000,
        date: new Date(Date.now() - 86400000 * 5),
        status: 'completed',
        category: 'Infrastructure',
        merchant: 'Amazon Web Services',
      },
      {
        id: 'demo-4',
        type: 'payment',
        description: 'Google Workspace',
        amount: -2400,
        date: new Date(Date.now() - 86400000 * 7),
        status: 'completed',
        category: 'Software',
        merchant: 'Google',
      },
    ];

    setDemoTransactions(newTransactions);
  }, []);

  const enableSavings = useCallback(() => {
    setDemoSavingsEnabled(true);
    // Move 20% to savings
    setDemoSavingsBalance(500000);
    setDemoBalance(2000000);
  }, []);

  const simulateYieldAccrual = useCallback(() => {
    // Simulate yield growing
    const interval = setInterval(() => {
      setDemoYieldEarned((prev) => prev + 0.13); // ~$0.13/sec = ~$11k/day at 8% APY on $500k
    }, 100); // Update every 100ms for smooth animation

    // Clean up after 10 seconds
    setTimeout(() => clearInterval(interval), 10000);
  }, []);

  const value = {
    isDemo,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    resetDemo,
    demoBalance,
    demoTransactions,
    demoSavingsBalance,
    demoSavingsEnabled,
    demoYieldEarned,
    simulateDeposit,
    enableSavings,
    simulateYieldAccrual,
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
}

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
