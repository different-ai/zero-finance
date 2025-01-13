import { NextResponse } from 'next/server';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const privateKey = ephemeralKeyService.getPrivateKey(token);
    if (!privateKey) {
      return NextResponse.json(
        { error: 'Key not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({ privateKey });
  } catch (error) {
    console.error('Error retrieving ephemeral key:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve ephemeral key' },
      { status: 500 }
    );
  }
} 