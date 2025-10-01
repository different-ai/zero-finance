import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const result = streamText({
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

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('KYB Assistant error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
