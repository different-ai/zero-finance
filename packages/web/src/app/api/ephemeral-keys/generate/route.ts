import { NextResponse } from 'next/server';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';

export async function POST() {
  try {
    const { token, publicKey } = await ephemeralKeyService.generateKey();
    console.log('0xHypr', 'Ephemeral key generated:', { token, publicKey });
    
    return NextResponse.json({
      success: true,
      token,
      publicKey,
    });
  } catch (error) {
    console.error('0xHypr', 'Failed to generate ephemeral key:', error);
    return NextResponse.json(
      { error: 'Failed to generate ephemeral key' },
      { status: 500 }
    );
  }
} 