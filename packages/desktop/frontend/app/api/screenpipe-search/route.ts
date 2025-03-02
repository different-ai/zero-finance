import { createScreenPipe } from '@screenpipe/browser';
import { NextResponse } from 'next/server';
import { getApiKey } from '@/stores/api-key-store';

// Use node runtime instead of edge to work with Electron
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }

    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const pipe = createScreenPipe({
      apiKey,
    });

    const results = await pipe.searchText(query, {
      limit: 10,
      recentFirst: true,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in screenpipe search API:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}