import { motion } from 'framer-motion'
import { ArrowDownToLine } from 'lucide-react'
import { useTaskAIStore } from '@/renderer/stores/task-ai-store'

export function FilterDivider() {
  const { isLoading } = useTaskAIStore()

  return (
    <div className="relative py-4">
      <div className="absolute left-1/2 transform -translate-x-1/2">
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
          <ArrowDownToLine className="h-6 w-6" />
        </motion.div>
      </div>
    </div>
  )
} 