import { Agent, TaskData, RecognizedContext, isRecognizedContext } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';
import { createOpenAI } from '@ai-sdk/openai';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

const taskSchema = z.object({
  task: z.object({
    title: z.string(),
    content: z.string(),
  })
});

interface TaskAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

export const TaskAgentUI: React.FC<TaskAgentUIProps> = ({ context, onSuccess }) => {
  const { toast } = useToast();

  if (!isRecognizedContext(context)) {
    console.error('0xHypr', 'Invalid context provided to TaskAgentUI');
    return null;
  }

  const processTask = async () => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: taskSchema,
        prompt: `
          Create a task from the following content and vital information:
          
          Content:
          ${context.relevantRawContent}
          
          Vital Information:
          ${context.vitalInformation}
          
          Create a well-formatted task with a clear title and description.
        `.trim()
      });

      const result = taskSchema.parse(object);
      const taskData: TaskData = {
        title: result.task.title,
        content: result.task.content,
        details: result.task.details,
      };

      // Add to vault
      const config = await window.api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      const filePath = `${config.path}/hyprsqrl.md`;
      let fileContent = '';

      try {
        const result = await window.api.readMarkdownFile(filePath);
        fileContent = result.content;
      } catch (error) {
        fileContent = `# HyprSqrl Tasks\n\n## Tasks\n`;
      }

      const taskEntry = `- [ ] ${taskData.title}\n` +
        `  - Content: ${taskData.content}\n` +
        (taskData.details ? `  - Details: ${taskData.details}\n` : '') +
        `  - Created: ${new Date().toISOString()}\n`;

      if (fileContent.includes('## Tasks')) {
        fileContent = fileContent.replace('## Tasks\n', `## Tasks\n${taskEntry}`);
      } else {
        fileContent += `\n## Tasks\n${taskEntry}`;
      }

      await window.api.writeMarkdownFile(filePath, fileContent);
      console.log('0xHypr', 'Task added to vault:', taskData.title);
      
      toast({
        title: 'Success',
        description: 'Task added to vault'
      });

      onSuccess?.();
    } catch (error) {
      console.error('0xHypr', 'Error creating task:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive'
      });
    }
  };

  return React.createElement(Card, null,
    React.createElement(CardContent, { className: "p-4" },
      React.createElement('div', { className: "flex justify-between items-center" },
        React.createElement('div', null,
          React.createElement('h3', { className: "font-medium" }, "Task Detected"),
          React.createElement('p', { className: "text-sm text-muted-foreground" }, context.relevantRawContent),
          React.createElement('p', { className: "text-xs text-muted-foreground mt-1" }, context.vitalInformation)
        ),
        React.createElement(Button, { onClick: processTask }, "Create Task")
      )
    )
  );
};

export const taskAgent: Agent = {
  id: 'task',
  name: 'Task Agent',
  description: 'Recognizes tasks from text',
  type: 'task',
  isActive: true,

  render: (context: RecognizedContext, onSuccess?: () => void) => {
    if (!isRecognizedContext(context)) {
      console.error('0xHypr', 'Invalid context provided to task agent');
      return null;
    }
    return React.createElement(TaskAgentUI, { context, onSuccess });
  }
}; 