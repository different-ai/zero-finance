'use client';

import React, { useEffect, useState } from 'react';
import { useDemoMode } from '@/providers/demo-mode-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  ChevronRight,
  Sparkles,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_DESCRIPTIONS = {
  intro: {
    title: 'Welcome to Zero Finance',
    description: "Get 8% APY on your startup's savings",
    action: 'Start Demo',
  },
  signup: {
    title: 'Quick Signup',
    description: '60-second onboarding for your company',
    action: 'Continue',
  },
  'empty-dashboard': {
    title: 'Your Dashboard',
    description: "This is where you'll manage your funds",
    action: 'Deposit Funds',
  },
  'deposit-instructions': {
    title: 'Simple Deposit',
    description: 'Send USDC to your wallet address',
    action: 'Simulate Deposit',
  },
  'processing-deposit': {
    title: 'Processing...',
    description: 'Your funds are being detected',
    action: null,
  },
  'funded-dashboard': {
    title: 'Funds Received!',
    description: '$2.5M now in your account',
    action: 'View Savings',
  },
  'savings-page': {
    title: 'Savings Options',
    description: 'Choose your yield strategy',
    action: 'Activate Savings',
  },
  'activate-savings': {
    title: 'Activating Savings',
    description: 'Setting up 8% APY savings',
    action: null,
  },
  'savings-active': {
    title: "You're Earning!",
    description: 'Watch your yield grow in real-time',
    action: 'Withdrawal Options',
  },
  withdrawal: {
    title: 'Easy Withdrawals',
    description: 'ACH transfer or wire - your money, your way',
    action: 'Complete Demo',
  },
  summary: {
    title: "That's Zero Finance",
    description: '8% savings with crypto yield, banking simplicity',
    action: 'Restart Demo',
  },
};

export function DemoOverlay() {
  const demo = useDemoMode();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const stepInfo = STEP_DESCRIPTIONS[demo.currentStep];
  const currentStepIndex = Object.keys(STEP_DESCRIPTIONS).indexOf(
    demo.currentStep,
  );
  const totalSteps = Object.keys(STEP_DESCRIPTIONS).length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Auto-advance logic
  useEffect(() => {
    if (!isAutoPlaying) return;

    const delays: Record<string, number> = {
      intro: 3000,
      signup: 2000,
      'empty-dashboard': 3000,
      'deposit-instructions': 3000,
      'processing-deposit': 2000,
      'funded-dashboard': 4000,
      'savings-page': 4000,
      'activate-savings': 2000,
      'savings-active': 5000,
      withdrawal: 4000,
      summary: null, // Don't auto-advance from summary
    };

    const delay = delays[demo.currentStep];
    if (delay === null) {
      setIsAutoPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      handleAction();
    }, delay);

    return () => clearTimeout(timer);
  }, [demo.currentStep, isAutoPlaying]);

  // Handle step-specific actions
  const handleAction = () => {
    switch (demo.currentStep) {
      case 'intro':
      case 'signup':
      case 'empty-dashboard':
        demo.nextStep();
        break;
      case 'deposit-instructions':
        demo.simulateDeposit();
        demo.nextStep();
        break;
      case 'processing-deposit':
        setTimeout(() => demo.nextStep(), 1500);
        break;
      case 'funded-dashboard':
        // Navigate to savings page
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard/savings?demo=true';
        }
        demo.nextStep();
        break;
      case 'savings-page':
        demo.enableSavings();
        demo.nextStep();
        break;
      case 'activate-savings':
        demo.simulateYieldAccrual();
        setTimeout(() => demo.nextStep(), 1500);
        break;
      case 'savings-active':
      case 'withdrawal':
        demo.nextStep();
        break;
      case 'summary':
        demo.resetDemo();
        break;
    }
  };

  if (!demo.isDemo) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsMinimized(false)} className="shadow-lg">
          <Play className="h-4 w-4 mr-2" />
          Demo Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-2xl mx-auto shadow-2xl border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{stepInfo.title}</CardTitle>
                <CardDescription>{stepInfo.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {currentStepIndex + 1} of {totalSteps}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
              >
                Minimize
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress bar */}
          <Progress value={progress} className="h-2" />

          {/* Step-specific content */}
          {demo.currentStep === 'deposit-instructions' && (
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              Wallet Address: 0x742d35Cc6634C053...2a1E7
            </div>
          )}

          {demo.currentStep === 'savings-active' &&
            demo.demoYieldEarned > 0 && (
              <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm text-green-700">Yield Earned:</span>
                <span className="text-lg font-bold text-green-700">
                  +${demo.demoYieldEarned.toFixed(2)}
                </span>
              </div>
            )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={demo.prevStep}
                disabled={currentStepIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button variant="outline" size="sm" onClick={demo.resetDemo}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {stepInfo.action && (
              <Button onClick={handleAction} className="ml-auto">
                {stepInfo.action}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
