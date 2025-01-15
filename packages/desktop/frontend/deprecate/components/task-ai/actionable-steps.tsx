import { useTaskAIStore } from '@/stores/task-ai-store'
import { Loader2 } from 'lucide-react'
import { ActionableStep } from './actionable-step'
import { useDebounce } from 'use-debounce'

export function ActionableSteps() {
  const { actionableSteps, isLoading } = useTaskAIStore()
  // throttle the re-rendering of the steps
  const [debouncedActionableSteps] = useDebounce(actionableSteps, 50)

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
      {debouncedActionableSteps.map((step) => (
        <ActionableStep key={step.id} step={step} />
      ))}
    </div>
  )
}      