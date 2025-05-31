export type SourceType = "email" | "bank_transaction" | "stripe" | "hyperstable_bank" | "manual" | "system_alert"

export interface SourceDetails {
  name: string // e.g., "Chase Bank", "Gmail", "Stripe Connect", "Hyperstable Business Account"
  identifier?: string // e.g., Transaction ID, Email Subject, Stripe Charge ID
  icon?: string // Optional: path to an icon or a Lucide icon name
}

export interface Comment {
  id: string
  userId: string // 'ai' for AI comments
  authorName: string // e.g., "Alice Wonderland", "AI Assistant"
  avatarUrl?: string
  timestamp: string
  text: string
  role: "user" | "ai"
}

// Represents a potential update suggested by the AI based on comments
export interface SuggestedInboxCardUpdate {
  title?: string
  subtitle?: string
  impact?: {
    currentBalance?: number // Should generally not change currentBalance via suggestion
    postActionBalance?: number
    yield?: number
  }
  // Add other fields that AI might suggest changing
  [key: string]: any // Allow for flexible updates
}

export interface InboxCard {
  id: string
  icon: "bank" | "invoice" | "compliance" | "fx" | "other"
  title: string
  subtitle: string
  confidence: number
  status: "pending" | "executed" | "dismissed" | "auto" | "snoozed" | "error"
  blocked: boolean
  timestamp: string
  rationale: string
  codeHash: string
  chainOfThought: string[]
  impact: {
    currentBalance: number
    postActionBalance: number
    yield?: number
  }
  logId: string
  snoozedTime?: string
  sourceType: SourceType
  sourceDetails: SourceDetails
  comments?: Comment[]
  suggestedUpdate?: SuggestedInboxCardUpdate
  isAiSuggestionPending?: boolean
}

export interface Memory {
  id: string
  timestamp: string
  description: string // e.g., "AI learned: User prefers Acme Corp invoices to be $2000 if possible."
  sourceCardId?: string
  triggeringCommentId?: string
}
