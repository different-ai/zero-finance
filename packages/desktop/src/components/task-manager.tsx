import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, X, Plus, Loader2, AlertCircle } from 'lucide-react'
import { useClassificationStore } from '@/stores/classification-store'
import type { Task } from '@/stores/dashboard-store'
import type { RecognizedTaskItem } from '@/stores/classification-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllTasks } from '@/renderer/task-utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { VaultTask } from '@/renderer/task-utils'

interface TaskManagerProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
}

interface TaskFilters {
  status: 'all' | 'open' | 'completed'
  search: string
}

export function TaskManager({ tasks, setTasks }: TaskManagerProps) {
  const [newTask, setNewTask] = useState('')
  const [vaultTasks, setVaultTasks] = useState<VaultTask[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    search: '',
  })
  
  const { clearRecognizedItems, recognizedItems, setRecognizedItems } = useClassificationStore()

  // Load tasks from vault
  useEffect(() => {
    const loadVaultTasks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const config = await window.api.getVaultConfig()
        if (!config?.path) {
          throw new Error('No vault configured')
        }

        const allTasks = await getAllTasks(config.path)
        setVaultTasks(allTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }

    loadVaultTasks()
  }, [])

  const handleTaskToggle = async (taskId: string) => {
    try {
      const task = vaultTasks.find((t) => t.id === taskId)
      if (!task) return

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
      setVaultTasks(
        vaultTasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      )
    } catch (err) {
      setError('Failed to update task. Please try again.')
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const config = await window.api.getVaultConfig()
      if (!config?.path) {
        throw new Error('No vault configured')
      }

      // Add task to daily note
      const today = new Date().toISOString().split('T')[0]
      const filePath = `${config.path}/Daily Notes/${today}.md`
      
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
      
      // Refresh tasks
      const allTasks = await getAllTasks(config.path)
      setVaultTasks(allTasks)
      
      setNewTask('')
    } catch (err) {
      setError('Failed to add task')
    }
  }

  const discardRecognizedItem = (id: string) => {
    setRecognizedItems(recognizedItems.filter(item => item.id !== id))
  }

  const handleAddTask = async (item: RecognizedTaskItem) => {
    try {
      const config = await window.api.getVaultConfig()
      if (!config?.path) {
        throw new Error('No vault configured')
      }

      // Add recognized task to daily note
      const today = new Date().toISOString().split('T')[0]
      const filePath = `${config.path}/Daily Notes/${today}.md`
      
      let content = ''
      try {
        const result = await window.api.readMarkdownFile(filePath)
        content = result.content
      } catch {
        content = `# ${today}\n\n## Tasks\n`
      }

      const taskEntry = `- [ ] ${item.data.title}\n  - Source: ${item.source}\n  - Created: ${item.timestamp}\n  - Confidence: ${(item.confidence * 100).toFixed(0)}%\n`
      
      if (content.includes('## Tasks')) {
        content = content.replace('## Tasks\n', `## Tasks\n${taskEntry}`)
      } else {
        content += `\n## Tasks\n${taskEntry}`
      }

      await window.api.writeMarkdownFile(filePath, content)
      
      // Refresh tasks
      const allTasks = await getAllTasks(config.path)
      setVaultTasks(allTasks)
      
      // Remove from recognized items
      discardRecognizedItem(item.id)
    } catch (err) {
      setError('Failed to add recognized task')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-lg">
        <AlertCircle className="h-5 w-4 inline mr-2" />
        {error}
      </div>
    )
  }

  const filteredTasks = vaultTasks.filter((task) => {
    const matchesStatus =
      filters.status === 'all'
        ? true
        : filters.status === 'completed'
        ? task.completed
        : !task.completed

    const matchesSearch = task.title
      .toLowerCase()
      .includes(filters.search.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const handleStatusChange = (value: 'all' | 'open' | 'completed') => {
    setFilters(f => ({ ...f, status: value }))
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addTask} className="flex space-x-2">
        <Input
          className="flex-grow"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button type="submit">Add Task</Button>
      </form>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select
            value={filters.status}
            onValueChange={handleStatusChange}
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
              setFilters(f => ({ ...f, search: e.target.value }))
            }
            className="w-[200px]"
          />
        </div>
        {recognizedItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {recognizedItems.length} recognized items pending
            </span>
            <Button variant="outline" onClick={clearRecognizedItems}>
              Dismiss All
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                  />
                  <div>
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                    {task.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Recognized Items Section */}
          {recognizedItems
            .filter(item => item.type === 'task')
            .map((item) => (
              <Card key={item.id} className="border-dashed">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.data.title}</p>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => discardRecognizedItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTask(item)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    </div>
                    {item.data.details && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.data.details}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}