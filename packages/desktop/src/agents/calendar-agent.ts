import { Agent, EventData } from './base-agent';
import { createEvents, EventAttributes } from 'ics';
import { CalendarAgentUI } from '@/components/calendar-agent-ui';
import React from 'react';

interface CalendarAgentUIProps {
  content: string;
  onSuccess?: () => void;
}

export const calendarAgent: Agent = {
  id: 'calendar',
  name: 'Calendar Agent',
  description: 'Creates and manages calendar events',
  type: 'event',
  isActive: true,

  render: (content: string, onSuccess?: () => void) => {
    return React.createElement(CalendarAgentUI, { content, onSuccess });
  }
}; 