'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/renderer/components/ui/card';
import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { useApiKeyStore } from '@/stores/api-key-store';
import { Loader2, AlertCircle, ChevronDown, FileText } from 'lucide-react';
import { getAllTasks } from '@/renderer/task-utils';
import type { Task } from '@/renderer/task-utils';
import { z } from 'zod';
import { useDebounce } from 'use-debounce';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { Button } from '@/renderer/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEditorStore } from '@/renderer/stores/editor-store';
import { useTaskStore } from '@/renderer/stores/task-store';
import { isTaskWithinDateRange } from '@/renderer/task-utils';
import { ObsidianIcon } from '@/renderer/components/obsidian-icon';

interface SummaryProps {
  vaultPath: string;
  currentFile: { path: string; content: { content: string } } | null;
}

interface TaskDeadline {
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  obsidianUrl?: string;
  context: string; // Why this deadline is important
  createdAt?: string;
}

interface ActionableStep {
  id: string;
  text: string;
  fileModified: string;
  fileCreated: string;
  filePath: string;
  taskContext: string;
  tags: string[];
  obsidianUrl?: string;
  llmAnalysis: {
    importance: string;
    estimatedTime: string;
    priority: 'high' | 'medium' | 'low';
    suggestedNextSteps: string[];
  };
}

interface TaskStats {
  openTasks: number;
  completed: number;
  completionRate: number;
  upcomingDeadlines: TaskDeadline[];
  actionableSteps: ActionableStep[];
}

interface LoadingState {
  tasks: boolean;
  analysis: boolean;
  error?: {
    type: 'API_ERROR' | 'CONNECTION_ERROR' | 'UNKNOWN_ERROR';
    message: string;
  };
}

interface StreamingState {
  deadlines: boolean;
  actions: boolean;
}

interface ActionableStepDetail {
  context: string;
  importance: string;
  relatedTasks: string[];
  suggestedNextSteps: string[];
  filePath: string;
}

// Add utility function for date checking
const isWithinWeeks = (filePath: string, weeks: number): boolean => {
  const dateMatch = filePath.match(/\d{4}-\d{2}-\d{2}/);
  if (!dateMatch) return false;

  const taskDate = new Date(dateMatch[0]);
  const now = new Date();
  const diffTime = now.getTime() - taskDate.getTime();
  const diffWeeks = diffTime / (1000 * 60 * 60 * 24 * 7);

  return diffWeeks <= weeks;
};

// Add this new component for collapsible task details
interface TaskDetailProps {
  step: ActionableStep;
  isExpanded: boolean;
  onToggle: () => void;
  detail: ActionableStepDetail | null;
  isLoading: boolean;
}

const TaskDetail = ({
  step,
  isExpanded,
  onToggle,
  detail,
  isLoading,
}: TaskDetailProps) => {
  const { openFile } = useEditorStore();

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border rounded-md overflow-hidden transition-all duration-200 ease-in-out">
      <div
        className={cn(
          'flex items-center gap-2 p-2 cursor-pointer hover:bg-secondary/50',
          isExpanded && 'border-b'
        )}
      >
        {/* Basic Info - Always Available */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            <div className="font-medium">{step.text}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Modified: {formattedDate(step.fileModified)}</span>
              {step.tags.length > 0 && (
                <div className="flex gap-1">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary px-1.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                openFile(step.filePath);
              }}
              className="h-8 w-8"
            >
              <FileText className="h-4 w-4" />
            </Button>
            {step.obsidianUrl && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  window.api.openExternal(step.obsidianUrl!);
                }}
                className="h-8 w-8 group"
              >
                <ObsidianIcon className="h-4 w-4 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10" />
              </Button>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isExpanded && 'transform rotate-180'
              )}
              onClick={onToggle}
            />
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="p-4 space-y-3 text-sm bg-secondary/10">
          {/* Context - Always Available */}
          <div>
            <div className="mt-1 pl-4 border-l-2 border-secondary">
              {step.taskContext}
            </div>
          </div>

          {/* LLM Analysis - Loading State or Results */}
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
            </div>
          ) : (
            step.llmAnalysis && (
              <>
                <div>
                  <span className="font-medium">Why it's important: </span>
                  {step.llmAnalysis.importance}
                </div>
                {step.llmAnalysis.suggestedNextSteps?.length > 0 && (
                  <div>
                    <span className="font-medium">Suggested next steps:</span>
                    <ul className="list-disc pl-4 mt-1">
                      {step.llmAnalysis.suggestedNextSteps.map(
                        (nextStep, i) => (
                          <li key={i}>{nextStep}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            )
          )}

          {/* File Info - Always Available */}
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            <div>Created: {formattedDate(step.fileCreated)}</div>
            <div>Modified: {formattedDate(step.fileModified)}</div>
            <div className="truncate">Path: {step.filePath}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this utility function at the top of the file
const generateStableId = (text: string): string => {
  if (!text) return '';
  // Create a simple hash from the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `step-${Math.abs(hash).toString(36)}`;
};

// Add this utility function at the top
const getRecentFiles = (tasks: Task[], daysAgo: number = 30): string[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
  
  return [...new Set(tasks
    .filter(task => new Date(task.stats.modified) >= cutoffDate)
    .map(task => task.filePath)
  )];
};

export function TaskSummary({ vaultPath, currentFile }: SummaryProps) {
  const {
    tasks,
    loadTasks,
    updateTask,
    isLoading: tasksLoading,
  } = useTaskStore();
  const [stats, setStats] = useState<TaskStats>({
    openTasks: 0,
    completed: 0,
    completionRate: 0,
    upcomingDeadlines: [],
    actionableSteps: [],
  });
  const [loadingState, setLoadingState] = useState<LoadingState>({
    tasks: false,
    analysis: false,
  });
  const [streamingState, setStreamingState] = useState<StreamingState>({
    deadlines: false,
    actions: false,
  });

  // Add filters state
  const [filters, setFilters] = useState<{
    status: 'all' | 'open' | 'completed';
    search: string;
  }>({
    status: 'all',
    search: '',
  });

  const [debouncedSearch] = useDebounce(filters.search, 300);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [debouncedStats] = useDebounce(stats, 150);

  const { apiKey } = useApiKeyStore();
  const { openFile } = useEditorStore();

  const [selectedStep, setSelectedStep] = useState<ActionableStepDetail | null>(
    null
  );
  const [isProcessingStep, setIsProcessingStep] = useState(false);

  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Add selection state
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );

  // Selection handlers
  const toggleTaskSelection = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTaskIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const isTaskSelected = (taskId: string) => selectedTaskIds.has(taskId);

  const handleError = (error: unknown) => {
    console.error('Error:', error);
    let errorType: LoadingState['error'] = {
      type: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    };

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorType = {
          type: 'API_ERROR',
          message: 'Invalid API key. Please check your settings.',
        };
      } else if (
        error.message.includes('network') ||
        error.message.includes('ECONNREFUSED')
      ) {
        errorType = {
          type: 'CONNECTION_ERROR',
          message: 'Unable to connect. Please check your internet connection.',
        };
      } else if (error.message.includes('Rate limit')) {
        errorType = {
          type: 'API_ERROR',
          message: 'API rate limit exceeded. Please try again later.',
        };
      }
    }

    setLoadingState((prev) => ({
      ...prev,
      tasks: false,
      analysis: false,
      error: errorType,
    }));

    // Reset streaming states
    setStreamingState({
      deadlines: false,
      actions: false,
    });
  };

  // Optimize task filtering with better memoization
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Early return for completed status
        if (filters.status !== 'all') {
          const isCompleted = filters.status === 'completed';
          if (task.completed !== isCompleted) return false;
        }

        // Only do search if there's a search term
        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          );
        }

        return true;
      })
      .slice(0, 100); // Limit maximum displayed tasks
  }, [tasks, filters.status, debouncedSearch]);

  // Optimize stats calculation
  const taskStats = useMemo(() => {
    const completedCount = tasks.reduce(
      (acc, task) => acc + (task.completed ? 1 : 0),
      0
    );
    return {
      openTasks: tasks.length - completedCount,
      completed: completedCount,
      completionRate: tasks.length ? (completedCount / tasks.length) * 100 : 0,
    };
  }, [tasks]);

  // Optimize recent tasks for LLM
  const recentTasksForLLM = useMemo(() => {
    return tasks
      .filter((task) => !task.completed && isTaskWithinDateRange(task, 28))
      .sort(
        (a, b) =>
          new Date(b.stats.modified).getTime() -
          new Date(a.stats.modified).getTime()
      )
      .slice(0, 25) // Reduce context size
      .map(({ id, title, tags, context }) => ({ id, title, tags, context })); // Only send necessary data
  }, [tasks]);

  // First, let's create a type for the mapped step result
  type MappedStep = {
    id: string;
    text: string;
    fileModified: string;
    fileCreated: string;
    filePath: string;
    taskContext: string;
    tags: string[];
    obsidianUrl?: string;
    llmAnalysis: {
      importance: string;
      estimatedTime: string;
      priority: 'high' | 'medium' | 'low';
      suggestedNextSteps: string[];
    };
  } | null;

  // Then update the filter in the LLM processing effect
  useEffect(() => {
    const analyzeActions = async () => {
      if (!recentTasksForLLM.length || !apiKey) return;

      setStreamingState((prev) => ({ ...prev, actions: true }));

      try {
        // Get recent files and their contents
        const recentFiles = getRecentFiles(tasks);
        const fileContexts = await Promise.all(
          recentFiles.map(async (filePath) => {
            try {
              const content = await window.api.readMarkdownFile(filePath);
              return {
                path: filePath,
                content: content.content,
                modified: tasks.find(t => t.filePath === filePath)?.stats.modified
              };
            } catch (error) {
              console.error(`Failed to read file: ${filePath}`, error);
              return null;
            }
          })
        );

        const validFileContexts = fileContexts.filter((f): f is NonNullable<typeof f> => f !== null);

        const openai = createOpenAI({ apiKey });
        const result = await streamObject({
          model: openai('gpt-4o'),
          schema: z.object({
            steps: z.array(
              z.object({
                id: z.string(),
                text: z.string(),
                importance: z.string(),
                estimatedTime: z.string(),
                priority: z.enum(['high', 'medium', 'low']),
                filePath: z.string(),
                suggestedNextSteps: z.array(z.string())
              })
            ).max(5)
          }).strict(),
          system: `You are analyzing tasks and files from the last 30 days.
                  Current date: ${new Date().toISOString()}
                  
                  Your goal is to identify the 0-5 most important actionable steps.
                  For each step:
                  1. Use the actual file path where the task was found
                  2. Consider file recency and task priority
                  3. Focus on concrete, actionable items
                  4. Maintain connection to source context`,
          prompt: `Analyze these files and tasks to identify key actionable steps:

                  Recent Files with Context:
                  ${validFileContexts.map(file => `
                    File: ${file.path}
                    Modified: ${file.modified}
                    ---
                    ${file.content.slice(0, 500)}... // First 500 chars for context
                    ---
                  `).join('\n')}

                  Available Tasks:
                  ${JSON.stringify(recentTasksForLLM, null, 2)}

                  Return 0-5 most important actionable steps.
                  Each step must:
                  1. Reference a specific file path
                  2. Be concrete and actionable
                  3. Include clear importance justification
                  4. Estimate time required
                  5. Suggest specific next steps`,
        });

        // Process the stream
        for await (const chunk of result.partialObjectStream) {
          if (chunk.steps?.length) {
            setStats((prev) => ({
              ...prev,
              actionableSteps: chunk.steps.map(step => ({
                id: step.id,
                text: step.text,
                fileModified: validFileContexts.find(f => f.path === step.filePath)?.modified || new Date().toISOString(),
                fileCreated: tasks.find(t => t.filePath === step.filePath)?.stats.created || new Date().toISOString(),
                filePath: step.filePath,
                taskContext: step.importance,
                tags: tasks.find(t => t.filePath === step.filePath)?.tags || [],
                obsidianUrl: tasks.find(t => t.filePath === step.filePath)?.obsidianUrl,
                llmAnalysis: {
                  importance: step.importance,
                  estimatedTime: step.estimatedTime,
                  priority: step.priority,
                  suggestedNextSteps: step.suggestedNextSteps
                }
              }))
            }));
          }
        }
      } catch (error) {
        handleError(error);
      } finally {
        setStreamingState((prev) => ({ ...prev, actions: false }));
      }
    };

    // Debounce the analysis to prevent too frequent updates
    const timeoutId = setTimeout(analyzeActions, 1000);
    return () => clearTimeout(timeoutId);
  }, [recentTasksForLLM, apiKey, tasks]);

  // Add useEffect for basic stats calculation
  useEffect(() => {
    if (!tasks.length) return;

    // Calculate basic stats
    const openTasksCount = tasks.filter((task) => !task.completed).length;
    const completedTasksCount = tasks.filter((task) => task.completed).length;
    const completionRate = (completedTasksCount / tasks.length) * 100;

    setStats((prev) => ({
      ...prev,
      openTasks: openTasksCount,
      completed: completedTasksCount,
      completionRate: completionRate,
    }));
  }, [tasks]); // Only recalculate when tasks change

  // Modify the actionable steps rendering to include the detail view
  const renderActionableSteps = () => (
    <div className="space-y-2">
      {streamingState.actions && debouncedStats.actionableSteps.length === 0 ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Identifying next actions...</span>
        </div>
      ) : (
        <>
          {debouncedStats.actionableSteps.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No actionable steps found
            </div>
          ) : (
            debouncedStats.actionableSteps.map((step, i) => {
              const stepId = `${step?.text}-${i}`;
              return (
                <TaskDetail
                  key={stepId}
                  step={step}
                  isExpanded={expandedStepId === stepId}
                  onToggle={() => {
                    if (expandedStepId !== stepId) {
                      setExpandedStepId(stepId);
                      analyzeStep(step);
                    } else {
                      setExpandedStepId(null);
                    }
                  }}
                  detail={selectedStep}
                  isLoading={isProcessingStep}
                />
              );
            })
          )}
        </>
      )}
    </div>
  );

  const analyzeStep = async (step: ActionableStep) => {
    if (!apiKey || isProcessingStep) return;

    console.log('Analyzing step:', step);
    setIsProcessingStep(true);

    try {
      // Get relevant tasks with their full context
      const relevantTasks = tasks
        .filter((task) => {
          // Filter tasks that are:
          // 1. Not completed
          // 2. Have matching tags with the current step
          // 3. Are from recent files (using the existing isWithinWeeks function)
          return (
            !task.completed &&
            (step.tags.some(tag => task.tags.includes(tag)) ||
             isWithinWeeks(task.filePath, 4))
          );
        })
        .slice(0, 50)
        .map(task => ({
          id: task.id,
          title: task.title,
          filePath: task.filePath,
          tags: task.tags,
          created: task.stats.created,
          modified: task.stats.modified,
          context: task.context
        }));

      const openai = createOpenAI({ apiKey });
      const result = await streamObject({
        model: openai('gpt-4o'),
        schema: z.object({
          context: z.string(),
          importance: z.string(),
          relatedTasks: z.array(z.object({
            taskId: z.string(),
            filePath: z.string(),
            reason: z.string()
          })),
          suggestedNextSteps: z.array(z.object({
            step: z.string(),
            associatedFile: z.string().optional(),
            dueDate: z.string().optional()
          })),
          timeline: z.object({
            start: z.string().optional(),
            due: z.string().optional(),
            reasoning: z.string()
          })
        }),
        system: `You are analyzing tasks in a knowledge management system.
                Current date: ${new Date().toISOString()}
                
                Task dates and files are critical for proper organization.
                When analyzing tasks:
                1. Use the actual file paths from the provided tasks
                2. Extract or infer dates from task content and file paths
                3. Consider task relationships based on:
                   - Shared tags
                   - File proximity (same folder)
                   - Temporal proximity (creation/modification dates)
                   - Content similarity`,
        prompt: `Analyze this task step in detail:
                Step Text: "${step.text}"
                Step File: "${step.filePath}"
                Step Context: "${step.taskContext}"
                Step Tags: ${JSON.stringify(step.tags)}
                File Created: ${step.fileCreated}
                File Modified: ${step.fileModified}
                
                Available related tasks for context:
                ${JSON.stringify(relevantTasks, null, 2)}
                
                Consider:
                1. File relationships - prefer linking to existing task files
                2. Temporal context - use actual dates from files when available
                3. Tag relationships - tasks sharing tags may be related
                4. Physical proximity - tasks in nearby files may be related
                
                Provide a detailed analysis that:
                1. Uses real file paths from the task context
                2. References actual dates from the files
                3. Links related tasks with their source files
                4. Suggests next steps with specific files when relevant`,
      });

      // Process the stream
      for await (const chunk of result.partialObjectStream) {
        if (chunk) {
          setSelectedStep({
            context: chunk.context || selectedStep?.context || '',
            importance: chunk.importance || selectedStep?.importance || '',
            relatedTasks: chunk.relatedTasks?.map(t => t.reason) || [],
            suggestedNextSteps: chunk.suggestedNextSteps?.map(s => 
              s.dueDate ? `${s.step} (Due: ${s.dueDate})` : s.step
            ) || [],
            filePath: chunk.relatedTasks?.[0]?.filePath || step.filePath
          });
        }
      }
    } catch (error) {
      console.error('Error analyzing step:', error);
      handleError(error);
    } finally {
      setIsProcessingStep(false);
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const content = await window.api.readMarkdownFile(task.filePath);
      const updatedContent = content.content.replace(
        /- \[([ xX])\] (.*)/g,
        (match: string, check: string, text: string) => {
          if (text.includes(task.title)) {
            return `- [${check === ' ' ? 'x' : ' '}] ${text}`;
          }
          return match;
        }
      );

      await window.api.writeMarkdownFile(task.filePath, updatedContent);
      updateTask(taskId, { completed: !task.completed });
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  // Add debug logging
  useEffect(() => {
    console.log('TaskSummary mounted with vaultPath:', vaultPath);
    console.log('Current tasks:', tasks);
    console.log('Loading state:', tasksLoading);
  }, [vaultPath, tasks, tasksLoading]);

  // Load tasks when component mounts or vaultPath changes
  useEffect(() => {
    if (!vaultPath) {
      console.log('No vault path provided');
      return;
    }

    const initializeTasks = async () => {
      console.log('Initializing tasks...');
      try {
        await loadTasks(vaultPath);
        console.log('Tasks loaded successfully');
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    initializeTasks();
  }, [vaultPath, loadTasks]);

  // Update stats whenever tasks change
  useEffect(() => {
    console.log('Updating stats with tasks:', tasks.length);
    if (!tasks.length) return;

    const openTasksCount = tasks.filter((task) => !task.completed).length;
    const completedTasksCount = tasks.filter((task) => task.completed).length;
    const completionRate = (completedTasksCount / tasks.length) * 100;

    setStats((prev) => ({
      ...prev,
      openTasks: openTasksCount,
      completed: completedTasksCount,
      completionRate: completionRate,
    }));
  }, [tasks]);

  // Loading state
  if (tasksLoading) {
    console.log('Rendering loading state');
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading tasks...</span>
      </div>
    );
  }

  // No tasks state
  if (!tasks.length) {
    console.log('Rendering no tasks state');
    return (
      <div className="text-center p-4 text-muted-foreground">
        No tasks found in this vault
      </div>
    );
  }

  console.log('Rendering main component with tasks:', tasks.length);

  const handleTaskClick = async (task: Task, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent task selection if you're using that
    if (task.filePath) {
      await openFile(task.filePath)
    }
  }

  return (
    <div className="space-y-4 h-full p-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <div className="text-3xl font-bold">
                {tasks.filter((task) => !task.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Open Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <div className="text-3xl font-bold">
                {tasks.filter((task) => task.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <div className="text-3xl font-bold">
                {`${(
                  (tasks.filter((task) => task.completed).length /
                    tasks.length) *
                  100
                ).toFixed(2)}%`}
              </div>
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-11)] ">
        {/* Left Column: All Tasks */}
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Manage your tasks</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="px-3 py-1 rounded-md border"
                  />
                  <Select
                    value={filters.status}
                    onValueChange={(value: 'all' | 'open' | 'completed') =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <ScrollArea className="h-[calc(100vh-22rem)]">
                <div className="px-4 space-y-2">
                  {filteredAndSortedTasks.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No tasks found
                    </div>
                  ) : (
                    filteredAndSortedTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          'flex items-center justify-between py-2 border-b last:border-b-0',
                          'cursor-pointer hover:bg-secondary/20 px-2 py-1 rounded',
                          isTaskSelected(task.id) && 'bg-secondary/40'
                        )}
                        onClick={(e) => handleTaskClick(task, e)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={cn(
                              'h-4 w-4 rounded border cursor-pointer',
                              task.completed && 'bg-primary border-primary'
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskToggle(task.id);
                            }}
                          />
                          <span
                            className={cn(
                              task.completed &&
                                'line-through text-muted-foreground'
                            )}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-secondary rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {task.obsidianUrl && (
                            <div className="group h-4 w-4">
                              <ObsidianIcon
                                className="text-muted-foreground hover:text-purple-500 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.api.openExternal(task.obsidianUrl!);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actionable Steps & Deadlines */}
        <div className="space-y-4">
          {/* Actionable Steps */}
          <CardHeader className="pb-2 ">
            <CardTitle>Actionable Steps</CardTitle>
            <CardDescription>Next actions from your notes</CardDescription>
          </CardHeader>
          <CardContent className="p-o">{renderActionableSteps()}</CardContent>
        </div>
      </div>
    </div>
  );
}
