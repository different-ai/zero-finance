import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface TaskData {
  title: string;
  content: string;
  details?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface EventData {
  title: string;
  startTime: string;
  endTime: string;
  content?: string;
  details?: string;
  location?: string;
  attendees?: string[];
}

export interface InvoiceData {
  title: string;
  amount: number;
  currency: string;
  description: string;
  dueDate?: string;
  recipient: {
    name: string;
    address?: string;
    email?: string;
  };
}

export type RecognizedTaskItem = {
  id: string;
  type: 'task';
  data: TaskData;
  timestamp: string;
  agentId: string;
  source: string;
  confidence: number;
};

export type RecognizedEventItem = {
  id: string;
  type: 'event';
  data: EventData;
  timestamp: string;
  agentId: string;
  source: string;
  confidence: number;
};

export type RecognizedInvoiceItem = {
  id: string;
  type: 'invoice';
  data: InvoiceData;
  timestamp: string;
  agentId: string;
  source: string;
  confidence: number;
};

export type RecognizedItem = RecognizedTaskItem | RecognizedEventItem | RecognizedInvoiceItem;

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'task' | 'event' | 'invoice';
  isActive: boolean;
  process: (content: string) => Promise<RecognizedItem>;
  action: (item: RecognizedItem) => Promise<void>;
  render: (item: RecognizedItem, onSuccess: () => void) => ReactNode;
} 