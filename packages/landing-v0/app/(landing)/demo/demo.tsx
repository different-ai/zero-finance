'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Monitor, Wallet } from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BrowserWindow } from './browser-window';
import { motion, AnimatePresence } from 'framer-motion';
import { ValueJourney } from '../components/value-journey';

// Demo data based on dashboard-store
const demoTasks = [
  {
    id: 1,
    title: 'Review Design Sprint Invoice',
    completed: false,
    date: '2024-03-15',
    automated: true,
  },
  {
    id: 2,
    title: 'Schedule ETH Payment',
    completed: true,
    date: '2024-03-10',
    automated: true,
  },
];

const demoRecognizedItems = [
  {
    id: 'finance-1',
    title: 'Design Review Payment',
    confidence: 0.95,
    priority: 'high',
    details: 'Agreement reached in design review meeting: Pay 2 ETH upon completion of UI mockups.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Zoom',
      windowTitle: 'Design Review Meeting',
      trigger: '💰 Crypto payment agreement detected in meeting transcript'
    }
  },
  {
    id: 'finance-2',
    title: 'Cloud Services Invoice',
    confidence: 0.92,
    priority: 'medium',
    details: 'Received invoice for 500 DAI (Infrastructure costs). Due in 30 days.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Gmail',
      windowTitle: 'Invoice #CS-2024-123',
      trigger: '📄 Crypto invoice automatically detected in email'
    }
  },
  {
    id: 'finance-3',
    title: 'DeFi Yield Opportunity',
    confidence: 0.88,
    priority: 'high',
    details: 'Potential yield improvement: Move 10k USDC from Aave (8.2% APY) to Compound (12.5% APY). Estimated +$430/year.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Chrome',
      windowTitle: 'DeFi Rates Dashboard',
      trigger: '📈 Higher yield opportunity detected'
    }
  },
  {
    id: 'finance-4',
    title: 'Crypto Payroll Transfer',
    confidence: 0.96,
    priority: 'high',
    details: 'Upcoming payroll transfer needed: 4 ETH from treasury wallet to operational account. Due within 48 hours.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Banking Portal',
      windowTitle: 'Treasury Management',
      trigger: '🏦 Scheduled crypto transfer reminder'
    }
  },
  {
    id: 'finance-5',
    title: 'Dev Tools Subscription',
    confidence: 0.94,
    priority: 'low',
    details: 'Developer Tools Inc subscription (100 USDC) automatically categorized as Business Expense for tax purposes.',
    timestamp: new Date().toISOString(),
    source: {
      app: 'Chrome',
      windowTitle: 'Developer Tools Inc - Receipt',
      trigger: '🧾 Crypto expense automatically categorized'
    }
  }
];

export const Demo = () => {
 



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
                <h3 className="font-medium">Finance Agent</h3>
                <p className="text-sm text-gray-400">
                  Detects crypto payments and invoices from screen content
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-400">
              <span>Today: 5</span>
              <span>Total: 5</span>
            </div>
          </div>
          <div className="border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-[#6E45FE]" />
              <div>
                <h3 className="font-medium">Treasury Agent</h3>
                <p className="text-sm text-gray-400">
                  Monitors DeFi yields and optimizes crypto treasury
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-400">
              <span>Today: 3</span>
              <span>Total: 3</span>
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
            <p className="text-gray-400 text-sm">Recently detected by HyprSqrl</p>
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
                    Process
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
          {renderActiveAgents()}
          <div className="bg-[#1C1D21] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Automations</h2>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500"
              >
                5 Active
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Screen</span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Email</span>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Slack</span>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Telegram</span>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Coming Soon</Badge>
              </div>
            </div>
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
