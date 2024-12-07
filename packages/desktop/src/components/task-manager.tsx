import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

export function TaskManager({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false, automated: false, date: new Date().toISOString().split('T')[0] }])
      setNewTask('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const toggleAutomation = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, automated: !task.automated } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
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
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={task.automated ? 'default' : 'secondary'}>
                  {task.automated ? 'Automated' : 'Manual'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => toggleAutomation(task.id)}>
                  {task.automated ? 'Make Manual' : 'Automate'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

