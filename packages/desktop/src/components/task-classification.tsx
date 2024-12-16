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
import { Zap, Calendar, X, Plus } from 'lucide-react';
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
  RecognizedItem
} from '@/stores/classification-store';
import { taskAgent } from '@/agents/task-agent';
import { calendarAgent } from '@/agents/calendar-agent';

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
  const [classificationError, setClassificationError] = useState<string | null>(null);

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

  const classifyInterval = useCallback(async (startTime: string, endTime: string) => {
    setIsClassifying(true);
    setClassificationError(null);

    try {
      const healthCheck = await fetch('http://localhost:3030/health');
      if (!healthCheck.ok) {
        throw new Error('Screenpipe is not running. Please start Screenpipe first.');
      }

      const searchParams = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
        limit: '10',
      });

      const response = await fetch(`http://localhost:3030/search?${searchParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch data from Screenpipe');
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error('No screen content found in this time interval');
      }

      const openai = createOpenAI({ apiKey });
      const combinedContent = data.data.map((item: any) => item.content.text).join('\n');

      if (hasProcessedContent(combinedContent)) {
        console.log('Content already processed, skipping...');
        return;
      }

      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          items: z.array(z.object({
            type: z.enum(['task', 'event']),
            title: z.string(),
            details: z.string(),
            priority: z.enum(['high', 'medium', 'low']).optional(),
            dueDate: z.string().nullable(),
            startTime: z.string().nullable(),
            endTime: z.string().nullable(),
            location: z.string().optional(),
            attendees: z.array(z.string()).optional(),
            confidence: z.number().min(0).max(1),
          })).max(6),
        }),
        prompt: `
          Analyze this screen content and extract only genuine, actionable work tasks or calendar events.
          
          Rules:
          - Ignore UI elements, menus, completed tasks
          - Focus on real work items (todos, calls, writing tasks etc)
          - Do not extract anything from calendar apps
          - Include full context and details
          - Extract dates and times if present
          - Rate confidence for each item (0-100%)
          - Return only the 6 most important items
          - For tasks, include priority (high/medium/low) and due date if available
          
          Content to analyze:
          ${combinedContent}
        `
      });

      // Convert to our internal types
      let newItems: RecognizedItem[] = object.items.map((item) => {
        const base = {
          id: crypto.randomUUID(),
          agentId: item.type === 'task' ? taskAgent.id : calendarAgent.id,
          timestamp: new Date().toISOString(),
          source: 'screen',
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
            }
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
              endTime: item.endTime || new Date(Date.now() + 3600000).toISOString(),
              location: item.location,
              attendees: item.attendees,
            }
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
            startTime: item.type === 'event' ? item.data.startTime : undefined,
            endTime: item.type === 'event' ? item.data.endTime : undefined,
          })),
        });
      }

      setLastClassifiedAt(new Date());
    } catch (error) {
      addLog({
        timestamp: new Date().toISOString(),
        content: 'Failed to fetch content from Screenpipe',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      console.error('Error classifying interval:', error);
      setClassificationError(
        error instanceof Error ? error.message : 'Failed to classify content'
      );
    } finally {
      setIsClassifying(false);
    }
  }, [
    apiKey,
    addLog,
    addProcessedContent,
    hasProcessedContent,
    setRecognizedItems,
    recognizedItems,
    deduplicateItems
  ]);

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
    deduplicateItems
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
        attendees: event.data.attendees?.map((attendee) => ({ name: attendee })) || [],
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
          `## Calendar Events\n${eventEntry}`
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
    setRecognizedItems(recognizedItems.filter(item => item.id !== id))
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Classification</CardTitle>
            <CardDescription>
              Automatically detect and classify tasks from your screen
            </CardDescription>
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
                              Due: {new Date(item.data.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      )}

                      {item.type === 'event' && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Start: {new Date(item.data.startTime).toLocaleString()}</p>
                          <p>End: {new Date(item.data.endTime).toLocaleString()}</p>
                          {item.data.location && <p>Location: {item.data.location}</p>}
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
