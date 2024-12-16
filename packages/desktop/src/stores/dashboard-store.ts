import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Task = {
  id: number
  title: string
  completed: boolean
  date: string
  automated: boolean
}

type DashboardStore = {
  tasks: Task[]
  activePanel: string
  isDemoMode: boolean
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id'>) => void
  automationRate: () => number
  setActivePanel: (panel: string) => void
  toggleDemoMode: () => void
}

const demoTasks = [
  {
    id: 1,
    title: 'Review Unconf speaker list',
    completed: false,
    date: '2023-06-15',
    automated: false,
  },
  {
    id: 2,
    title: 'Prepare Vitalik introduction',
    completed: true,
    date: '2023-06-10',
    automated: true,
  },
  // ... other demo tasks
]

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      activePanel: 'overview',
      isDemoMode: false,
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 }] 
      })),
      automationRate: () => {
        const tasks = get().tasks
        return tasks.length ? (tasks.filter(task => task.automated).length / tasks.length) * 100 : 0
      },
      setActivePanel: (panel) => set({ activePanel: panel }),
      toggleDemoMode: () => set((state) => {
        const isDemoMode = !state.isDemoMode
        return {
          isDemoMode,
          tasks: isDemoMode ? demoTasks : []
        }
      })
    }),
    {
      name: 'dashboard-store',
    }
  )
) 