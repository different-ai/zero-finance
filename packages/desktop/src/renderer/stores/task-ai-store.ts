import { create } from 'zustand'
import { createOpenAI } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'
import { Task } from '@/renderer/task-utils'

export interface ActionableStep {
  id: string
  text: string
  fileModified: string
  fileCreated: string
  filePath: string
  taskContext: string
  tags: string[]
  obsidianUrl?: string
  llmAnalysis: {
    importance: string
    estimatedTime: string
    priority: 'high' | 'medium' | 'low'
    suggestedNextSteps: string[]
  }
}

interface TaskAIState {
  actionableSteps: ActionableStep[]
  isLoading: boolean
  error: Error | null
  selectedStepId: string | null
  analyzeRecentTasks: (tasks: Task[], apiKey: string) => Promise<void>
  selectStep: (stepId: string | null) => void
}

export const useTaskAIStore = create<TaskAIState>((set, get) => ({
  actionableSteps: [],
  isLoading: false,
  error: null,
  selectedStepId: null,

  selectStep: (stepId) => set({ selectedStepId: stepId }),

  analyzeRecentTasks: async (tasks: Task[], apiKey: string) => {
    if (!tasks.length || !apiKey) return

    set({ isLoading: true })

    try {
      // Use the provided filtered tasks directly
      const recentTasks = tasks
        .filter((task) => !task.completed)
        .sort(
          (a, b) =>
            new Date(b.stats.modified).getTime() -
            new Date(a.stats.modified).getTime()
        )
        .slice(0, 25)
        .map(({ id, title, tags, context }) => ({ id, title, tags, context }))

      // Get files from filtered tasks
      const recentFiles = [...new Set(tasks.map(task => task.filePath))]

      const fileContexts = await Promise.all(
        recentFiles.map(async (filePath) => {
          try {
            const content = await window.api.readMarkdownFile(filePath)
            return {
              path: filePath,
              content: content.content,
              modified: tasks.find(t => t.filePath === filePath)?.stats.modified
            }
          } catch (error) {
            console.error(`Failed to read file: ${filePath}`, error)
            return null
          }
        })
      )

      const validFileContexts = fileContexts.filter((f): f is NonNullable<typeof f> => f !== null)

      const openai = createOpenAI({ apiKey })
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
                ${JSON.stringify(recentTasks, null, 2)}

                Return 0-5 most important actionable steps.
                Each step must:
                1. Reference a specific file path
                2. Be concrete and actionable
                3. Include clear importance justification
                4. Estimate time required
                5. Suggest specific next steps`,
      })

      // Process the stream
      for await (const chunk of result.partialObjectStream) {
        if (chunk.steps?.length) {
          set({
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
          })
        }
      }
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ isLoading: false })
    }
  }
})) 