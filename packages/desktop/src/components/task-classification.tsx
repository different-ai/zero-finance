import React, { useState, useEffect } from 'react';
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
import { Zap, MessageSquare, ArrowRight, Folder, FileText } from 'lucide-react';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { useApiKeyStore } from '@/stores/api-key-store';
import { useTaskStore } from '@/renderer/stores/task-store';
import { cn } from '@/lib/utils';
import type { VaultConfig } from '@/types/electron';

export type TaskClassification = {
  category: string;
  confidence: number;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
};

export type RecognizedTask = {
  id: string;
  content: string;
  timestamp: string;
  source: string;
  confidence: number;
};

export function TaskClassification() {
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null);
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState(true);
  const [autoClassify, setAutoClassify] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(
    null
  );
  const [recognizedTasks, setRecognizedTasks] = useState<RecognizedTask[]>([]);
  const { apiKey } = useApiKeyStore();
  const { addTask } = useTaskStore();

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

  const classifyInterval = async (startTime: string, endTime: string) => {
    setIsClassifying(true);
    setClassificationError(null);

    try {
      // Check if Screenpipe is running
      const healthCheck = await fetch('http://localhost:3030/health');
      if (!healthCheck.ok) {
        throw new Error(
          'Screenpipe is not running. Please start Screenpipe first.'
        );
      }

      // 1. Get data from screenpipe
      const searchParams = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
        limit: '10',
        content_type: 'ocr',
        // include_frames: 'true',
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

      // 2. Use generateObject to classify the content
      const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: z.object({
          classification: z.object({
            category: z.enum([
              'Meeting',
              'Communication',
              'Content Creation',
              'Development',
              'Research',
            ]),
            confidence: z.number().min(0).max(1),
            suggestedAction: z.string(),
            priority: z.enum(['high', 'medium', 'low']),
            timeEstimate: z.string(),
            recognizedTasks: z.array(
              z.object({
                content: z.string(),
                confidence: z.number().min(0).max(1),
                source: z.string(),
              })
            ),
          }),
        }),
        prompt: `Analyze the following content and classify it into a task category with suggested actions:
                ${data.data.map((item) => item.content.text).join('\n')}`,
      });

      // Update state with classification results
      const classification = {
        category: object.classification.category,
        confidence: object.classification.confidence,
        suggestedAction: object.classification.suggestedAction,
        priority: object.classification.priority,
        timeEstimate: object.classification.timeEstimate,
      };

      // Add new recognized tasks
      const newTasks = object.classification.recognizedTasks.map((task) => ({
        id: crypto.randomUUID(),
        content: task.content,
        confidence: task.confidence,
        source: task.source,
        timestamp: new Date().toISOString(),
      }));

      setRecognizedTasks((prev) => [...newTasks, ...prev]);
      setLastClassifiedAt(new Date());
    } catch (error) {
      console.error('Error classifying interval:', error);
      setClassificationError(
        error instanceof Error ? error.message : 'Failed to classify content'
      );
    } finally {
      setIsClassifying(false);
    }
  };

  useEffect(() => {
    if (!autoClassify) return;

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
  }, [autoClassify]);

  const handleManualClassification = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    classifyInterval(fiveMinutesAgo.toISOString(), now.toISOString());
  };

  const handleAddTask = async (task: RecognizedTask) => {
    try {
      // Get vault config
      const config = await window.api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      // Create hyprsqrl.md if it doesn't exist
      const filePath = `${config.path}/hyprsqrl.md`;
      let content = '';
      
      try {
        const result = await window.api.readMarkdownFile(filePath);
        content = result.content;
      } catch (error) {
        // File doesn't exist, create with template
        content = `# HyprSqrl Tasks\n\n## Tasks\n`;
      }

      // Add task to content
      const taskEntry = `- [ ] ${task.content}\n  - Source: ${task.source}\n  - Created: ${task.timestamp}\n  - Confidence: ${(task.confidence * 100).toFixed(0)}%\n`;
      
      if (content.includes('## Tasks')) {
        // Add under existing Tasks section
        content = content.replace('## Tasks\n', `## Tasks\n${taskEntry}`);
      } else {
        // Add new Tasks section
        content += `\n## Tasks\n${taskEntry}`;
      }

      // Write back to file
      await window.api.writeMarkdownFile(filePath, content);

      // Show success message or update UI
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      setClassificationError('Failed to add task to vault');
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Task Classification Card */}
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
                      checked={autoClassify}
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
                    <>Last classified: {lastClassifiedAt.toLocaleTimeString()}</>
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

        {/* Recognized Items Card */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Recognized Items</CardTitle>
            <CardDescription>
              Recently detected tasks and actions from your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recognizedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{task.content}</p>
                      <Badge
                        variant={task.confidence > 0.9 ? 'default' : 'secondary'}
                      >
                        {(task.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {task.source}
                      </span>
                      <span className="mx-2">•</span>
                      <time dateTime={task.timestamp}>
                        {new Date(task.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAddTask(task)}>
                    Add Task
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 w-full">
              View All Recognized Items
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
