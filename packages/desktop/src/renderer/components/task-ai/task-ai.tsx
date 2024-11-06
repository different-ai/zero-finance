import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/renderer/components/ui/card'
import { useTaskStore } from '@/renderer/stores/task-store'
import { useTaskAIStore } from '@/renderer/stores/task-ai-store'
import { useApiKeyStore } from '@/stores/api-key-store'
import { useFilterStore } from '@/renderer/stores/task-filter-store'
import { ActionableSteps } from './actionable-steps'
import { ArrowRight } from 'lucide-react'

export function TaskAI() {
  const { tasks, filteredTasks } = useTaskStore()
  const { apiKey } = useApiKeyStore()
  const { analyzeRecentTasks, isLoading } = useTaskAIStore()
  const { getDateRangeLabel } = useFilterStore()

  useEffect(() => {
    if (filteredTasks.length && apiKey) {
      analyzeRecentTasks(filteredTasks, apiKey)
    }
  }, [filteredTasks, apiKey, analyzeRecentTasks])

  return (
    <div className="relative">
      <Card className="h-full relative">
        {/* Context Badge */}
        <div className="mb-2">
          <div className="bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-t-md text-xs flex items-center gap-2">
            <span className="font-medium">Context:</span>
            <span>Tasks from</span>
            <span>{getDateRangeLabel()}</span>
            <span className="text-muted-foreground">
              ({filteredTasks.length} tasks)
            </span>
          </div>
        </div>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>AI-powered task analysis and suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <ActionableSteps />
        </CardContent>
      </Card>
    </div>
  )
} 