import { useEffect, useMemo } from 'react'
import { ScrollArea } from '@/renderer/components/ui/scroll-area'
import { useTaskStore } from '@/renderer/stores/task-store'
import { useFilterStore } from '@/renderer/stores/task-filter-store'
import { TaskItem } from './task-item'
import { useDebounce } from 'use-debounce'
import { isWithinInterval } from 'date-fns'

export function TaskList() {
  const { tasks, updateTask, setFilteredTasks } = useTaskStore()
  const { 
    status, 
    search, 
    sortOrder = 'most-recent',
    dateRange,
    customDateFrom,
    customDateTo,
    getDateRange 
  } = useFilterStore()
  const [debouncedSearch] = useDebounce(search, 300)

  const dateRangeValue = useMemo(() => getDateRange(), [
    dateRange,
    customDateFrom,
    customDateTo,
    getDateRange
  ])

  const filteredAndSortedTasks = useMemo(() => {
    const { from, to } = dateRangeValue

    return tasks
      .filter((task) => {
        // Date range filter
        const taskDate = new Date(task.stats.created)
        if (!isWithinInterval(taskDate, { start: from, end: to })) {
          return false
        }

        // Status filter
        if (status !== 'all') {
          const isCompleted = status === 'completed'
          if (task.completed !== isCompleted) return false
        }

        // Search filter
        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase()
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          )
        }

        return true
      })
      .sort((a, b) => {
        const aTime = new Date(a.stats.created).getTime()
        const bTime = new Date(b.stats.created).getTime()
        return sortOrder === 'most-recent' 
          ? bTime - aTime  // Most recent first
          : aTime - bTime  // Least recent first
      })
      .slice(0, 100)
  }, [
    tasks,
    status,
    debouncedSearch,
    sortOrder,
    dateRangeValue // Use the memoized date range value
  ])

  // Update filtered tasks in store whenever they change
  useEffect(() => {
    setFilteredTasks(filteredAndSortedTasks)
  }, [filteredAndSortedTasks, setFilteredTasks])

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
        {filteredAndSortedTasks.map((task) => (
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