export interface InboxCard {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'executed' | 'dismissed' | 'auto' | 'snoozed' | 'error';
  type: 'payment' | 'invoice' | 'transfer' | 'approval' | 'notification';
  amount?: string;
  currency?: string;
  from?: string;
  to?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  comments?: Comment[];
  suggestedUpdate?: Partial<InboxCard>;
  isAiSuggestionPending?: boolean;
  impact?: {
    efficiency?: string;
    savings?: string;
    risk?: string;
  };
  snoozedTime?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type?: 'user' | 'system' | 'ai';
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  tags?: string[];
  category?: string;
}

export interface ActionToast {
  id: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
  onUndo?: () => void;
  duration?: number;
} 