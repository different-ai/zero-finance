import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage } from 'ai'; // Assuming StreamingTextResponse is not needed if toDataStreamResponse works

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = await streamText({
      model: openai('gpt-4.1'), // Switched to gpt-3.5-turbo for stability
      system: 'You are a helpful AI assistant.',
      messages: messages, // Pass all messages for context
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    // Catch errors from req.json() or other synchronous parts before streaming begins
    console.error('[Inbox Chat API General Error]', error);
    // Return a JSON response for errors occurring before or outside of streaming
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred on the server.',
        // Attempt to get a message, otherwise provide a generic string
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
