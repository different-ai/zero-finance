import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import SHA256 from 'crypto-js/sha256'
import enc from 'crypto-js/enc-hex'

type ClassificationResult = {
  type: 'task' | 'event'
  title: string
  startTime?: string
  endTime?: string
  location?: string
}

type ClassificationLog = {
  id: string
  timestamp: string
  content: string
  success: boolean
  error?: string
  results?: ClassificationResult[]
}

// Export the types we need in other components
export type RecognizedItemType = 'task' | 'event' | 'other';

export type RecognizedItemBase = {
  id: string;
  rawContent: string;
  timestamp: string;
  source: string;
  confidence: number;
  type: RecognizedItemType;
};

export type RecognizedTaskItem = RecognizedItemBase & {
  type: 'task';
  title: string;
  details?: string;
};

export type RecognizedEventItem = RecognizedItemBase & {
  type: 'event';
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  details?: string;
  attendees?: string[];
};

export type RecognizedOtherItem = RecognizedItemBase & {
  type: 'other';
};

export type RecognizedItem = RecognizedTaskItem | RecognizedEventItem | RecognizedOtherItem;

type ClassificationStore = {
  logs: ClassificationLog[]
  processedContent: Set<string>
  recognizedItems: RecognizedItem[]
  autoClassifyEnabled: boolean
  addLog: (log: Omit<ClassificationLog, 'id'>) => void
  clearLogs: () => void
  hasProcessedContent: (content: string) => boolean
  addProcessedContent: (content: string) => void
  deduplicateItems: (items: RecognizedItem[], apiKey: string) => Promise<RecognizedItem[]>
  setRecognizedItems: (items: RecognizedItem[]) => void
  clearRecognizedItems: () => void
  setAutoClassify: (enabled: boolean) => void
}

// Helper function for consistent hashing
const hashContent = (str: string): string => {
  return SHA256(str).toString(enc)
}

export const useClassificationStore = create<ClassificationStore>()(
  persist(
    (set, get) => ({
      logs: [],
      processedContent: new Set(),
      recognizedItems: [],
      autoClassifyEnabled: true,

      addLog: (log) => set((state) => ({
        logs: [{
          ...log,
          id: crypto.randomUUID(),
        }, ...state.logs.slice(0, 99)]
      })),

      clearLogs: () => set({ logs: [] }),

      hasProcessedContent: (content: string) => {
        const hash = hashContent(content)
        return get().processedContent.has(hash)
      },

      addProcessedContent: (content: string) => {
        const hash = hashContent(content)
        set((state) => ({
          processedContent: new Set([...state.processedContent, hash])
        }))
      },

      async deduplicateItems(items: RecognizedItem[], apiKey: string) {
        // If there are fewer items, no need to deduplicate
        if (items.length <= 3) return items

        const openai = createOpenAI({ apiKey })
        
        // We'll just send titles and details to the model to determine uniqueness
        const indexedContent = items.map((item, i) => ({
          index: i+1,
          content: (() => {
            switch (item.type) {
              case 'task':
                return `Task: ${item.title}, details: ${item.details || 'N/A'}`
              case 'event':
                return `Event: ${item.title}, details: ${item.details || 'N/A'}`
              default:
                return 'Other item'
            }
          })()
        }))

        const { object: result } = await generateObject({
          model: openai('gpt-4o'),
          schema: z.object({
            uniqueItems: z.array(z.object({
              index: z.number(),
              reason: z.string(),
            })).max(6),
          }),
          prompt: `Analyze these items and select 3-6 most important and unique ones.
Avoid duplicates and similar items. For each selected item, explain why it's unique.

Items:
${indexedContent.map((item) => `${item.index}. ${item.content}`).join('\n')}

Return a JSON object with "uniqueItems" field containing indices of the chosen items and reasoning. Do not mention duplicates in the final JSON, just return the structure asked.`,
        })

        const selectedIndices = result.uniqueItems.map(({ index }) => index - 1)
        const deduplicated = items.filter((_, i) => selectedIndices.includes(i))
        return deduplicated
      },

      setRecognizedItems: (items) => set({ recognizedItems: items }),

      clearRecognizedItems: () => set({ recognizedItems: [] }),

      setAutoClassify: (enabled) => set({ autoClassifyEnabled: enabled }),
    }),
    {
      name: 'classification-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        logs: state.logs,
        processedContent: Array.from(state.processedContent),
        recognizedItems: state.recognizedItems,
        autoClassifyEnabled: state.autoClassifyEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert Array back to Set after rehydration
          if (Array.isArray(state.processedContent)) {
            state.processedContent = new Set(state.processedContent)
          }
          // Ensure logs array exists
          if (!Array.isArray(state.logs)) {
            state.logs = []
          }
          // Trim logs to max size if needed
          if (state.logs.length > 100) {
            state.logs = state.logs.slice(0, 100)
          }
        }
      },
      version: 1,
    }
  )
)