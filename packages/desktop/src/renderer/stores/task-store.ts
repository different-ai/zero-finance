import { create } from 'zustand'
import { ObsidianService } from '@/services/obsidian-service'

export type VaultTask = {
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
  obsidianUrl: string
  automated: boolean
}

type TaskStore = {
  tasks: VaultTask[]
  vaultPath: string | null
  obsidianService: ObsidianService | null
  isLoading: boolean
  error: string | null
  fetchTasks: (vaultPath: string) => Promise<void>
  addTask: (task: { title: string; automated: boolean }) => Promise<void>
  toggleTaskCompletion: (taskId: string) => Promise<void>
  setVaultPath: (path: string) => void
  automationRate: () => number
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  vaultPath: null,
  obsidianService: null,
  isLoading: false,
  error: null,

  setVaultPath: (path) => {
    set({ 
      vaultPath: path,
      obsidianService: new ObsidianService(path)
    })
  },

  fetchTasks: async (vaultPath) => {
    set({ isLoading: true, error: null })
    try {
      const files = await window.api.listMarkdownFiles(vaultPath)
      const tasks: VaultTask[] = []

      for (const file of files) {
        try {
          const content = await window.api.readMarkdownFile(file.path)
          const taskRegex = /- \[([ xX])\] (.*)/g
          let match

          while ((match = taskRegex.exec(content.content)) !== null) {
            const completed = match[1].toLowerCase() === 'x'
            const title = match[2]
            
            const vaultName = vaultPath.split('/').pop() || ''
            
            tasks.push({
              id: crypto.randomUUID(),
              title,
              completed,
              filePath: file.path,
              tags: [], 
              context: '', 
              stats: {
                created: content.stats.birthtime,
                modified: content.stats.mtime
              },
              obsidianUrl: `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(file.path)}`,
              automated: false
            })
          }
        } catch (error) {
          console.error(`Error processing file ${file.path}:`, error)
        }
      }

      set({ tasks, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false 
      })
    }
  },

  addTask: async (task) => {
    const { obsidianService, vaultPath } = get()
    if (!obsidianService || !vaultPath) {
      throw new Error('Vault not initialized')
    }

    try {
      await obsidianService.addTaskToDailyNote(task.title)
      // Refresh tasks after adding
      await get().fetchTasks(vaultPath)
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  },

  toggleTaskCompletion: async (taskId) => {
    const { tasks, vaultPath } = get()
    if (!vaultPath) return

    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const content = await window.api.readMarkdownFile(task.filePath)
      const newContent = content.content.replace(
        `- [ ] ${task.title}`,
        `- [x] ${task.title}`
      )
      await window.api.writeMarkdownFile(task.filePath, newContent)
      await get().fetchTasks(vaultPath)
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  },

  automationRate: () => {
    const tasks = get().tasks
    return tasks.length ? (tasks.filter(task => task.automated).length / tasks.length) * 100 : 0
  },
})) 