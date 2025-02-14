import { processOCRForInvoicesAndAdmin } from '@/lib/ocr/pipeline';

// Initialize the OCR pipeline when this route is first accessed
let initialized = false;

export async function GET() {
  if (!initialized) {
    initialized = true;
    // Start the OCR pipeline
    setInterval(() => {
      processOCRForInvoicesAndAdmin().catch(console.error);
    }, 60000);
  }
  return new Response('OCR pipeline initialized', { status: 200 });
}
