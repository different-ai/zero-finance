import { NextResponse } from 'next/server';
import axios from 'axios';
import { pipe } from '@screenpipe/js';

const MERCURY_API_URL = 'https://backend.mercury.com/api/v1';

interface CreateRecipientRequest {
  name: string;
  email: string;
  routingNumber: string;
  accountNumber: string;
  accountType: 'businessChecking' | 'personalChecking';
  address: {
    country: string;
    postalCode: string;
    region: string;
    city: string;
    address1: string;
  };
}

export async function POST(request: Request) {
  try {
    const settings = await pipe.settings.getAll();
    const mercuryApiKey = settings?.customSettings?.['auto-pay']?.mercuryApiKey;

    if (!mercuryApiKey) {
      return NextResponse.json(
        { error: 'Mercury API key not configured' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, routingNumber, accountNumber, accountType, address } = body as CreateRecipientRequest;

    const recipientData = {
      emails: [email],
      name,
      paymentMethod: 'electronic',
      electronicRoutingInfo: {
        address,
        electronicAccountType: accountType,
        routingNumber,
        accountNumber,
      },
    };

    const response = await axios.post(
      `${MERCURY_API_URL}/recipients`,
      recipientData,
      {
        headers: {
          Authorization: `Bearer ${mercuryApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      recipient: response.data,
      recipientId: response.data.id,
    });
  } catch (error: any) {
    console.error('Error creating Mercury recipient:', error.response?.data || error);

    if (error.response?.data?.error) {
      return NextResponse.json(
        {
          error: error.response.data.error.message,
          type: error.response.data.error.type,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      {
        error: error.message,
        type: 'INTERNAL_ERROR',
      },
      { status: error.response?.status || 500 }
    );
  }
} 