import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 },
      );
    }

    const result = await generateText({
      model: openai('gpt-5'),
      system: context,
      messages: messages.map(
        (m: { role: 'user' | 'assistant'; content: string }) => ({
          role: m.role,
          content: m.content,
        }),
      ),
      tools: {
        web_search: openai.tools.webSearch({
          searchContextSize: 'high',
        }),
      },
      temperature: 0.7,
    });

    return NextResponse.json({
      content: result.text,
      sources: result.sources || [],
    });
  } catch (error) {
    console.error('KYB Assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
