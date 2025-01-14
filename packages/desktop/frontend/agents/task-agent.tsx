import { Agent, RecognizedContext, AgentType } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as React from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '../stores/api-key-store';
import { useElectron } from '../hooks/use-electron';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertCircle,
  Book,
  CheckCircle2,
  FileText,
  List,
  Plus,
  Search,
  Tag,
  Loader2,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { getAllTasks } from '../deprecate/task-utils';
import type { Task } from '../deprecate/task-utils';
import { ObsidianIcon } from '../deprecate/components/obsidian-icon';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  details: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const taskParserSchema = z.object({
  task: z.object({
    title: z.string(),
    content: z.string(),
    details: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

interface AddTaskToObsidianUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const AddTaskToObsidianUI: React.FC<AddTaskToObsidianUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const api = useElectron();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      content: '',
      details: '',
      dueDate: '',
      priority: 'medium',
    },
  });

  const parseContext = async () => {
    try {
      setIsLoading(true);
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: taskParserSchema,
        prompt: `
          Extract task information from the following content and vital information:
          
          Content:
          ${context.title}
          
          Vital Information:
          ${context.vitalInformation}
          
          Parse this into a well-formatted task with title, content, and optional details.
          If dates are mentioned, format them as YYYY-MM-DD.
          If priority indicators are present, categorize as low, medium, or high.
        `.trim(),
      });

      const result = taskParserSchema.parse(object);

      // Update form with parsed data
      form.reset({
        title: result.task.title,
        content: result.task.content,
        details: result.task.details || '',
        dueDate: result.task.dueDate || '',
        priority: result.task.priority || 'medium',
      });

      setOpen(true);
    } catch (error) {
      console.error('0xHypr', 'Error parsing task data:', error);
      toast.error('Failed to parse task data');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const config = await api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      const filePath = `${config.path}/hyprsqrl.md`;
      let fileContent = '';

      try {
        const result = await api.readMarkdownFile(filePath);
        fileContent = result.content;
      } catch (error) {
        fileContent = `# HyprSqrl Tasks\n\n## Tasks\n`;
      }

      const taskEntry =
        `- [ ] ${values.title}\n` +
        `  - Content: ${values.content}\n` +
        (values.details ? `  - Details: ${values.details}\n` : '') +
        (values.dueDate ? `  - Due: ${values.dueDate}\n` : '') +
        (values.priority ? `  - Priority: ${values.priority}\n` : '') +
        `  - Created: ${new Date().toISOString()}\n`;

      if (fileContent.includes('## Tasks')) {
        fileContent = fileContent.replace(
          '## Tasks\n',
          `## Tasks\n${taskEntry}`
        );
      } else {
        fileContent += `\n## Tasks\n${taskEntry}`;
      }

      await api.writeMarkdownFile(filePath, fileContent);
      console.log('0xHypr', 'Task added to vault:', values.title);

      toast.success('Task added to vault');
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('0xHypr', 'Error creating task:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create task'
      );
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <h3 className="font-medium">Task Detected</h3>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={parseContext} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Create Task'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority (optional)</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface TaskFilters {
  status: 'all' | 'open' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
  search: string;
}

const TaskDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useElectron();

  // Debounce search input
  const [debouncedSearch] = useDebounce(filters.search, 300);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === 'all'
          ? true
          : filters.status === 'completed'
          ? task.completed
          : !task.completed;

      const matchesSearch =
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

      return matchesStatus && matchesSearch;
    });
  }, [tasks, filters.status, debouncedSearch]);

  // Load tasks with error handling
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const config = await api.getVaultConfig();
        if (!config?.path) {
          throw new Error('No vault configured');
        }
        const allTasks = await getAllTasks(config.path);
        setTasks(allTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [api]);

  const handleTaskToggle = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const content = await api.readMarkdownFile(task.filePath);
      const updatedContent = content.content.replace(
        /- \[([ xX])\] (.*)/g,
        (match: string, check: string, text: string) => {
          if (text.includes(task.title)) {
            return `- [${check === ' ' ? 'x' : ' '}] ${text}`;
          }
          return match;
        }
      );

      await api.writeMarkdownFile(task.filePath, updatedContent);
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const handleOpenInObsidian = async (filePath: string) => {
    try {
      await api.openInObsidian(filePath);
      toast.success('Opened in Obsidian');
    } catch (err) {
      toast.error('Failed to open in Obsidian');
      console.error('0xHypr', 'Failed to open in Obsidian:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-lg">
        <AlertCircle className="h-5 w-5 inline mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <select
              className="p-2 border rounded"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value as any })
              }
            >
              <option value="all">All Tasks</option>
              <option value="open">Open Tasks</option>
              <option value="completed">Completed Tasks</option>
            </select>
            <input
              type="text"
              placeholder="Search tasks..."
              className="p-2 border rounded"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskToggle(task.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <CardTitle
                          className={cn(
                            'cursor-pointer hover:text-primary transition-colors',
                            task.completed && 'line-through opacity-50'
                          )}
                          onClick={() => handleOpenInObsidian(task.filePath)}
                        >
                          {task.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <button
                            onClick={() => handleOpenInObsidian(task.filePath)}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            {task.filePath.split('/').pop()}
                          </button>
                        </CardDescription>
                        {task.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-secondary rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenInObsidian(task.filePath)}
                      className="ml-2"
                    >
                      <Book className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export const AddTaskToObsidianAgent: Agent = {
  id: 'add-task-to-obsidian',
  name: 'ObsidianTask Adder',
  displayName: () => (
    <div className="flex items-center gap-2">
      <ObsidianIcon className='text-purple-600'/>
      Task Adder
    </div>
  ),
  description: 'Automatically adds tasks to your Obsidian vault',
  type: 'task' as AgentType,
  isActive: true,
  isReady: true,
  detectorPrompt:
    `Search for tasks that are like that are received by  the owner of this computer and requires their actions. Focus on work and personal related stuff.
    Sample queries:
    "I need to do",
    "Could you finish",
     `,
  miniApp: () => <TaskDashboardView />,

  eventAction(
    context: RecognizedContext,
    onSuccess?: () => void
  ): React.ReactNode {
    return <AddTaskToObsidianUI context={context} onSuccess={onSuccess} />;
  },
};
