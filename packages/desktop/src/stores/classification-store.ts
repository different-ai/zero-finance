import * as React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { debug } from '@/lib/debug'
import { CheckSquare, Calendar } from 'lucide-react'

// Default agents
const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'task-agent',
    name: 'Task Agent',
    description: 'Automatically recognize tasks and seamlessly add them to your Obsidian vault.',
    isActive: true,
    icon: CheckSquare,
    features: [
      "Detects actionable tasks from screen content",
      "Adds tasks to your daily notes",
      "Includes context and metadata",
      "Priority and due date detection",
      "Integrates with your Obsidian workflow"
    ],
    restore: (state: any) => {
      debug('Restoring task agent state:', state)
    }
  },
  {
    id: 'calendar-agent',
    name: 'Calendar Agent',
    description: 'Automatically recognize calendar events and create ICS files on demand.',
    isActive: true,
    icon: Calendar,
    features: [
      "Detects events and meetings from screen content",
      "Creates ICS files for calendar import",
      "Captures attendees and location",
      "Adds events to your vault for reference",
      "Syncs with your calendar app"
    ],
    restore: (state: any) => {
      debug('Restoring calendar agent state:', state)
    }
  }
]

export interface Agent {
  id: string
  name: string
  isActive: boolean
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  features?: string[]
  restore: (state: any) => void
}

export interface AgentState {
  id: string
  state: any
}

export interface RecognizedTaskItem {
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

export interface RecognizedEventItem {
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

interface ClassificationLog {
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

interface ClassificationStore {
  agents: Agent[]
  agentStates: AgentState[]
  recognizedItems: RecognizedItem[]
  autoClassifyEnabled: boolean
  logs: ClassificationLog[]
  setAgentState: (agentId: string, state: any) => void
  toggleAgent: (agentId: string) => void
  addLog: (log: Omit<ClassificationLog, 'id'>) => void
  clearRecognizedItems: () => void
  clearRecognizedEvents: () => void
  clearRecognizedTasks: () => void
  clearItemsByAgent: (agentId: string) => void
  clearItemsBeforeDate: (date: Date) => void
  removeRecognizedItem: (id: string) => void
  setRecognizedItems: (items: RecognizedItem[]) => void
  addProcessedContent: (content: string) => void
  hasProcessedContent: (content: string) => boolean
  setAutoClassify: (enabled: boolean) => void
  deduplicateItems: (items: RecognizedItem[], apiKey: string) => Promise<RecognizedItem[]>
}

export const useClassificationStore = create<ClassificationStore>()(
  persist(
    (set, get) => {
      debug('Initializing classification store with default agents:', DEFAULT_AGENTS)
      
      return {
        agents: DEFAULT_AGENTS,
        agentStates: [],
        recognizedItems: [],
        autoClassifyEnabled: true,
        logs: [],
        setAgentState: (agentId, state) => set((store) => {
          debug('Setting agent state:', { agentId, state })
          return {
            agentStates: [
              ...store.agentStates.filter(s => s.id !== agentId),
              { id: agentId, state }
            ]
          }
        }),
        toggleAgent: (agentId) => set((state) => {
          const newAgents = state.agents.map(agent => 
            agent.id === agentId 
              ? { ...agent, isActive: !agent.isActive }
              : agent
          )
          debug('Toggling agent:', { agentId, newAgents })
          return { agents: newAgents }
        }),
        addLog: (log) => set((state) => ({
          logs: [{ ...log, id: crypto.randomUUID() }, ...state.logs]
        })),
        clearRecognizedItems: () => {
          debug('Clearing all recognized items')
          set({ recognizedItems: [] })
        },
        clearRecognizedEvents: () => {
          debug('Clearing all event items')
          set((state) => ({
            recognizedItems: state.recognizedItems.filter(item => item.type !== 'event')
          }))
        },
        clearRecognizedTasks: () => {
          debug('Clearing all task items')
          set((state) => ({
            recognizedItems: state.recognizedItems.filter(item => item.type !== 'task')
          }))
        },
        clearItemsByAgent: (agentId) => {
          debug('Clearing items for agent:', agentId)
          set((state) => ({
            recognizedItems: state.recognizedItems.filter(item => item.agentId !== agentId)
          }))
        },
        clearItemsBeforeDate: (date) => {
          debug('Clearing items before date:', date)
          set((state) => ({
            recognizedItems: state.recognizedItems.filter(item => {
              const itemDate = new Date(item.timestamp)
              return itemDate >= date
            })
          }))
        },
        removeRecognizedItem: (id) => {
          debug('Removing item:', id)
          set((state) => ({
            recognizedItems: state.recognizedItems.filter(item => item.id !== id)
          }))
        },
        setRecognizedItems: (items) => {
          debug('Setting recognized items:', items.length)
          set({ recognizedItems: items })
        },
        addProcessedContent: () => {}, // Implement if needed
        hasProcessedContent: () => false, // Implement if needed
        setAutoClassify: (enabled) => set({ autoClassifyEnabled: enabled }),
        deduplicateItems: async (items) => items, // Implement if needed
      }
    },
    {
      name: 'classification-store',
      version: 1,
      merge: (persistedState: any, currentState: ClassificationStore) => {
        debug('Merging persisted state:', persistedState)
        debug('Current state:', currentState)
        
        // Ensure agents exist and have all required properties
        const agents = persistedState?.agents?.length > 0
          ? persistedState.agents.map((agent: Agent) => ({
              ...DEFAULT_AGENTS.find(a => a.id === agent.id) || agent,
              isActive: agent.isActive
            }))
          : DEFAULT_AGENTS

        return {
          ...currentState,
          ...persistedState,
          agents,
        }
      },
      onRehydrateStorage: () => (state) => {
        debug('Rehydrating classification store:', state)
        if (!state) {
          debug('No state found, using defaults')
          return { agents: DEFAULT_AGENTS }
        }
        
        // Ensure we have agents
        if (!state.agents?.length) {
          debug('No agents found, using defaults')
          state.agents = DEFAULT_AGENTS
        }
        
        // Restore agent states
        if (state.agentStates?.length) {
          debug('Restoring agent states:', state.agentStates)
          state.agents.forEach(agent => {
            const savedState = state.agentStates.find(s => s.id === agent.id)
            if (savedState) {
              agent.restore(savedState.state)
            }
          })
        }
        
        return state
      }
    }
  )
)