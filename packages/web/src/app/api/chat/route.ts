import {
  UIMessage,
  smoothStream,
  streamText,
  tool,
  type ToolExecutionOptions,
} from 'ai'; // Cleaned up imports
import { auth } from '@/lib/auth'; // Placeholder
import { systemPrompt } from '@/lib/ai/prompts'; // Placeholder
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  getMessageCountByUserId,
} from '@/lib/db/chat-queries';
import {
  generateUUID, 
  getMostRecentUserMessage, 
  getTrailingMessageId, 
} from '@/lib/utils'; // Placeholder
import { generateTitleFromUserMessage } from '@/actions/chat-actions';
import { z } from 'zod';
const createOrUpdateInvoiceToolSchema = z.object({
  invoiceId: z.string().optional().describe("Existing invoice ID for updates"),
  buyerEmail: z.string().describe("Email of the buyer"),
  sellerEmail: z.string().describe("Email of the seller (usually current user)"),
  items: z.array(z.object({
    name: z.string().describe("Item name or description"),
    quantity: z.number().describe("Item quantity"),
    unitPrice: z.number().describe("Price per unit"),
  })).describe("Array of line items"),
  currency: z.string().default('USD').describe("Currency code, e.g., USD, EUR"),
});

type CreateOrUpdateInvoiceArgs = Omit<z.infer<typeof createOrUpdateInvoiceToolSchema>, 'currency'> & {
  currency?: string; 
};

import { isProductionEnvironment } from '@/lib/constants'; // Placeholder
import { myProvider } from '@/lib/ai/providers'; // Placeholder
import { openai } from '@ai-sdk/openai';

// Remove custom uiMessagesToModelMessages if convertToModelMessages handles it
// function uiMessagesToModelMessages(uiMessages: UIMessage[]): ModelMessage[] { ... }

export const maxDuration = 120;

export async function POST(request: Request) {
  console.log('=== WEB API ROUTE CALLED: POST /api/chat ===');
  try {
    const { id, messages: uiMessages, selectedChatModel }: {
      id: string;
      messages: Array<UIMessage>; // Received from client
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();
    if (!session || !session.user || !session.user.id) return new Response('Unauthorized', { status: 401 });
    const userId = session.user.id;

    const userMessage = getMostRecentUserMessage(uiMessages);
    if (!userMessage) return new Response('No user message found', { status: 400 });

    let chat = await getChatById({ id });
    if (!chat) {
      const title = await generateTitleFromUserMessage({ message: userMessage });
      await saveChat({ id, userId, title });
    }

    // Save the new user message (as UIMessage structure, parts contain attachments)
    await saveMessages({
      messages: [{
        chatId: id,
        id: userMessage.id,
        role: 'user',
        parts: userMessage.parts as any, // UIMessage parts
        // attachments: userMessage.attachments ?? [], // Use .parts for attachments as per UIMessage structure
        createdAt: new Date(),
      }],
    });

    const tools = {
      createOrUpdateInvoice: tool({
        description: 'Creates a new invoice or updates an existing one.',
        parameters: createOrUpdateInvoiceToolSchema,
        execute: async (args: CreateOrUpdateInvoiceArgs, options: ToolExecutionOptions) => { 
          const validatedArgs = createOrUpdateInvoiceToolSchema.parse(args);
          console.log('[Chat Tool] createOrUpdateInvoice called with:', validatedArgs);
          return { success: true, invoiceId: validatedArgs.invoiceId || generateUUID(), status: validatedArgs.invoiceId ? 'updated' : 'created', details: validatedArgs };
        },
      }),
      webSearch: openai.tools.webSearchPreview(),
    };
    
    const activeTools = ['createOrUpdateInvoice', 'webSearch'];
    
    // AI SDK 5: Use UIMessages directly 
    // In v5, streamText can accept UIMessage[] directly or we need to convert appropriately
    const streamTextMessages = uiMessages;

    const result = await streamText({
      model: myProvider.languageModel(selectedChatModel),
      system: systemPrompt({ selectedChatModel, isResearchRequest: false }),
      messages: streamTextMessages, // Pass the direct result of convertToModelMessages
      toolCallStreaming: true,
      experimental_activeTools: activeTools as any,
      experimental_transform: smoothStream({ chunking: 'word' }), 
      tools: tools,
      onFinish: async ({ response }) => {
        // response.messages are CoreMessage[] in current version
        if (session.user?.id) {
          try {
            const messagesToSave = response.messages
              .filter(msg => msg.role === 'assistant' || msg.role === 'tool')
              .map(modelMsg => {
                let messageId: string;
                let toolNameVal: string | undefined = undefined;
                let toolCallIdVal: string | undefined = undefined;
                let toolResultJson: any = undefined;
                let dbParts: any; // Parts to store in DB

                if (modelMsg.role === 'assistant') {
                  messageId = generateUUID(); 
                  // ModelMessage content for assistant is a string
                  dbParts = [{ type: 'text', value: modelMsg.content as string }];
                  // If assistant message has tool_calls, they are in modelMsg.toolCalls
                  // and would need to be mapped to dbParts if schema supports it.
                } else { // role === 'tool'
                  // ModelMessage content for tool is ToolContentPart[]
                  const toolContentParts = modelMsg.content as { type: 'tool-result'; toolCallId: string; toolName: string; result: any }[];
                  const firstToolContent = toolContentParts[0];
                  messageId = firstToolContent?.toolCallId || generateUUID(); 
                  toolCallIdVal = firstToolContent?.toolCallId;
                  toolNameVal = firstToolContent?.toolName;
                  toolResultJson = firstToolContent?.result;
                  dbParts = toolContentParts; // Store the array of tool results in parts
                }
                return {
                  id: messageId,
                  chatId: id,
                  role: modelMsg.role as 'assistant' | 'tool',
                  parts: dbParts, 
                  toolName: toolNameVal,
                  toolCallId: toolCallIdVal,
                  toolResult: toolResultJson, // This could be redundant if parts stores the full tool content
                  createdAt: new Date(),
                };
              });
            if (messagesToSave.length > 0) await saveMessages({ messages: messagesToSave as any });
          } catch (error) { console.error('[Chat API] Error saving messages:', error); }
        }
      },
      experimental_telemetry: { isEnabled: isProductionEnvironment, functionId: 'stream-text-web-invoice-chat' },
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('[Chat API] POST request failed:', error);
    return new Response('An error occurred', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  console.log('=== WEB API ROUTE CALLED: DELETE /api/chat ===');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return new Response('Chat ID is required', { status: 400 });
    const session = await auth();
    if (!session || !session.user || !session.user.id) return new Response('Unauthorized', { status: 401 });
    const userId = session.user.id;
    const chat = await getChatById({ id });
    if (!chat || chat.userId !== userId) return new Response('Chat not found or unauthorized', { status: 404 });
    await deleteChatById({ id, userId });
    console.log(`[Chat API] Deleted chat ID: ${id} for user: ${userId}`);
    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    console.error('[Chat API] DELETE request failed:', error);
    return new Response('Failed to delete chat', { status: 500 });
  }
}

// TODO: GET handler 