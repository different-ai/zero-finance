import { create } from 'zustand'
import { getAllTasks } from '@/renderer/task-utils'
import type { Task } from '@/renderer/task-utils'

interface TaskState {
  tasks: Task[]
  filteredTasks: Task[]
  isLoading: boolean
  error: Error | null
  loadTasks: (vaultPath: string) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => void
  setFilteredTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  isLoading: false,
  error: null,

  loadTasks: async (vaultPath: string) => {
    set({ isLoading: true })
    try {
      const tasks = await getAllTasks(vaultPath)
      set({ tasks, filteredTasks: tasks, isLoading: false })
    } catch (error) {
      set({ error: error as Error, isLoading: false })
    }
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
      return {
        tasks: updatedTasks,
        filteredTasks: state.filteredTasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }
    })
  },

  setFilteredTasks: (tasks: Task[]) => set({ filteredTasks: tasks }),
})) 