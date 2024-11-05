import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

export interface ChatSession {
  id: string
  timestamp: number
  title: string
  messages: any[]
  filePath?: string
}

interface ChatHistoryState {
  sessions: ChatSession[]
  currentSessionId: string | null
  createSession: () => string
  addMessageToSession: (sessionId: string, message: any) => void
  updateSessionTitle: (sessionId: string, title: string) => void
  setCurrentSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
}

export const useChatHistoryStore = create<ChatHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      createSession: () => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          title: `New Chat ${format(new Date(), 'MMM d, h:mm a')}`,
          messages: [],
        }
        set(state => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id
        }))
        return newSession.id
      },
      addMessageToSession: (sessionId, message) => {
        set(state => ({
          sessions: state.sessions.map(session => {
            if (session.id !== sessionId) return session
            
            const updatedMessages = [...session.messages, message]
            
            // Generate title from first user message if not already set
            let title = session.title
            if (title.startsWith('New Chat') && message.role === 'user') {
              title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
            }
            
            return {
              ...session,
              messages: updatedMessages,
              title
            }
          })
        }))
      },
      updateSessionTitle: (sessionId, title) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, title }
              : session
          )
        }))
      },
      setCurrentSession: (sessionId) => {
        set({ currentSessionId: sessionId })
      },
      deleteSession: (sessionId) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId 
            ? state.sessions[1]?.id ?? null 
            : state.currentSessionId
        }))
      }
    }),
    { name: 'chat-history' }
  )
) 