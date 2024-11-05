import { create } from 'zustand'
import type { Task } from '@/renderer/task-utils'
import { getAllTasks } from '@/renderer/task-utils'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  loadTasks: (vaultPath: string) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  loadTasks: async (vaultPath: string) => {
    console.log('TaskStore: Loading tasks from:', vaultPath);
    set({ isLoading: true, error: null });
    try {
      const tasks = await getAllTasks(vaultPath);
      console.log('TaskStore: Loaded tasks:', tasks.length);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('TaskStore: Failed to load tasks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load tasks',
        isLoading: false,
        tasks: [], // Reset tasks on error
      });
    }
  },
  updateTask: (taskId: string, updates: Partial<Task>) => {
    console.log('TaskStore: Updating task:', taskId, updates);
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  }
})); 