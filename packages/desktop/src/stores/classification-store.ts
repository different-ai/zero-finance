import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Agent } from '@/agents/base-agent'
import { taskAgent } from '@/agents/task-agent'
import { calendarAgent } from '@/agents/calendar-agent'
import { ClassifierService } from '@/services/classifier-service'
import SHA256 from 'crypto-js/sha256'
import enc from 'crypto-js/enc-hex'

// Helper function for consistent hashing
const hashContent = (str: string): string => {
  return SHA256(str).toString(enc)
}

// Default agents with their initial state
const DEFAULT_AGENTS = [
  { ...taskAgent, isActive: true },
  { ...calendarAgent, isActive: true }
]

// Debug logging helper
const debug = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[ClassificationStore]', ...args)
  }
}

export type RecognizedTaskItem = {
  id: string
  type: 'task'
  agentId: string
  timestamp: string
  source: string
  confidence: number
  data: {
    title: string
    details?: string
    priority?: 'high' | 'medium' | 'low'
    dueDate?: string
  }
}

export type RecognizedEventItem = {
  id: string
  type: 'event'
  agentId: string
  timestamp: string
  source: string
  confidence: number
  data: {
    title: string
    startTime: string
    endTime: string
    location?: string
    attendees?: string[]
    details?: string
  }
}

export type RecognizedItem = RecognizedTaskItem | RecognizedEventItem

type ClassificationLog = {
  id: string
  timestamp: string
  content: string
  success: boolean
  error?: string
  results?: Array<{
    type: 'task' | 'event'
    title: string
    startTime?: string
    endTime?: string
  }>
}

type ClassificationStore = {
  agents: Agent[]
  recognizedItems: RecognizedItem[]
  autoClassifyEnabled: boolean
  processedContent: Set<string>
  classifier: ClassifierService
  logs: ClassificationLog[]
  
  // Actions
  addLog: (log: Omit<ClassificationLog, 'id'>) => void
  addRecognizedItem: (item: Omit<RecognizedTaskItem | RecognizedEventItem, 'id'>) => void
  removeRecognizedItem: (id: string) => void
  clearRecognizedItems: () => void
  setAutoClassify: (enabled: boolean) => void
  toggleAgent: (agentId: string) => void
  hasProcessedContent: (content: string) => boolean
  addProcessedContent: (content: string) => void
  setRecognizedItems: (items: RecognizedItem[]) => void
  deduplicateItems: (items: RecognizedItem[], apiKey: string) => Promise<RecognizedItem[]>
}

export const useClassificationStore = create<ClassificationStore>()(
  persist(
    (set, get) => ({
      agents: DEFAULT_AGENTS,
      recognizedItems: [],
      autoClassifyEnabled: true,
      processedContent: new Set<string>(),
      classifier: new ClassifierService(),
      logs: [],

      addLog: (log) => set((state) => ({
        logs: [{
          ...log,
          id: crypto.randomUUID(),
        }, ...state.logs]
      })),

      addRecognizedItem: (item) => set((state) => ({
        recognizedItems: [{
          ...item,
          id: crypto.randomUUID(),
        } as RecognizedItem, ...state.recognizedItems]
      })),

      removeRecognizedItem: (id) => set((state) => ({
        recognizedItems: state.recognizedItems.filter(item => item.id !== id)
      })),

      clearRecognizedItems: () => set({ recognizedItems: [] }),

      setAutoClassify: (enabled) => set({ autoClassifyEnabled: enabled }),

      toggleAgent: (agentId) => {
        debug('Toggling agent:', agentId)
        set((state) => {
          const newAgents = state.agents.map(agent => 
            agent.id === agentId 
              ? { ...agent, isActive: !agent.isActive }
              : agent
          )
          debug('New agent states:', newAgents.map(a => ({ id: a.id, isActive: a.isActive })))
          return { agents: newAgents }
        })
      },

      hasProcessedContent: (content) => {
        const hash = hashContent(content)
        return get().processedContent.has(hash)
      },

      addProcessedContent: (content) => {
        const hash = hashContent(content)
        const newSet = new Set(get().processedContent)
        newSet.add(hash)
        set({ processedContent: newSet })
      },

      setRecognizedItems: (items) => set({ recognizedItems: items }),

      deduplicateItems: async (items, apiKey) => {
        // Implementation of deduplication logic
        return items
      },
    }),
    {
      name: 'classification-store',
      partialize: (state) => {
        const partialState = {
          autoClassifyEnabled: state.autoClassifyEnabled,
          processedContent: Array.from(state.processedContent),
          agentStates: state.agents.map(({ id, isActive }) => ({ id, isActive })),
        }
        debug('Persisting state:', partialState)
        return partialState
      },
      onRehydrateStorage: () => (state) => {
        debug('Rehydrating state:', state)
        if (state) {
          if (Array.isArray(state.processedContent)) {
            state.processedContent = new Set(state.processedContent)
          }
          
          // Restore agent states while keeping all other properties
          if (state.agentStates) {
            debug('Restoring agent states:', state.agentStates)
            state.agents = DEFAULT_AGENTS.map(agent => {
              const savedState = state.agentStates.find(s => s.id === agent.id)
              const restoredAgent = savedState ? { ...agent, isActive: savedState.isActive } : agent
              debug('Restored agent:', { id: agent.id, isActive: restoredAgent.isActive })
              return restoredAgent
            })
          } else {
            debug('No agent states found, using defaults')
            state.agents = DEFAULT_AGENTS
          }
        }
        debug('Final rehydrated state:', state)
      },
    }
  )
)