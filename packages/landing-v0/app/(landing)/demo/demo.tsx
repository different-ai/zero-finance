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
    id: 'task-1',
    title: 'Upload files to IPFS',
    confidence: 0.9,
    priority: 'medium',
    details: 'Upload necessary files to the InterPlanetary File System (IPFS) for decentralized storage.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Telegram',
      windowTitle: 'ETH Dev Chat',
      trigger: '👀 Spotted this task in a Telegram message'
    }
  },
  {
    id: 'task-2',
    title: 'Add task to daily note',
    confidence: 0.85,
    priority: 'high',
    details: 'Integrate task management with daily notes in Obsidian, ensuring tasks are automatically added to daily notes.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Chrome',
      windowTitle: 'Project Roadmap - Notion',
      trigger: '📝 Detected while viewing your Notion roadmap'
    }
  },
  {
    id: 'task-3',
    title: 'Make sure agents have icons',
    confidence: 0.8,
    priority: 'low',
    details: 'Ensure all agents in the system have appropriate icons for better visual representation.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Slack',
      windowTitle: 'design-team',
      trigger: '💬 Found in your Slack design team discussion'
    }
  },
];

export const Demo = () => {
  const defaultValue = `Hello,

Stripe monitors your transactions for [Company] to see if you have exceeded a tax threshold as your business grows.

Thresholds are determined by taxing authorities and exceeding a tax threshold in a location may mean that you need to register to collect sales tax, VAT, or GST in that location, depending on your business type, product categories, and other factors.

Based on Stripe's monitoring of your sales, you have exceeded a tax threshold in the following locations:

 Europe: Spain, Finland
- Middle East: United Arab Emirates

You can read more about whether [Company] needs to register and collect tax in these locations by reading our location-specific guides.

To start collecting tax with Stripe in these locations, there are two steps you'll need to complete:

1. Register with the above locations to collect tax.
2. After you register, add your registration details to the dashboard to begin automatically collecting tax.

If you have any questions, please visit our support site. We're here to help.

— The Stripe team

This email relates to your [Company] Stripe account. Account ID: [REDACTED] Need to refer to this message? Use this ID: [REDACTED]

Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080`;



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
