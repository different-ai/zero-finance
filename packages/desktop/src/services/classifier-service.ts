import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { taskAgent } from '@/agents/task-agent'
import { calendarAgent } from '@/agents/calendar-agent'

export class ClassifierService {
  private agents = [taskAgent, calendarAgent]

  async classify(content: string) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        contentTypes: z.array(z.object({
          type: z.enum(['task', 'event']),
          confidence: z.number().min(0).max(1),
          relevantContent: z.string(),
        })),
      }),
      prompt: `Analyze this content and determine if it contains tasks, calendar events, or both.
      For each detected type, extract the relevant content.
      
      Content: ${content}`
    })

    const results = []

    for (const contentType of object.contentTypes) {
      const agent = this.agents.find(a => a.type === contentType.type && a.isActive)
      if (agent) {
        const processed = await agent.process(contentType.relevantContent)
        results.push({
          type: contentType.type,
          agent: agent.id,
          results: processed,
        })
      }
    }

    return results
  }
} 