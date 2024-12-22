import { Agent, RecognizedTaskItem, TaskData } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';
import { createOpenAI } from '@ai-sdk/openai';

const taskSchema = z.object({
  task: z.object({
    title: z.string(),
    content: z.string(),
    details: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  })
});

type TaskSchema = z.infer<typeof taskSchema>;

export const taskAgent: Agent = {
  id: 'task',
  name: 'Task Agent',
  description: 'Recognizes tasks from text',
  type: 'task',
  isActive: true,

  process: async (content: string) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Please set your OpenAI API key in settings');
    }

    const openai = createOpenAI({ apiKey });
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: taskSchema,
      prompt: content
    });

    const result = taskSchema.parse(object);
    
    // Ensure required fields are present
    const taskData: TaskData = {
      title: result.task.title,
      content: result.task.content,
      details: result.task.details,
      dueDate: result.task.dueDate,
      priority: result.task.priority
    };

    const recognizedTask: RecognizedTaskItem = {
      id: crypto.randomUUID(),
      type: 'task',
      data: taskData,
      timestamp: new Date().toISOString(),
      agentId: 'task',
      source: 'ai-classification',
      confidence: 0.9
    };

    return recognizedTask;
  },

  action: async (item: RecognizedTaskItem) => {
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

      const taskEntry = `- [ ] ${item.data.title}\n` +
        `  - Content: ${item.data.content}\n` +
        (item.data.details ? `  - Details: ${item.data.details}\n` : '') +
        (item.data.dueDate ? `  - Due: ${new Date(item.data.dueDate).toLocaleDateString()}\n` : '') +
        (item.data.priority ? `  - Priority: ${item.data.priority}\n` : '') +
        `  - Source: ${item.source}\n` +
        `  - Created: ${new Date(item.timestamp).toISOString()}\n` +
        `  - Confidence: ${(item.confidence * 100).toFixed(0)}%\n`;

      if (content.includes('## Tasks')) {
        content = content.replace('## Tasks\n', `## Tasks\n${taskEntry}`);
      } else {
        content += `\n## Tasks\n${taskEntry}`;
      }

      await window.api.writeMarkdownFile(filePath, content);
      console.log('0xHypr', 'Task added to vault:', item.data.title);
      
      return Promise.resolve();
    } catch (error) {
      console.error('0xHypr', 'Error creating task:', error);
      throw error;
    }
  }
}; 