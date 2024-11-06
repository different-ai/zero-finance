import { useTaskAIStore } from '@/renderer/stores/task-ai-store'
import { Loader2 } from 'lucide-react'
import { ActionableStep } from './actionable-step'

export function ActionableSteps() {
  const { actionableSteps, isLoading } = useTaskAIStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Analyzing tasks...</span>
      </div>
    )
  }

  if (!actionableSteps.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No actionable steps found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {actionableSteps.map((step) => (
        <ActionableStep key={step.id} step={step} />
      ))}
    </div>
  )
} 