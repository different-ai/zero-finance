interface Integration {
  name: string;
  status: 'active' | 'coming-soon';
  description: string;
}

export const individualIntegrations: Integration[] = [
  {
    name: 'Screenpipe',
    status: 'active',
    description: 'Screen activity monitoring',
  },
  {
    name: 'Obsidian',
    status: 'active',
    description: 'Task management',
  },
  {
    name: 'Calendar',
    status: 'active',
    description: 'Event scheduling',
  },
  {
    name: 'Gmail',
    status: 'coming-soon',
    description: 'Coming soon',
  },
  {
    name: 'GitHub',
    status: 'coming-soon',
    description: 'Coming soon',
  },
  {
    name: 'Linear',
    status: 'coming-soon',
    description: 'Coming soon',
  },
  {
    name: 'Telegram',
    status: 'coming-soon',
    description: 'Coming soon',
  },
  {
    name: 'Slack',
    status: 'coming-soon',
    description: 'Coming soon',
  },
];

export const enterpriseIntegrations: Integration[] = [
  {
    name: 'Screenpipe',
    status: 'active',
    description: 'Screen activity monitoring',
  },
  {
    name: 'Salesforce',
    status: 'coming-soon',
    description: 'CRM automation',
  },
  {
    name: 'SAP',
    status: 'coming-soon',
    description: 'ERP integration',
  },
  {
    name: 'ServiceNow',
    status: 'coming-soon',
    description: 'ITSM automation',
  },
  {
    name: 'Workday',
    status: 'coming-soon',
    description: 'HR automation',
  },
  {
    name: 'Oracle',
    status: 'coming-soon',
    description: 'Database integration',
  },
  {
    name: 'Microsoft 365',
    status: 'coming-soon',
    description: 'Office suite integration',
  },
  {
    name: 'Jira',
    status: 'coming-soon',
    description: 'Project management',
  },
]; 