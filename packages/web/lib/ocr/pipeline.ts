import { screenPipe } from '../screenpipe/client';
import { extractInvoicesAndAdmin } from '../ai/extractors';
import { auth } from '@/app/(auth)/auth';
import { storeInvoices, storeAdminObligations } from '../db/queries/invoices';
import { InvoicesAndAdminSchema } from '../schemas/invoicesAdminSchema';
import { z } from 'zod';
type Session = {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

export async function processOCRForInvoicesAndAdmin() {
  try {
    const session = await auth() as Session | null;
    if (!session?.user?.id) {
      console.error('No user session found');
      return;
    }

    // Query new OCR data from the last minute
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    const newOCRRecords = await screenPipe.queryOCRData({
      q: '',
      contentType: 'ocr',
      startTime: oneMinuteAgo.toISOString(),
      endTime: now.toISOString(),
      limit: 50,
      includeFrames: false,
    });

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
      await storeInvoices(data.invoices.map(inv => ({
        ...inv,
        userId: session.user.id,
      })));
    }

    // Store extracted admin obligations if any
    if (data.adminObligations && data.adminObligations.length > 0) {
      await storeAdminObligations(data.adminObligations.map(admin => ({
        ...admin,
        userId: session.user.id,
      })));
    }
  } catch (err) {
    console.error('Error processing OCR for invoices and admin obligations:', err);
  }
}

// Run this process every 60 seconds
setInterval(() => {
  processOCRForInvoicesAndAdmin();
}, 60000);
