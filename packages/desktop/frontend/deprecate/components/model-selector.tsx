import { ChevronDown } from 'lucide-react'
import { Button } from '@/renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/renderer/components/ui/dropdown-menu'
import { useModelStore, ModelType } from '@/stores/model-store'

const MODEL_OPTIONS: { value: ModelType; label: string }[] = [
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'o1-preview', label: 'o1' },
]

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useModelStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 gap-1 bg-white border-gray-200"
        >
          {MODEL_OPTIONS.find(m => m.value === selectedModel)?.label}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {MODEL_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setSelectedModel(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 