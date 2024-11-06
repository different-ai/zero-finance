import { useTaskStore } from '@/renderer/stores/task-store'
import { useTaskAIStore } from '@/renderer/stores/task-ai-store'
import { useApiKeyStore } from '@/stores/api-key-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowDownToLine } from 'lucide-react'
import { motion } from 'framer-motion'

export function UpdateControl() {
  const { filteredTasks } = useTaskStore()
  const { apiKey } = useApiKeyStore()
  const { analyzeRecentTasks, isLoading, autoRefresh, setAutoRefresh } = useTaskAIStore()

  const handleUpdate = () => {
    if (filteredTasks.length && apiKey && !isLoading) {
      analyzeRecentTasks(filteredTasks, apiKey)
    }
  }

  return (
    <div className="flex items-center gap-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-t-md">
      <div className="flex items-center gap-2">
        <Checkbox 
          id="auto-update"
          checked={autoRefresh}
          onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
        />
        <label 
          htmlFor="auto-update" 
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Auto-update
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: isLoading ? [1, 1.2, 1] : 1,
            color: isLoading ? '#0ea5e9' : '#64748b',
          }}
          transition={{
            duration: 0.5,
            repeat: isLoading ? Infinity : 0,
          }}
        >
          <ArrowDownToLine className="h-4 w-4" />
        </motion.div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUpdate}
          disabled={isLoading}
          className={isLoading ? 'text-primary' : ''}
        >
          Update
        </Button>
      </div>
    </div>
  )
} 