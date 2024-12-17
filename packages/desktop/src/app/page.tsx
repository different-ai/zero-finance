import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardHeader } from '@/components/dashboard-header';
import { TaskManager } from '@/components/task-manager';
import { Integrations } from '@/components/integrations';
import { Notifications } from '@/components/notifications';
import { AIAgentStore } from '@/components/ai-agent-store';
import { AutomationInsights } from '@/components/automation-insights';
import { TaskClassification } from '@/components/task-classification';
import { AutomationProgress } from '@/components/automation-progress';
import { ActiveAgents } from '@/components/active-agents';
import { ConnectedApps } from '@/components/connected-apps';
import { useDashboardStore } from '@/stores/dashboard-store';
import RootLayout from './layout';

export default function DashboardPage() {
  const { activePanel, setActivePanel } = useDashboardStore();

  function renderOverviewPanel() {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AutomationProgress />
          <ActiveAgents />
          <ConnectedApps />
        </div>
        <TaskClassification />
      </div>
    );
  }

  function renderPanel() {
    switch (activePanel) {
      case 'overview':
        return renderOverviewPanel();
      case 'tasks':
        return <TaskManager />;
      case 'integrations':
        return <Integrations />;
      case 'notifications':
        return <Notifications />;
      case 'aiAgents':
        return <AIAgentStore />;
      case 'insights':
        return <AutomationInsights />;
      default:
        return null;
    }
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <RootLayout>
        <DashboardHeader
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
        <main className="container mx-auto p-4">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </RootLayout>
    </div>
  );
}
