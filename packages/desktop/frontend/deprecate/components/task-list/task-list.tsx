import React from 'react'
import { TaskItem } from './task-item'
import { useTaskStore } from '@/renderer/stores/task-store'
import type { Task } from '@/renderer/task-utils'

interface TaskListProps {
  onToggle: (taskId: string) => void
  onOpenFile?: (filePath: string) => Promise<void>
  filteredTasks?: Task[] // Optional override for filtered tasks
}

export function TaskList({ onToggle, onOpenFile, filteredTasks: externalFilteredTasks }: TaskListProps) {
  const { tasks, filteredTasks: storeFilteredTasks, updateTask } = useTaskStore()
  
  // Use external filtered tasks if provided, otherwise use store's filtered tasks, fallback to all tasks
  const displayTasks = externalFilteredTasks || storeFilteredTasks || tasks

  return (
    <div className="space-y-2">
      {displayTasks.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No tasks found
        </div>
      ) : (
        displayTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onOpenFile={onOpenFile}
            onUpdate={updateTask}
          />
        ))
      )}
    </div>
  )
} 