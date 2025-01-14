import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardHeader } from '@/components/dashboard-header';
import { Integrations } from '@/components/integrations';
import { Notifications } from '@/components/notifications';
import { AIAgentStore } from '@/components/ai-agent-store';
import { EventClassification } from '@/components/event-classification';
import { ActiveAgents } from '@/components/active-agents';
import { ConnectedApps } from '@/components/connected-apps';
import { useDashboardStore } from '@/stores/dashboard-store';
import RootLayout from './layout';
import { Toaster } from '@/components/ui/toaster';
import { ApiKeyRequirement } from '@/components/api-key-requirement';
import { useApiKeyStore } from '@/stores/api-key-store';

export default function DashboardPage() {
  const { activePanel, setActivePanel } = useDashboardStore();
  const { apiKey } = useApiKeyStore();

  function renderOverviewPanel() {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <ActiveAgents />
          <ConnectedApps />
        </div>
        <EventClassification />
      </div>
    );
  }

  function renderPanel() {
    switch (activePanel) {
      case 'overview':
        return renderOverviewPanel();
     case 'integrations':
        return <Integrations />;
      case 'notifications':
        return <Notifications />;
      case 'aiAgents':
        return <AIAgentStore />;
      default:
        return null;
    }
  }
  if (!apiKey) {
    return <ApiKeyRequirement />;
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <RootLayout>
        <Toaster />
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
