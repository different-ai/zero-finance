export interface Task {
  id: string
  title: string
  completed: boolean
  filePath: string
  tags: string[]
  context: string
  stats: {
    created: string
    modified: string
  }
  obsidianUrl?: string
}

export async function getAllTasks(vaultPath: string): Promise<Task[]> {
  try {
    return await window.api.getAllTasks(vaultPath)
  } catch (error) {
    console.error('Error getting tasks:', error)
    throw error
  }
}

export function isTaskWithinDateRange(task: Task, days: number): boolean {
  const taskDate = new Date(task.stats.modified)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return taskDate >= cutoffDate
}