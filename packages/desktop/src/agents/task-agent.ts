import { CheckSquare } from 'lucide-react'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import type { Agent } from './base-agent'

export const taskAgent: Agent = {
  id: 'built-in-task-agent',
  name: 'Task Agent',
  description: 'Detects and processes actionable tasks from screen content',
  type: 'task',
  icon: CheckSquare,
  isBuiltIn: true,
  isActive: true,

  async process(content: string) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        tasks: z.array(z.object({
          title: z.string(),
          details: z.string(),
          confidence: z.number().min(0).max(1),
          priority: z.enum(['high', 'medium', 'low']).optional(),
          dueDate: z.string().nullable(),
        })).max(5),
      }),
      prompt: `Extract only genuine, actionable work tasks from this content.
      Ignore UI elements, menus, and completed tasks.
      Focus on real work items that need to be done.
      
      Content: ${content}`
    })

    return object.tasks
  }
} 