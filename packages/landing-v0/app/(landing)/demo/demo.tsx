'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Calendar,
  Monitor,
} from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BrowserWindow } from './browser-window';
import { AnimatePresence, motion } from 'framer-motion';
import { ValueJourney } from '../components/value-journey';

// Demo data based on dashboard-store
const demoTasks = [
  {
    id: 1,
    title: 'Review Unconf speaker list',
    completed: false,
    date: '2023-06-15',
    automated: false,
  },
  {
    id: 2,
    title: 'Prepare Vitalik introduction',
    completed: true,
    date: '2023-06-10',
    automated: true,
  },
];

const demoRecognizedItems = [
  {
    id: 'finance-1',
    title: 'Design Review Payment Trigger',
    confidence: 0.95,
    priority: 'high',
    details: 'Agreement reached in design review meeting: Release $2,500 payment upon completion of UI mockups.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Zoom',
      windowTitle: 'Design Review Meeting',
      trigger: '💰 Payment agreement detected in meeting transcript'
    }
  },
  {
    id: 'finance-2',
    title: 'Cloud Services Invoice',
    confidence: 0.92,
    priority: 'medium',
    details: 'Received invoice from Cloud Services Ltd for $850 (Infrastructure). Due in 30 days.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Gmail',
      windowTitle: 'Invoice #CS-2024-123',
      trigger: '📄 Invoice automatically detected in email'
    }
  },
  {
    id: 'finance-3',
    title: 'Treasury Yield Opportunity',
    confidence: 0.88,
    priority: 'high',
    details: 'Potential yield improvement: Move from Aave (8.2% APY) to Compound (12.5% APY). Estimated +$1,200/year.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Chrome',
      windowTitle: 'DeFi Rates Dashboard',
      trigger: '📈 Higher yield opportunity detected'
    }
  },
  {
    id: 'finance-4',
    title: 'Payroll Transfer Required',
    confidence: 0.96,
    priority: 'high',
    details: 'Upcoming payroll transfer needed: $5,000 from Treasury wallet to Operational account. Due within 48 hours.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Banking Portal',
      windowTitle: 'Treasury Management',
      trigger: '🏦 Scheduled transfer reminder'
    }
  },
  {
    id: 'finance-5',
    title: 'Dev Tools Expense Processed',
    confidence: 0.94,
    priority: 'low',
    details: 'Developer Tools Inc subscription ($99) automatically categorized as Business Expense for tax purposes.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Chrome',
      windowTitle: 'Developer Tools Inc - Receipt',
      trigger: '🧾 Expense automatically categorized'
    }
  }
];

export const Demo = () => {
  const defaultValue = `HyprSqrl Financial Activity Report

Our AI has detected several actionable financial events from your recent activities:

1. Meeting Payment Agreement (10:30 AM)
- Design review meeting completed
- Milestone: UI mockups delivery
- Payment amount: $2,500
- Status: Ready to trigger upon delivery confirmation
- Action required: Review and approve

2. Invoice Recognition (11:45 AM)
- Sender: Cloud Services Ltd
- Amount: $850
- Category: Infrastructure
- Due date: Net 30
- Status: Automatically processed and scheduled

3. Treasury Yield Optimization
- Current position: 8.2% APY on Aave
- Opportunity: 12.5% APY on Compound
- Potential gain: +$1,200/year
- Risk assessment: Similar risk profile
- Action required: Review rebalancing proposal

4. Bank Transfer Required
- Purpose: Upcoming payroll
- Amount: $5,000
- From: Treasury wallet
- To: Operational account
- Deadline: Next 48 hours
- Action required: Approve transfer

5. Automated Expense Categorization
- Merchant: Developer Tools Inc
- Amount: $99
- Category: Development Tools
- Tax category: Business Expense
- Status: Automatically processed

Our AI agents continue to monitor your screen activity for financial optimization opportunities. Visit your dashboard to take action on these items.

Need assistance? Our support team is available 24/7.

— HyprSqrl Financial Assistant`;



  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');

  const [recognizedItems, setRecognizedItems] = useState(demoRecognizedItems);
  const automationRate =
    (demoTasks.filter((task) => task.automated).length / demoTasks.length) *
    100;

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = window.innerHeight * 0.6;
      const newHeight = Math.min(scrollHeight, maxHeight);
      setTextareaHeight(`${newHeight}px`);
    }
  }, []);





  const renderTaskAutomationProgress = () => {
    return (
      <div className="bg-[#1C1D21] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Task Automation Progress</h2>
        <p className="text-gray-400 text-sm mb-4">
          Percentage of tasks automated
        </p>
        <div className="w-32 h-32 mx-auto">
          <CircularProgressbar
            value={automationRate}
            text={`${Math.round(automationRate)}%`}
            styles={{
              path: { stroke: '#6E45FE' },
              text: { fill: '#fff', fontSize: '16px' },
              trail: { stroke: '#2A2B2E' },
            }}
          />
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          {demoTasks.filter((t) => t.automated).length} / {demoTasks.length}{' '}
          tasks
        </div>
      </div>
    );
  };

  const renderActiveAgents = () => {
    return (
      <div className="bg-[#1C1D21] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Agents</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">2 Active</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Monitor className="h-5 w-5 text-[#6E45FE]" />
              <div>
                <h3 className="font-medium">Task Agent</h3>
                <p className="text-sm text-gray-400">
                  Detects and processes actionable tasks from screen content
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-400">
              <span>Today: 12</span>
              <span>Total: 12</span>
            </div>
          </div>
          <div className="border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#6E45FE]" />
              <div>
                <h3 className="font-medium">Calendar Agent</h3>
                <p className="text-sm text-gray-400">
                  Detects and processes calendar events from screen content
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-400">
              <span>Today: 0</span>
              <span>Total: 0</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecognizedEvents = () => {
    return (
      <div className="bg-[#1C1D21] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Live Screen Activity</h2>
            <p className="text-gray-400 text-sm">Recently detected by Screenpipe</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {recognizedItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{item.source.app}</span>
                  </div>
                  <p className="text-sm text-gray-400">{item.details}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">{item.source.windowTitle}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`
                      ${item.priority === 'high' ? 'bg-red-500/10 text-red-500' : ''}
                      ${item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                      ${item.priority === 'low' ? 'bg-blue-500/10 text-blue-500' : ''}
                    `}
                  >
                    {item.priority}
                  </Badge>
                  <Badge variant="secondary">
                    {Math.round(item.confidence * 100)}%
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Add Task
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOverviewPanel = () => {
    return (
      <div className="space-y-6">
        <ValueJourney />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {renderTaskAutomationProgress()}
          {renderActiveAgents()}
          <div className="bg-[#1C1D21] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Screenpipe</h2>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500"
              >
                Connected
              </Badge>
            </div>
            <p className="text-gray-400 text-sm">
              Captures and processes screen content for task and event detection
            </p>
            <Button className="mt-4" variant="outline">
              Add Integration
            </Button>
          </div>
        </div>
        {renderRecognizedEvents()}
      </div>
    );
  };

  return (
    <BrowserWindow>
      <div className="mx-auto p-4">
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderOverviewPanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BrowserWindow>
  );
};
