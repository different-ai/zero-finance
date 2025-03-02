import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardHeader } from '@/components/dashboard-header';
import { useDashboardStore } from '@/stores/dashboard-store';
import RootLayout from './layout';
import { Toaster } from '@/components/ui/toaster';
import { ApiKeyRequirement } from '@/components/api-key-requirement';
import { useApiKeyStore } from '@/stores/api-key-store';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoiceList } from '@/components/invoice-list';
import { PaymentConfig } from '@/components/payment-config';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function DashboardPage() {
  const { activePanel, setActivePanel } = useDashboardStore();
  const { apiKey } = useApiKeyStore();
  const [showNewInvoice, setShowNewInvoice] = React.useState(false);

  function renderInvoicesPanel() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Invoices</h2>
          <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] h-[90vh] p-0">
              <div className="flex-1 flex flex-col min-h-0">
                <InvoiceForm 
                  onSubmit={() => setShowNewInvoice(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <InvoiceList />
      </div>
    );
  }

  function renderSettingsPanel() {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Payment Settings</h2>
        <PaymentConfig />
      </div>
    );
  }

  function renderPanel() {
    switch (activePanel) {
      case 'invoices':
        return renderInvoicesPanel();
      case 'settings':
        return renderSettingsPanel();
      default:
        return renderInvoicesPanel();
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
