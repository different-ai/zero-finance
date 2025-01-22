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
import { generateText, embed, cosineSimilarity } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { AgentStepsView } from '@/components/agent-steps-view';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { tool } from 'ai';
import { RecognizedItemStatus } from '@/types/electron';

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

// Helper function to combine classification text for embedding
function getClassificationText(title: string, vitalInfo: string): string {
  return `${title.toLowerCase().trim()} ${vitalInfo.toLowerCase().trim()}`;
}

// Duplicate detection using embeddings
async function isDuplicateClassification(
  newClassification: ClassificationResult,
  agentId: string | undefined,
  allItems: RecognizedItem[]
): Promise<boolean> {
  if (!agentId) return false;
  console.log('0xHypr', 'isDuplicateClassification', {
    newClassification,
    agentId,
    allItems,
  });

  try {
    // Get OpenAI instance
    const openai = createOpenAI({ apiKey: getApiKey() });

    // Get text for new classification
    const newText = getClassificationText(
      newClassification.title,
      newClassification.vitalInformation
    );

    // Get embedding for new text
    const { embedding: newEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: newText,
    });

    // Get all item statuses (including ignored, completed, deleted)
    const itemStatuses = await window.api.getItemStatuses();

    // Filter items to only check against same agent type
    const sameTypeItems = allItems.filter((item) => item.agentId === agentId);

    // Check each existing item
    for (const item of sameTypeItems) {
      const oldText = getClassificationText(item.title, item.vitalInformation);

      const { embedding: oldEmbedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: oldText,
      });

      const similarity = cosineSimilarity(newEmbedding, oldEmbedding);
      console.log('0xHypr', 'Similarity score for active item', {
        new: newText,
        existing: oldText,
        score: similarity,
      });

      // If similarity is very high (0.9+), consider it a duplicate
      if (similarity > 0.8) {
        return true;
      }
    }

    // Check items in different statuses
    for (const status of itemStatuses) {
      // Skip if not the same type as our agent
      if (status.itemType !== newClassification.type) continue;

      const oldText = getClassificationText(
        status.title,
        '' // We don't have vitalInformation in status, but title is often enough
      );

      const { embedding: oldEmbedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: oldText,
      });

      const similarity = cosineSimilarity(newEmbedding, oldEmbedding);
      console.log('0xHypr', 'Similarity score for status item', {
        new: newText,
        existing: oldText,
        status: status.status,
        score: similarity,
      });

      // If similarity is very high (0.9+), consider it a duplicate
      if (similarity > 0.9) {
        console.log('0xHypr', 'Found duplicate in status:', status.status);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('0xHypr', 'Error checking for duplicates:', error);
    return false; // On error, allow the item through
  }
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
  const [processingItems, setProcessingItems] = useState<any[]>([]);
  const [isProcessingLock, setIsProcessingLock] = useState(false);

  // Get auto-classify from settings store
  const { autoClassifyEnabled, setAutoClassifyEnabled } = useSettingsStore();

  // Classification store
  const {
    addLog,
    addProcessedContent,
    hasProcessedContent,
    addRecognizedItem,
    recognizedItems = [],
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
      .map((a) =>
        [`${a.name}: ${a.detectorPrompt?.trim()}`].filter(Boolean).join('\n\n')
      )
      .filter(Boolean)
      .join('\n\n');

    console.log('0xHypr', 'combinedDetectorPrompts', combinedDetectorPrompts);
    // Access the steps store
    const addStep = useAgentStepsStore.getState().addStep;
    // Add an initial step to the steps store
    addStep(classificationId, {
      humanAction: 'Starting content classification',
      finishReason: 'complete',
    });
    console.log('0xHypr', 'combinedDetectorPrompts', combinedDetectorPrompts);

    // Prepare the system instructions
    const systemInstructions = `
    Today is ${new Date().toLocaleDateString()}
You are the Classification Agent. Your job is to identify real, actionable events that require user attention or action.

To find things to classify you need to first search for content with screenpipeSearch.
only then can you start classifying the content.

CORE PRINCIPLE: Quality over quantity. Only classify if you're highly confident (>0.8) that the item requires action.

1. ACTIVE AGENTS
${activeAgents.map((a) => `${a.name}: ${a.detectorPrompt?.trim()}`).join('\n')}


Always use screenpipeSearch first to search for content.

Start with the screeenpipeSearch tool to search for content.
Then use the classificationSerializer tool to extract relevant information from the content.

Don't confuse an invoice sent to me vs an invoice i need to send.

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
      model: openai('o1'),
      maxSteps: 8,
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
      // experimental_providerMetadata: {
      //   openai: {
      //     reasoningEffort: 'low',
      //   },
      // },
      onStepFinish({ text, toolCalls, toolResults, finishReason }) {
        // Each "step" can invoke 0+ tools. We'll store them as steps.
        let humanAction = 'Analyzing content';
        console.log(toolCalls, toolResults);
        if (toolResults[0]?.toolName === 'screenpipeSearch') {
          humanAction = `${toolResults[0].args.humanReadableAction || ''}`;
        }
        addStep(classificationId, {
          text,
          toolCalls,
          toolResults,
          finishReason,
          humanAction: humanAction,
        });

        // Track newly added items during this processing
        const newlyAddedItems: RecognizedItem[] = [];

        // Each time the tool calls classificationSerializer, we can add
        // recognized items to the store on the fly:
        toolCalls?.forEach(async (call, idx) => {
          if (
            'toolName' in call &&
            call.toolName === 'classificationSerializer' &&
            toolResults?.[idx]
          ) {
            const result = toolResults[idx];
            console.log('0xHypr', 'Processing classification result', result);
            if ('result' in result && result.result) {
              const classification = result.result as ClassificationResult;

              // Skip if no classification was returned (due to low confidence)
              if (!classification) {
                console.log('0xHypr', 'Classification skipped - no result', {
                  toolCall: call,
                });
                return;
              }

              // Skip if we're currently processing another item
              if (isProcessingLock) {
                console.log('0xHypr', 'Skipping due to processing lock');
                return;
              }

              // Set processing lock
              setIsProcessingLock(true);

              try {
                // Identify the matching agent for that classification
                const agent = activeAgents.find(
                  (a) => a.type === classification.type
                );

                if (!agent) {
                  console.log('0xHypr', 'No matching agent found', {
                    type: classification.type,
                  });
                  return;
                }

                // Add to processing items before duplicate check
                const processingItem = {
                  id: crypto.randomUUID(),
                  type: classification.type,
                  title: classification.title,
                  source: 'ai-classification',
                  vitalInformation: classification.vitalInformation,
                  agentId: agent.id,
                  data: {
                    confidence: classification.confidence,
                  },
                };

                // Get current state immediately before check
                const currentRecognizedItems = useClassificationStore.getState().recognizedItems;
                const currentProcessingItems = processingItems;
                
                // Check for duplicates including both recognized and currently processing items
                const allItems = [...currentRecognizedItems, ...currentProcessingItems];
                console.log('0xHypr', 'Checking duplicates against items:', {
                  recognizedCount: currentRecognizedItems.length,
                  processingCount: currentProcessingItems.length,
                  total: allItems.length
                });

                const isDuplicate = await isDuplicateClassification(
                  classification,
                  agent.id,
                  allItems
                );

                if (isDuplicate) {
                  console.log('0xHypr', 'Skipping duplicate classification', {
                    title: classification.title,
                    type: classification.type,
                  });
                  return;
                }

                // If not a duplicate, add to recognized items
                addRecognizedItem(processingItem);

                // Log success with confidence score
                addLog({
                  message: `Recognized new ${classification.type}: ${
                    classification.title
                  } (confidence: ${(classification.confidence * 100).toFixed(
                    0
                  )}%)`,
                  timestamp: new Date().toISOString(),
                  success: true,
                  results: [
                    {
                      type: classification.type,
                      title: classification.title,
                    },
                  ],
                });
              } catch (error) {
                console.error('0xHypr', 'Error processing classification:', error);
              } finally {
                // Release processing lock
                setIsProcessingLock(false);
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
  // Item Status Management
  // --------------------------------------------
  const handleItemAction = async (
    item: RecognizedItem,
    action: 'deleted' | 'ignored' | 'completed',
    reason?: string
  ) => {
    try {
      const status: RecognizedItemStatus = {
        id: item.id,
        status: action,
        timestamp: new Date().toISOString(),
        itemType: item.type,
        title: item.title,
        reason,
      };

      // Update item status
      await window.api.updateItemStatus(status);

      // If deleted, remove from recognized items
      if (action === 'deleted') {
        await window.api.deleteRecognizedItem(item.id);
        // Only clear the specific item, not all items from the agent
        const updatedItems = recognizedItems.filter(i => i.id !== item.id);
        useClassificationStore.setState({ recognizedItems: updatedItems });
      }

      // Show success toast
      toast({
        title: `Item ${action}`,
        description: `Successfully ${action} item: ${item.title}`,
      });
    } catch (error) {
      console.error('0xHypr', `Failed to ${action} item:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} item: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // --------------------------------------------
  // Discard recognized item
  // --------------------------------------------
  const discardRecognizedItem = (id: string) => {
    const item = recognizedItems.find((i) => i.id === id);
    if (item) {
      handleItemAction(item, 'deleted');
    }
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
      <div key={item.id} className="flex items-center gap-2 w-full group border-b">
        {/* Menu on the left */}
            {/* Content fills remaining width */}
            <div className="flex-1 min-w-0 ">
          {agent.eventAction(item, () => discardRecognizedItem(item.id))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleItemAction(item, 'completed')}
            >
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleItemAction(item, 'ignored')}
            >
              Ignore to prevent future classification
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleItemAction(item, 'deleted')}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

    
      </div>
    );
  };

  // --------------------------------------------
  // The component's JSX
  // --------------------------------------------
  return (
    <div className="flex gap-4 h-screen p-4">
      {/* Main content */}
      <div className="flex-1 space-y-4 overflow-auto">
        {/* Classification controls */}
        <Card className="w-full">
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
                      onCheckedChange={setAutoClassifyEnabled}
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
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
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
        <Card className="w-full flex-1">
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>
              Recently detected items from your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[calc(100vh-20rem)]">
            <div className="space-y-4">
              {recognizedItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No items detected yet
                </div>
              ) : (
                recognizedItems.map(renderRecognizedItem)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Steps / Logging sidebar */}
      <div className="w-[350px] shrink-0">
        <Card className="h-full">
          <CardContent className="p-0">
            {currentClassificationId ? (
              <AgentStepsView
                recognizedItemId={currentClassificationId}
                className="h-[calc(100vh-2rem)]"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No classification in progress
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
