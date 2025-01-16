import React from 'react'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'
import { ExternalLink } from 'lucide-react'
import type { Task } from '@/legacy/task-utils'

interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
  onOpenFile?: (filePath: string) => Promise<void>
  onUpdate?: (task: Task) => void
}

export function TaskItem({ task, onToggle, onOpenFile, onUpdate }: TaskItemProps) {
  const handleFileOpen = async () => {
    if (task.filePath && onOpenFile) {
      await onOpenFile(task.filePath)
    }
  }

  return (
    <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-accent/50 group">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div 
          className="text-sm cursor-pointer hover:underline"
          onClick={handleFileOpen}
        >
          {task.title}
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {task.obsidianUrl && (
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => window.api.openExternal(task.obsidianUrl!)}
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  )
}         