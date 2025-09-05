'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type DemoStep =
  | 'welcome'
  | 'pain-points'
  | 'solution-intro'
  | 'onboarding'
  | 'dashboard-overview'
  | 'yield-opportunities'
  | 'checking-account'
  | 'runway-extension'
  | 'success';

export interface StartupData {
  name: string;
  runway: number; // months
  bankBalance: number;
  monthlyBurn: number;
  lastFundingRound: string;
  fundingAmount: number;
  investorFunds: number;
}

export interface YieldOpportunity {
  protocol: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  type: 'stable' | 'lending' | 'liquidity';
  description: string;
  projectedYearlyReturn: number;
  runwayExtension: number; // days
}

export interface DemoTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'yield' | 'payment';
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed';
  category?: string;
}

interface DemoStartupContextType {
  currentStep: DemoStep;
  setCurrentStep: (step: DemoStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  startupData: StartupData;
  setStartupData: (data: Partial<StartupData>) => void;
  yieldOpportunities: YieldOpportunity[];
  selectedYield: YieldOpportunity | null;
  setSelectedYield: (opp: YieldOpportunity | null) => void;
  transactions: DemoTransaction[];
  addTransaction: (tx: Omit<DemoTransaction, 'id'>) => void;
  isDemo: boolean;
  toggleDemo: () => void;
  runwayWithYield: number;
  projectedSavings: number;
}

const DemoStartupContext = createContext<DemoStartupContextType | undefined>(
  undefined,
);

const DEMO_STEPS: DemoStep[] = [
  'welcome',
  'pain-points',
  'solution-intro',
  'onboarding',
  'dashboard-overview',
  'yield-opportunities',
  'checking-account',
  'runway-extension',
  'success',
];

const INITIAL_STARTUP_DATA: StartupData = {
  name: 'TechCo',
  runway: 18,
  bankBalance: 2500000,
  monthlyBurn: 138888, // ~$2.5M / 18 months
  lastFundingRound: 'Series A',
  fundingAmount: 5000000,
  investorFunds: 2500000,
};

const YIELD_OPPORTUNITIES: YieldOpportunity[] = [
  {
    protocol: 'USDC Savings',
    apy: 8.0,
    risk: 'low',
    type: 'stable',
    description:
      'Earn stable yield on USDC through institutional-grade lending',
    projectedYearlyReturn: 200000, // $2.5M * 8%
    runwayExtension: 43, // ~1.4 months extra runway
  },
  {
    protocol: 'Treasury Bills',
    apy: 5.2,
    risk: 'low',
    type: 'lending',
    description: 'On-chain exposure to US Treasury Bills',
    projectedYearlyReturn: 130000,
    runwayExtension: 28,
  },
  {
    protocol: 'Blue Chip Lending',
    apy: 12.5,
    risk: 'medium',
    type: 'lending',
    description: 'Lend to verified institutional borrowers',
    projectedYearlyReturn: 312500,
    runwayExtension: 67,
  },
];

const INITIAL_TRANSACTIONS: DemoTransaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 2500000,
    description: 'Initial treasury deposit from Series A',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: '2',
    type: 'payment',
    amount: -45000,
    description: 'AWS Infrastructure',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: 'completed',
    category: 'Infrastructure',
  },
  {
    id: '3',
    type: 'payment',
    amount: -380000,
    description: 'Monthly Payroll',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    category: 'Payroll',
  },
  {
    id: '4',
    type: 'yield',
    amount: 16666,
    description: 'Monthly yield earnings',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
];

export function DemoStartupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState<DemoStep>('welcome');
  const [startupData, setStartupDataState] =
    useState<StartupData>(INITIAL_STARTUP_DATA);
  const [selectedYield, setSelectedYield] = useState<YieldOpportunity | null>(
    null,
  );
  const [transactions, setTransactions] =
    useState<DemoTransaction[]>(INITIAL_TRANSACTIONS);
  const [isDemo, setIsDemo] = useState(false);

  const nextStep = useCallback(() => {
    const currentIndex = DEMO_STEPS.indexOf(currentStep);
    if (currentIndex < DEMO_STEPS.length - 1) {
      setCurrentStep(DEMO_STEPS[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const currentIndex = DEMO_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(DEMO_STEPS[currentIndex - 1]);
    }
  }, [currentStep]);

  const setStartupData = useCallback((data: Partial<StartupData>) => {
    setStartupDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const addTransaction = useCallback((tx: Omit<DemoTransaction, 'id'>) => {
    const newTx: DemoTransaction = {
      ...tx,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  const toggleDemo = useCallback(() => {
    setIsDemo((prev) => !prev);
    if (!isDemo) {
      setCurrentStep('welcome');
    }
  }, [isDemo]);

  // Calculate runway with yield
  const runwayWithYield = selectedYield
    ? startupData.runway + selectedYield.runwayExtension / 30
    : startupData.runway;

  const projectedSavings = selectedYield
    ? selectedYield.projectedYearlyReturn
    : 0;

  const value: DemoStartupContextType = {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    startupData,
    setStartupData,
    yieldOpportunities: YIELD_OPPORTUNITIES,
    selectedYield,
    setSelectedYield,
    transactions,
    addTransaction,
    isDemo,
    toggleDemo,
    runwayWithYield,
    projectedSavings,
  };

  return (
    <DemoStartupContext.Provider value={value}>
      {children}
    </DemoStartupContext.Provider>
  );
}

export function useDemoStartup() {
  const context = useContext(DemoStartupContext);
  if (context === undefined) {
    throw new Error('useDemoStartup must be used within a DemoStartupProvider');
  }
  return context;
}
