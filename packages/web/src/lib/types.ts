import type { ReactNode } from "react"

export interface Attachment {
  name: string
  size: string
  type: "pdf" | "image" | "zip" | "other"
}

export interface Message {
  id: string
  sender: string
  senderEmail: string
  recipient: string
  subject: string
  body: ReactNode | string // Can be JSX or a string for typing
  timestamp: string
  isRead: boolean
  avatar?: string
  attachments?: Attachment[]
  previousMessage?: Message // This enables threading
  isForwarded?: boolean
  threadId?: string
  isActionable?: boolean
}

export interface DemoStep {
  title: string
  description: string
  action:
    | "START_WITH_MESSAGES"
    | "ADD_MESSAGE"
    | "AI_WELCOME"
    | "OPEN_MESSAGE"
    | "GO_TO_INBOX"
    | "FORWARD_MESSAGE"
    | "TYPE_AND_SEND_FORWARD"
    | "SHOW_MESSAGE_IN_THREAD"
    | "CLEAR_THREAD"
    | "ARCHIVE_NON_ACTIONABLE"
    | "FINISH_EMPTY"
    | "END"
  messageId?: string
  messageIds?: string[]
  threadId?: string
  isTyping?: boolean
  delayAfter: number
  highlightButton?: "reply" | "forward" | "send" | "back"
  forwardBody?: string
}
