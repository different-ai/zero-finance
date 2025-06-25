'use server'

import { createAI, getMutableAIState } from 'ai/rsc'
import type { ReactNode } from 'react'

export interface ServerMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant'
  display: ReactNode
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    /* server-side actions */
  },
  initialAIState: [],
  initialUIState: []
}) 