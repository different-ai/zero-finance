import type { LucideIcon } from 'lucide-react'

export interface Agent {
  id: string
  name: string
  description: string
  type: string
  icon: LucideIcon
  isBuiltIn: boolean
  isActive: boolean
  process: (content: string) => Promise<any>
} 