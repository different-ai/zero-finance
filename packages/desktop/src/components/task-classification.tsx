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
import { generateObject, generateText } from 'ai';
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
} from '@/stores/classification-store';

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

  const extractInformation = async (content: string, openai: any) => {
    const { text } = await generateText({
      model: openai('o1-preview'),
      prompt: `
        Analyze this screen content and extract only genuine, actionable work tasks or calendar events.
        
        Rules:
        - Ignore UI elements, menus, completed tasks
        - Focus on real work items (todos, calls, writing tasks etc)
        - Do not extract anything from calendar apps
        - Include full context and details
        - Extract dates and times if present
        - Rate confidence for each item (0-100%)
        
        Format each item as:
        ITEM
        Type: [task/event]
        Title: [clear title]
        Details: [full context]
        Start: [date/time or blank]
        End: [date/time or blank]
        Confidence: [0-100]
        END
        
        Content to analyze:
        ${content}
      `
    });

    return text;
  };

  const formatResults = async (extractedText: string, openai: any) => {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        items: z.array(
          z.object({
            type: z.enum(['task', 'calendarevent']),
            name: z.string(),
            details: z.string(), 
            startDate: z.string().nullable(),
            endDate: z.string().nullable(),
            confidence: z.number().min(0).max(1)
          })
        ).max(6)
      }),
      prompt: `
        Convert this extracted information into a structured format:
        ${extractedText}
      `
    });

    return object;
  };

  const classifyInterval = useCallback(async (startTime: string, endTime: string) => {
    setIsClassifying(true);
    setClassificationError(null);

    try {
      const healthCheck = await fetch('http://localhost:3030/health');
      if (!healthCheck.ok) {
        throw new Error(
          'Screenpipe is not running. Please start Screenpipe first.'
        );
      }

      const searchParams = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
        limit: '10',
      });

      const response = await fetch(
        `http://localhost:3030/search?${searchParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch data from Screenpipe');
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error('No screen content found in this time interval');
      }
      const openai = createOpenAI({
        apiKey: apiKey,
      });

      const combinedContent = data.data
        .map((item: any) => item.content.text)
        .join('\n');

      // Check if we've already processed this content
      if (hasProcessedContent(combinedContent)) {
        console.log('Content already processed, skipping...');
        return;
      }

      // First pass: Extract information with o1-preview
      const extractedInfo = await extractInformation(combinedContent, openai);
      
      // Second pass: Format with gpt-4o-mini
      const formattedResults = await formatResults(extractedInfo, openai);

      // Convert classified items to our internal types
      let newItems = formattedResults.items.map((item) => {
        const base = {
          id: crypto.randomUUID(),
          rawContent: combinedContent,
          timestamp: new Date().toISOString(),
          source: 'screen',
          confidence: item.confidence,
        };

        if (item.type === 'task') {
          return {
            ...base,
            type: 'task' as const,
            title: item.name,
            details: item.details,
          };
        } else {
          return {
            ...base,
            type: 'event' as const,
            title: item.name,
            details: item.details,
            startTime: item.startDate || new Date().toISOString(),
            endTime:
              item.endDate || new Date(Date.now() + 3600000).toISOString(),
          };
        }
      });

      // Deduplicate items before setting them
      newItems = (await deduplicateItems(newItems, apiKey)) as typeof newItems;

      if (newItems.length > 0) {
        setRecognizedItems([...newItems, ...recognizedItems]);

        // Mark content as processed
        addProcessedContent(combinedContent);

        // Update log
        addLog({
          timestamp: new Date().toISOString(),
          content: combinedContent,
          success: true,
          results: newItems.map((item) => ({
            type: item.type === 'task' ? 'task' : 'event',
            title: (item as any).title,
            startTime:
              item.type === 'event' ? (item as any).startTime : undefined,
            endTime: item.type === 'event' ? (item as any).endTime : undefined,
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

  const handleAddTask = async (task) => {
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

      const taskEntry = `- [ ] ${task.title}\n  - Source: ${
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
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);

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
        title: event.title,
        description: event.details || '',
        location: event.location || '',
        attendees:
          event.attendees?.map((attendee) => ({ name: attendee })) || [],
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
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          description: event.details,
          attendees: event.attendees,
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
        `- [ ] ${event.title}\n` +
        `  - Start: ${startDate.toLocaleString()}\n` +
        `  - End: ${endDate.toLocaleString()}\n` +
        `  - Location: ${event.location || 'N/A'}\n` +
        `  - Details: ${event.details || 'N/A'}\n` +
        `  - Attendees: ${event.attendees?.join(', ') || 'N/A'}\n`;

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
                .filter((item) => item.type !== 'other')
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.title}</p>
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

                      {item.type === 'task' && (item as any).details && (
                        <p className="text-sm text-muted-foreground">
                          {(item as any).details}
                        </p>
                      )}

                      {item.type === 'event' && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Start: {(item as any).startTime}</p>
                          <p>End: {(item as any).endTime}</p>
                          {(item as any).location && (
                            <p>Location: {(item as any).location}</p>
                          )}
                          {(item as any).attendees && (
                            <p>
                              Attendees: {(item as any).attendees.join(', ')}
                            </p>
                          )}
                          {(item as any).details && (
                            <p>{(item as any).details}</p>
                          )}
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
