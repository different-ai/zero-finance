import type { AiProcessedDocument } from '@/server/services/ai-service';

// Core Enums & Simple Interfaces
export type SourceType = "email" | "bank_transaction" | "stripe" | "hyperstable_bank" | "manual" | "system_alert" | "ai_generated" | "receipt" | "payment_reminder";

export interface SourceDetails {
  name: string; // e.g., "Chase Bank", "Gmail", "Stripe Connect", "Hyperstable Business Account", "AI Text Input"
  identifier?: string; // e.g., Transaction ID, Email Subject, Stripe Charge ID, Partial user text
  icon?: string; // Optional: path to an icon or a Lucide icon name
  // For email type specifically
  emailId?: string;
  threadId?: string | null;
  subject?: string | null;
  fromAddress?: string | null;
  attachments?: { filename: string; mimeType: string; size: number; attachmentId?: string; tempPath?: string; }[];
  rawBody?: string; // Base64 encoded, if we decide to store it on the card
  textBody?: string | null;
  htmlBody?: string | null;
}

export interface Comment {
  id: string;
  userId: string; // 'ai_assistant_id' or actual user ID
  authorName: string; // e.g., "Alice Wonderland", "AI Assistant"
  avatarUrl?: string;
  timestamp: string; // ISO string format
  text: string;
  role: "user" | "ai";
}

export interface SuggestedInboxCardUpdate {
  title?: string;
  subtitle?: string;
  impact?: {
    currentBalance?: number;
    postActionBalance?: number;
    yield?: number;
  };
  [key: string]: any;
}

export interface InboxCard {
  id: string;
  // Updated icon to include more types. Consider a mapping if Lucide icons are used directly.
  icon: "bank" | "invoice" | "compliance" | "fx" | "other" | "email" | "system" | "receipt" | "file-text" | "bell";
  title: string;
  subtitle: string; // Replaces 'description' for consistency with UI
  confidence: number; // AI confidence score (0-100)

  // Status & State
  status: 'pending' | 'executed' | 'dismissed' | 'auto' | 'snoozed' | 'error';
  blocked: boolean; // If action is blocked by system/user
  timestamp: string; // ISO string, creation or event time
  snoozedTime?: string; // e.g., "for 2 hours", "until tomorrow morning"
  isAiSuggestionPending?: boolean;

  requiresAction?: boolean;
  suggestedActionLabel?: string | null;

  // Data & Metadata
  amount?: string; // Optional: for quick display, actual amount might be in parsedInvoiceData or impact
  currency?: string; // Optional: for quick display
  from?: string; // Optional: for quick display
  to?: string; // Optional: for quick display
  metadata?: Record<string, any>; // Generic metadata bucket
  logId: string; // Original ID from the source system (e.g., Gmail Message ID, Stripe Event ID)

  // AI & Processing Details
  rationale: string; // AI's reasoning for this card/suggestion
  codeHash: string; // For versioning AI logic that generated this card
  chainOfThought: string[]; // Steps AI took
  impact: {
    currentBalance: number;
    postActionBalance: number;
    yield?: number;
    // Old fields from the other type definition - decide if they are needed or map to new ones
    // efficiency?: string;
    // savings?: string;
    // risk?: string;
  };
  parsedInvoiceData?: AiProcessedDocument; // UPDATED to use AiProcessedDocument

  // Source Information
  sourceType: SourceType;
  sourceDetails: SourceDetails;

  // Interaction
  comments?: Comment[];
  suggestedUpdate?: SuggestedInboxCardUpdate;

  // Note: 'type' field from previous version is merged into 'icon' or can be part of 'sourceType' semantics
}


export interface SimplifiedEmailForChat {
  emailId: string;
  subject?: string | null;
  body?: string | null;
}

export interface Memory {
  id: string;
  timestamp: string;
  description: string;
  sourceCardId?: string;
  triggeringCommentId?: string;
  tags?: string[]; // Added from the other definition
  category?: string; // Added from the other definition
}

export interface ActionToast {
  id: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info'; // Matched from the other definition
  onUndo?: () => void;
  duration?: number;
} 