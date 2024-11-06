import { cn } from '@/lib/utils'
import { Task } from '@/renderer/task-utils'
import { ObsidianIcon } from '@/renderer/components/obsidian-icon'
import { useEditorStore } from '@/renderer/stores/editor-store'

interface TaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const { openFile } = useEditorStore()

  const handleClick = async (event: React.MouseEvent) => {
    event.stopPropagation()
    if (task.filePath) {
      await openFile(task.filePath)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-2 border-b last:border-b-0',
        'cursor-pointer hover:bg-secondary/20 px-2 py-1 rounded'
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 flex-1">
        <div
          className={cn(
            'h-4 w-4 rounded border cursor-pointer',
            task.completed && 'bg-primary border-primary'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(task.id)
          }}
        />
        <span
          className={cn(
            task.completed && 'line-through text-muted-foreground'
          )}
        >
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-secondary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        {task.obsidianUrl && (
          <ObsidianIcon
            className="h-4 w-4 text-muted-foreground hover:text-purple-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              window.api.openExternal(task.obsidianUrl!)
            }}
          />
        )}
      </div>
    </div>
  )
} 