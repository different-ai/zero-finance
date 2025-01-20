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
import { Zap, MoreVertical, Clock, Trash2 } from 'lucide-react';
import { useApiKeyStore } from '@/stores/api-key-store';
import { useToast } from '@/hooks/use-toast';
import { useClassificationStore } from '@/stores/classification-store';
import {
  Agent,
  RecognizedContext,
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
import { useSettingsStore } from '@/stores/settings-store';
import { generateText } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { AgentStepsView } from '@/components/agent-steps-view';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { tool } from 'ai';

// NOTE: classificationSerializer is the final "serialization tool"
import { classificationSerializer } from '@/agents/tools/classification-serializer';

// NOTE: screenpipeSearch is the search tool
import { screenpipeSearch } from '@/agents/tools/screenpipe-search';
import { markdownSearch } from '@/agents/tools/markdown-search';

// --------------------------------------------
// Error handler helper
// --------------------------------------------
const createErrorHandler =
  (addLog: Function) => (error: unknown, context: string) => {
    console.error('0xHypr', `Error in ${context}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    addLog({
      message: `Error in ${context}`,
      timestamp: new Date().toISOString(),
      success: false,
      error: errorMessage,
    });
    return errorMessage;
  };

// --------------------------------------------
// Types
// --------------------------------------------
export interface RecognizedItem extends RecognizedContext {
  title: string;
  agentId: string;
  data: any;
}



// --------------------------------------------
// Component
// --------------------------------------------
export function EventClassification() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(
    null
  );
  const [currentClassificationId, setCurrentClassificationId] = useState<
    string | null
  >(null);

  // Classification store
  const {
    addLog,
    addProcessedContent,
    hasProcessedContent,
    addRecognizedItem,
    recognizedItems = [],
    autoClassifyEnabled,
    setAutoClassify,
    clearItemsBeforeDate,
    clearItemsByAgent,
    agents,
  } = useClassificationStore();

  // Other hooks
  const { apiKey } = useApiKeyStore();
  const { toast } = useToast();

  // Central error handler
  const handleError = createErrorHandler(addLog);

  // ------------------------------------------
  // Primary classification function
  // ------------------------------------------
  const classifyContent = async () => {
    const classificationId = crypto.randomUUID();
    setCurrentClassificationId(classificationId);

    // Check for user's OpenAI API Key
    const openaiApiKey = getApiKey();
    if (!openaiApiKey) {
      throw new Error('Please set your OpenAI API key in settings');
    }

    // Create OpenAI instance
    const openai = createOpenAI({ apiKey: openaiApiKey });

    // Determine which agents are active (and ready if not in demoMode)
    const isDemoMode = useDashboardStore.getState().isDemoMode;
    const activeAgents = agents.filter((agent) => {
      if (!isDemoMode && !agent.isReady) {
        return false;
      }
      return agent.isActive;
    });

    // We collect all agent detector prompts in a single string
    // so the classifier can see them in the "system" message.
    const combinedDetectorPrompts = activeAgents
      .map((a) => [`${a.name}: ${a.detectorPrompt?.trim()}`].filter(Boolean).join('\n\n'))
      .filter(Boolean)
      .join('\n\n');

    console.log('0xHypr', 'combinedDetectorPrompts', combinedDetectorPrompts);
    // Access the steps store
    const addStep = useAgentStepsStore.getState().addStep;
    const currentItems =
      useClassificationStore.getState().recognizedItems || [];

    // Add an initial step to the steps store
    addStep(classificationId, {
      humanAction: 'Starting content classification',
      finishReason: 'complete',
    });
    console.log('0xHypr', 'combinedDetectorPrompts', combinedDetectorPrompts);

    // Prepare the system instructions
    const systemInstructions = `
You are the Classification Agent. Your job is to identify real, actionable events that require user attention or action.

CORE PRINCIPLE: Quality over quantity. Only classify if you're highly confident (>0.8) that the item requires action.

1. ACTIVE AGENTS
${activeAgents.map((a) => `${a.name}: ${a.detectorPrompt?.trim()}`).join('\n')}

2. CLASSIFICATION RULES
   REQUIRE these for classification:
   - Specific, actionable items (real invoices, concrete tasks, scheduled meetings)
   - Clear next steps or due dates
   - Explicit amounts, dates, or action requests
   
   IGNORE these (do not classify):
   - Documentation or API references
   - General discussions or concepts
   - Partial or ambiguous matches
   - Historical or archived content

3. SEARCH PROCESS
   a) Use screenpipeSearch to find content:
      - Search both OCR (screen) and audio (microphone) content
      - Use humanReadableAction to describe your search intent
      - Focus on recent content first
   
   b) For real matches, use classificationSerializer:
      {
        title: "Clear, action-oriented title",
        type: "invoice" | "task" | "event" | "goal",
        vitalInformation: "Key details: amounts, dates, actions needed",
        confidence: 0.85, // Must be >0.8 for real actionable items
        source: {
          text: "Original matched content",
          timestamp: "When detected",
          context: "Additional context if relevant"
        }
      }

4. EXAMPLES
   ✅ CLASSIFY:
   - "Please pay invoice #123 for $500 by March 31"
   - "Meeting scheduled with John tomorrow at 2pm"
   - "Task due: Submit Q1 report by Friday"

   ❌ DO NOT CLASSIFY:
   - "Documentation about invoice processing"
   - "Example of how to create an invoice"
   - "Discussion about meeting formats"

GOAL: Keep the inbox focused on real, actionable items only. Better to miss a borderline case than create noise.
`;

    // Add the readMarkdownFile tool definition before the classifyContent function
    const readMarkdownFileTool = tool({
      description:
        'Read the complete contents of a markdown file when you need more context than the snippet provides.',
      parameters: z.object({
        filePath: z
          .string()
          .describe('The full path to the markdown file to read'),
      }),
      execute: async ({ filePath }) => {
        try {
          const content = await window.api.readMarkdownFile(filePath);
          return content;
        } catch (error) {
          console.error('0xHypr', 'Error reading markdown file:', error);
          return { error: 'Failed to read markdown file' };
        }
      },
    });

    // Now call generateText with the relevant tools
    const {
      text: classificationText,
      toolCalls,
      toolResults,
    } = await generateText({
      model: openai('gpt-4o'),
      maxSteps: 10,
      toolChoice: 'required',
      tools: {
        screenpipeSearch,
        classificationSerializer,
      },
      messages: [
        {
          role: 'system',
          content: systemInstructions,
        },
      ],
      onStepFinish({ text, toolCalls, toolResults, finishReason }) {
        // Each "step" can invoke 0+ tools. We'll store them as steps.
        let humanAction = 'Analyzing content';
        console.log(toolCalls, toolResults);
        if (toolResults[0].toolName === 'screenpipeSearch') {
          humanAction = `${toolResults[0].args.humanReadableAction || ''}`;
        }
        addStep(classificationId, {
          text,
          toolCalls,
          toolResults,
          finishReason,
          humanAction: humanAction,
        });

        // Each time the tool calls classificationSerializer, we can add
        // recognized items to the store on the fly:
        toolCalls?.forEach((call, idx) => {
          if (
            'toolName' in call &&
            call.toolName === 'classificationSerializer' &&
            toolResults?.[idx]
          ) {
            const result = toolResults[idx];
            if ('result' in result && result.result) {
              const classification = result.result as ClassificationResult;
              
              // Skip if no classification was returned (due to low confidence)
              if (!classification) {
                console.log("0xHypr", "Classification skipped", { toolCall: call });
                return;
              }

              // Identify the matching agent for that classification
              const agent = activeAgents.find(
                (a) => a.type === classification.type
              );
              if (agent) {
                const newItem: RecognizedItem = {
                  id: crypto.randomUUID(),
                  type: classification.type,
                  title: classification.title,
                  source: 'ai-classification',
                  vitalInformation: classification.vitalInformation,
                  agentId: agent.id,
                  data: {
                    confidence: classification.confidence,
                    source: classification.source
                  },
                };

                // Add the new item
                addRecognizedItem(newItem);

                // Log success with confidence score
                addLog({
                  message: `Recognized new ${classification.type}: ${classification.title} (confidence: ${(classification.confidence * 100).toFixed(0)}%)`,
                  timestamp: new Date().toISOString(),
                  success: true,
                  results: [
                    {
                      type: classification.type,
                      title: classification.title,
                      confidence: classification.confidence
                    },
                  ],
                });
              }
            }
          }
        });
      },
    });

    // Finally, add a final step for the "done" message
    addStep(classificationId, {
      text: classificationText || '',
      humanResult: 'Classification complete',
      finishReason: 'complete',
    });

    return [];
  };

  // --------------------------------------------
  // The main "classify interval" method
  // that fetches content from Screenpipe, or from somewhere else
  // --------------------------------------------
  const classifyInterval = useCallback(
    async (startTime: string, endTime: string) => {
      setIsClassifying(true);
      setClassificationError(null);

      try {
        const { monitoredApps } = useSettingsStore.getState();
        if (!monitoredApps || monitoredApps.length === 0) {
          throw new Error(
            'No applications selected for monitoring. Please configure in settings.'
          );
        }
        console.log('0xHypr', 'Monitored apps:', monitoredApps);

        // Call classifyContent without passing content
        await classifyContent();

        setLastClassifiedAt(new Date());
      } catch (error) {
        handleError(error, 'classifying interval');
        setClassificationError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setIsClassifying(false);
      }
    },
    [
      agents,
      addLog,
      addProcessedContent,
      hasProcessedContent,
      addRecognizedItem,
    ]
  );

  // --------------------------------------------
  // Auto-classify effect
  // --------------------------------------------
  useEffect(() => {
    if (!autoClassifyEnabled) return;

    // Initial classification
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60000);
    classifyInterval(twoMinutesAgo.toISOString(), now.toISOString());

    // Periodic classification every 5 minutes
    const intervalId = setInterval(() => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
      classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
    }, 5 * 60000);

    return () => clearInterval(intervalId);
  }, [autoClassifyEnabled, classifyInterval]);

  // --------------------------------------------
  // Manual Classification Handler
  // --------------------------------------------
  const handleManualClassification = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
  };

  // --------------------------------------------
  // Discard recognized item
  // --------------------------------------------
  const discardRecognizedItem = (id: string) => {
    // We'll handle this through the store's clearItemsByAgent or similar method
    clearItemsByAgent(id);
  };

  // --------------------------------------------
  // Clear items older than 7 days
  // --------------------------------------------
  const clearOldItems = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Clear items older than 7 days
    clearItemsBeforeDate(date);
    toast({
      title: 'Cleared old items',
      description: 'Removed items older than 7 days',
    });
  };

  // --------------------------------------------
  // Render recognized items
  // --------------------------------------------
  const renderRecognizedItem = (item: RecognizedItem) => {
    const agent = agents.find((a) => a.id === item.agentId);
    if (!agent) return null;

    return (
      <div key={item.id} className="space-y-2">
        {agent.eventAction(item, () => discardRecognizedItem(item.id))}
      </div>
    );
  };

  // --------------------------------------------
  // The component's JSX
  // --------------------------------------------
  return (
    <div className="flex gap-4">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Classification controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recognized Items</CardTitle>
                <CardDescription>
                  Items automatically detected from your workflows
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {/* Clear / Overflow menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => clearItemsBeforeDate(new Date())}
                    >
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {/* Auto-classify toggle */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-classify"
                      checked={autoClassifyEnabled}
                      onCheckedChange={setAutoClassify}
                    />
                    <Label htmlFor="auto-classify">
                      Auto-classify every 5 minutes
                    </Label>
                  </div>
                  {/* Manually trigger classification */}
                  <Button
                    variant="outline"
                    onClick={handleManualClassification}
                    className="ml-4"
                    disabled={isClassifying}
                  >
                    {isClassifying ? (
                      <>
                        <span className="animate-spin mr-2">⚡</span>
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Classify Now
                      </>
                    )}
                  </Button>
                </div>
                {/* Last classification time */}
                <div className="text-sm text-muted-foreground">
                  {lastClassifiedAt ? (
                    <>
                      Last classified: {lastClassifiedAt.toLocaleTimeString()}
                    </>
                  ) : (
                    'Not classified yet'
                  )}
                </div>
              </div>

              {classificationError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {classificationError}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Latest recognized items */}
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>
              Recently detected items from your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recognizedItems.map(renderRecognizedItem)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Steps / Logging sidebar */}
      <div className="w-[350px] border rounded-lg">
        {currentClassificationId && (
          <AgentStepsView
            recognizedItemId={currentClassificationId}
            className="h-[calc(100vh-2rem)]"
          />
        )}
      </div>
    </div>
  );
}
