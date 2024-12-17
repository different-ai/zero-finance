// Common task properties that all task types must have
interface TaskBase {
  id: string
  title: string
  completed: boolean
  date: string
  automated: boolean
  filePath?: string
  tags?: string[]
  context?: string
  stats?: {
    created: string
    modified: string
  }
  obsidianUrl?: string
}

// Task type for the UI/store
export type Task = TaskBase

// Task type for the vault/file system with required fields
export interface VaultTask extends Task {
  filePath: string
  tags: string[]
  context: string
  stats: {
    created: string
    modified: string
  }
  obsidianUrl: string
}

export interface VaultConfig {
  path: string
  isObsidian: boolean
  lastOpened: string
  showEditor: boolean
}

export interface TaskFilters {
  status: 'all' | 'open' | 'completed'
  search: string
}

export interface TaskStore {
  // State
  tasks: Task[]
  filteredTasks: Task[]
  filters: TaskFilters
  isLoading: boolean

  // Task Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'date' | 'automated'>) => void
  updateTask: (task: Task) => void
  handleTaskToggle: (taskId: string) => Promise<void>
  
  // Filter Actions
  setFilteredTasks: (tasks: Task[]) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  applyFilters: () => void
  
  // Loading Actions
  loadTasks: () => Promise<void>
}

export async function getAllTasks(vaultPath: string): Promise<Task[]> {
  try {
    const tasks = await window.api.getAllTasks(vaultPath) as VaultTask[]
    return tasks.map(task => ({
      ...task,
      date: task.stats.modified,
      automated: false
    }))
  } catch (error) {
    console.error('Error getting tasks:', error)
    return []
  }
}

export function isTaskWithinDateRange(task: Task, days: number): boolean {
  const taskDate = task.stats?.modified ? new Date(task.stats.modified) : new Date(task.date)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return taskDate >= cutoffDate
}