import { NextResponse } from 'next/server';

const DESKTOP_API_URL = process.env.DESKTOP_API_URL || 'http://localhost:3030';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const response = await fetch(`${DESKTOP_API_URL}/ephemeral-key?token=${token}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve ephemeral key from desktop app');
    }

    const data = await response.json();
    return NextResponse.json({ privateKey: data.privateKey });
  } catch (error) {
    console.error('Error retrieving ephemeral key:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve ephemeral key' },
      { status: 500 }
    );
  }
} 