import { ReactNode } from 'react';
import { RecognizedContext } from '@/components/event-classification';

export type AgentType = 'task' | 'event' | 'invoice' | 'goal' | 'business';

export interface RecognizedContext {
  id: string;
  title: string;
  vitalInformation: string;
  type: AgentType;
  source: string;
}

export interface Agent {
  id: string;
  name: string;
  displayName?: () => ReactNode;
  description: string;
  type: AgentType;
  isActive: boolean;
  isReady: boolean;
  miniApp?: () => ReactNode;
  eventAction(context: RecognizedContext, onSuccess?: () => void): ReactNode;
}

export interface ClassificationResult {
  title: string;
  type: AgentType;
  relevantRawContent: string;
  vitalInformation: string;
  confidence: number;
}