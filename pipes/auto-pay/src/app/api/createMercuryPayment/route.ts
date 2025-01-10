import { pipe } from '@screenpipe/js';
import { NextResponse } from 'next/server';
import type { MercuryPaymentRequest, MercuryPaymentResponse } from '@/types/mercury';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!pipe?.settings) {
    return NextResponse.json(
      { error: 'Pipe settings manager not found' },
      { status: 500 }
    );
  }

  try {
    const { paymentInfo } = await request.json();
    const settings = await pipe.settings.getNamespaceSettings('auto-pay');

    if (!settings?.mercuryApiKey || !settings?.mercuryAccountId) {
      throw new Error('Missing Mercury configuration');
    }

    console.log('0xHypr', 'Creating Mercury payment', paymentInfo);

    // Create the payment using Mercury's API
    const response = await fetch(
      `https://backend.mercury.com/api/v1/account/${settings.mercuryAccountId}/transactions`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.mercuryApiKey}`,
        },
        body: JSON.stringify(paymentInfo),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mercury API error: ${error}`);
    }

    const data = await response.json() as MercuryPaymentResponse;
    console.log('0xHypr', 'Mercury payment created:', data);

    return NextResponse.json({
      success: true,
      payment: data,
      paymentId: data.id,
      dashboardLink: data.dashboardLink,
    });
  } catch (error) {
    console.error('0xHypr Error creating Mercury payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    );
  }
} 