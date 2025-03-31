'use client';

import { FC } from 'react';
import { ResearchPlan, Step } from '@/lib/ai/tools/plan-yield-research';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Circle, Clock, AlertCircle, ChevronRight, X } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { useResearchPlanStore } from '@/lib/store/research-plan-store';
import { Button } from './ui/button';

interface ResearchPlanDisplayProps {
  plan?: ResearchPlan | null;
  isLoading?: boolean;
}

export const ResearchPlanDisplay: FC<ResearchPlanDisplayProps> = ({ 
  plan,
  isLoading = false,
}) => {
  const { setVisibility } = useResearchPlanStore();
  
  if (isLoading) {
    return <ResearchPlanSkeleton />;
  }

  if (!plan || !plan.title) {
    return null;
  }

  const completedSteps = plan.steps.filter(step => step.status === 'completed').length;
  const totalSteps = plan.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card className="w-full mb-4 overflow-hidden border border-accent">
      <CardHeader className="bg-secondary/50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <div className="flex items-center gap-2">
            <PlanStatusBadge status={plan.status} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-6 rounded-full hover:bg-muted"
              onClick={() => setVisibility(false)}
              aria-label="Hide research plan"
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {completedSteps} of {totalSteps} steps completed
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-2">
        {plan.steps.map((step, index) => (
          <StepItem key={step.id} step={step} index={index} />
        ))}

        {plan.context && Object.keys(plan.context).length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground border-t pt-3">
            <h4 className="font-medium text-foreground mb-1">Research Parameters:</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {plan.context.inputAmount && (
                <li><span className="font-medium">Amount:</span> {plan.context.inputAmount}</li>
              )}
              {plan.context.inputToken && (
                <li><span className="font-medium">Token:</span> {plan.context.inputToken}</li>
              )}
              {plan.context.targetChain && (
                <li><span className="font-medium">Chain:</span> {plan.context.targetChain}</li>
              )}
              {plan.context.riskPreference && (
                <li><span className="font-medium">Risk Preference:</span> {plan.context.riskPreference}</li>
              )}
              {plan.context.timeHorizon && (
                <li><span className="font-medium">Time Horizon:</span> {plan.context.timeHorizon}</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StepItem: FC<{ step: Step; index: number }> = ({ step, index }) => {
  return (
    <div className="flex items-start mb-2 group">
      <div className="mr-2 mt-0.5">
        <StepStatusIcon status={step.status} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline">
          <span className="text-sm font-medium">{index + 1}. {step.description}</span>
        </div>
        {step.result && step.status === 'completed' && (
          <div className="text-sm mt-1 pl-1 text-muted-foreground py-1 px-2 bg-secondary/30 rounded-sm group-hover:block">
            {step.result.length > 100 
              ? `${step.result.substring(0, 100)}...` 
              : step.result}
          </div>
        )}
      </div>
    </div>
  );
};

const StepStatusIcon: FC<{ status: Step['status'] }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="size-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="size-4 text-blue-500 animate-pulse" />;
    case 'failed':
      return <AlertCircle className="size-4 text-red-500" />;
    case 'pending':
    default:
      return <Circle className="size-4 text-muted-foreground" />;
  }
};

const PlanStatusBadge: FC<{ status: ResearchPlan['status'] }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'in-progress':
      return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'planning':
    default:
      return <Badge variant="outline">Planning</Badge>;
  }
};

const ResearchPlanSkeleton: FC = () => (
  <Card className="w-full mb-4 overflow-hidden border border-accent">
    <CardHeader className="bg-secondary/50 pb-2">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <div className="mt-2">
        <Skeleton className="h-2 w-full mt-4" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
    </CardHeader>
    <CardContent className="pt-4 pb-2">
      <div className="space-y-3">
        <div className="flex items-start">
          <Skeleton className="size-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex items-start">
          <Skeleton className="size-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex items-start">
          <Skeleton className="size-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </div>
    </CardContent>
  </Card>
); 