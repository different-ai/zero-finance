import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/renderer/components/ui/card'
import { useTaskStore } from '@/renderer/stores/task-store'
import { useTaskAIStore } from '@/renderer/stores/task-ai-store'
import { useApiKeyStore } from '@/stores/api-key-store'
import { ActionableSteps } from './actionable-steps'

export function TaskAI() {
  const { tasks } = useTaskStore()
  const { apiKey } = useApiKeyStore()
  const { analyzeRecentTasks, isLoading } = useTaskAIStore()

  useEffect(() => {
    if (tasks.length && apiKey) {
      analyzeRecentTasks(tasks, apiKey)
    }
  }, [tasks, apiKey, analyzeRecentTasks])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>AI-powered task analysis and suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <ActionableSteps />
      </CardContent>
    </Card>
  )
} 