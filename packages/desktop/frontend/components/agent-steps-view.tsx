import React from 'react';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AgentStepsViewProps {
  recognizedItemId: string;
  className?: string;
  maxContentHeight?: 'sm' | 'md' | 'lg';
}

// Utility function to check if text includes search term (case insensitive)
function includesSearch(text: string | undefined | null, search: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(search.toLowerCase());
}

// Highlight component for matched text
interface HighlightProps {
  text: string;
  searchTerm: string;
  className?: string;
  isCode?: boolean;
}

function Highlight({ text, searchTerm, className, isCode }: HighlightProps) {
  if (!searchTerm.trim()) {
    return isCode ? (
      <div className="overflow-x-auto">
        <pre className={cn("whitespace-pre", className)}>{text}</pre>
      </div>
    ) : (
      <span className={className}>{text}</span>
    );
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  const content = parts.map((part, i) => (
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5">{part}</mark>
    ) : part
  ));

  return isCode ? (
    <div className="overflow-x-auto">
      <pre className={cn("whitespace-pre", className)}>{content}</pre>
    </div>
  ) : (
    <span className={className}>{content}</span>
  );
}

// Highlight for JSON content
function HighlightJson({ json, searchTerm }: { json: any; searchTerm: string }) {
  if (!searchTerm.trim()) {
    return (
      <div className="overflow-x-auto">
        <pre className="whitespace-pre">{JSON.stringify(json, null, 2)}</pre>
      </div>
    );
  }

  const jsonString = JSON.stringify(json, null, 2);
  const parts = jsonString.split(new RegExp(`(${searchTerm})`, 'gi'));

  return (
    <div className="overflow-x-auto">
      <pre className="whitespace-pre">
        {parts.map((part, i) => (
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5">{part}</mark>
          ) : part
        ))}
      </pre>
    </div>
  );
}

export function AgentStepsView({ recognizedItemId, className, maxContentHeight = 'md' }: AgentStepsViewProps) {
  const steps = useAgentStepsStore((state) => state.steps[recognizedItemId] || []);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  // Filter types based on available data
  const filterTypes = useMemo(() => {
    const types = new Set<string>();
    steps.forEach(step => {
      if (step.humanAction) types.add('actions');
      if (step.humanResult) types.add('results');
      if (step.toolCalls?.length) types.add('tools');
      if (step.text) types.add('text');
      if (step.finishReason === 'error') types.add('errors');
    });
    return Array.from(types);
  }, [steps]);

  // Filtered steps based on search and filters
  const filteredSteps = useMemo(() => {
    return steps.filter(step => {
      // If no search term and no filters, show all
      if (!searchTerm && activeFilters.size === 0) return true;

      // Check if step matches active filters
      if (activeFilters.size > 0) {
        const matchesFilter = (
          (activeFilters.has('actions') && step.humanAction) ||
          (activeFilters.has('results') && step.humanResult) ||
          (activeFilters.has('tools') && step.toolCalls?.length) ||
          (activeFilters.has('text') && step.text) ||
          (activeFilters.has('errors') && step.finishReason === 'error')
        );
        if (!matchesFilter) return false;
      }

      // If no search term, filter only by type
      if (!searchTerm) return true;

      // Search in all relevant fields
      return (
        includesSearch(step.humanAction as string, searchTerm) ||
        includesSearch(step.humanResult, searchTerm) ||
        includesSearch(step.text, searchTerm) ||
        step.toolCalls?.some(call => 
          'toolName' in call && includesSearch(call.toolName, searchTerm)
        ) ||
        step.toolResults?.some(result => 
          includesSearch(JSON.stringify(result), searchTerm)
        )
      );
    });
  }, [steps, searchTerm, activeFilters]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilters(new Set());
  };

  // Automatically expand steps that match search
  useMemo(() => {
    if (searchTerm) {
      const newExpanded = { ...expandedSteps };
      filteredSteps.forEach(step => {
        newExpanded[step.id] = true;
      });
      setExpandedSteps(newExpanded);
    }
  }, [searchTerm]);



  if (steps.length === 0) {
    return null;
  }

  return (
    <ScrollArea className={cn('w-full', className)}>
      <div className="flex flex-col gap-2 p-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex flex-col gap-1.5 pb-2"
          >
            {/* Step number and connection line */}
            <div className="absolute left-3 top-0 -bottom-2 w-px bg-border" />
            <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border bg-background" />

            {/* Step content */}
            <div className="ml-8 space-y-1">
              {/* Human action */}
              {step.humanAction && (
                <div className="text-sm font-medium text-foreground">
                  {step.humanAction}
                </div>
              )}

              {/* Main content with improved wrapping */}
              <div className="rounded-lg border bg-muted/50 p-2.5">
                <div className="space-y-1.5">
                  {/* Text content */}
                  {step.text && (
                    <div className="whitespace-pre-wrap break-words text-sm text-muted-foreground max-w-full">
                      {step.text}
                    </div>
                  )}

                  {/* Tool calls with better overflow handling */}
                  {step.toolCalls?.map((call, callIndex) => (
                    <div key={callIndex} className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Tool: {call.toolName}
                      </div>
                      <div className="rounded bg-muted p-2 max-w-full">
                        <pre className="text-xs whitespace-pre-wrap break-words overflow-hidden">
                          {JSON.stringify(call.args, null, 2)}
                        </pre>
                      </div>
                      {step.toolResults?.[callIndex] && (
                        <div className="rounded bg-muted p-2 mt-1 max-w-full">
                          <pre className="text-xs whitespace-pre-wrap break-words overflow-hidden">
                            {JSON.stringify(step.toolResults[callIndex], null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Human result */}
                  {step.humanResult && (
                    <div className="text-sm font-medium text-foreground">
                      Result: {step.humanResult}
                    </div>
                  )}

                  {/* Finish reason */}
                  {step.finishReason && (
                    <div className="text-xs text-muted-foreground">
                      Status: {step.finishReason}
                    </div>
                  )}

                  {/* Usage info */}
                  {step.usage && (
                    <div className="text-xs text-muted-foreground/50">
                      Tokens: {step.usage.totalTokens} (prompt: {step.usage.promptTokens}, completion: {step.usage.completionTokens})
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 