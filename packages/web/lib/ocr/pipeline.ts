import { pipe } from '@screenpipe/js';
import { extractInvoicesAndAdmin } from '../ai/extractors';
import { storeInvoices, storeAdminObligations } from '../db/queries/invoices';
import { InvoicesAndAdminSchema, type InvoicesAndAdmin } from '../schemas/invoicesAdminSchema';
import { type NewInvoice, type NewAdminObligation } from '../db/schema';
import { z } from 'zod';

interface VisionEvent {
  data: {
    text: string;
    app_name: string;
    window_name: string;
    timestamp: string;
  };
}

let isProcessing = false;
let textBuffer = '';
const PROCESS_INTERVAL = 60000; // Process every 60 seconds
let lastProcessTime = Date.now();

export async function startOCRProcessing() {
  if (isProcessing) {
    console.log('OCR processing already running');
    return;
  }

  isProcessing = true;
  console.log('Starting OCR processing stream...');

  try {
    const stream = await pipe.streamVision(false);
    for await (const event of stream) {
      if (event.data.text) {
        textBuffer += event.data.text + '\n';
        console.log('New OCR text:', event.data.text);
        console.log('From app:', event.data.app_name);
        console.log('Window:', event.data.window_name);
      }

      const now = Date.now();
      if (now - lastProcessTime >= PROCESS_INTERVAL && textBuffer.trim()) {
        await processBuffer();
        lastProcessTime = now;
      }
    }
  } catch (err) {
    console.error('Error in OCR stream:', {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
  } finally {
    isProcessing = false;
  }
}

async function processBuffer() {
  if (!textBuffer.trim()) return;

  try {
    console.log('Processing OCR buffer...');
    const result = await extractInvoicesAndAdmin(textBuffer);
    
    if (!result) {
      console.log('No data extracted from OCR text');
      return;
    }

    const parsed = InvoicesAndAdminSchema.safeParse(result);
    if (!parsed.success) {
      console.error('Invalid data format:', parsed.error);
      return;
    }

    const data: InvoicesAndAdmin = parsed.data;
    const userId = 'test-user-123'; // TODO: Remove test user ID once auth is set up
    const source = `ocr_stream_${new Date().toISOString()}`;
    
    // Store invoices
    if (data.invoices && data.invoices.length > 0) {
      const invoiceInputs: NewInvoice[] = data.invoices.map(inv => ({
        id: crypto.randomUUID(),
        invoiceNumber: inv.invoiceNumber,
        vendor: inv.vendor,
        amount: inv.amount.toString(),
        invoiceDate: new Date(inv.invoiceDate),
        dueDate: new Date(inv.dueDate),
        userId,
        createdAt: new Date(),
        source
      }));
      await storeInvoices(invoiceInputs);
      console.log(`Stored ${invoiceInputs.length} invoices`);
    }

    // Store admin obligations
    if (data.adminObligations && data.adminObligations.length > 0) {
      const adminInputs: NewAdminObligation[] = data.adminObligations.map(admin => ({
        id: crypto.randomUUID(),
        obligation: admin.obligation,
        dueDate: new Date(admin.dueDate),
        notes: admin.notes || null,
        userId,
        createdAt: new Date(),
        source
      }));
      await storeAdminObligations(adminInputs);
      console.log(`Stored ${adminInputs.length} admin obligations`);
    }
  } catch (err) {
    console.error('Error processing OCR buffer:', err);
  } finally {
    // Clear the buffer after processing
    textBuffer = '';
  }
}

// Start the OCR processing when this module is imported
startOCRProcessing();
