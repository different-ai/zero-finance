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
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';

// Add error boundary handler
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

export interface RecognizedItem extends RecognizedContext {
  title: string;
  agentId: string;
  data: any;
}

const classificationSchema = z.object({
  classifications: z.array(
    z
      .object({
        title: z.string(),
        type: z.enum(['task', 'event', 'invoice']) as z.ZodType<AgentType>,
        vitalInformation: z.string(),
      })
      .required(),
  ),
});
type Classification = z.infer<typeof classificationSchema>;

export function EventClassification() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(
    null,
  );

  const {
    addLog,
    addProcessedContent,
    hasProcessedContent,
    setRecognizedItems,
    recognizedItems = [],
    autoClassifyEnabled,
    setAutoClassify,
    clearItemsBeforeDate,
    clearItemsByAgent,
    agents,
  } = useClassificationStore();

  const { apiKey } = useApiKeyStore();
  const { toast } = useToast();

  const handleError = createErrorHandler(addLog);

  const classifyContent = async (
    content: string,
  ): Promise<Classification['classifications']> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Please set your OpenAI API key in settings');
    }

    const openai = createOpenAI({ apiKey });
    const activeAgentTypes = agents
      .filter((agent) => agent.isActive)
      .map((agent) => agent.type);

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: classificationSchema,
      prompt: `
        Analyze the following content and identify any tasks, events, or invoices.
        For each identified item, extract the relevant information and provide a confidence score.
        Only classify as types: ${activeAgentTypes.join(', ')}

        Content:
        ${content}

        Return an array of classifications, where each classification includes:
        - title: e.g. send invoice to amy, add new contact to email list, add romina's birthday to calendar
        - type: the type of item detected
        - vitalInformation: key information extracted (e.g., dates, amounts, people involved)
      `.trim(),
    });

    return object.classifications;
  };

  const classifyInterval = useCallback(
    async (startTime: string, endTime: string) => {
      setIsClassifying(true);
      setClassificationError(null);

      try {
        const healthCheck = await fetch('http://localhost:3030/health');
        if (!healthCheck.ok) {
          throw new Error(
            'Screenpipe is not running. Please start Screenpipe first.',
          );
        }

        const { monitoredApps } = useSettingsStore.getState();

        if (!monitoredApps || monitoredApps.length === 0) {
          throw new Error(
            'No applications selected for monitoring. Please configure in settings.',
          );
        }

        console.log('0xHypr', 'Monitored apps:', monitoredApps);

        const searchPromises = monitoredApps.map(async (appName) => {
          const searchParams = new URLSearchParams({
            app_name: appName.toLowerCase(),
            start_time: startTime,
            end_time: endTime,
            limit: '50',
            min_length: '10',
          });

          try {
            const response = await fetch(
              `http://localhost:3030/search?${searchParams}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              },
            );

            if (!response.ok) {
              console.warn(
                `Failed to fetch content for ${appName}:`,
                await response.text(),
              );
              return [];
            }

            const data = await response.json();
            console.log(`0xHypr`, `Content found for ${appName}:`, data);
            return (data.data || []).map((item: any) => ({
              ...item,
              app_name: appName,
            }));
          } catch (error) {
            console.error(
              `0xHypr`,
              `Error fetching content for ${appName}:`,
              error,
            );
            return [];
          }
        });

        const results = await Promise.all(searchPromises);
        const flattenedContent = results.flat();

        if (flattenedContent.length === 0) {
          addLog({
            message: 'No content found in the specified time interval',
            timestamp: new Date().toISOString(),
            success: false,
          });
          return;
        }

        const contentByApp = flattenedContent.reduce<Record<string, string[]>>(
          (acc, item) => {
            const appName = item.app_name;
            if (!acc[appName]) acc[appName] = [];
            acc[appName].push(item.content.text);
            return acc;
          },
          {},
        );

        const combinedContent = Object.entries(contentByApp)
          .map(([app, texts]) => {
            const textArray = Array.isArray(texts) ? texts : [texts];
            return `=== ${app} ===\n${textArray.join('\n')}`;
          })
          .join('\n\n');

        if (hasProcessedContent(combinedContent)) {
          console.log('0xHypr', 'Content already processed, skipping...');
          return;
        }

        // First step: Classify the content
        const classifications = await classifyContent(combinedContent);
        console.log('0xHypr', 'Classifications:', classifications);

        // Second step: Create recognized items
        const newItems: RecognizedItem[] = classifications
          .map((classification) => {
            const agent = agents.find((a) => a.type === classification.type);
            if (!agent) return null;

            const item: RecognizedItem = {
              id: crypto.randomUUID(),
              type: classification.type,
              title: classification.title,
              source: 'ai-classification',
              vitalInformation: classification.vitalInformation,
              agentId: agent.id,
              data: {},
            };
            return item;
          })
          .filter((item): item is RecognizedItem => item !== null);

        if (newItems.length > 0) {
          console.log('0xHypr', 'Adding new items to store:', newItems);
          const currentItems =
            useClassificationStore.getState().recognizedItems || [];
          const updatedItems = [...currentItems, ...newItems];
          setRecognizedItems(updatedItems);
          addProcessedContent(combinedContent);
          addLog({
            message: `Processed ${newItems.length} items`,
            timestamp: new Date().toISOString(),
            success: true,
            results: newItems.map((item) => ({
              type: item.type,
              title: item.title,
            })),
          });
        } else {
          addLog({
            message: 'No items were recognized from the content',
            timestamp: new Date().toISOString(),
            success: false,
          });
        }

        setLastClassifiedAt(new Date());
      } catch (error) {
        handleError(error, 'classifying interval');
        setClassificationError(
          error instanceof Error ? error.message : 'Unknown error',
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
      setRecognizedItems,
    ],
  );

  useEffect(() => {
    if (!autoClassifyEnabled) return;

    // Initial classification
    const now = new Date();
    // let's say two minutes ago
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60000);
    classifyInterval(twoMinutesAgo.toISOString(), now.toISOString());

    // Set up periodic classification
    const intervalId = setInterval(() => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
      classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
    }, 5 * 60000); // Every 5 minutes

    return () => clearInterval(intervalId);
  }, [autoClassifyEnabled, classifyInterval]);

  const handleManualClassification = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
  };

  const discardRecognizedItem = (id: string) => {
    setRecognizedItems(recognizedItems.filter((item) => item.id !== id));
  };

  const clearOldItems = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Clear items older than 7 days
    clearItemsBeforeDate(date);
    toast({
      title: 'Cleared old items',
      description: 'Removed items older than 7 days',
    });
  };

  const renderRecognizedItem = (item: RecognizedItem) => {
    const agent = agents.find((a) => a.id === item.agentId);
    if (!agent) return null;

    return (
      <div key={item.id} className="space-y-2">
        {agent.render(item, () => discardRecognizedItem(item.id))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recognized Items</CardTitle>
                <CardDescription>
                  Recently detected items from your workflow
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => clearOldItems()}>
                      <Clock className="h-4 w-4 mr-2" />
                      Clear Items Older Than 7 Days
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {agents.map((agent) => (
                      <DropdownMenuItem
                        key={agent.id}
                        onClick={() => clearItemsByAgent(agent.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear {agent.name} Items
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setRecognizedItems([])}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
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

        <Card>
          <CardHeader>
            <CardTitle>Latest Recognized Items</CardTitle>
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
    </div>
  );
}
