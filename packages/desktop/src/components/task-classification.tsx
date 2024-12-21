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
import { object, z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { useApiKeyStore } from '@/stores/api-key-store';
import { useTaskStore } from '@/renderer/stores/task-store';
import { useToast } from '@/hooks/use-toast';
import { useClassificationStore } from '@/stores/classification-store';
import { createEvents } from 'ics';
import { generateId, formatDateTime } from '@/lib/utils';
import type {
  RecognizedEventItem,
  RecognizedTaskItem,
  RecognizedItem,
  RecognizedInvoiceItem,
} from '@/agents/base-agent';
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
import { InvoiceFlow } from '@/app/invoice-flow';

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

// Add proper type guards at the top of the file
const isTaskItem = (item: RecognizedItem): item is RecognizedTaskItem => {
  return item.type === 'task' && 'data' in item && 
    'title' in item.data && 'content' in item.data;
};

const isEventItem = (item: RecognizedItem): item is RecognizedEventItem => {
  return item.type === 'event' && 'data' in item && 
    'startTime' in item.data && 'endTime' in item.data;
};

const isInvoiceItem = (item: RecognizedItem): item is RecognizedInvoiceItem => {
  return item.type === 'invoice' && 'data' in item && 
    'amount' in item.data && 'recipient' in item.data;
};

// Add error boundary handler
const handleError = (error: unknown, context: string) => {
  console.error('0xHypr', `Error in ${context}:`, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  addLog({
    message: `Error in ${context}`,
    timestamp: new Date().toISOString(),
    success: false,
    error: errorMessage
  });
  return errorMessage;
};

export function TaskClassification() {
  const [vaultConfig, setVaultConfig] = useState(null);
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
    clearRecognizedEvents,
    clearRecognizedTasks,
    clearItemsBeforeDate,
    clearItemsByAgent,
    agents,
    addRecognizedItem,
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
              }
            );

            if (!response.ok) {
              console.warn(`Failed to fetch content for ${appName}:`, await response.text());
              return [];
            }

            const data = await response.json();
            console.log(`0xHypr`, `Content found for ${appName}:`, data);
            return (data.data || []).map((item: any) => ({
              ...item,
              app_name: appName,
            }));
          } catch (error) {
            console.error(`0xHypr`, `Error fetching content for ${appName}:`, error);
            return [];
          }
        });

        const results = await Promise.all(searchPromises);
        const flattenedContent = results.flat();

        console.log('0xHypr', 'Total content items found:', flattenedContent.length);

        if (flattenedContent.length === 0) {
          addLog({
            message: 'No content found in the specified time interval',
            timestamp: new Date().toISOString(),
            success: false,
          });
          return;
        }

        const contentByApp = flattenedContent.reduce<Record<string, string[]>>((acc, item) => {
          const appName = item.app_name;
          if (!acc[appName]) acc[appName] = [];
          acc[appName].push(item.content.text);
          return acc;
        }, {});

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

        const activeAgents = agents.filter(agent => agent.isActive);
        console.log('0xHypr', 'Active agents:', activeAgents);
        
        const newItems: RecognizedItem[] = [];

        for (const agent of activeAgents) {
          try {
            console.log('0xHypr', `Processing with ${agent.name}...`);
            const result = await agent.process(combinedContent);
            console.log('0xHypr', `Result from ${agent.name}:`, result);
            
            if (result) {
              const item: RecognizedItem = {
                id: crypto.randomUUID(),
                type: agent.type,
                source: 'ai-classification',
                timestamp: Date.now(),
                confidence: 0.9,
                agentId: agent.id,
                data: result
              };
              newItems.push(item);
            }
          } catch (error) {
            console.error('0xHypr', `Error processing with ${agent.name}:`, error);
            addLog({
              message: `Failed to process with ${agent.name}`,
              timestamp: new Date().toISOString(),
              error: error instanceof Error ? error.message : 'Unknown error',
              success: false
            });
          }
        }

        if (newItems.length > 0) {
          console.log("0xHypr", "Adding new items to store:", newItems);
          const currentItems = useClassificationStore.getState().recognizedItems || [];
          const updatedItems = [...currentItems, ...newItems];
          setRecognizedItems(updatedItems);
          addProcessedContent(combinedContent);
          addLog({
            message: `Processed ${newItems.length} items`,
            timestamp: new Date().toISOString(),
            success: true,
            results: newItems.map(item => ({
              type: item.type,
              title: item.data.title
            }))
          });
        } else {
          addLog({
            message: 'No items were recognized from the content',
            timestamp: new Date().toISOString(),
            success: false
          });
        }

        setLastClassifiedAt(new Date());
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addLog({
          message: 'Failed to process content',
          timestamp: new Date().toISOString(),
          success: false,
          error: errorMessage,
        });

        console.error('0xHypr', 'Error classifying interval:', error);
        setClassificationError(errorMessage);
      } finally {
        setIsClassifying(false);
      }
    },
    [agents, addLog, addProcessedContent, hasProcessedContent, setRecognizedItems]
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
  }, [autoClassifyEnabled, classifyInterval]);

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

      // Validate times
      if (endDate <= startDate) {
        // If end time is before or equal to start time, set it to 1 hour after start
        endDate.setTime(startDate.getTime() + 60 * 60 * 1000);
        event.data.endTime = endDate.toISOString();
      }

      const icsEvent: ICSEvent = {
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ],
        title: event.data.title,
        description: event.data.details || '',
        location: event.data.location || '',
        attendees: event.data.attendees?.map((attendee) => ({ name: attendee })) || [],
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        productId: 'hyprsqrl/ics',
      };

      const { error, value } = createEvents([icsEvent]);

      if (error) {
        throw new Error(`Failed to create ICS event: ${error}`);
      }

      const fileName = `event-${generateId()}.ics`;
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

      // Add to vault
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
        `  - Start: ${formatDateTime(startDate)}\n` +
        `  - End: ${formatDateTime(endDate)}\n` +
        `  - Location: ${event.data.location || 'N/A'}\n` +
        `  - Details: ${event.data.details || 'N/A'}\n` +
        `  - Attendees: ${event.data.attendees?.join(', ') || 'N/A'}\n` +
        `  - Source: ${event.source}\n` +
        `  - Created: ${formatDateTime(event.timestamp)}\n` +
        `  - Confidence: ${(event.confidence * 100).toFixed(0)}%\n`;

      if (content.includes('## Calendar Events')) {
        content = content.replace('## Calendar Events\n', `## Calendar Events\n${eventEntry}`);
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

  // Add timezone handling in the display logic
  const formatLocalDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });
  };

  // Update renderRecognizedItem with type guards
  const renderRecognizedItem = (item: RecognizedItem) => {
    const renderItemActions = () => (
      <div className="flex items-center space-x-2">
        <Badge variant={item.confidence > 0.9 ? 'default' : 'secondary'}>
          {(item.confidence * 100).toFixed(0)}%
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => discardRecognizedItem(item.id)}
        >
          <X className="h-4 w-4" />
        </Button>
        {isTaskItem(item) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddTask(item)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
        {isEventItem(item) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddEvent(item)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
        {isInvoiceItem(item) && (
          <InvoiceFlow
            invoiceData={item.data}
            onProcessed={() => discardRecognizedItem(item.id)}
          />
        )}
      </div>
    );

    return (
      <div
        key={item.id}
        className="flex items-start space-x-4 p-3 rounded-lg border bg-card"
      >
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-medium">{item.data.title}</p>
            {renderItemActions()}
          </div>
          {isTaskItem(item) && (
            <div className="text-sm text-muted-foreground">
              {item.data.details && <p>{item.data.details}</p>}
              {item.data.priority && (
                <Badge variant="outline" className="ml-2">
                  {item.data.priority}
                </Badge>
              )}
              {item.data.dueDate && (
                <span className="ml-2">
                  Due: {new Date(item.data.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
          {isEventItem(item) && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Start: {formatLocalDateTime(item.data.startTime)}</p>
              <p>End: {formatLocalDateTime(item.data.endTime)}</p>
              {item.data.location && <p>Location: {item.data.location}</p>}
              {item.data.attendees?.length > 0 && (
                <p>Attendees: {item.data.attendees.join(', ')}</p>
              )}
              {item.data.details && <p>{item.data.details}</p>}
            </div>
          )}
          {isInvoiceItem(item) && (
            <div className="text-sm text-muted-foreground">
              <p>Amount: {item.data.amount} {item.data.currency}</p>
              {item.data.dueDate && (
                <p>Due: {new Date(item.data.dueDate).toLocaleDateString()}</p>
              )}
              <p>Recipient: {item.data.recipient.name}</p>
              {item.data.description && <p>{item.data.description}</p>}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Update the processContent function to properly handle types and errors
  const processContent = async () => {
    setIsClassifying(true);
    try {
      const response = await fetch('http://localhost:3030/search?content_type=ocr');
      const data = await response.json();

      if (!data?.data || !Array.isArray(data.data)) {
        console.log("0xHypr", "No content found from screenpipe");
        addLog({
          message: "No content found from screenpipe",
          timestamp: new Date().toISOString(),
          success: false
        });
        return;
      }

      const activeAgents = agents.filter(agent => agent.isActive);
      console.log("0xHypr", "Active agents:", activeAgents);

      for (const item of data.data) {
        if (!item.content || hasProcessedContent(item.content)) continue;

        for (const agent of activeAgents) {
          try {
            const result = await agent.process(item.content);
            if (result) {
              const recognizedItem: RecognizedItem = {
                id: crypto.randomUUID(),
                type: agent.type,
                source: 'screenpipe',
                timestamp: Date.now(),
                confidence: 0.9,
                agentId: agent.id,
                data: result
              };
              addRecognizedItem(recognizedItem);
              addProcessedContent(item.content);
            }
          } catch (error) {
            console.error("0xHypr", `Error processing with ${agent.name}:`, error);
            addLog({
              message: `Error processing with ${agent.name}`,
              timestamp: new Date().toISOString(),
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      }
    } catch (error) {
      console.error("0xHypr", "Error fetching from screenpipe:", error);
      addLog({
        message: "Error fetching from screenpipe",
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Classified Events</CardTitle>
                <CardDescription>
                  Recently detected items from your workflow
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
                        clearItemsByAgent(taskAgent.id, 'Task Agent')
                      }
                    >
                      <ListX className="h-4 w-4 mr-2" />
                      Clear Task Agent Items
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        clearItemsByAgent(calendarAgent.id, 'Calendar Agent')
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
              {recognizedItems.map(renderRecognizedItem)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
