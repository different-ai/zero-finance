'use client';

import React from 'react';
import { Agent, AgentType, RecognizedContext } from './base-agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface PaymentFormData {
  accountId: string;
  amount: number;
  currency: string;
  recipientName: string;
  routingNumber?: string;
  accountNumber?: string;
  reference?: string;
}

function AutoPaySettingsUI() {
  const [apiKey, setApiKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Load saved API key
    window.mercuryApi.getApiKey().then(key => {
      if (key) setApiKey(key);
    });
  }, []);

  async function handleSave() {
    setIsLoading(true);
    try {
      await window.mercuryApi.setApiKey(apiKey);
      toast({
        title: 'Success',
        description: 'Mercury API key saved successfully',
      });
    } catch (error) {
      console.error('0xHypr', 'Failed to save Mercury API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API key',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4 dark">
      <div className="space-y-2">
        <Label>Mercury API Key</Label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Mercury API key"
        />
      </div>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save API Key'}
      </Button>
    </div>
  );
}

function PaymentForm({ 
  context,
  onClose,
  onSuccess,
}: { 
  context: RecognizedContext;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = React.useState<PaymentFormData>({
    accountId: '',
    amount: 0,
    currency: 'USD',
    recipientName: '',
    routingNumber: '',
    accountNumber: '',
    reference: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await window.mercuryApi.createPayment(formData);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Success',
        description: 'Payment created successfully',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('0xHypr', 'Failed to create payment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Account ID</Label>
        <Input
          value={formData.accountId}
          onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Currency</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => setFormData({ ...formData, currency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Recipient Name</Label>
        <Input
          value={formData.recipientName}
          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Routing Number (Optional)</Label>
        <Input
          value={formData.routingNumber}
          onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Account Number (Optional)</Label>
        <Input
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Reference (Optional)</Label>
        <Input
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Payment...' : 'Create Payment'}
        </Button>
      </div>
    </form>
  );
}

function AutoPayEventUI({ 
  context, 
  onSuccess 
}: { 
  context: RecognizedContext;
  onSuccess?: () => void;
}) {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h3 className="font-medium">Auto-Pay Action</h3>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Button onClick={() => setShowForm(true)}>
        Prepare Payment
      </Button>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <PaymentForm
              context={context}
              onClose={() => setShowForm(false)}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const AutoPayAgent: Agent = {
  id: 'auto-pay-agent',
  name: 'Auto-Pay Manager',
  type: 'payment' as AgentType,
  isActive: true,
  isReady: true,
  detectorPrompt: `You are an agent that identifies when the user needs to MAKE a payment (i.e., the user is the one paying).

Look for text that implies the user owes money or must pay someone, such as:
- "Pay $X to [Name/Account]"
- "We received an invoice for $X from [Vendor]"
- "Your invoice from [Vendor] is due"
- "Transfer $X to account #..."
- "Process payment for $X"
- "Please pay this invoice by [date]"

Do NOT classify if the user is the one receiving money. Only classify if user is the payer or has a bill to pay.
Focus on:
1. A clear amount and payee details (or vendor name)
2. Language indicating the user must pay or settle a balance
3. The user is the payer, not the payee
4. Due dates or payment deadlines

Extract vital information like:
- Payment amount and currency
- Vendor/recipient details
- Account information if provided
- Due date or payment terms
- Invoice reference numbers
- Any late payment penalties`,
  displayName: () => <>Auto-Pay Manager</>,
  description: 'Detects and processes payments from recognized text',
  miniApp: () => <AutoPaySettingsUI />,
  eventAction: (context, onSuccess) => (
    <AutoPayEventUI context={context} onSuccess={onSuccess} />
  ),
}; 