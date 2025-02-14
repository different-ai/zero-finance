import { processOCRForInvoicesAndAdmin } from './pipeline';

let schedulerInterval: NodeJS.Timeout | null = null;

export function startOCRScheduler() {
  if (schedulerInterval) {
    console.log('OCR scheduler already running');
    return;
  }

  // Run immediately on start
  processOCRForInvoicesAndAdmin().catch(err => {
    console.error('Error in OCR pipeline:', err);
  });

  // Schedule to run every minute
  schedulerInterval = setInterval(() => {
    processOCRForInvoicesAndAdmin().catch(err => {
      console.error('Error in OCR pipeline:', err);
    });
  }, 60000);

  console.log('OCR scheduler started');
}

export function stopOCRScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('OCR scheduler stopped');
  }
}
