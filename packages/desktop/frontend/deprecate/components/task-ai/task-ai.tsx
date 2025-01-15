import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTaskStore } from '@/stores/task-store'
import { useTaskAIStore } from '@/stores/task-ai-store'
import { useApiKeyStore } from '@/stores/api-key-store'
import { useFilterStore } from '@/stores/task-filter-store'
import { ActionableSteps } from './actionable-steps'
import { UpdateControl } from './update-control'

export function TaskAI() {
  const { filteredTasks } = useTaskStore()
  const { apiKey } = useApiKeyStore()
  const { analyzeRecentTasks, autoRefresh } = useTaskAIStore()
  const { getDateRangeLabel } = useFilterStore()

  useEffect(() => {
    if (autoRefresh && filteredTasks.length && apiKey) {
      analyzeRecentTasks(filteredTasks, apiKey)
    }
  }, [filteredTasks, apiKey, analyzeRecentTasks, autoRefresh])

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
        
        {/* Update Control */}
        <UpdateControl />

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