import { NextResponse } from 'next/server';
import axios from 'axios';
import type { PaymentInfo } from '@/types/wise';
import {
  toMercuryPaymentRequest,
  type MercuryPaymentResponse,
} from '@/types/mercury';
import { pipe } from '@screenpipe/js';

const MERCURY_API_URL = 'https://api.mercury.com/api/v1';

// Mercury API error response type
interface MercuryErrorResponse {
  error: {
    message: string;
    type: string;
  };
}

export async function POST(request: Request) {
  console.log('Mercury transfer request received');
  try {
    const settings = await pipe.settings.getAll();
    const mercuryApiKey = settings?.customSettings?.['auto-pay']?.mercuryApiKey;
    const mercuryAccountId =
      settings?.customSettings?.['auto-pay']?.mercuryAccountId;
    console.log('mercuryApiKey', mercuryApiKey);
    console.log('mercuryAccountId', mercuryAccountId);

    if (!mercuryApiKey || !mercuryAccountId) {
      return NextResponse.json(
        { error: 'Mercury credentials not configured' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('body', body);
    const { paymentInfo } = body as { paymentInfo: PaymentInfo };
    const mercuryPayment = toMercuryPaymentRequest(paymentInfo);

    console.log('mercuryPayment', mercuryPayment);

    // Create payment request using Mercury's API
    const response = await axios.post<MercuryPaymentResponse>(
      `${MERCURY_API_URL}/accounts/${mercuryAccountId}/send-money-requests`,
      mercuryPayment,
      {
        headers: {
          Authorization: `Bearer ${mercuryApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      transfer: response.data,
      transferId: response.data.id,
    });
  } catch (error: any) {
    console.error(
      'Error creating Mercury transfer:',
      error.response?.data || error
    );

    // Handle Mercury API specific errors
    if (error.response?.data?.error) {
      const mercuryError = error.response.data as MercuryErrorResponse;
      return NextResponse.json(
        {
          error: mercuryError.error.message,
          type: mercuryError.error.type,
        },
        { status: error.response.status }
      );
    }

    // Handle network or other errors
    return NextResponse.json(
      {
        error: error.message,
        type: 'INTERNAL_ERROR',
      },
      { status: error.response?.status || 500 }
    );
  }
}
