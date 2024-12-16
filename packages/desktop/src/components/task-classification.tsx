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
import { Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { useApiKeyStore } from '@/stores/api-key-store';

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

type TaskClassificationProps = {
  onNewTasksRecognized?: (tasks: RecognizedTask[]) => void;
  onNewClassification?: (classification: TaskClassification) => void;
};

export function TaskClassification({
  onNewTasksRecognized,
  onNewClassification,
}: TaskClassificationProps) {
  const [autoClassify, setAutoClassify] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastClassifiedAt, setLastClassifiedAt] = useState<Date | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(
    null
  );
  const [recognizedTasks, setRecognizedTasks] = useState<RecognizedTask[]>([]);
  const { apiKey } = useApiKeyStore();

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

      // 3. Update both classifications and recognized tasks
      const classification = {
        category: object.classification.category,
        confidence: object.classification.confidence,
        suggestedAction: object.classification.suggestedAction,
        priority: object.classification.priority,
        timeEstimate: object.classification.timeEstimate,
      };

      onNewClassification?.(classification);

      // Add new recognized tasks
      const newTasks = object.classification.recognizedTasks.map(
        (task, index) => ({
          id: `${Date.now()}-${index}`,
          content: task.content,
          timestamp: new Date().toISOString(),
          source: task.source,
          confidence: task.confidence,
        })
      );

      setRecognizedTasks((prev) => [...newTasks, ...prev]);
      onNewTasksRecognized?.(newTasks);
      setLastClassifiedAt(new Date());
    } catch (error) {
      console.error('Error classifying interval:', error);
      setClassificationError(
        error instanceof Error ? error.message : 'An unknown error occurred'
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Classification Controls</CardTitle>
          <CardDescription>
            Manage how tasks are classified from your screen content
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
                <Button variant="outline" size="sm">
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
  );
}
