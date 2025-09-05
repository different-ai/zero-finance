'use client';

import React, { useEffect, useState } from 'react';
import { useDemoMode } from '@/context/demo-mode-context';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, StopCircle, ChevronRight, RotateCcw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const DEMO_STEPS = [
  { id: 0, name: 'Welcome', description: 'Introduction to 0 Finance' },
  { id: 1, name: 'Empty Dashboard', description: 'Starting with no funds' },
  { id: 2, name: 'Deposit Instructions', description: 'How to add funds' },
  { id: 3, name: 'Funds Received', description: '$2.5M treasury deposited' },
  {
    id: 4,
    name: 'Active Dashboard',
    description: 'View transactions & balance',
  },
  { id: 5, name: 'Savings Activated', description: '10% auto-save enabled' },
  { id: 6, name: 'Earning Yield', description: '8% APY accumulating' },
  { id: 7, name: 'Withdraw Options', description: 'ACH & wire transfers' },
];

export function DemoModeToggle() {
  const { isDemoMode, setDemoMode, demoStep, setDemoStep } = useDemoMode();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or with special query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const showDemo =
      params.get('demo') === 'true' || process.env.NODE_ENV === 'development';
    setIsVisible(showDemo);
  }, []);

  if (!isVisible) return null;

  const currentStep = DEMO_STEPS[demoStep] || DEMO_STEPS[0];
  const progress = ((demoStep + 1) / DEMO_STEPS.length) * 100;

  const handleToggle = (checked: boolean) => {
    setDemoMode(checked);
    if (checked) {
      toast.success('Demo mode activated', {
        description: 'Showing simulated data for demonstration',
      });
      // Reload to apply demo mode to all components
      setTimeout(() => window.location.reload(), 500);
    } else {
      toast.info('Demo mode deactivated', {
        description: 'Showing real data',
      });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleNextStep = () => {
    if (demoStep < DEMO_STEPS.length - 1) {
      setDemoStep(demoStep + 1);
      toast.info(`Step ${demoStep + 2}: ${DEMO_STEPS[demoStep + 1].name}`);
    }
  };

  const handleReset = () => {
    setDemoStep(0);
    toast.info('Demo reset to beginning');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isDemoMode ? (
                <PlayCircle className="h-5 w-5 text-green-500 animate-pulse" />
              ) : (
                <StopCircle className="h-5 w-5 text-gray-400" />
              )}
              Demo Mode
            </CardTitle>
            <Switch checked={isDemoMode} onCheckedChange={handleToggle} />
          </div>
        </CardHeader>

        {isDemoMode && (
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{currentStep.name}</span>
                <Badge variant="outline" className="text-xs">
                  Step {demoStep + 1}/{DEMO_STEPS.length}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentStep.description}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleNextStep}
                disabled={demoStep >= DEMO_STEPS.length - 1}
                className="flex-1"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground border-t pt-2">
              💡 Navigate through the demo steps to simulate the complete user
              journey
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
