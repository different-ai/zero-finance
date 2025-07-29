'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Circle, 
  CreditCard, 
  Building2, 
  FileText,
  TrendingUp,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action: () => void;
}

export function OnboardingTasksCard() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'connect-bank',
      title: 'Connect Bank Account',
      description: 'Link your bank for easy transfers',
      icon: <CreditCard className="w-5 h-5" />,
      completed: true,
      action: () => console.log('Connect bank'),
    },
    {
      id: 'verify-business',
      title: 'Verify Business',
      description: 'Complete KYC for higher limits',
      icon: <Building2 className="w-5 h-5" />,
      completed: true,
      action: () => console.log('Verify business'),
    },
    {
      id: 'create-invoice',
      title: 'Create First Invoice',
      description: 'Start accepting crypto payments',
      icon: <FileText className="w-5 h-5" />,
      completed: false,
      action: () => console.log('Create invoice'),
    },
    {
      id: 'setup-savings',
      title: 'Set Up Auto-Savings',
      description: 'Automatically save on deposits',
      icon: <TrendingUp className="w-5 h-5" />,
      completed: false,
      action: () => console.log('Setup savings'),
    },
  ]);

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleCompleteStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  if (!isExpanded) {
    return (
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsExpanded(true)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{completedSteps}/{totalSteps}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Complete your setup</p>
                <p className="text-sm text-gray-500">{totalSteps - completedSteps} tasks remaining</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Get Started</CardTitle>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Setup Progress</span>
            <span className="font-medium text-gray-900">{completedSteps} of {totalSteps} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all",
                step.completed 
                  ? "bg-gray-50" 
                  : "bg-white hover:bg-gray-50 border border-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  step.completed 
                    ? "bg-green-100" 
                    : "bg-blue-50"
                )}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="text-blue-600">{step.icon}</div>
                  )}
                </div>
                <div>
                  <p className={cn(
                    "font-medium",
                    step.completed ? "text-gray-500" : "text-gray-900"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
              {!step.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    step.action();
                    handleCompleteStep(step.id);
                  }}
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                >
                  Start
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {completedSteps === totalSteps && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-900">All set up!</p>
            <p className="text-sm text-green-700 mt-1">You're ready to use all features</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}