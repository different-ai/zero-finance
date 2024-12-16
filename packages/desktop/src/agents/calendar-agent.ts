import { Calendar } from 'lucide-react'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import type { Agent } from './base-agent'

export const calendarAgent: Agent = {
  id: 'built-in-calendar-agent',
  name: 'Calendar Agent',
  description: 'Detects and processes calendar events from screen content',
  type: 'event',
  icon: Calendar,
  isBuiltIn: true,
  isActive: true,

  async process(content: string) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        events: z.array(z.object({
          title: z.string(),
          startTime: z.string(),
          endTime: z.string(),
          location: z.string().optional(),
          attendees: z.array(z.string()).optional(),
          details: z.string().optional(),
          confidence: z.number().min(0).max(1),
        })).max(5),
      }),
      prompt: `Extract only genuine calendar events from this content.
      Ignore UI elements and non-event content.
      Focus on real meetings, appointments, and scheduled events.
      
      Content: ${content}`
    })

    return object.events
  }
} 