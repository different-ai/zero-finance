import { LucideIcon } from 'lucide-react';

export interface TaskData {
  title: string;
  content: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface EventData {
  title: string;
  startTime: string;
  endTime: string;
  content?: string;
  location?: string;
}

export interface InvoiceData {
  title: string;
  amount: number;
  currency: string;
  dueDate?: string;
  paymentDetails?: {
    recipient: string;
    accountNumber?: string;
    bankDetails?: string;
  };
}

export type RecognizedTaskItem = {
  id?: string;
  type: 'task';
  data: TaskData;
  timestamp?: string;
  agentId?: string;
};

export type RecognizedEventItem = {
  id?: string;
  type: 'event';
  data: EventData;
  timestamp?: string;
  agentId?: string;
};

export type RecognizedInvoiceItem = {
  id?: string;
  type: 'invoice';
  data: InvoiceData;
  timestamp?: string;
  agentId?: string;
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
} 