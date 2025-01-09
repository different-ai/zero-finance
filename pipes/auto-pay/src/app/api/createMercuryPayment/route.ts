import axios, { AxiosError } from 'axios';
import { getAutoPaySettings } from '@/lib/auto-pay-settings';
import { NextResponse } from 'next/server';
import type { MercuryPaymentInfo, MercuryPaymentResponse } from '@/types/mercury';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MERCURY_API_URL = 'https://api.mercury.com/api/v1';

export async function POST(request: Request) {
  try {
    const { paymentInfo } = await request.json() as { paymentInfo: MercuryPaymentInfo };
    const { mercuryApiKey, mercuryAccountId } = await getAutoPaySettings();

    if (!mercuryApiKey || !mercuryAccountId) {
      throw new Error('Missing Mercury API configuration');
    }

    console.log('0xHypr', 'Creating Mercury payment', paymentInfo);

    // Create the payment using Mercury's API
    const paymentResponse = await axios.post<MercuryPaymentResponse>(
      `${MERCURY_API_URL}/account/${mercuryAccountId}/payments`,
      paymentInfo,
      {
        headers: {
          Authorization: `Bearer ${mercuryApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('0xHypr', 'Mercury payment created:', paymentResponse.data);

    return NextResponse.json({
      success: true,
      payment: paymentResponse.data,
      paymentId: paymentResponse.data.id,
      mercuryUrl: paymentResponse.data.mercuryUrl,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      '0xHypr Error creating Mercury payment:',
      axiosError.response?.data || axiosError
    );
    return NextResponse.json(
      axiosError.response?.data || { message: axiosError.message },
      { status: axiosError.response?.status || 500 }
    );
  }
} 