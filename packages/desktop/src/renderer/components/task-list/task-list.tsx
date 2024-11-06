import { useEffect, useMemo } from 'react'
import { ScrollArea } from '@/renderer/components/ui/scroll-area'
import { useTaskStore } from '@/renderer/stores/task-store'
import { useFilterStore } from '@/renderer/stores/task-filter-store'
import { TaskItem } from './task-item'
import { useDebounce } from 'use-debounce'

export function TaskList() {
  const { tasks, updateTask } = useTaskStore()
  const { status, search } = useFilterStore()
  const [debouncedSearch] = useDebounce(search, 300)

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (status !== 'all') {
          const isCompleted = status === 'completed'
          if (task.completed !== isCompleted) return false
        }

        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase()
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          )
        }

        return true
      })
      .slice(0, 100)
  }, [tasks, status, debouncedSearch])

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const content = await window.api.readMarkdownFile(task.filePath)
      const updatedContent = content.content.replace(
        /- \[([ xX])\] (.*)/g,
        (match: string, check: string, text: string) => {
          if (text.includes(task.title)) {
            return `- [${check === ' ' ? 'x' : ' '}] ${text}`
          }
          return match
        }
      )

      await window.api.writeMarkdownFile(task.filePath, updatedContent)
      updateTask(taskId, { completed: !task.completed })
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  if (!tasks.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No tasks found
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-22rem)]">
      <div className="px-4 space-y-2">
        {filteredTasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            onToggle={handleTaskToggle}
          />
        ))}
      </div>
    </ScrollArea>
  )
} 