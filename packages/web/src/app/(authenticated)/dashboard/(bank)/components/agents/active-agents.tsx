'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Bell, AlertTriangle, CheckCircle, PiggyBank, ClipboardList } from 'lucide-react';

export interface ActivityLogEntry {
  date: Date;
  action: string;
  details: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'yield' | 'tax' | 'custom';
  status: 'active' | 'paused' | 'alert';
  description: string;
  config: any;
  createdAt: Date;
  lastActivity?: Date;
  activityLog?: ActivityLogEntry[];
  monitoringStatus?: string;
}

// In-memory store for active agents
let agents: Agent[] = [];
let listeners: (() => void)[] = [];

// Function to notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function addAgent(agent: Agent) {
  // For yield agents, add some realistic monitoring activity
  if (agent.type === 'yield') {
    // Create an initial activity log
    const activityLog = [
      {
        date: new Date(),
        action: "Initial investment setup",
        details: `Invested in ${agent.config.opportunity.name} at ${agent.config.opportunity.apy}% APY`
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        action: "Market conditions check",
        details: "Verified current market rates are optimal"
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        action: "Risk assessment",
        details: `Confirmed ${agent.config.opportunity.risk} risk profile is appropriate`
      }
    ];
    
    agent = {
      ...agent,
      activityLog,
      monitoringStatus: "Actively monitoring market conditions"
    };
    
    // Set up a simulated alert if yield drops condition
    if (!agent.config.alertThreshold) {
      agent.config.alertThreshold = agent.config.opportunity.apy * 0.8;
    }
    
    if (!agent.config.emailAlerts) {
      agent.config.emailAlerts = true;
    }
  }
  
  agents = [...agents, agent];
  notifyListeners();
}

export function removeAgent(agentId: string) {
  agents = agents.filter(agent => agent.id !== agentId);
  notifyListeners();
}

export function useAgents() {
  const [activeAgents, setActiveAgents] = useState<Agent[]>(agents);
  
  useEffect(() => {
    // Update state when agents change
    const handleChange = () => {
      setActiveAgents([...agents]);
    };
    
    // Add listener
    listeners.push(handleChange);
    
    // Set up event listeners for agent activation
    const handleYieldAgentActivation = (event: any) => {
      const detail = event.detail;
      const opportunity = detail.config?.opportunity || detail;
      const config = detail.config || {
        opportunity,
        alertThreshold: opportunity.apy * 0.8,
        rebalanceFrequency: 'weekly',
        emailAlerts: true
      };
      
      addAgent({
        id: `yield-${crypto.randomUUID()}`,
        name: `Yield Manager: ${opportunity.name}`,
        type: 'yield',
        status: 'active',
        description: `Monitoring and managing investments in ${opportunity.name} at ${opportunity.apy}% APY`,
        config,
        createdAt: new Date(),
        lastActivity: new Date(),
      });
    };

    const handleTaxAgentActivation = (event: any) => {
      const taxData = event.detail;
      addAgent({
        id: `tax-${crypto.randomUUID()}`,
        name: `Tax Automation for ${taxData.country}`,
        type: 'tax',
        status: 'active',
        description: `Managing tax compliance, receipt collection, and filing for your business in ${taxData.country}`,
        config: {
          country: taxData.country,
          corporateTaxRate: taxData.corporateTaxRate,
          vatRate: taxData.vatRate,
          collectReceipts: true,
          automateFilings: true,
        },
        createdAt: new Date(),
        lastActivity: new Date(),
      });
    };

    window.addEventListener('activateYieldAgent', handleYieldAgentActivation as EventListener);
    window.addEventListener('activateTaxAgent', handleTaxAgentActivation as EventListener);
    
    // Remove listener on cleanup
    return () => {
      listeners = listeners.filter(l => l !== handleChange);
      window.removeEventListener('activateYieldAgent', handleYieldAgentActivation as EventListener);
      window.removeEventListener('activateTaxAgent', handleTaxAgentActivation as EventListener);
    };
  }, []);
  
  return activeAgents;
}

export function ActiveAgents() {
  const agents = useAgents();

  if (agents.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center mb-4">
        <PiggyBank className="h-5 w-5 text-blue-400 mr-2" />
        <h2 className="text-lg font-medium text-white">Your Active AI Agents</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusIcons = {
    active: <CheckCircle className="h-4 w-4 text-green-400" />,
    paused: <Bell className="h-4 w-4 text-yellow-400" />,
    alert: <AlertTriangle className="h-4 w-4 text-red-400" />,
  };

  const typeIcons = {
    yield: <PiggyBank className="h-5 w-5 text-blue-400" />,
    tax: <ClipboardList className="h-5 w-5 text-blue-400" />,
    custom: <Bot className="h-5 w-5 text-blue-400" />,
  };

  const isYieldAgent = agent.type === 'yield';

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
            {typeIcons[agent.type]}
          </div>
          <div>
            <h3 className="font-medium text-white">{agent.name}</h3>
            <p className="text-xs text-slate-400">Created {agent.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
        <button
          onClick={() => removeAgent(agent.id)}
          className="rounded-full p-1 hover:bg-slate-700"
          aria-label="Remove agent"
        >
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>
      
      <div className="p-3">
        <p className="text-xs text-slate-300 mb-3">{agent.description}</p>
        
        {isYieldAgent && (
          <div className="mb-3 border-b border-slate-700 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-700/50 rounded">
                <p className="text-xs font-medium text-slate-400">Alert Threshold</p>
                <p className="text-sm text-blue-400 font-semibold">{agent.config.alertThreshold}% APY</p>
              </div>
              <div className="p-2 bg-slate-700/50 rounded">
                <p className="text-xs font-medium text-slate-400">Email Alerts</p>
                <p className="text-sm text-blue-400 font-semibold">{agent.config.emailAlerts ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            {agent.monitoringStatus && (
              <div className="mt-2 text-xs font-medium text-blue-400 bg-blue-600/20 p-2 rounded">
                {agent.monitoringStatus}
              </div>
            )}
          </div>
        )}
        
        {isYieldAgent && agent.activityLog && agent.activityLog.length > 0 && (
          <div className="mb-3 space-y-2">
            <p className="text-xs font-medium text-slate-400">Recent Activity:</p>
            {agent.activityLog.slice(0, 2).map((entry, idx) => (
              <div key={idx} className="text-xs border-l-2 border-blue-400 p-2 pl-3 bg-slate-700/30 rounded">
                <div className="flex justify-between">
                  <span className="font-medium text-white">{entry.action}</span>
                  <span className="text-slate-400">{new Date(entry.date).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 mt-1">{entry.details}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded">
            {statusIcons[agent.status]}
            <span className="text-xs capitalize text-slate-300">{agent.status}</span>
          </div>
          {agent.lastActivity && (
            <span className="text-xs text-slate-400">
              Last active: {new Date(agent.lastActivity).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}