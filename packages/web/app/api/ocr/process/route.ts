import { processOCRForInvoicesAndAdmin } from '../../../../lib/ocr/pipeline';
import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Remove test bypass once auth is set up
  try {
    await processOCRForInvoicesAndAdmin();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process OCR data:', error);
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 });
  }
}

// Bypass auth middleware for testing
export const config = {
  api: {
    bodyParser: true,
  },
}
