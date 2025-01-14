import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/renderer/stores/editor-store'
import { Button } from '@/renderer/components/ui/button'
import { FileText, ChevronDown } from 'lucide-react'
import { ObsidianIcon } from '@/renderer/components/obsidian-icon'
import type { ActionableStep as ActionableStepType } from '@/renderer/stores/task-ai-store'

interface ActionableStepProps {
  step: ActionableStepType
}

export function ActionableStep({ step }: ActionableStepProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { openFile } = useEditorStore()

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="border rounded-md overflow-hidden transition-all duration-200 ease-in-out">
      <div
        className={cn(
          'flex items-center gap-2 p-2 cursor-pointer hover:bg-secondary/50',
          isExpanded && 'border-b'
        )}
      >
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            <div className="font-medium">{step.text}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Modified: {formattedDate(step.fileModified)}</span>
              {step.tags.length > 0 && (
                <div className="flex gap-1">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary px-1.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                openFile(step.filePath)
              }}
              className="h-8 w-8"
            >
              <FileText className="h-4 w-4" />
            </Button>
            {step.obsidianUrl && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  window.api.openExternal(step.obsidianUrl!)
                }}
                className="h-8 w-8"
              >
                <ObsidianIcon className="h-4 w-4 text-muted-foreground hover:text-purple-500" />
              </Button>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isExpanded && 'transform rotate-180'
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="p-4 space-y-3 text-sm bg-secondary/10">
          <div>
            <div className="mt-1 pl-4 border-l-2 border-secondary">
              {step.taskContext}
            </div>
          </div>

          <div>
            <span className="font-medium">Why it's important: </span>
            {step.llmAnalysis.importance}
          </div>

          <div>
            <span className="font-medium">Estimated time: </span>
            {step.llmAnalysis.estimatedTime}
          </div>

          {step.llmAnalysis.suggestedNextSteps?.length > 0 && (
            <div>
              <span className="font-medium">Suggested next steps:</span>
              <ul className="list-disc pl-4 mt-1">
                {step.llmAnalysis.suggestedNextSteps.map((nextStep, i) => (
                  <li key={i}>{nextStep}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            <div>Created: {formattedDate(step.fileCreated)}</div>
            <div>Modified: {formattedDate(step.fileModified)}</div>
            <div className="truncate">Path: {step.filePath}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 