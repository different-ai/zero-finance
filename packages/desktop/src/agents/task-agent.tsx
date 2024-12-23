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
import { useState } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '../stores/api-key-store';
import { useElectron } from '../hooks/use-electron';

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

      const taskEntry = `- [ ] ${values.title}\n` +
        `  - Content: ${values.content}\n` +
        (values.details ? `  - Details: ${values.details}\n` : '') +
        (values.dueDate ? `  - Due: ${values.dueDate}\n` : '') +
        (values.priority ? `  - Priority: ${values.priority}\n` : '') +
        `  - Created: ${new Date().toISOString()}\n`;

      if (fileContent.includes('## Tasks')) {
        fileContent = fileContent.replace('## Tasks\n', `## Tasks\n${taskEntry}`);
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
      toast.error(error instanceof Error ? error.message : 'Failed to create task');
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
          <Button
            variant="outline"
            onClick={parseContext}
            disabled={isLoading}
          >
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

export const AddTaskToObsidianAgent: Agent = {
  id: 'add-task-to-obsidian',
  name: 'Add Task to Obsidian',
  description: 'Creates tasks in your Obsidian vault from detected content',
  type: 'task' as AgentType,
  isActive: true,

  render(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    return <AddTaskToObsidianUI context={context} onSuccess={onSuccess} />;
  },
}; 