import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock, MoreVertical, Zap, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useApiKeyStore } from '@/stores/api-key-store';
import { useToast } from '@/hooks/use-toast';
import { useClassificationStore } from '@/stores/classification-store';
import { demoRecognizedItems } from '@/stores/classification-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { useSettingsStore } from '@/stores/settings-store';
import { RecognizedItem } from '@/types/recognized-item';

import {
  AgentType,
  ClassificationResult,
} from '@/agents/base-agent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { generateText, embed, cosineSimilarity, generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { AgentStepsView } from '@/components/agent-steps-view';
import { RecognizedItemStatus } from '@/types/electron';

// import our simplified classification serializer
import { classificationSerializer } from '@/agents/tools/classification-serializer';

// import the single-step screenpipe search
import { screenpipeSearch } from '@/agents/tools/screenpipe-search';

import { planningTool } from '@/agents/tools/planning-tool';
import { z } from 'zod';

// import the orchestrator
import { orchestrateClassification } from '@/agents/orchestrators/event-classification-orchestrator';

// Add this type at the top level
type StepMessage = string | JSX.Element;

// Add the schema for the classification request
const classificationRequestSchema = z.object({
  type: z.enum(['search', 'classification']),
  query: z.string().optional(),
  timeframe: z.string(),
  plan: z.object({
    steps: z.array(z.string()),
    rationale: z.string(),
  }),
});

// Update the planning schema to match the search requirements
const planningSchema = z.object({
  plan: z.object({
    steps: z.array(z.string()).min(1),
    searchQueries: z.array(z.object({
      query: z.string().min(1),
      rationale: z.string().min(1),
      contentType: z.enum(['ocr', 'audio', 'ui']),
    })).min(1),
    rationale: z.string(),
  }),
});

type PlanningResult = z.infer<typeof planningSchema>;

// Update the classification result type
interface ClassificationOutput {
  items: ClassificationResult[];
  summary: string;
}

function getClassificationText(title: string, vitalInfo: string): string {
  return `${title.toLowerCase().trim()} ${vitalInfo.toLowerCase().trim()}`;
}

// minimal duplicate check via embeddings
async function isDuplicateClassification(
  newItem: ClassificationResult,
  agentId: string | undefined,
  existingItems: RecognizedItem[]
): Promise<boolean> {
  if (!agentId) return false;

  try {
    const openai = createOpenAI({ apiKey: getApiKey() });
    const newText = getClassificationText(
      newItem.title,
      newItem.vitalInformation || ''
    );

    const { embedding: newEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: newText,
    });

    for (const item of existingItems) {
      if (item.agentId !== agentId) continue;
      const oldText = getClassificationText(
        item.title,
        item.vitalInformation || ''
      );
      const { embedding: oldEmbedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: oldText,
      });
      const sim = cosineSimilarity(newEmbedding, oldEmbedding);
      if (sim > 0.8) return true;
    }
    return false;
  } catch (err) {
    console.error('error checking duplicates:', err);
    return false;
  }
}

// Add these utility functions at the top level
function sanitizeDate(date: Date): string {
  try {
    // Ensure valid date and prevent XSS
    return new Date(date.getTime()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (err) {
    console.error('0xHypr', 'sanitizeDate error', err);
    return new Date().toLocaleDateString(); // fallback to current date
  }
}

function validateApiKey(apiKey: string | null): asserts apiKey is string {
  if (!apiKey?.trim()) {
    throw new Error('Please set your OpenAI API key in Settings');
  }
  if (apiKey.length < 20) { // basic length check
    throw new Error('Invalid API key format');
  }
}

function sanitizePrompts(prompts: string[]): string {
  return prompts
    .filter(Boolean)
    .map(p => p.trim())
    .join('\n\n');
}

// Update the time range utility to include timeframe
function getTimeRange(minutes: number = 5) {
  const now = new Date();
  const startTime = new Date(now.getTime() - minutes * 60 * 1000);
  
  return {
    startTime: startTime.toISOString(),
    endTime: now.toISOString(),
    timeframe: `last ${minutes} minutes`
  };
}

export function EventClassification() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(null);
  const [currentClassificationId, setCurrentClassificationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // store-based
  const { autoClassifyEnabled, setAutoClassifyEnabled } = useSettingsStore();
  const { 
    recognizedItems,
    setRecognizedItems,
    addRecognizedItem,
    addLog,
    clearItemsBeforeDate,
    clearItemsByAgent,
    agents
  } = useClassificationStore();

  const isDemoMode = useDashboardStore((state) => state.isDemoMode);
  const { toast } = useToast();

  const filteredRecognizedItems = useMemo(() => {
    return recognizedItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vitalInformation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recognizedItems, searchQuery]);

  // load items on mount
  useEffect(() => {
    if (isDemoMode) {
      setRecognizedItems(demoRecognizedItems);
    } else {
      window.api.readRecognizedItems().then((items) => {
        if (Array.isArray(items)) setRecognizedItems(items);
      });
    }
  }, [isDemoMode, setRecognizedItems]);

  // save recognized items to disk if not in demo
  useEffect(() => {
    if (!isDemoMode) {
      window.api.saveRecognizedItems(recognizedItems).catch((err) => {
        console.error('error saving recognized items:', err);
      });
    }
  }, [isDemoMode, recognizedItems]);

  function handleError(err: unknown, context: string) {
    console.error('classification error', context, err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    addLog({ message: `Error in ${context}`, success: false, timestamp: new Date().toISOString(), error: msg });
    return msg;
  }

  // Update the classification function
  const classifyContent = async () => {
    const classificationId = crypto.randomUUID();
    setCurrentClassificationId(classificationId);
    const addStep = useAgentStepsStore.getState().addStep;

    try {
      const openaiApiKey = getApiKey();
      validateApiKey(openaiApiKey);
      
      const activeAgents = agents.filter((agent) => {
        if (!isDemoMode && !agent.isReady) return false;
        return agent.isActive;
      });

      const combinedPrompts = sanitizePrompts(
        activeAgents.map((a) => `${a.name}: ${a.detectorPrompt?.trim()}`)
      );

      // Step 1: Create Plan
      addStep(classificationId, {
        humanAction: 'Creating classification plan',
        text: searchQuery.trim() 
          ? `Planning search strategy for: "${searchQuery.trim()}"`
          : 'Planning classification strategy for recent content',
      });

      const openai = createOpenAI({ apiKey: openaiApiKey });
      const timeRange = getTimeRange(5); // Last 5 minutes

      const { object: planResult } = await generateObject({
        model: openai('gpt-4o'),
        schema: planningSchema,
        prompt: `
Create a plan to ${searchQuery ? `search for "${searchQuery}"` : 'analyze recent content'}.
Consider what specific information we need to look for and how to find it.
Generate specific search queries that will help find relevant information.
Focus on quality over quantity.

Available agents and their purposes:
${combinedPrompts}

Current timeframe: ${timeRange.timeframe}
        `.trim()
      });

      // Safely handle the plan result
      if (!planResult?.plan) {
        throw new Error('Failed to generate a valid plan');
      }

      const plan = planResult.plan;

      addStep(classificationId, {
        humanAction: 'Plan created',
        text: `Plan rationale: ${plan.rationale}\n\nSteps:\n${plan.steps.map(s => `- ${s}`).join('\n')}`,
        finishReason: 'complete'
      });

      // Step 2: Execute Searches Based on Plan
      addStep(classificationId, {
        humanAction: 'Executing searches based on plan',
        text: `Running ${plan.searchQueries.length} search queries...`,
      });

      interface SearchResult {
        query: {
          query: string;
          rationale: string;
          contentType: 'ocr' | 'audio' | 'ui';
        };
        results: any; // Type from screenpipe-search results
      }

      const searchResults: SearchResult[] = [];
      for (const searchQuery of plan.searchQueries) {
        try {
          const searchResult = await screenpipeSearch.execute(
            {
              query: searchQuery.query,
              contentType: searchQuery.contentType,
              appName: 'hypr', // Required by schema
              startTime: timeRange.startTime,
              endTime: timeRange.endTime,
              humanReadableAction: `Searching for: ${searchQuery.query} (${searchQuery.rationale})`
            },
            {
              toolCallId: crypto.randomUUID(),
              messages: []
            }
          );

          if ('error' in searchResult) {
            console.error('0xHypr', 'Search error:', searchResult.error);
            continue;
          }

          searchResults.push({
            query: searchQuery,
            results: searchResult
          });
        } catch (err) {
          console.error('0xHypr', 'Search execution error:', err);
          continue;
        }
      }

      // Step 3: Serialize Results
      addStep(classificationId, {
        humanAction: 'Analyzing and classifying results',
        text: `Processing ${searchResults.length} search results...`,
      });

      try {
        const classificationResult = await classificationSerializer.execute(
          {
            type: 'event',
            title: searchQuery || 'Recent Content Analysis',
            vitalInformation: JSON.stringify(searchResults),
            confidence: 0.9,
            source: {
              text: 'Classification from search results',
              timestamp: new Date().toISOString(),
            }
          },
          {
            toolCallId: crypto.randomUUID(),
            messages: []
          }
        );

        // Process results
        if (classificationResult) {
          // Convert single classification to array format for consistency
          const items = Array.isArray(classificationResult) ? classificationResult : [classificationResult];
          
          for (const item of items) {
            const agent = activeAgents.find((a) => a.type === item.type);
            if (!agent?.id) continue;

            // Check for duplicates before adding
            const isDuplicate = await isDuplicateClassification(item, agent.id, recognizedItems);
            if (isDuplicate) {
              console.log("0xHypr", "Skipping duplicate item", item.title);
              continue;
            }

            const recognizedItem = {
              id: crypto.randomUUID(),
              agentId: agent.id,
              title: item.title,
              type: item.type,
              vitalInformation: item.vitalInformation,
              data: {
                confidence: item.confidence,
                date: item.date || null,
                time: item.time || null,
                amount: item.amount || null,
              },
              source: item.source,
              status: 'pending' as const,
              createdAt: new Date().toISOString(),
            };

            addRecognizedItem(recognizedItem);
          }

          // Add final summary
          addStep(classificationId, {
            text: 'Classification completed',
            finishReason: 'complete',
            humanResult: `Found ${items.length} items`,
          });
        }
      } catch (err) {
        const msg = handleError(err, 'classifyContent');
        setClassificationError(msg);
        
        if (classificationId) {
          addStep(classificationId, {
            humanAction: 'Error occurred',
            text: msg,
            finishReason: 'error',
          });
        }
      }

    } catch (err) {
      const msg = handleError(err, 'classifyContent');
      setClassificationError(msg);
      
      if (classificationId) {
        addStep(classificationId, {
          humanAction: 'Error occurred',
          text: msg,
          finishReason: 'error',
        });
      }
    }
  };

  // run classification
  const classifyInterval = useCallback(
    async () => {
      setIsClassifying(true);
      setClassificationError(null);
      try {
        await classifyContent();
        setLastClassifiedAt(new Date());
      } catch (err) {
        const msg = handleError(err, 'classifyInterval');
        setClassificationError(msg);
      } finally {
        setIsClassifying(false);
      }
    },
    []
  );

  // auto classify effect
  useEffect(() => {
    if (!autoClassifyEnabled) return;

    // Initial classification
    classifyInterval();

    // Set up interval
    const handle = setInterval(() => {
      classifyInterval();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(handle);
  }, [autoClassifyEnabled, classifyInterval]);

  // manual classify
  const handleManualClassification = () => {
    classifyInterval();
  };

  // user actions
  const handleItemAction = async (
    item: RecognizedItem,
    action: 'deleted' | 'ignored' | 'completed'
  ) => {
    try {
      const status: RecognizedItemStatus = {
        id: item.id,
        status: action,
        timestamp: new Date().toISOString(),
        itemType: item.type,
        title: item.title,
      };
      await window.api.updateItemStatus(status);

      if (action === 'deleted') {
        await window.api.deleteRecognizedItem(item.id);
        useClassificationStore.setState({
          recognizedItems: recognizedItems.filter((i) => i.id !== item.id),
        });
      }

      toast({
        title: `Item ${action}`,
        description: `Item "${item.title}" marked as ${action}.`,
      });
    } catch (e) {
      console.error('Error updating item action', e);
      toast({
        title: 'Error',
        description: String(e),
        variant: 'destructive',
      });
    }
  };

  // item rendering
  const renderRecognizedItem = useCallback(
    (item: RecognizedItem) => {
      const agent = agents.find((a) => a.id === item.agentId);
      if (!agent) {
        return (
          <div key={item.id} className="border-b p-4 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.vitalInformation}</div>
            </div>
            <Button variant="outline" onClick={() => handleItemAction(item, 'completed')}>
              done
            </Button>
            <Button variant="outline" onClick={() => handleItemAction(item, 'deleted')}>
              delete
            </Button>
          </div>
        );
      }
      if (!agent.eventAction) {
        return (
          <div key={item.id} className="border-b p-4 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.vitalInformation}</div>
            </div>
            <Button variant="outline" onClick={() => handleItemAction(item, 'completed')}>
              done
            </Button>
            <Button variant="outline" onClick={() => handleItemAction(item, 'deleted')}>
              delete
            </Button>
          </div>
        );
      }
      // if agent has custom eventAction, use it:
      return (
        <div key={item.id} className="border-b p-4">
          {agent.eventAction(item, () => handleItemAction(item, 'deleted'))}
        </div>
      );
    },
    [agents]
  );

  // First, add a new function to handle search-based classification
  const handleSearchClassification = () => {
    if (!searchQuery.trim() || isClassifying) return;
    handleManualClassification();
  };

  return (
    <div className="flex h-screen p-6 bg-background">
      {/* Main content area - using grid for better space management */}
      <div className="grid grid-cols-[1fr,400px] gap-6 w-full">
        {/* Left side - recognized items */}
        <div className="flex flex-col space-y-6 min-w-0">
          {/* Search bar with improved spacing */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClassification();
                  }
                }}
                placeholder="Search and classify content..."
                className="pl-10 h-10"
              />
            </div>
            <Button 
              variant="secondary"
              onClick={handleSearchClassification}
              disabled={isClassifying || !searchQuery.trim()}
              className="h-10 px-4 min-w-[100px]"
            >
              {isClassifying ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse_1s_ease-in-out_infinite]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
                  </div>
                  <span className="ml-2">Searching...</span>
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Controls card */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>recognized items</CardTitle>
                <CardDescription>auto-detected tasks / invoices / events</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => clearItemsBeforeDate(new Date())}>
                      Clear Old Items
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => clearItemsByAgent('all')}
                      className="text-destructive"
                    >
                      Clear All Items
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-classify"
                    checked={autoClassifyEnabled}
                    onCheckedChange={setAutoClassifyEnabled}
                  />
                  <Label htmlFor="auto-classify">auto-classify every 5m</Label>
                </div>
                <Button
                  variant="outline"
                  onClick={handleManualClassification}
                  disabled={isClassifying}
                  className="h-8"
                >
                  {isClassifying ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse_1s_ease-in-out_infinite]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
                      </div>
                      <span className="ml-2">classifying...</span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5" />
                      classify now
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {lastClassifiedAt
                  ? `Last run: ${lastClassifiedAt.toLocaleTimeString()}`
                  : 'never'}
              </div>

              {classificationError && (
                <div className="mt-2 text-red-500">{classificationError}</div>
              )}
            </CardContent>
          </Card>

          {/* Recognized items list with flex-1 to take remaining space */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader>
              <CardTitle>inbox</CardTitle>
              <CardDescription>
                tasks, events, invoices that the agent found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-2">
                  {filteredRecognizedItems.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      {searchQuery ? 'No items match your search' : 'no items yet'}
                    </div>
                  ) : (
                    filteredRecognizedItems.map(renderRecognizedItem)
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right side: steps / logs - fixed width */}
        <div className="w-[400px]">
          <Card className="h-full">
            <CardContent className="p-0">
              {currentClassificationId ? (
                <AgentStepsView 
                  recognizedItemId={currentClassificationId} 
                  className="h-[calc(100vh-3rem)]"
                  maxContentHeight="md" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  no classification in progress
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
