import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

const SHAREHOLDER_REGISTRY_PROMPT = `You are generating a professional shareholder registry document for KYB (Know Your Business) verification.

Based on the conversation, extract shareholder/member information and create a well-formatted HTML document.

IMPORTANT INSTRUCTIONS:
1. Extract all relevant information from the conversation about shareholders, members, ownership, etc.
2. If the user hasn't provided specific shareholder details, create a template with placeholder fields that they can fill in
3. Structure the document professionally with:
   - Company name and entity type at the top
   - Current date
   - A clean table with proper columns
   - A footer stating this is informational for KYB purposes

For C-Corp, use columns: Shareholder Name, Email, Role, Security Type, Shares/%, Fully Diluted %, Vesting, Notes
For LLC, use columns: Member Name, Email, Role, Membership Units/%, Capital Contribution, Voting Rights, Profit/Loss Allocation %

Format everything inside proper HTML table tags with clear headers. Use professional formatting.
Include a footer: "Informational registry snapshot for KYB verification. Not a legal certificate. Generated on [today's date]"

Return ONLY the content for inside the <body> tag - no DOCTYPE, no <html>, no <head>, just the content.`;

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
      .join('\n\n');

    const result = await generateText({
      model: openai('gpt-5'),
      system: SHAREHOLDER_REGISTRY_PROMPT,
      prompt: `Based on this conversation, generate a shareholder/member registry document:\n\n${conversationContext}`,
      temperature: 0.3,
    });

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shareholder Registry</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      padding: 60px 40px;
      max-width: 900px;
      margin: 0 auto;
      line-height: 1.6;
      color: #101010;
      background: white;
    }
    h1 { 
      color: #101010;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    h2 {
      color: #101010;
      font-size: 18px;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .date { 
      color: #666;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .company-info {
      margin-bottom: 24px;
      padding: 16px;
      background: #f7f7f2;
      border-radius: 8px;
    }
    .company-info p {
      margin: 4px 0;
      font-size: 14px;
    }
    table { 
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 13px;
    }
    th, td { 
      border: 1px solid #e0e0e0;
      padding: 12px;
      text-align: left;
      vertical-align: top;
    }
    th { 
      background-color: #f7f7f2;
      font-weight: 600;
      color: #101010;
    }
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    .footer { 
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      font-style: italic;
    }
    .placeholder {
      color: #999;
      font-style: italic;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>Shareholder Registry</h1>
  <p class="date">Generated: ${today}</p>
  
  ${result.text}
  
  <div class="footer">
    <p>Generated on ${today} using Zero Finance KYB Assistant.</p>
  </div>
</body>
</html>`;

    return NextResponse.json({
      html: html,
      success: true,
    });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 },
    );
  }
}
