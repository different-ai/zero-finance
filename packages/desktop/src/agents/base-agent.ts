import { ReactNode } from 'react';

export type AgentType = 'invoice' | 'calendar' | 'task';

export interface RecognizedContext {
  title: string;
  vitalInformation: string;
  type: AgentType;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  isActive: boolean;
  render: (context: RecognizedContext, onSuccess?: () => void) => ReactNode;
  view?: () => ReactNode;
}