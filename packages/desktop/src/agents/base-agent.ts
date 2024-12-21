import { LucideIcon } from 'lucide-react';

export interface RecognizedTaskItem {
  id: string;
  type: 'task';
  source: string;
  timestamp: number;
  confidence: number;
  agentId: string;
  data: {
    title: string;
    content: string;
    priority?: 'high' | 'medium' | 'low';
    dueDate?: string | null;
    details?: string;
  };
}

export interface RecognizedEventItem {
  id: string;
  type: 'event';
  source: string;
  timestamp: number;
  confidence: number;
  agentId: string;
  data: {
    title: string;
    content: string;
    startTime: string;
    endTime: string;
    location?: string;
    attendees?: string[];
    details?: string;
  };
}

export interface RecognizedInvoiceItem {
  id: string;
  type: 'invoice';
  source: string;
  timestamp: number;
  confidence: number;
  agentId: string;
  data: {
    title: string;
    content: string;
    amount: number;
    currency: string;
    dueDate?: string;
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    description: string;
  };
}

export type RecognizedItem = RecognizedTaskItem | RecognizedEventItem | RecognizedInvoiceItem;

export interface Agent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  type: 'task' | 'event' | 'invoice';
  process: (content: string) => Promise<{
    title: string;
    content: string;
    data: any;
  } | null>;
} 