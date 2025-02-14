import { processOCRForInvoicesAndAdmin } from './pipeline';

let initialized = false;

export function initializeOCRPipeline() {
  if (!initialized && typeof window === 'undefined') {
    initialized = true;
    // Start the OCR pipeline
    setInterval(() => {
      processOCRForInvoicesAndAdmin().catch(console.error);
    }, 60000);
    console.log('OCR pipeline initialized');
  }
}
