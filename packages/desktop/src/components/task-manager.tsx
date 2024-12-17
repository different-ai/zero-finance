import React, { useState, useEffect } from 'react'
import { TaskList } from '@/renderer/components/task-list/task-list'
import { useTaskStore } from '@/renderer/stores/task-store'
import type { Task, VaultTask } from '@/renderer/task-utils'
import { getAllTasks } from '@/renderer/task-utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Type guard to check if a Task is a VaultTask
function isVaultTask(task: Task): task is VaultTask {
  return Boolean(
    task.filePath &&
    Array.isArray(task.tags) &&
    typeof task.context === 'string' &&
    task.stats &&
    typeof task.stats.created === 'string' &&
    typeof task.stats.modified === 'string' &&
    task.obsidianUrl
  )
}

export function TaskManager() {
  const [vaultTasks, setVaultTasks] = useState<VaultTask[]>([])
  const [newTask, setNewTask] = useState('')
  
  const { 
    tasks, 
    setTasks, 
    isLoading, 
    addTask: addTaskToStore,
    filters,
    setFilters,
    filteredTasks
  } = useTaskStore()

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const vaultPath = await window.api.getVaultConfig()
          .then(config => config?.path)
        
        if (!vaultPath) {
          console.error('No vault path configured')
          return
        }

        const allTasks = await getAllTasks(vaultPath)
        const vaultTasksOnly = allTasks.filter(isVaultTask)
        
        setVaultTasks(vaultTasksOnly)
        setTasks(allTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
    }

    loadTasks()
  }, [setTasks])

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTask = { ...task, completed: !task.completed }
    
    try {
      if (isVaultTask(task)) {
        const vaultTask: VaultTask = {
          ...task,
          completed: !task.completed
        }
        await window.api.updateTaskInFile(task.filePath, vaultTask)
        
        // Update vault tasks
        setVaultTasks(vaultTasks.map(t => 
          t.id === taskId ? vaultTask : t
        ))
      }
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const vaultPath = await window.api.getVaultConfig()
        .then(config => config?.path)
      
      if (!vaultPath) {
        throw new Error('No vault configured')
      }

      // Add task to daily note
      const today = new Date().toISOString().split('T')[0]
      const filePath = `${vaultPath}/Daily Notes/${today}.md`
      
      let content = ''
      try {
        const result = await window.api.readMarkdownFile(filePath)
        content = result.content
      } catch {
        content = `# ${today}\n\n## Tasks\n`
      }

      const taskEntry = `- [ ] ${newTask}\n`
      if (content.includes('## Tasks')) {
        content = content.replace('## Tasks\n', `## Tasks\n${taskEntry}`)
      } else {
        content += `\n## Tasks\n${taskEntry}`
      }

      await window.api.writeMarkdownFile(filePath, content)
      
      // Add to store
      addTaskToStore({
        title: newTask,
        completed: false,
      })
      
      setNewTask('')
      
      // Refresh tasks to get the vault task version
      const allTasks = await getAllTasks(vaultPath)
      const vaultTasksOnly = allTasks.filter(isVaultTask)
      setVaultTasks(vaultTasksOnly)
      setTasks(allTasks)
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading tasks...</div>
  }

  return (
    <div className="space-y-4 p-4">
      <form onSubmit={handleAddTask} className="flex space-x-2">
        <Input
          className="flex-grow"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button type="submit">Add Task</Button>
      </form>

      <div className="flex items-center space-x-2">
        <Select
          value={filters.status}
          onValueChange={(value: 'all' | 'open' | 'completed') => 
            setFilters({ status: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="open">Open Tasks</SelectItem>
            <SelectItem value="completed">Completed Tasks</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => 
            setFilters({ search: e.target.value })
          }
          className="w-[200px]"
        />
      </div>

      <TaskList 
        onToggle={handleTaskToggle} 
        onOpenFile={async (filePath) => {
          if (window.api.openFile) {
            await window.api.openFile(filePath)
          }
        }}
        filteredTasks={filteredTasks}
      />
    </div>
  )
}