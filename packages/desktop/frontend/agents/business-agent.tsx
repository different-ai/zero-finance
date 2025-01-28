import { Agent, AgentType } from './base-agent';
import { generateText } from 'ai';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { markdownSearch } from './tools/markdown-search';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { AgentStepsView } from '@/components/agent-steps-view';
import { tool } from 'ai';
import { z } from 'zod';

interface BusinessInfo {
  type: string;
  content: string;
  timestamp: number;
  title: string;
  tags: string[];
}

interface AnalysisPlan {
  steps: Array<{
    id: string;
    description: string;
    query?: string;
    type: 'search' | 'analyze' | 'summarize';
    explanation: string;
    completed: boolean;
  }>;
  currentStepIndex: number;
}

const BusinessInfoView: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedItemId, setRecognizedItemId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<AnalysisPlan | null>(null);
  const addStep = useAgentStepsStore((state) => state.addStep);

  // Tool to create the analysis plan
  const createAnalysisPlanTool = {
    description: 'Create a structured plan for analyzing business content',
    parameters: z.object({
      steps: z.array(z.object({
        description: z.string(),
        query: z.string().optional(),
        type: z.enum(['search', 'analyze', 'summarize']),
        explanation: z.string(),
      })),
    }),
    execute: async ({ steps }) => {
      const plan: AnalysisPlan = {
        steps: steps.map(step => ({
          ...step,
          id: crypto.randomUUID(),
          completed: false,
          description: step.description,
          type: step.type,
        })),
        currentStepIndex: 0,
      };

      // Add the plan overview to the steps view
      addStep(recognizedItemId!, {
        humanAction: 'Analysis Plan Created',
        text: `Created a ${steps.length}-step plan:\n${steps.map((step, i) => 
          `${i + 1}. ${step.type.toUpperCase()}: ${step.description}\n   → ${step.explanation}`
        ).join('\n')}`,
        finishReason: 'complete',
      });

      setCurrentPlan(plan);
      return plan;
    },
  };

  // Tool to execute the next step in the plan
  const executeNextStepTool = {
    description: 'Execute the next step in the analysis plan',
    parameters: z.object({}),
    execute: async () => {
      if (!currentPlan) return null;
      
      const currentStep = currentPlan.steps[currentPlan.currentStepIndex];
      if (!currentStep) return null;

      // Add detailed step explanation to the view
      const stepDetails = [];
      stepDetails.push(`Step ${currentPlan.currentStepIndex + 1} of ${currentPlan.steps.length}`);
      stepDetails.push(`Type: ${currentStep.type.toUpperCase()}`);
      
      if (currentStep.type === 'search') {
        stepDetails.push(`Query: "${currentStep.query}"`);
      }
      
      stepDetails.push(`Action: ${currentStep.description}`);
      stepDetails.push(`Details: ${currentStep.explanation}`);

      addStep(recognizedItemId!, {
        humanAction: currentStep.description,
        text: stepDetails.join('\n'),
        finishReason: 'complete',
      });

      // Mark step as completed and move to next
      setCurrentPlan(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[prev.currentStepIndex] = {
          ...updatedSteps[prev.currentStepIndex],
          completed: true,
        };
        return {
          ...prev,
          steps: updatedSteps,
          currentStepIndex: prev.currentStepIndex + 1,
        };
      });

      return currentStep;
    },
  };

  const { data: businessInfo, refetch } = useQuery<BusinessInfo[]>({
    queryKey: ['business-info'],
    queryFn: async () => {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const newRecognizedItemId = crypto.randomUUID();
      setRecognizedItemId(newRecognizedItemId);
      setCurrentPlan(null);

      // Add initial planning step with more detail
      addStep(newRecognizedItemId, {
        humanAction: 'Initializing Business Analysis',
        text: 'Starting a comprehensive analysis of business content:\n' +
              '1. Creating a detailed search and analysis plan\n' +
              '2. Executing each step systematically\n' +
              '3. Collecting and organizing results\n' +
              '4. Preparing final summary',
        finishReason: 'complete',
      });

      // Use generateText with planning and execution tools
      const { text, toolCalls, toolResults } = await generateText({
        model: openai('gpt-4o'),
        maxSteps: 15,
        tools: {
          markdownSearch,
          createAnalysisPlan: tool(createAnalysisPlanTool),
          executeNextStep: tool(executeNextStepTool),
        },
        messages: [
          {
            role: 'system',
            content: `
              You are a business information analyzer that works in two phases:

              PHASE 1 - PLANNING:
              First, create a detailed plan using createAnalysisPlan. Include steps for:
              - Searching company information
              - Finding client details
              - Identifying project information
              - Locating financial records
              
              Each step should have:
              - Clear description of what will be done
              - Search query if needed
              - Type (search/analyze/summarize)
              - Detailed explanation of what we expect to find and why it's important

              Example steps:
              1. {
                description: "Search for recent invoices",
                query: "type:invoice created:>2024-01",
                type: "search",
                explanation: "Looking for invoices created this year to analyze recent financial activity"
              }
              2. {
                description: "Analyze client relationships",
                type: "analyze",
                explanation: "Examining client interactions and project history to identify key business relationships"
              }

              PHASE 2 - EXECUTION:
              Then, execute each step using executeNextStep and markdownSearch:
              1. Call executeNextStep to get the current step
              2. If it's a search step, use markdownSearch with the query
              3. Process the results
              4. Repeat until all steps are complete

              Remember to:
              - Make the plan detailed but concise
              - Use specific search queries with date ranges when relevant
              - Process results after each search
              - Provide clear progress updates
            `.trim(),
          },
          {
            role: 'user',
            content: 'Find and analyze all business-related content in our markdown files.',
          },
        ],
      });

      // Process search results
      const results: BusinessInfo[] = [];
      toolCalls?.forEach((call, idx) => {
        if ('toolName' in call && call.toolName === 'markdownSearch') {
          const result = toolResults?.[idx];
          if ('result' in result && Array.isArray(result.result)) {
            // Add search results step with details
            const searchQuery = 'args' in call ? call.args.query : 'unknown query';
            addStep(newRecognizedItemId, {
              humanAction: 'Search Results',
              text: `Found ${result.result.length} matches for query: "${searchQuery}"\n` +
                    result.result.map(item => 
                      `• ${item.content?.metadata?.title || 'Untitled'} (${format(
                        new Date(item.content?.metadata?.updated || Date.now()),
                        'MMM dd, yyyy'
                      )})`
                    ).join('\n'),
              finishReason: 'complete',
            });

            result.result.forEach((item: any) => {
              if (item.content?.text) {
                results.push({
                  type: item.content.metadata?.type || 'business',
                  content: item.content.text,
                  timestamp: new Date(item.content.metadata?.updated || Date.now()).getTime(),
                  title: item.content.metadata?.title || 'Untitled',
                  tags: item.content.metadata?.tags || [],
                });
              }
            });
          }
        }
      });

      // Add final summary step with detailed breakdown
      addStep(newRecognizedItemId, {
        humanAction: `Analysis Complete`,
        text: `Found ${results.length} business items:\n` +
              `• ${results.filter(r => r.type === 'invoice').length} invoices\n` +
              `• ${results.filter(r => r.type === 'client').length} client records\n` +
              `• ${results.filter(r => r.type === 'project').length} project documents\n` +
              `• ${results.filter(r => !['invoice', 'client', 'project'].includes(r.type)).length} other business documents`,
        finishReason: 'complete',
      });

      return results;
    },
  });

  const handleRefresh = async () => {
    setIsAnalyzing(true);
    try {
      await refetch();
      toast.success('Business information refreshed');
    } catch (error) {
      toast.error('Failed to refresh business information');
      if (recognizedItemId) {
        addStep(recognizedItemId, {
          humanAction: 'Error analyzing business content',
          text: error instanceof Error ? error.message : 'Unknown error',
          finishReason: 'error',
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Business Information</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {!businessInfo?.length ? (
            <div className="text-center text-muted-foreground py-8">
              No business information found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessInfo.map((info, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {format(info.timestamp, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="capitalize">{info.type}</TableCell>
                    <TableCell>{info.title}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {info.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-1 bg-muted rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {recognizedItemId && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentStepsView recognizedItemId={recognizedItemId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const BusinessAgent: Agent = {
  id: 'business-agent',
  name: 'Business Information',
  description: 'View and analyze business-related content from markdown files',
  type: 'business' as AgentType,
  isActive: true,
  isReady: true,
  miniApp: () => <BusinessInfoView />,
  eventAction(context, onSuccess) {
    return (
      <div className="flex flex-col">
        <div className="font-medium">{context.title}</div>
        <div className="text-sm text-muted-foreground">{context.vitalInformation}</div>
      </div>
    );
  }
}; 