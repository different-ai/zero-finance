'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateEscrowInvoiceCard } from '../invoice-escrow/components/create-escrow-invoice-card';
import { EscrowInvoiceListCard } from '../invoice-escrow/components/escrow-invoice-list-card';
import { EscrowBalanceCard } from '../invoice-escrow/components/escrow-balance-card';
import { FileText, Lock, Send } from 'lucide-react';

export default function InvoiceEscrowPage() {
  const [activeView, setActiveView] = useState<'create' | 'list'>('list');

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Invoice Escrow</h1>
        <p className="text-muted-foreground">
          Create invoices with locked funds that are automatically released when sent to recipients.
        </p>
      </div>

      {/* Balance Overview */}
      <EscrowBalanceCard />

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'list' ? 'default' : 'outline'}
          onClick={() => setActiveView('list')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          My Invoices
        </Button>
        <Button
          variant={activeView === 'create' ? 'default' : 'outline'}
          onClick={() => setActiveView('create')}
          className="flex items-center gap-2"
        >
          <Lock className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Main Content */}
      {activeView === 'create' ? (
        <CreateEscrowInvoiceCard />
      ) : (
        <EscrowInvoiceListCard />
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Invoice Escrow Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              1
            </div>
            <div>
              <h4 className="font-semibold">Create Invoice</h4>
              <p className="text-sm text-muted-foreground">
                Create an invoice with the amount you want to charge. The funds will be locked in escrow.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              2
            </div>
            <div>
              <h4 className="font-semibold">Lock Funds</h4>
              <p className="text-sm text-muted-foreground">
                The invoice amount is locked from your wallet into the escrow smart contract.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              3
            </div>
            <div>
              <h4 className="font-semibold">Send to Recipient</h4>
              <p className="text-sm text-muted-foreground">
                Share the invoice link with your recipient. They can view and pay the invoice.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              4
            </div>
            <div>
              <h4 className="font-semibold">Automatic Release</h4>
              <p className="text-sm text-muted-foreground">
                Once the invoice is sent, the funds are automatically released to the recipient.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}