'use client';

import { FC } from 'react';
import { Button } from './ui/button';
import { useResearchPlanStore } from '@/lib/store/research-plan-store';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { ClipboardList, ChevronUp, ChevronDown } from 'lucide-react';

export const ResearchPlanToggle: FC = () => {
  const { isActive, isVisible, toggleVisibility } = useResearchPlanStore();
  
  if (!isActive) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleVisibility}
          className="h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80"
          aria-label={isVisible ? 'Hide research plan' : 'Show research plan'}
        >
          <div className="flex items-center">
            {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <ClipboardList size={14} className="ml-1" />
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isVisible ? 'Hide research plan' : 'Show research plan'}
      </TooltipContent>
    </Tooltip>
  );
}; 