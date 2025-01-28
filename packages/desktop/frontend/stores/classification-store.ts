import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent, AgentType } from '@/agents/base-agent';
import { AddTaskToObsidianAgent } from '@/agents/task-agent';
import { InvoiceAgent } from '@/agents/invoice-agent';
import { useDashboardStore } from './dashboard-store';
import { AddToMacCalendarAgent } from '@/agents/add-to-mac-calendar-agent';
import { GoalPlanningAgent } from '@/agents/goal-planning-agent';
import { MarkdownAgent } from '@/agents/markdown-agent';
import { BusinessAgent } from '@/agents/business-agent';
import { AutoPayAgent } from '@/agents/auto-pay-agent';
import { subscribeWithSelector } from 'zustand/middleware';
import { debounce } from 'lodash';
import { RecognizedItem } from '@/types/recognized-item';
// Use agents directly without modification
export const defaultAgents = [
  AddTaskToObsidianAgent,
  InvoiceAgent,
  AddToMacCalendarAgent,
  GoalPlanningAgent,
  BusinessAgent,
  AutoPayAgent,
];

// Demo data with proper agent IDs and types
export const demoRecognizedItems: RecognizedItem[] = [
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
    id: 'demo-invoice-1',
    type: 'invoice',
    source: 'ai-classification',
    title: 'Design Services Invoice',
    agentId: InvoiceAgent.id,
    vitalInformation: 'Invoice for UI/UX design services: $2,500 due in 30 days. Project: Dashboard Redesign.',
    data: {
      amount: 2500,
      currency: 'USD',
      description: 'UI/UX Design Services - Dashboard Redesign',
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      recipient: {
        name: 'Design Studio Inc.',
        email: 'billing@designstudio.com'
      }
    },
  },
  {
    id: 'demo-calendar-1',
    type: 'calendar',
    source: 'ai-classification',
    title: 'Team Sprint Planning',
    agentId: AddToMacCalendarAgent.id,
    vitalInformation: 'Sprint Planning Meeting next Tuesday at 10 AM PST. All team leads required.',
    data: {
      title: 'Sprint Planning Meeting',
      startTime: new Date(Date.now() + 7 * 86400000).toISOString(),
      endTime: new Date(Date.now() + 7 * 86400000 + 3600000).toISOString(),
      description: 'Quarterly sprint planning session with all team leads',
      attendees: ['team@company.com']
    },
  },
  {
    id: 'demo-goal-1',
    type: 'goal',
    source: 'ai-classification',
    title: 'Launch MVP by Q4',
    agentId: GoalPlanningAgent.id,
    vitalInformation: 'Team objective: Launch MVP by Q4 2024. Key features include user authentication, dashboard, and basic analytics.',
    data: {
      title: 'Q4 MVP Launch',
      description: 'Launch minimum viable product with core features',
      deadline: '2024-12-31',
      milestones: [
        'Complete user authentication',
        'Implement dashboard',
        'Deploy basic analytics'
      ]
    },
  },
  {
    id: 'demo-business-1',
    type: 'business',
    source: 'ai-classification',
    title: 'New Client Contract',
    agentId: BusinessAgent.id,
    vitalInformation: 'New enterprise client contract with TechCorp. Annual value: $150,000. Requires legal review.',
    data: {
      clientName: 'TechCorp',
      contractValue: 150000,
      contractType: 'enterprise',
      status: 'pending_review',
      priority: 'high'
    },
  },
  {
    id: 'demo-autopay-1',
    type: 'payment',
    source: 'ai-classification',
    title: 'Monthly Server Hosting Payment',
    agentId: AutoPayAgent.id,
    vitalInformation: 'AWS monthly hosting payment due: $850. Recurring payment on the 1st of each month.',
    data: {
      amount: 850,
      currency: 'USD',
      recipient: 'Amazon Web Services',
      schedule: 'monthly',
      nextPayment: new Date(Date.now() + 15 * 86400000).toISOString(),
      category: 'hosting'
    },
  }
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
export const useClassificationStore = create(
  subscribeWithSelector<ClassificationState>((set, get) => ({
    recognizedItems: [],
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
  }))
);

// Debounced save function to avoid too frequent writes
const debouncedSave = debounce((items: RecognizedItem[]) => {
  console.log('0xHypr', 'Saving recognized items to markdown...');
  window.api.saveRecognizedItems(items).catch((err) => {
    console.error('0xHypr', 'Failed to save recognized items:', err);
  });
}, 1000); // 1 second debounce

// Subscribe to changes and save to markdown
useClassificationStore.subscribe(
  (state) => state.recognizedItems,
  (newRecognizedItems) => {
    debouncedSave(newRecognizedItems);
  }
);
