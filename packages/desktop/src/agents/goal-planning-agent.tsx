import { Agent, RecognizedContext, AgentType } from './base-agent';
import { useElectron } from '../hooks/use-electron';
import { toast } from 'sonner';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '../stores/api-key-store';
import { generateObject } from 'ai';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface PlanningFolderCheckProps {
  onResult: (exists: boolean) => void;
}

const PlanningFolderCheck: React.FC<PlanningFolderCheckProps> = ({ onResult }) => {
  const [isChecking, setIsChecking] = useState(true);
  const api = useElectron();

  useEffect(() => {
    const checkFolder = async () => {
      try {
        const config = await api.getVaultConfig();
        if (!config?.path) {
          throw new Error('No vault configured');
        }

        const planningFolderPath = `${config.path}/hyprsqrl/planning`;
        try {
          const contents = await api.listFolderContents(planningFolderPath);
          onResult(contents !== null && Array.isArray(contents));
        } catch (error) {
          onResult(false);
        }
      } catch (error) {
        console.error('0xHypr', 'Error checking planning folder:', error);
        toast.error('Failed to check planning folder');
        onResult(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkFolder();
  }, [api, onResult]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Checking planning folder...</span>
      </div>
    );
  }

  return null;
};

const goalFormSchema = z.object({
  horizon: z.enum(['yearly', 'quarterly', 'monthly', 'weekly', 'today']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

const goalParserSchema = z.object({
  goal: z.object({
    title: z.string(),
    description: z.string(),
    subGoals: z.array(z.object({
      title: z.string(),
      tasks: z.array(z.object({
        description: z.string(),
        timeEstimate: z.string(),
        details: z.array(z.string()),
      })),
      whyThisMovesTheNeedle: z.array(z.string()),
    })),
  }),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export const GoalPlanningAgent: Agent = {
  id: 'goal-planning',
  name: 'Goal Planning',
  description: 'Creates structured goal plans in your Obsidian vault',
  type: 'task' as AgentType,
  isActive: true,
  
  render(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    const [folderExists, setFolderExists] = useState<boolean | null>(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const api = useElectron();

    const form = useForm<GoalFormValues>({
      resolver: zodResolver(goalFormSchema),
      defaultValues: {
        horizon: 'today',
        title: '',
        description: '',
      },
    });

    const parseGoalContext = async (values: GoalFormValues) => {
      try {
        const apiKey = getApiKey();
        if (!apiKey) {
          throw new Error('Please set your OpenAI API key in settings');
        }

        const openai = createOpenAI({ apiKey });
        const { object } = await generateObject({
          model: openai('gpt-4o'),
          schema: goalParserSchema,
          prompt: `
            You are analyzing user goals for the time horizon: ${values.horizon}.
            Create a structured plan that breaks down the following goal into actionable steps:

            Goal Title: ${values.title}
            Description: ${values.description || 'No description provided'}

            Format the response as a detailed plan with:
            1. Main sections as sub-goals
            2. Each section should have:
               - Specific tasks with time estimates (e.g. "15 mins", "1 hour")
               - Bullet points with implementation details
               - A "Why This Moves the Needle" summary explaining the impact
            
            Focus on practical, achievable steps that can be completed within the ${values.horizon} timeframe.
            Make each task concrete and actionable.
            Include specific tools or methods where relevant.
            Add time estimates that are realistic for each task.
          `.trim(),
        });

        return goalParserSchema.parse(object);
      } catch (error) {
        console.error('0xHypr', 'Error parsing goal data:', error);
        throw error;
      }
    };

    const onSubmit = async (values: GoalFormValues) => {
      try {
        setIsLoading(true);
        
        // First parse the goal with GPT-4o
        const parsedGoal = await parseGoalContext(values);
        
        const config = await api.getVaultConfig();
        if (!config?.path) {
          throw new Error('No vault configured');
        }

        // Map horizon to filename
        const getFilePath = (horizon: string, basePath: string) => {
          const horizonToFile = {
            yearly: 'yearly.md',
            quarterly: 'quarterly.md',
            monthly: 'monthly.md',
            weekly: 'weekly.md',
          };

          if (horizon === 'today') {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${basePath}/today-${year}-${month}-${day}.md`;
          }

          return `${basePath}/${horizonToFile[horizon as keyof typeof horizonToFile]}`;
        };

        const filePath = getFilePath(values.horizon, `${config.path}/hyprsqrl/planning`);

        // Read existing content
        let fileContent;
        try {
          const result = await api.readMarkdownFile(filePath);
          fileContent = result.content;
        } catch (error) {
          // Create new file with header
          if (values.horizon === 'today') {
            const date = new Date();
            const formattedDate = date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            fileContent = `# Goals for ${formattedDate}\n\nBelow are practical steps you can take today to move closer to your goals.\n\n`;
          } else {
            fileContent = `# ${values.horizon.charAt(0).toUpperCase() + values.horizon.slice(1)} Goals\n\n`;
          }
        }

        // Format the parsed goal into markdown
        const formatSubGoal = (subGoal: typeof parsedGoal.goal.subGoals[0], index: number) => {
          let markdown = `${index + 1}. ${subGoal.title}\n`;
          
          subGoal.tasks.forEach((task, taskIndex) => {
            markdown += `\t${taskIndex + 1}.\t${task.description} (${task.timeEstimate})\n`;
            task.details.forEach(detail => {
              markdown += `\t•\t${detail}\n`;
            });
            markdown += '\n';
          });

          markdown += 'Why This Moves the Needle:\n';
          subGoal.whyThisMovesTheNeedle.forEach(reason => {
            markdown += `\t•\t${reason}\n`;
          });
          markdown += '\n';

          return markdown;
        };

        // Add new goal with parsed content
        const goalEntry = `## ${parsedGoal.goal.title}\n\n${parsedGoal.goal.description}\n\n` +
          parsedGoal.goal.subGoals.map((subGoal, index) => formatSubGoal(subGoal, index)).join('\n');
        fileContent += goalEntry;

        await api.writeMarkdownFile(filePath, fileContent);
        console.log('0xHypr', 'Goal added to vault:', values.title);
        
        toast.success('Goal added to vault');
        setOpen(false);
        onSuccess?.();
      } catch (error) {
        console.error('0xHypr', 'Error creating goal:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create goal');
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      const initializePlanningFolder = async () => {
        if (folderExists === false) {
          try {
            const config = await api.getVaultConfig();
            if (!config?.path) {
              throw new Error('No vault configured');
            }
            const planningFolderPath = `${config.path}/hyprsqrl/planning`;
            const created = await api.createFolder(planningFolderPath);
            if (created) {
              console.log('0xHypr', 'Successfully created planning folder');
              
              // Create planning files
              const files = [
                { name: 'yearly.md', title: 'Yearly Goals' },
                { name: 'quarterly.md', title: 'Quarterly Goals' },
                { name: 'monthly.md', title: 'Monthly Goals' },
                { name: 'weekly.md', title: 'Weekly Goals' }
              ];

              for (const file of files) {
                const filePath = `${planningFolderPath}/${file.name}`;
                try {
                  // Check if file exists first
                  await api.readMarkdownFile(filePath);
                } catch {
                  // File doesn't exist, create it
                  const content = `# ${file.title}\n\n`;
                  await api.writeMarkdownFile(filePath, content);
                  console.log('0xHypr', `Created ${file.name}`);
                }
              }

              setFolderExists(true);
            } else {
              throw new Error('Failed to create planning folder');
            }
          } catch (error) {
            console.error('0xHypr', 'Error initializing planning folder:', error);
            toast.error('Failed to initialize planning folder');
          }
        } else if (folderExists === true) {
          console.log('0xHypr', 'Planning folder exists, proceeding to UI');
        }
      };

      initializePlanningFolder();
    }, [folderExists, api]);
    
    return (
      <div>
        <PlanningFolderCheck onResult={setFolderExists} />
        {folderExists && (
          <div className="flex flex-col">
            <h3 className="font-medium">Goal Planning</h3>
            <p className="text-sm text-muted-foreground">{context.title}</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Create Goal'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Goal</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="horizon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Horizon</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time horizon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yearly">1 Year</SelectItem>
                              <SelectItem value="quarterly">3 Months</SelectItem>
                              <SelectItem value="monthly">1 Month</SelectItem>
                              <SelectItem value="weekly">1 Week</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Goal
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  },
};
