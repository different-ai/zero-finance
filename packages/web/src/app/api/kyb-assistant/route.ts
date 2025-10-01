import { NextRequest, NextResponse } from 'next/server';
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

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
        searchDelaware: tool({
          description:
            'Search for Delaware business entity information, file numbers, and incorporation details',
          inputSchema: z.object({
            query: z
              .string()
              .describe('Search query for Delaware business records'),
          }),
          execute: async ({ query }: { query: string }) => {
            return {
              info: `For Delaware entity searches, users can visit: https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx. The File Number is found on the Certificate of Incorporation (top-left stamp) or Good Standing certificate.`,
              tip: `If using Stripe Atlas or Clerky, the File Number is in the incorporation documents package. For First Base, check the Delaware formation documents section.`,
            };
          },
        }),
        getEINInfo: tool({
          description:
            'Get information about EIN (Employer Identification Number) and how to find or retrieve it',
          inputSchema: z.object({
            situation: z
              .string()
              .describe('User situation: lost EIN, first time, etc'),
          }),
          execute: async ({ situation }: { situation: string }) => {
            return {
              info: `EIN (Employer Identification Number) is a 9-digit number from the IRS. Format: 12-3456789 or 123456789.`,
              howToFind: `Check: IRS CP-575 letter, SS-4 confirmation, prior tax returns, payroll systems, or bank account documents.`,
              ifLost: `If lost, you can request an IRS 147C letter by calling the IRS Business & Specialty Tax Line at 800-829-4933 or check your business tax transcripts at irs.gov.`,
              incorporationServices: `Stripe Atlas: Check your formation documents. Clerky: In your account dashboard. First Base: Documents section under Tax ID.`,
            };
          },
        }),
        findDocument: tool({
          description:
            'Help users locate specific KYB documents based on their incorporation service or situation',
          inputSchema: z.object({
            documentType: z.enum([
              'certificate',
              'goodstanding',
              'proofofaddress',
              'ein',
            ]),
            incorporationService: z
              .string()
              .optional()
              .describe(
                'Service used: Clerky, Carta, Stripe Atlas, First Base, etc',
              ),
          }),
          execute: async ({
            documentType,
            incorporationService,
          }: {
            documentType: string;
            incorporationService?: string;
          }) => {
            const guides: Record<string, Record<string, string>> = {
              certificate: {
                'stripe-atlas':
                  'Check your Stripe Atlas dashboard > Documents section > Certificate of Incorporation (with Delaware stamp)',
                clerky:
                  'Login to Clerky > Your company > Documents > Delaware Certificate of Incorporation',
                'first-base':
                  'First Base dashboard > Documents > Formation Documents > Certificate of Incorporation',
                carta:
                  'Carta typically handles cap tables, not incorporation docs. Check with your lawyer or incorporation service.',
                default:
                  'Contact your registered agent (often Harvard Business Services or Corporation Service Company) or visit Delaware Division of Corporations website.',
              },
              goodstanding: {
                default:
                  'Request from Delaware Division of Corporations at corp.delaware.gov or through your registered agent. Costs ~$50 and takes 24-48 hours for expedited service.',
              },
              proofofaddress: {
                default:
                  'Acceptable documents: Business utility bill, commercial lease agreement, bank statement, or business insurance policy - all must show company name and address, dated within last 3 months.',
              },
              ein: {
                default:
                  'IRS CP-575 letter (original EIN confirmation). If lost, call IRS at 800-829-4933 to request 147C letter or check irs.gov tax transcripts.',
              },
            };

            const serviceKey =
              incorporationService?.toLowerCase().replace(/\s+/g, '-') ||
              'default';
            return {
              guidance:
                guides[documentType][serviceKey] ||
                guides[documentType].default,
              alternative:
                documentType === 'certificate'
                  ? 'You can also order a certified copy from Delaware for $50 (expedited) at corp.delaware.gov'
                  : undefined,
            };
          },
        }),
      },
      temperature: 0.7,
    });

    return NextResponse.json({
      content: result.text,
      sources: [],
      toolResults:
        result.toolResults?.map((tr: any) => ({
          tool: tr.toolName,
          result: tr.result,
        })) || [],
    });
  } catch (error) {
    console.error('KYB Assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
