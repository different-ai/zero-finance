import { screenPipe } from '../screenpipe/client';
import { extractInvoicesAndAdmin } from '../ai/extractors';
import { auth } from '@/app/(auth)/auth';
import { storeInvoices, storeAdminObligations } from '../db/queries/invoices';
import { InvoicesAndAdminSchema } from '../schemas/invoicesAdminSchema';
import { z } from 'zod';

type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

import { type NewInvoice, type NewAdminObligation } from '../db/schema';

export async function processOCRForInvoicesAndAdmin() {
  try {
    // TODO: Remove test user ID once auth is set up
    const userId = 'test-user-123';

    // Query new OCR data from the last minute
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    // TODO: Restore screenpipe query once service is available
    // Hardcoded test data until screenpipe is available
    const newOCRRecords = [{
      text: `INVOICE
Number: INV-2024-001
Vendor: Tech Solutions Inc.
Amount: $1,500.00
Invoice Date: 2024-02-14
Due Date: 2024-03-14

REMINDER: Tax filing deadline on March 15, 2024
Note: Don't forget to include Q1 projections

Payment reminder: Insurance premium due on February 28, 2024
Notes: Coverage period March-May`
    }];

    const aggregatedText = (newOCRRecords as any[]).map(record => record.text).join('\n');
    if (!aggregatedText.trim()) {
      console.log('No new OCR text found');
      return;
    }

    // Extract structured invoice and admin obligations using AI
    const extracted = await extractInvoicesAndAdmin(aggregatedText);
    console.log('Extracted data:', extracted);

    // Store extracted invoices if any
    const data = extracted.object as z.infer<typeof InvoicesAndAdminSchema>;
    
    if (data.invoices && data.invoices.length > 0) {
      const invoiceInputs = data.invoices.map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        vendor: inv.vendor,
        amount: inv.amount.toString(),
        invoiceDate: new Date(inv.invoiceDate),
        dueDate: new Date(inv.dueDate),
        userId
      }));
      await storeInvoices(invoiceInputs);
    }

    // Store extracted admin obligations if any
    if (data.adminObligations && data.adminObligations.length > 0) {
      const adminInputs = data.adminObligations.map(admin => ({
        obligation: admin.obligation,
        dueDate: new Date(admin.dueDate),
        notes: admin.notes || null,
        userId
      }));
      await storeAdminObligations(adminInputs);
    }
  } catch (err) {
    console.error('Error processing OCR for invoices and admin obligations:', err);
  }
}

// Run this process every 60 seconds
setInterval(() => {
  processOCRForInvoicesAndAdmin();
}, 60000);
