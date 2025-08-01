'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { parseEther } from 'viem';
import { Loader2, Lock } from 'lucide-react';

export function CreateEscrowInvoiceCard() {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    amount: '',
    currency: 'ETH',
    description: '',
    dueDate: '',
    invoiceNumber: `INV-${Date.now()}`,
  });

  const createInvoice = api.invoiceEscrow.createEscrowInvoice.useMutation({
    onSuccess: (data) => {
      toast.success('Invoice created successfully!', {
        description: `Invoice ${data.invoiceNumber} has been created and funds locked.`,
      });
      // Reset form
      setFormData({
        recipientEmail: '',
        recipientName: '',
        amount: '',
        currency: 'ETH',
        description: '',
        dueDate: '',
        invoiceNumber: `INV-${Date.now()}`,
      });
    },
    onError: (error) => {
      toast.error('Failed to create invoice', {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    createInvoice.mutate({
      recipientEmail: formData.recipientEmail,
      recipientName: formData.recipientName,
      amount: parseEther(formData.amount).toString(),
      currency: formData.currency as 'ETH' | 'USDC',
      description: formData.description,
      dueDate: formData.dueDate,
      invoiceNumber: formData.invoiceNumber,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Escrow Invoice</CardTitle>
        <CardDescription>
          Create an invoice with funds locked in escrow until sent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="John Doe"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="john@example.com"
                value={formData.recipientEmail}
                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                placeholder="0.1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Invoice for services rendered..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>
                By creating this invoice, {formData.amount || '0'} {formData.currency} will be locked in escrow
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createInvoice.isPending}
          >
            {createInvoice.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Invoice...
              </>
            ) : (
              'Create Invoice & Lock Funds'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}