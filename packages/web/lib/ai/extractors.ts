import { generateObject } from 'ai';
import { openai } from '@/lib/ai/models';
import { InvoicesAndAdminSchema } from '@/lib/schemas/invoicesAdminSchema';

export async function extractInvoicesAndAdmin(ocrText: string) {
  const prompt = `
You are an AI specialized in financial and administrative data extraction.
From the following OCR text, extract any invoice details (invoice number, vendor, amount, invoice date, and due date)
and any administrative obligations (such as payment reminders, tax deadlines, or other administrative tasks).
Output a JSON object matching this schema:
${InvoicesAndAdminSchema.toString()}

If no relevant data is found, output: { "invoices": [], "adminObligations": [] }.

OCR text:
"""${ocrText}"""
  `;

  const result = await generateObject({
    model: openai('o3-mini'),
    prompt,
    schema: InvoicesAndAdminSchema,
    providerOptions: { openai: { reasoningEffort: 'low' } },
  });
  return result;
}
