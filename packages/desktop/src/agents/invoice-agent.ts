import { Agent, InvoiceData, RecognizedContext, isRecognizedContext } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';
import { createOpenAI } from '@ai-sdk/openai';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const invoiceSchema = z.object({
  invoice: z.object({
    title: z.string(),
    amount: z.number(),
    currency: z.string(),
    description: z.string(),
    dueDate: z.string().datetime().optional(),
    recipient: z.object({
      name: z.string(),
      address: z.string().optional(),
      email: z.string().optional(),
    }),
  })
});

interface InvoiceAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

export const InvoiceAgentUI: React.FC<InvoiceAgentUIProps> = ({ context, onSuccess }) => {
  const { toast } = useToast();

  if (!isRecognizedContext(context)) {
    console.error('0xHypr', 'Invalid context provided to InvoiceAgentUI');
    return null;
  }

  const processInvoice = async () => {
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: invoiceSchema,
        prompt: `
          Create an invoice from the following context:
          Content: ${context.content}
          ${context.summary ? `Summary: ${context.summary}` : ''}
          ${context.category ? `Category: ${context.category}` : ''}
          ${context.dueDate ? `Due Date: ${context.dueDate}` : ''}
          ${context.people?.length ? `People: ${context.people.join(', ')}` : ''}
          ${context.amount ? `Amount: ${context.amount.value} ${context.amount.currency}` : ''}
        `.trim()
      });

      const result = invoiceSchema.parse(object);
      const invoiceData: InvoiceData = {
        title: result.invoice.title,
        amount: result.invoice.amount || context.amount?.value || 0,
        currency: result.invoice.currency || context.amount?.currency || 'USD',
        description: result.invoice.description,
        dueDate: result.invoice.dueDate || context.dueDate,
        recipient: {
          name: result.invoice.recipient.name || context.people?.[0] || '',
          address: result.invoice.recipient.address,
          email: result.invoice.recipient.email,
        }
      };

      // Add to vault
      const config = await window.api.getVaultConfig();
      if (!config?.path) {
        throw new Error('No vault configured');
      }

      const filePath = `${config.path}/hyprsqrl.md`;
      let fileContent = '';

      try {
        const result = await window.api.readMarkdownFile(filePath);
        fileContent = result.content;
      } catch (error) {
        fileContent = `# HyprSqrl Tasks\n\n## Invoices\n`;
      }

      const invoiceEntry = `- [ ] ${invoiceData.title}\n` +
        `  - Amount: ${invoiceData.amount} ${invoiceData.currency}\n` +
        `  - Description: ${invoiceData.description}\n` +
        (invoiceData.dueDate ? `  - Due: ${new Date(invoiceData.dueDate).toLocaleDateString()}\n` : '') +
        `  - Recipient: ${invoiceData.recipient.name}\n` +
        (invoiceData.recipient.address ? `  - Address: ${invoiceData.recipient.address}\n` : '') +
        (invoiceData.recipient.email ? `  - Email: ${invoiceData.recipient.email}\n` : '') +
        `  - Created: ${new Date().toISOString()}\n`;

      if (fileContent.includes('## Invoices')) {
        fileContent = fileContent.replace('## Invoices\n', `## Invoices\n${invoiceEntry}`);
      } else {
        fileContent += `\n## Invoices\n${invoiceEntry}`;
      }

      await window.api.writeMarkdownFile(filePath, fileContent);
      console.log('0xHypr', 'Invoice added to vault:', invoiceData.title);
      
      toast({
        title: 'Success',
        description: 'Invoice added to vault'
      });

      onSuccess?.();
    } catch (error) {
      console.error('0xHypr', 'Error creating invoice:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create invoice',
        variant: 'destructive'
      });
    }
  };

  return React.createElement(Card, null,
    React.createElement(CardContent, { className: "p-4" },
      React.createElement('div', { className: "flex justify-between items-center" },
        React.createElement('div', null,
          React.createElement('h3', { className: "font-medium" }, "Invoice Detected"),
          React.createElement('p', { className: "text-sm text-muted-foreground" }, context.content),
          context.summary && React.createElement('p', { className: "text-xs text-muted-foreground mt-1" }, context.summary),
          context.amount && React.createElement('p', { className: "text-xs text-muted-foreground" }, 
            `Amount: ${context.amount.value} ${context.amount.currency}`
          ),
          context.people?.length && React.createElement('p', { className: "text-xs text-muted-foreground" }, 
            `From: ${context.people.join(', ')}`
          )
        ),
        React.createElement(Button, { onClick: processInvoice }, "Process Invoice")
      )
    )
  );
};

export const invoiceAgent: Agent = {
  id: 'invoice',
  name: 'Invoice Agent',
  description: 'Recognizes invoices from text',
  type: 'invoice',
  isActive: true,

  render: (context: RecognizedContext, onSuccess?: () => void) => {
    if (!isRecognizedContext(context)) {
      console.error('0xHypr', 'Invalid context provided to invoice agent');
      return null;
    }
    return React.createElement(InvoiceAgentUI, { context, onSuccess });
  }
};