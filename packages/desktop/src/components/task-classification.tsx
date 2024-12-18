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
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Calendar,
  X,
  Plus,
  Trash2,
  CalendarX,
  ListX,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { useApiKeyStore } from '@/stores/api-key-store';
import { useTaskStore } from '@/renderer/stores/task-store';
import { useToast } from '@/hooks/use-toast';
import { useClassificationStore } from '@/stores/classification-store';
import { createEvents } from 'ics';
import type {
  RecognizedEventItem,
  RecognizedTaskItem,
  RecognizedItem,
  clearItemsBeforeDate,
  clearItemsByAgent,
} from '@/stores/classification-store';
import { taskAgent } from '@/agents/task-agent';
import { calendarAgent } from '@/agents/calendar-agent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSettingsStore } from '@/stores/settings-store';

type ICSEvent = {
  start: [number, number, number, number, number];
  end: [number, number, number, number, number];
  title: string;
  description?: string;
  location?: string;
  attendees?: { name: string; email?: string }[];
  status: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  busyStatus: 'BUSY' | 'FREE' | 'TENTATIVE' | 'OOF';
  productId: string;
};

export function TaskClassification() {
  const [vaultConfig, setVaultConfig] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(
    null,
  );

  // Use the store for auto-classify state
  const {
    addLog,
    addProcessedContent,
    hasProcessedContent,
    setRecognizedItems,
    recognizedItems,
    deduplicateItems,
    autoClassifyEnabled,
    setAutoClassify,
    clearRecognizedEvents,
    clearRecognizedTasks,
    clearItemsBeforeDate,
    clearItemsByAgent,
  } = useClassificationStore();

  const { apiKey } = useApiKeyStore();
  const { addTask } = useTaskStore();
  const { toast } = useToast();

  // Load vault config
  useEffect(() => {
    const checkVaultConfig = async () => {
      try {
        const config = await window.api.getVaultConfig();
        if (config?.path) {
          setVaultConfig(config);
        }
      } catch (error) {
        console.error('Failed to get vault config:', error);
      }
    };
    checkVaultConfig();
  }, []);

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

        if (monitoredApps.length === 0) {
          throw new Error(
            'No applications selected for monitoring. Please configure in settings.',
          );
        }

        const searchPromises = monitoredApps.map(async (appName) => {
          const searchParams = new URLSearchParams({
            // content_type: 'ui',
            app_name: appName.toLowerCase(),
            start_time: startTime,
            end_time: endTime,
            limit: '50',
            min_length: '10', // Ignore very short UI elements
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
              console.warn(`Failed to fetch content for ${appName}`);
              return [];
            }

            const data = await response.json();
            return (data.data || []).map((item: any) => ({
              ...item,
              app_name: appName, // Ensure consistent app name casing
            }));
          } catch (error) {
            console.error(`Error fetching content for ${appName}:`, error);
            return [];
          }
        });

        const results = await Promise.all(searchPromises);
        const flattenedContent = results.flat();

        if (flattenedContent.length === 0) {
          throw new Error(
            'No content found from monitored applications in this time interval',
          );
        }

        // Group content by app for better context
        const contentByApp = flattenedContent.reduce((acc, item) => {
          const appName = item.app_name;
          if (!acc[appName]) acc[appName] = [];
          acc[appName].push(item.content.text);
          return acc;
        }, {});

        // Format content with app context
        const combinedContent = Object.entries(contentByApp)
        // fix join not available on type unkown
          .map(([app, texts]) => `=== ${app} ===\n${texts?.join('\n') || ''}`)
          .join('\n\n');

        if (hasProcessedContent(combinedContent)) {
          console.log('Content already processed, skipping...');
          return;
        }
        const openai = createOpenAI({ apiKey });

        const { object } = await generateObject({
          model: openai('gpt-4o'),
          schema: z.object({
            items: z
              .array(
                z.object({
                  type: z.enum(['task', 'event']),
                  title: z.string(),
                  details: z.string(),
                  priority: z.enum(['high', 'medium', 'low']).optional(),
                  dueDate: z.string().nullable(),
                  startTime: z.string().nullable(),
                  endTime: z.string().nullable(),
                  location: z.string().optional().nullable(),
                  attendees: z.array(z.string()).optional().nullable(),
                  confidence: z.number().min(0).max(1),
                  source_app: z.string(),
                }),
              )
              .max(6),
          }),
          prompt: `
          Analyze the following screen content extracted from monitored applications. Your goal is to identify and extract only *genuine, actionable personal or professional tasks or calendar events* that require the user's direct involvement.
          
          **Important Guidelines:**
          - Consider items "genuine tasks" if they represent something the user intends to do or needs to do, such as replying to a client, scheduling a meeting, attending a lunch, writing a report, or completing an assigned work item.
          - Also consider USER requests
          - Consider items "calendar events" if they represent scheduled personal or professional gatherings, appointments, or meetings with specific start/end times and relevant participants.
          - Ignore system messages, navigation elements, interface labels, draft states, or UI artifacts that do not represent a clear user-intended action. For example:
            - "Draft message to Francisco" appearing as a label in a messaging app is not a confirmed action the user plans to take, so exclude it.
            - "Edit video in CapCut" shown as an interface option is not necessarily a chosen user task; exclude unless it's explicitly stated as a user’s planned action.
          - If the nature of the text is ambiguous or you are uncertain whether it's a user-intended action, do not include it.
          - Focus on personal (e.g., "Lunch with Rumena Haase") or professional (e.g., "Follow up with Acme Corp on new contract") actions that clearly require the user's involvement.
          - Extract relevant details such as priority for tasks, due dates if any, and for events, extract start/end times, location, and attendees if available.
          - Assign a confidence level (0 to 100%) to each recognized item, reflecting how certain you are that it's a genuine user-intended task or event.
          - Include the source application name as source_app.
          - Limit to a maximum of 6 items total.
          
          **Content to analyze:**
          ${combinedContent}
          `
        });

        // Convert to our internal types
        let newItems: RecognizedItem[] = object.items.map((item) => {
          const base = {
            id: crypto.randomUUID(),
            agentId: item.type === 'task' ? taskAgent.id : calendarAgent.id,
            timestamp: new Date().toISOString(),
            source: item.source_app,
            confidence: item.confidence,
          };

          if (item.type === 'task') {
            const taskItem: RecognizedTaskItem = {
              ...base,
              type: 'task',
              data: {
                title: item.title,
                details: item.details,
                priority: item.priority || 'medium',
                dueDate: item.dueDate || null,
              },
            };
            return taskItem;
          } else {
            const eventItem: RecognizedEventItem = {
              ...base,
              type: 'event',
              data: {
                title: item.title,
                details: item.details,
                startTime: item.startTime || new Date().toISOString(),
                endTime:
                  item.endTime || new Date(Date.now() + 3600000).toISOString(),
                location: item.location || '',
                attendees: item.attendees || [],
              },
            };
            return eventItem;
          }
        });

        // Deduplicate items before setting them
        newItems = await deduplicateItems(newItems, apiKey);

        if (newItems.length > 0) {
          setRecognizedItems([...newItems, ...recognizedItems]);
          addProcessedContent(combinedContent);
          addLog({
            timestamp: new Date().toISOString(),
            content: combinedContent,
            success: true,
            results: newItems.map((item) => ({
              type: item.type,
              title: item.data.title,
              source: item.source,
              startTime:
                item.type === 'event' ? item.data.startTime : undefined,
              endTime: item.type === 'event' ? item.data.endTime : undefined,
            })),
          });
        }

        setLastClassifiedAt(new Date());
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        addLog({
          timestamp: new Date().toISOString(),
          content: 'Failed to process content',
          success: false,
          error: errorMessage,
        });

        console.error('Error classifying interval:', error);
        setClassificationError(errorMessage);
      } finally {
        setIsClassifying(false);
      }
    },
    [
      apiKey,
      addLog,
      addProcessedContent,
      hasProcessedContent,
      setRecognizedItems,
      recognizedItems,
      deduplicateItems,
    ],
  );

  useEffect(() => {
    if (!autoClassifyEnabled) return;

    // Initial classification
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());

    // Set up periodic classification
    const intervalId = setInterval(() => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
      classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
    }, 5 * 60000); // Every 5 minutes

    return () => clearInterval(intervalId);
  }, [
    autoClassifyEnabled,
    classifyInterval,
    apiKey,
    addLog,
    addProcessedContent,
    hasProcessedContent,
    setRecognizedItems,
    recognizedItems,
    deduplicateItems,
  ]);

  const handleManualClassification = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
  };

  const handleAddTask = async (task: RecognizedTaskItem) => {
    try {
      const config = await window.api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      const filePath = `${config.path}/hyprsqrl.md`;
      let content = '';

      try {
        const result = await window.api.readMarkdownFile(filePath);
        content = result.content;
      } catch (error) {
        // File doesn't exist, create with template
        content = `# HyprSqrl Tasks\n\n## Tasks\n`;
      }

      const taskEntry = `- [ ] ${task.data.title}\n  - Source: ${
        task.source
      }\n  - Created: ${task.timestamp}\n  - Confidence: ${(
        task.confidence * 100
      ).toFixed(0)}%\n`;

      if (content.includes('## Tasks')) {
        content = content.replace('## Tasks\n', `## Tasks\n${taskEntry}`);
      } else {
        content += `\n## Tasks\n${taskEntry}`;
      }

      await window.api.writeMarkdownFile(filePath, content);
      toast({
        title: 'Task added',
        description: 'Task has been added to your vault',
      });
    } catch (error) {
      console.error('Error adding task:', error);
      setClassificationError('Failed to add task to vault');
    }
  };

  const handleAddEvent = async (event: RecognizedEventItem) => {
    try {
      const startDate = new Date(event.data.startTime);
      const endDate = new Date(event.data.endTime);

      const icsEvent: ICSEvent = {
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ] as [number, number, number, number, number],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ] as [number, number, number, number, number],
        title: event.data.title,
        description: event.data.details || '',
        location: event.data.location || '',
        attendees:
          event.data.attendees?.map((attendee) => ({ name: attendee })) || [],
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        productId: 'hyprsqrl/ics',
      };

      const { error, value } = createEvents([icsEvent]);

      if (error) {
        throw new Error(`Failed to create ICS event: ${error}`);
      }

      const fileName = `event-${Date.now()}.ics`;
      await window.api.addToCalendar({
        icsPath: fileName,
        content: value,
        event: {
          title: event.data.title,
          startTime: event.data.startTime,
          endTime: event.data.endTime,
          location: event.data.location,
          description: event.data.details,
          attendees: event.data.attendees,
        },
      });

      const config = await window.api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      const filePath = `${config.path}/hyprsqrl.md`;
      let content = '';

      try {
        const result = await window.api.readMarkdownFile(filePath);
        content = result.content;
      } catch (error) {
        content = `# HyprSqrl Tasks\n\n## Calendar Events\n`;
      }

      const eventEntry =
        `- [ ] ${event.data.title}\n` +
        `  - Start: ${startDate.toLocaleString()}\n` +
        `  - End: ${endDate.toLocaleString()}\n` +
        `  - Location: ${event.data.location || 'N/A'}\n` +
        `  - Details: ${event.data.details || 'N/A'}\n` +
        `  - Attendees: ${event.data.attendees?.join(', ') || 'N/A'}\n`;

      if (content.includes('## Calendar Events')) {
        content = content.replace(
          '## Calendar Events\n',
          `## Calendar Events\n${eventEntry}`,
        );
      } else {
        content += `\n## Calendar Events\n${eventEntry}`;
      }

      await window.api.writeMarkdownFile(filePath, content);

      toast({
        title: 'Event added',
        description: 'Event has been added to your calendar and vault',
      });
    } catch (error) {
      console.error('Error adding event:', error);
      setClassificationError('Failed to add event to calendar');
      toast({
        title: 'Error',
        description: 'Failed to add event to calendar',
        variant: 'destructive',
      });
    }
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

  const clearAgentItems = (agentId: string, agentName: string) => {
    clearItemsByAgent(agentId);
    toast({
      title: `Cleared ${agentName} items`,
      description: `Removed all items from ${agentName}`,
    });
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recognized Events</CardTitle>
                <CardDescription>
                  Automatically detect and classify events from your screen
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearRecognizedEvents}
                  className="text-muted-foreground"
                >
                  <CalendarX className="h-4 w-4 mr-2" />
                  Clear Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearRecognizedTasks}
                  className="text-muted-foreground"
                >
                  <ListX className="h-4 w-4 mr-2" />
                  Clear Tasks
                </Button>
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
                    <DropdownMenuItem
                      onClick={() =>
                        clearAgentItems(taskAgent.id, 'Task Agent')
                      }
                    >
                      <ListX className="h-4 w-4 mr-2" />
                      Clear Task Agent Items
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        clearAgentItems(calendarAgent.id, 'Calendar Agent')
                      }
                    >
                      <CalendarX className="h-4 w-4 mr-2" />
                      Clear Calendar Agent Items
                    </DropdownMenuItem>
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
              Recently detected tasks and events from your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recognizedItems
                .filter((item) => item.type === 'task' || item.type === 'event')
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.data.title}</p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              item.confidence > 0.9 ? 'default' : 'secondary'
                            }
                          >
                            {(item.confidence * 100).toFixed(0)}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => discardRecognizedItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              item.type === 'task'
                                ? handleAddTask(item as RecognizedTaskItem)
                                : handleAddEvent(item as RecognizedEventItem)
                            }
                          >
                            {item.type === 'task' ? (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Task
                              </>
                            ) : (
                              <>
                                <Calendar className="h-4 w-4 mr-2" />
                                Add Event
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {item.type === 'task' && item.data.details && (
                        <p className="text-sm text-muted-foreground">
                          {item.data.details}
                          {item.data.priority && (
                            <Badge variant="outline" className="ml-2">
                              {item.data.priority}
                            </Badge>
                          )}
                          {item.data.dueDate && (
                            <span className="ml-2 text-muted-foreground">
                              Due:{' '}
                              {new Date(item.data.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      )}

                      {item.type === 'event' && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Start:{' '}
                            {new Date(item.data.startTime).toLocaleString()}
                          </p>
                          <p>
                            End: {new Date(item.data.endTime).toLocaleString()}
                          </p>
                          {item.data.location && (
                            <p>Location: {item.data.location}</p>
                          )}
                          {item.data.attendees?.length > 0 && (
                            <p>Attendees: {item.data.attendees.join(', ')}</p>
                          )}
                          {item.data.details && <p>{item.data.details}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
