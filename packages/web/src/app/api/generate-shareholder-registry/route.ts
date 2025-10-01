import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
export const maxDuration = 30;

const SHAREHOLDER_REGISTRY_PROMPT = `Based on the conversation, extract shareholder/member information and generate a formatted shareholder registry document.

Include:
- Company name and entity type (C-Corp or LLC)
- Table with columns: Name, Email, Role, Security/Units, Ownership %, Additional details
- Footer: "Informational registry snapshot for KYB. Not a legal certificate."
- Date generated

Format as a clean, professional document suitable for KYB submission.
If information is missing, note "Not provided" or use reasonable placeholders.`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 },
      );
    }

    const conversationContext = messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join('\n');

    const result = await generateText({
      model: openai('gpt-4o'),
      system: SHAREHOLDER_REGISTRY_PROMPT,
      prompt: `Conversation:\n${conversationContext}\n\nGenerate a shareholder registry document in HTML format.`,
      temperature: 0.3,
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #101010; font-size: 24px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f7f7f2; font-weight: 600; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; font-style: italic; }
    .date { margin-bottom: 20px; color: #666; }
  </style>
</head>
<body>
  ${result.text}
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition':
          'attachment; filename="shareholder-registry.html"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 },
    );
  }
}
