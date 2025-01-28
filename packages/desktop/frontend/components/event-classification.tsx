import React, { useState, useEffect, useCallback } from 'react';
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
import { Clock, MoreVertical, Zap } from 'lucide-react';

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
import { generateText, embed, cosineSimilarity } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { AgentStepsView } from '@/components/agent-steps-view';
import { RecognizedItemStatus } from '@/types/electron';

// import our simplified classification serializer
import { classificationSerializer } from '@/agents/tools/classification-serializer';

// import the single-step screenpipe search
import { screenpipeSearch } from '@/agents/tools/screenpipe-search';

import { planningTool } from '@/agents/tools/planning-tool';

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

export function EventClassification() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(null);
  const [currentClassificationId, setCurrentClassificationId] = useState<string | null>(null);

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

  // primary classification function
  const classifyContent = async () => {
    const classificationId = crypto.randomUUID();
    setCurrentClassificationId(classificationId);

    try {
      const openaiApiKey = getApiKey();
      if (!openaiApiKey) throw new Error('Please set your OpenAI API key in Settings');
      const openai = createOpenAI({ apiKey: openaiApiKey });

      const activeAgents = agents.filter((agent) => {
        if (!isDemoMode && !agent.isReady) return false;
        return agent.isActive;
      });
      const combinedPrompts = activeAgents
        .map((a) => `${a.name}: ${a.detectorPrompt?.trim()}`)
        .filter(Boolean)
        .join('\n\n');

      const addStep = useAgentStepsStore.getState().addStep;
    addStep(classificationId, {
        humanAction: 'begin classification with planning step',
        finishReason: 'complete',
      });

      const systemInstructions = `

Date is ${new Date().toLocaleDateString()}.
You are the "Super Classification Agent" who first plans then executes classification.

**Required Flow**:
1) First call planningTool to outline your approach (e.g. "I'll do a broad search, then classify results")
2) Then call screenpipeSearch with the query "invoice OR pay OR payment OR send money OR transfer OR wire OR due OR deadline OR bill OR event OR meeting OR schedule OR task"
3) Finally, if you find real actionable items, call classificationSerializer (confidence must be > 0.8)

We have the following specialized agents:
${combinedPrompts}

Only do one search. Focus on quality over quantity.
You can revise your plan mid-run by calling planningTool again if needed.

Today is ${new Date().toLocaleDateString()}.
`;

      // multi-step llm run
      const { text, toolCalls, toolResults } = await generateText({
        model: openai('gpt-4o'),
        maxSteps: 10,
        tools: {
          planningTool,
          screenpipeSearch,
          classificationSerializer,
        },
        messages: [
          { role: 'system', content: systemInstructions },
          {
            role: 'user',
            content: 'please begin with your plan, then proceed with classification.',
          },
        ],
        onStepFinish: async ({ text, toolCalls, toolResults, finishReason }) => {
          // store each step
          let stepMsg = 'observing llm output';
          
          // Handle planning tool steps
          if (toolResults[0]?.toolName === 'planningTool') {
            const plan = toolResults[0].result;
            stepMsg = `Plan created: ${plan.steps.join(' → ')}`;
          }
          // Handle search steps
          else if (toolResults[0]?.toolName === 'screenpipeSearch') {
            stepMsg = toolResults[0].args?.humanReadableAction || 'screenpipe searching...';
          }

          addStep(classificationId, {
            text,
            toolCalls,
            toolResults,
            finishReason,
            humanAction: stepMsg,
            });

          // check for classificationSerializer calls
          if (toolCalls) {
            for (let i = 0; i < toolCalls.length; i++) {
              const call = toolCalls[i];
              if (call.toolName === 'classificationSerializer') {
                const result = toolResults?.[i];
                if (!result || !('result' in result)) continue;

                const classification = result.result as ClassificationResult;
                if (!classification) continue;

                // prevent double-processing
                if (classificationError) continue;

                // see if we have an agent for the classification type
                const agent = activeAgents.find((a) => a.type === classification.type);
                if (!agent) {
                  console.log('No agent for type', classification.type);
                  continue;
                }

                // check duplicates
                const allAgentItems = recognizedItems.filter((x) => x.agentId === agent.id);
                const isDup = await isDuplicateClassification(classification, agent.id, allAgentItems);
                if (isDup) {
                  console.log('Skipping duplicate classification:', classification);
                  continue;
                }

                // store recognized item
                  const recognized: RecognizedItem = {
                    id: crypto.randomUUID(),
                    type: classification.type,
                    title: classification.title,
                    source: 'ai-classification',
                    vitalInformation: classification.vitalInformation,
                    agentId: agent.id,
                    data: {
                      confidence: classification.confidence,
                      date: classification.date ?? null,
                      time: classification.time ?? null,
                      amount: classification.amount ?? null,
                    },
                  };
                  addRecognizedItem(recognized);

                  addLog({
                    message: `new item: ${classification.title}`,
                    timestamp: new Date().toISOString(),
                    success: true,
                  });
                }
              }
            }
          },
        });

      addStep(classificationId, {
        text: text ?? '',
          finishReason: 'complete',
        humanResult: 'classification done (with planning)',
        });
    } catch (err) {
      const msg = handleError(err, 'classifyContent');
      setClassificationError(msg);
    }
  };

  // run classification
  const classifyInterval = useCallback(
    async (startTime: string, endTime: string) => {
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

    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60_000);
    classifyInterval(twoMinutesAgo.toISOString(), now.toISOString());

    const handle = setInterval(() => {
      const newNow = new Date();
      const fiveMinAgo = new Date(newNow.getTime() - 5 * 60_000);
      classifyInterval(fiveMinAgo.toISOString(), newNow.toISOString());
    }, 5 * 60_000);

    return () => clearInterval(handle);
  }, [autoClassifyEnabled, classifyInterval]);

  // manual classify
  const handleManualClassification = () => {
    const now = new Date();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60_000);
    classifyInterval(fiveMinAgo.toISOString(), now.toISOString());
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

  return (
    <div className="flex gap-4 h-screen">
      {/* left side */}
      <div className="flex-1 space-y-4 overflow-auto">
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
              >
                {isClassifying ? (
                  <>
                    <Zap className="mr-1 h-4 w-4 animate-spin" />
                    classifying...
                  </>
                ) : (
                  <>
                    <Zap className="mr-1 h-4 w-4" />
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

        {/* recognized items list */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>inbox</CardTitle>
            <CardDescription>
              tasks, events, invoices that the agent found
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {recognizedItems.length === 0 ? (
              <div className="text-center text-muted-foreground">no items yet</div>
            ) : (
              recognizedItems.map(renderRecognizedItem)
            )}
          </CardContent>
        </Card>
      </div>

      {/* right side: steps / logs */}
      <div className="w-[350px] shrink-0">
        <Card className="h-full">
          <CardContent className="p-0">
            {currentClassificationId ? (
              <AgentStepsView recognizedItemId={currentClassificationId} className="h-[calc(100vh-2rem)]" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                no classification in progress
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}