import { create } from 'zustand'
import { getAllTasks } from '@/renderer/task-utils'
import type { Task } from '@/renderer/task-utils'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: Error | null
  loadTasks: (vaultPath: string) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  loadTasks: async (vaultPath: string) => {
    set({ isLoading: true })
    try {
      const tasks = await getAllTasks(vaultPath)
      set({ tasks, isLoading: false })
    } catch (error) {
      set({ error: error as Error, isLoading: false })
    }
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }))
  },
})) 