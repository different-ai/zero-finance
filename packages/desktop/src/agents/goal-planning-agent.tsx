import { Agent, RecognizedContext, AgentType } from './base-agent';
import { useElectron } from '../hooks/use-electron';
import { toast } from 'sonner';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '../stores/api-key-store';
import { generateObject } from 'ai';
import { z } from 'zod';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';

const goalFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

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

interface GoalPlanningUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const GoalPlanningUI: React.FC<GoalPlanningUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const api = useElectron();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
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
        schema: goalParserSchema,
        prompt: `
          Extract goal information from the following content and vital information:
          
          Content:
          ${context.title}
          
          Vital Information:
          ${context.vitalInformation}
          
          Parse this into a well-structured goal with title, description, and actionable sub-goals.
        `.trim(),
      });

      const result = goalParserSchema.parse(object);

      // Update form with parsed data
      form.reset({
        title: result.goal.title,
        description: result.goal.description,
      });

      setOpen(true);
    } catch (error) {
      console.error('0xHypr', 'Error parsing goal data:', error);
      toast.error('Failed to parse goal data');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: GoalFormValues) => {
    try {
      const config = await api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      const filePath = `${config.path}/goals.md`;
      let fileContent = '';

      try {
        const result = await api.readMarkdownFile(filePath);
        fileContent = result.content;
      } catch (error) {
        fileContent = `# Goals\n\n`;
      }

      const goalEntry = `## ${values.title}\n\n${values.description}\n\n`;
      fileContent += goalEntry;

      await api.writeMarkdownFile(filePath, fileContent);
      console.log('0xHypr', 'Goal added to vault:', values.title);
      
      toast.success('Goal added to vault');
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('0xHypr', 'Error creating goal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create goal');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <h3 className="font-medium">Goal Detected</h3>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={parseContext}
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
                    <FormLabel>Description</FormLabel>
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
  );
};

const GoalPlanningDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [markdownFiles, setMarkdownFiles] = useState<Array<{ path: string; content: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const api = useElectron();

  useEffect(() => {
    const loadMarkdownFiles = async () => {
      try {
        const config = await api.getVaultConfig();
        if (!config?.path) {
          throw new Error('No vault configured');
        }

        // List all markdown files in the vault
        const files = await api.listMarkdownFiles(config.path);
        
        // Load content of first 5 random files
        const randomFiles = files
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);

        const filesWithContent = await Promise.all(
          randomFiles.map(async (file) => {
            const content = await api.readMarkdownFile(file.path);
            return {
              path: file.path,
              content: content.content,
            };
          })
        );

        setMarkdownFiles(filesWithContent);
        if (filesWithContent.length > 0) {
          setSelectedFile(filesWithContent[0].path);
        }
      } catch (error) {
        console.error('0xHypr', 'Error loading markdown files:', error);
        toast.error('Failed to load markdown files');
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkdownFiles();
  }, [api]);

  const analyzeGoals = async (content: string) => {
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
          You are analyzing a markdown document for goals and action items.
          Extract and structure the goals found in this content:

          ${content}

          Focus on:
          1. Identifying clear goals and objectives
          2. Breaking down into actionable sub-goals
          3. Estimating time requirements
          4. Explaining impact of each sub-goal
        `.trim(),
      });

      return goalParserSchema.parse(object);
    } catch (error) {
      console.error('0xHypr', 'Error analyzing goals:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Loading markdown files...</span>
      </div>
    );
  }

  const selectedContent = markdownFiles.find(f => f.path === selectedFile)?.content;

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {markdownFiles.map((file) => (
          <Button
            key={file.path}
            variant={selectedFile === file.path ? "default" : "outline"}
            onClick={() => setSelectedFile(file.path)}
            className="flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            {file.path.split('/').pop()}
          </Button>
        ))}
      </div>

      {selectedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
            <CardDescription>
              Analyzing goals and action items from selected document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                <div className="font-medium">Raw Content:</div>
                <pre className="text-sm whitespace-pre-wrap bg-muted p-2 rounded">
                  {selectedContent}
                </pre>
              </div>
            </ScrollArea>
            <Button
              onClick={() => analyzeGoals(selectedContent)}
              className="mt-4"
            >
              Analyze Goals
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const GoalPlanningAgent: Agent = {
  id: 'goal-planning',
  name: 'Goal Planning',
  description: 'Analyzes markdown files to extract and track goals',
  type: 'goal' as AgentType,
  isActive: true,
  
  eventAction(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    return <GoalPlanningUI context={context} onSuccess={onSuccess} />;
  },

  miniApp: () => <GoalPlanningDashboard />,
};
