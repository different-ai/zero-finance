import { AgentType } from '@/agents/base-agent';

export interface RecognizedItem {
  id: string;
  type: AgentType;
  source: string;
  title: string;
  agentId: string;
  vitalInformation: string;
  data: any;
}
