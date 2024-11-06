import { useTaskAIStore } from '@/renderer/stores/task-ai-store'
import { ArrowDownToLine, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { motion, AnimatePresence } from 'framer-motion'

export function TaskRefreshControl() {
  const { 
    isLoading, 
    autoRefresh, 
    setAutoRefresh,
    analyzeRecentTasks 
  } = useTaskAIStore()

  const handleManualRefresh = () => {
    if (!isLoading) {
      analyzeRecentTasks()
    }
  }

  return (
    <div className="flex items-center justify-between py-4 px-2">
      {/* Center Arrow */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowDownToLine 
                className="h-6 w-6 text-primary animate-bounce" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left side - empty for balance */}
      <div className="w-[120px]" />

      {/* Right side - Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
          />
          <label 
            htmlFor="auto-refresh" 
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            Auto-refresh
          </label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleManualRefresh}
          disabled={isLoading}
          className={`transition-all duration-300 ${isLoading ? 'text-primary' : ''}`}
        >
          <RefreshCw 
            className={`h-4 w-4 mr-2 transition-all duration-300 ${
              isLoading ? 'animate-spin text-primary' : ''
            }`}
          />
          Refresh
        </Button>
      </div>
    </div>
  )
} 