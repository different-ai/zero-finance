import * as React from 'react';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Loader2, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface AgentStepsViewProps {
  recognizedItemId: string;
  className?: string;
}

export function AgentStepsView({ recognizedItemId, className }: AgentStepsViewProps) {
  const steps = useAgentStepsStore((state) => state.steps[recognizedItemId] || []);

  return (
    <ScrollArea className={className}>
      <div className="space-y-4 p-4">
        <h4 className="text-sm font-medium">Agent Progress</h4>
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className="text-sm border rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {step.finishReason ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(step.timestamp, 'HH:mm:ss')}
                  </span>
                </div>
                {step.usage && (
                  <span className="text-xs text-muted-foreground">
                    {step.usage.totalTokens} tokens
                  </span>
                )}
              </div>

              {step.text && (
                <div className="text-sm">
                  {step.text}
                </div>
              )}

              {step.toolCalls?.map((toolCall, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded p-2 text-xs space-y-1"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-3 w-3" />
                    {'toolName' in toolCall && (
                      <span>Using {toolCall.toolName}</span>
                    )}
                  </div>
                  {step.toolResults?.[index] && (
                    <div className="pl-5 pt-1 border-l text-xs">
                      {typeof step.toolResults[index] === 'string' ? (
                        <span>{step.toolResults[index] as string}</span>
                      ) : (
                        <pre className="overflow-x-auto">
                          {JSON.stringify(step.toolResults[index], null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {step.finishReason === 'error' && (
                <div className="flex items-center gap-2 text-destructive text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>Error: {step.text}</span>
                </div>
              )}
            </div>
          ))}

          {steps.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No steps yet
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
} 