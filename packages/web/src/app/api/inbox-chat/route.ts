import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getUser } from '@/lib/auth';
import { db } from '@/db';
import { inboxCards, type InboxCardDB } from '@/db/schema';
import { desc, eq, and, inArray } from 'drizzle-orm';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

async function findRelevantContent(userId: string): Promise<string> {
  console.log(`[Inbox-Chat-API] Starting findRelevantContent for user: ${userId}`);
  try {
    console.log('[Inbox-Chat-API] Querying database for recent inbox cards...');
    const recentInboxCards = await db
      .select()
      .from(inboxCards)
      .where(eq(inboxCards.userId, userId))
      .orderBy(desc(inboxCards.createdAt))
      .limit(5);
    
    console.log(`[Inbox-Chat-API] Found ${recentInboxCards.length} cards.`);

    if (recentInboxCards.length === 0) {
      console.log('[Inbox-Chat-API] No receipts found, returning message.');
      return "No receipts found.";
    }
    
    const jsonResult = JSON.stringify(recentInboxCards);
    console.log('[Inbox-Chat-API] Returning JSON string of cards.');
    return jsonResult;

  } catch (error) {
    console.error('[Inbox-Chat-API] Error during findRelevantContent:', error);
    return JSON.stringify({ error: 'Failed to fetch from database.' });
  }
}

async function updateCardStatus(userId: string, cardIds: string[], newStatus: string): Promise<string> {
  console.log(`[Inbox-Chat-API] Updating status for cards: ${cardIds.join(', ')} to ${newStatus}`);
  try {
    const result = await db
      .update(inboxCards)
      .set({ 
        status: newStatus as any,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(inboxCards.userId, userId),
          inArray(inboxCards.cardId, cardIds)
        )
      );
    
    console.log(`[Inbox-Chat-API] Updated ${cardIds.length} cards successfully.`);
    return JSON.stringify({ success: true, updatedCount: cardIds.length, newStatus });
  } catch (error) {
    console.error('[Inbox-Chat-API] Error updating card status:', error);
    return JSON.stringify({ error: 'Failed to update card status.' });
  }
}

export async function POST(req: Request) {
  console.log('[Inbox-Chat-API] Received POST request.');
  const { messages } = await req.json();

  const session = await getUser();
  if (!session?.id) {
    console.error('[Inbox-Chat-API] Unauthorized: No session found.');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userId = session.id;
  console.log(`[Inbox-Chat-API] Authorized for user: ${userId}`);

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful AI assistant with access to tools for managing receipts and inbox items.

AVAILABLE TOOLS:
1. get_receipts - Fetches and displays recent receipts/inbox items
2. mark_cards - Updates the status of one or more inbox cards

CRITICAL INSTRUCTIONS:
1. When the user asks about receipts, invoices, or recent transactions, you MUST use the 'get_receipts' tool. 
2. When the user wants to take action on receipts (mark as ok, dismiss, execute), use the 'mark_cards' tool.
3. DO NOT list receipts or invoices manually. ALWAYS use the tools.
4. The get_receipts tool will return structured data that the UI will render as interactive cards.
5. After calling a tool, acknowledge what was done.

Examples:
- User: "show me my receipts" → Call get_receipts tool
- User: "mark them all as ok" → Call mark_cards tool with status "executed"
- User: "dismiss the cloudflare receipt" → Call mark_cards tool with specific cardId and status "dismissed"`,
    messages,
    tools: {
      format_receipts: tool({
        description: 'Format the receipts into a readable format. Use this when the user asks about receipts, invoices, or recent transactions. Right after doing get receipts aapture it and pass it to this tool.',
        parameters: z.object({
          receipts: z.array(z.string()).describe("The receipts to format."),
        }),
        execute: async ({ receipts }) => {
            console.log(`[Inbox-Chat-API] Executing format_receipts tool with receipts: ${receipts.join(', ')}`);
            return JSON.stringify({ success: true, formattedReceipts: receipts });
        },
      }),
      get_receipts: tool({
        description: 'Get a list of recent receipts from the user\'s inbox. Use this whenever the user asks about receipts, invoices, or recent transactions.',
        parameters: z.object({
          query: z.string().describe("The user's query to find relevant receipts."),
        }),
        execute: async ({ query }) => {
            console.log(`[Inbox-Chat-API] Executing get_receipts tool with query: "${query}"`);
            const content = await findRelevantContent(userId);
            console.log('[Inbox-Chat-API] Finished executing tool.');
            return content;
        },
      }),
      mark_cards: tool({
        description: 'Update the status of inbox cards. Use this when the user wants to mark receipts as ok/executed, dismiss them, or take other actions.',
        parameters: z.object({
          cardIds: z.array(z.string()).describe("Array of card IDs to update. Use 'all' to update all recently shown cards."),
          status: z.enum(['executed', 'dismissed', 'pending']).describe("New status for the cards"),
        }),
        execute: async ({ cardIds, status }) => {
            console.log(`[Inbox-Chat-API] Executing mark_cards tool for cards: ${cardIds.join(', ')}`);
            
            // If "all" is passed, get recent cards first
            let actualCardIds = cardIds;
            if (cardIds.length === 1 && cardIds[0] === 'all') {
              const recentCardsStr = await findRelevantContent(userId);
              try {
                const recentCards = JSON.parse(recentCardsStr);
                if (Array.isArray(recentCards)) {
                  actualCardIds = recentCards.map(card => card.cardId);
                }
              } catch (e) {
                return JSON.stringify({ error: 'Failed to get recent cards for bulk update.' });
              }
            }
            
            const result = await updateCardStatus(userId, actualCardIds, status);
            console.log('[Inbox-Chat-API] Finished executing mark_cards tool.');
            return result;
        },
      }),
    },
    onToolCall: async ({ toolCall }) => {
      console.log(`[Inbox-Chat-API] Tool called: ${toolCall.toolName}`);
    },
  });

  return result.toDataStreamResponse();
}
