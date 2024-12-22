import { ReactNode } from 'react';

export type AgentType = 'task' | 'event' | 'invoice';

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

export interface RecognizedContext {
  id: string;
  type: AgentType;
  source: string;
  relevantRawContent: string;
  vitalInformation: string;
}

export interface ClassificationResult {
  type: AgentType;
  relevantRawContent: string;
  vitalInformation: string;
  confidence: number;
}

export function isRecognizedContext(obj: any): obj is RecognizedContext {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.source === 'string' &&
    typeof obj.relevantRawContent === 'string' &&
    typeof obj.vitalInformation === 'string'
  );
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  isActive: boolean;
  render: (context: RecognizedContext, onSuccess?: () => void) => ReactNode;
}