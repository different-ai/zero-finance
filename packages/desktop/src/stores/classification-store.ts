import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent, AgentType } from '@/agents/base-agent';
import { AddTaskToObsidianAgent } from '@/agents/task-agent';
import { InvoiceAgent } from '@/agents/invoice-agent';
import { useDashboardStore } from './dashboard-store';
import { RecognizedItem } from '@/components/event-classification';
// import add to mac calendar agent
import { AddToMacCalendarAgent } from '@/agents/add-to-mac-calendar-agent';

// Use agents directly without modification
const defaultAgents = [AddTaskToObsidianAgent, InvoiceAgent];

// Demo data with proper agent IDs and types
const demoRecognizedItems: RecognizedItem[] = [
  {
    id: 'demo-task-1',
    type: 'task',
    source: 'ai-classification',
    title: 'Review Product Roadmap',
    agentId: AddTaskToObsidianAgent.id,
    vitalInformation:
      'Team discussion about reviewing Q3 product roadmap by tomorrow EOD. @sarah please provide detailed feedback.',
    data: {
      title: 'Review Product Roadmap',
      content: 'Review Q3 product roadmap and provide feedback',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      details: 'Comprehensive review of Q3 roadmap required',
    },
  },
  {
    id: 'demo-event-1',
    type: 'event',
    source: 'ai-classification',
    agentId: AddToMacCalendarAgent.id,
    title: 'Team Standup',
    vitalInformation:
      'Daily team standup meeting tomorrow at 10 AM PST with @john @sarah via Zoom. Discussion points: Sprint progress and blockers.',
    data: {
      title: 'Team Standup',
      content: 'Daily team standup meeting',
      startTime: new Date(Date.now() + 3600000).toISOString(),
      endTime: new Date(Date.now() + 5400000).toISOString(),
      attendees: ['john@example.com', 'sarah@example.com'],
      location: 'Zoom',
      details: 'Daily sync-up with the development team',
    },
  },
  {
    id: 'demo-invoice-1',
    type: 'invoice',
    source: 'ai-classification',
    agentId: InvoiceAgent.id,
    title: 'AWS Monthly Invoice',
    vitalInformation:
      'AWS Monthly Invoice for Cloud Services\nTotal Amount: $1,299.99 USD\nDue Date: Next week\nBill to: Company Inc (billing@company.com) add also an ethereuma ddress and a currenty ',
    data: {
      title: 'AWS Monthly Invoice',
      content: 'Monthly AWS cloud services invoice',
      amount: 1299.99,
      currency: 'USD',
      dueDate: new Date(Date.now() + 604800000).toISOString(),
      recipient: {
        name: 'Company Inc',
        email: 'billing@company.com',
      },
      description: 'AWS Cloud Services - Monthly Subscription',
    },
  },
];

interface Log {
  message: string;
  timestamp: string;
  success?: boolean;
  error?: string;
  results?: Array<{
    type: AgentType;
    title?: string;
    vitalInformation?: string;
    relevantRawContent?: string;
  }>;
}

interface ClassificationState {
  recognizedItems: RecognizedItem[];
  processedContent: Set<string>;
  autoClassifyEnabled: boolean;
  agents: Agent[];
  logs: Log[];
  addRecognizedItem: (item: RecognizedItem) => void;
  setRecognizedItems: (items: RecognizedItem[]) => void;
  toggleAgent: (agentId: string) => void;
  addLog: (log: Log) => void;
  clearLogs: () => void;
  hasProcessedContent: (content: string) => boolean;
  addProcessedContent: (content: string) => void;
  clearRecognizedEvents: () => void;
  clearRecognizedTasks: () => void;
  clearItemsBeforeDate: (date: Date) => void;
  clearItemsByAgent: (agentId: string) => void;
  setAutoClassify: (enabled: boolean) => void;
}

// Create store without persistence for agents
export const useClassificationStore = create<ClassificationState>()((
  set,
  get,
) => {
  // Subscribe to demo mode changes
  useDashboardStore.subscribe((state) => {
    const isDemoMode = state.isDemoMode;
    console.log('0xHypr', 'Demo mode changed to:', isDemoMode);
    set({
      recognizedItems: isDemoMode ? demoRecognizedItems : [],
      logs: isDemoMode
        ? [
            {
              message: 'Demo mode enabled - Loading sample data',
              timestamp: new Date().toISOString(),
              success: true,
            },
            {
              message: 'Recognized 3 items from demo data',
              timestamp: new Date().toISOString(),
              success: true,
              results: demoRecognizedItems.map((item) => ({
                type: item.type,
                title: item.data.title,
                vitalInformation: item.vitalInformation,
              })),
            },
          ]
        : [],
    });
  });

  return {
    recognizedItems: useDashboardStore.getState().isDemoMode
      ? demoRecognizedItems
      : [],
    processedContent: new Set<string>(),
    autoClassifyEnabled: false,
    agents: defaultAgents,
    logs: [],

    addRecognizedItem: (item) => {
      console.log('0xHypr', 'Adding recognized item:', item);
      set((state) => ({
        recognizedItems: [...state.recognizedItems, item],
        logs: [
          ...state.logs,
          {
            message: `Recognized new ${item.type}`,
            timestamp: new Date().toISOString(),
            success: true,
            results: [
              {
                type: item.type,
                title: item.data.title,
                vitalInformation: item.vitalInformation,
              },
            ],
          },
        ],
      }));
    },

    setRecognizedItems: (items) => {
      console.log('0xHypr', 'Setting recognized items:', items);
      set({
        recognizedItems: items,
        logs: [
          ...get().logs,
          {
            message: `Set ${items.length} recognized items`,
            timestamp: new Date().toISOString(),
            success: true,
            results: items.map((item) => ({
              type: item.type,
              title: item.data.title,
              vitalInformation: item.vitalInformation,
            })),
          },
        ],
      });
    },

    toggleAgent: (agentId) => {
      console.log('0xHypr', 'Toggling agent:', agentId);
      set((state) => {
        const agent = state.agents.find((a) => a.id === agentId);
        if (!agent) return state;

        const newState = !agent.isActive;
        return {
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, isActive: newState } : a,
          ),
          logs: [
            ...state.logs,
            {
              message: `${agent.name} ${newState ? 'enabled' : 'disabled'}`,
              timestamp: new Date().toISOString(),
              success: true,
            },
          ],
        };
      });
    },

    addLog: (log) => {
      set((state) => ({
        logs: [
          ...state.logs,
          {
            ...log,
            timestamp: log.timestamp || new Date().toISOString(),
          },
        ],
      }));
    },

    clearLogs: () => set({ logs: [] }),

    hasProcessedContent: (content) => {
      return get().processedContent.has(content);
    },

    addProcessedContent: (content) => {
      set((state) => ({
        processedContent: new Set([...state.processedContent, content]),
      }));
    },

    clearRecognizedEvents: () => {
      set((state) => ({
        recognizedItems: state.recognizedItems.filter(
          (item) => item.type !== 'event',
        ),
        logs: [
          ...state.logs,
          {
            message: 'Cleared all recognized events',
            timestamp: new Date().toISOString(),
            success: true,
          },
        ],
      }));
    },

    clearRecognizedTasks: () => {
      set((state) => ({
        recognizedItems: state.recognizedItems.filter(
          (item) => item.type !== 'task',
        ),
        logs: [
          ...state.logs,
          {
            message: 'Cleared all recognized tasks',
            timestamp: new Date().toISOString(),
            success: true,
          },
        ],
      }));
    },

    clearItemsBeforeDate: (date) => {
      set((state) => ({
        recognizedItems: state.recognizedItems.filter(
          (item) => item.data.timestamp > date.getTime(),
        ),
        logs: [
          ...state.logs,
          {
            message: `Cleared items before ${date.toLocaleDateString()}`,
            timestamp: new Date().toISOString(),
            success: true,
          },
        ],
      }));
    },

    clearItemsByAgent: (agentId) => {
      set((state) => ({
        recognizedItems: state.recognizedItems.filter(
          (item) => item.agentId !== agentId,
        ),
        logs: [
          ...state.logs,
          {
            message: `Cleared items from agent ${agentId}`,
            timestamp: new Date().toISOString(),
            success: true,
          },
        ],
      }));
    },

    setAutoClassify: (enabled) => {
      set((state) => ({
        autoClassifyEnabled: enabled,
        logs: [
          ...state.logs,
          {
            message: `Auto-classification ${enabled ? 'enabled' : 'disabled'}`,
            timestamp: new Date().toISOString(),
            success: true,
          },
        ],
      }));
    },
  };
});
