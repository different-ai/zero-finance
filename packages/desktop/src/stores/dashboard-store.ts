import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/renderer/task-utils'

interface DashboardStore {
  tasks: Task[]
  activePanel: string
  isDemoMode: boolean
  isLoading?: boolean
  filteredTasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (task: Task) => void
  loadTasks: () => Promise<void>
  setFilteredTasks: (tasks: Task[]) => void
  automationRate: () => number
  setActivePanel: (panel: string) => void
  toggleDemoMode: () => void
}

const demoTasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: 'Review Unconf speaker list',
    completed: false,
    date: '2023-06-15',
    automated: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Prepare Vitalik introduction',
    completed: true,
    date: '2023-06-10',
    automated: true,
  },
]

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filteredTasks: [],
      activePanel: 'overview',
      isDemoMode: false,
      isLoading: false,
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }] 
      })),
      updateTask: (task) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t))
      })),
      loadTasks: async () => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        set({ isLoading: false })
      },
      setFilteredTasks: (filteredTasks) => set({ filteredTasks }),
      automationRate: () => {
        const tasks = get().tasks
        return tasks.length ? (tasks.filter(task => task.automated).length / tasks.length) * 100 : 0
      },
      setActivePanel: (panel) => set({ activePanel: panel }),
      toggleDemoMode: () => set((state) => ({
        isDemoMode: !state.isDemoMode,
        tasks: !state.isDemoMode ? demoTasks : []
      }))
    }),
    {
      name: 'dashboard-store',
    }
  )
) 