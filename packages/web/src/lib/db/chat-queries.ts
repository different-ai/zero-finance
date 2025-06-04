import { db } from '@/db';
import { chats, chatMessages, type NewChatDB, type NewChatMessageDB } from '@/db/schema';
import { eq, desc, count, and, gte, SQL } from 'drizzle-orm';
import type { UIMessage } from 'ai';
import { differenceInHours } from 'date-fns';

// --- Chat Session Queries ---

interface SaveChatParams {
  id: string;
  userId: string;
  title: string;
  visibility?: 'private' | 'public' | 'unlisted';
  sharePath?: string;
}

export async function saveChat(params: SaveChatParams): Promise<void> {
  await db.insert(chats).values({
    id: params.id,
    userId: params.userId,
    title: params.title,
    visibility: params.visibility || 'private',
    sharePath: params.sharePath,
    updatedAt: new Date(), // Ensure updatedAt is set on creation too
  }).onConflictDoUpdate({
    target: chats.id,
    set: {
      title: params.title,
      visibility: params.visibility || 'private',
      sharePath: params.sharePath,
      updatedAt: new Date(),
    }
  });
}

interface GetChatByIdParams {
  id: string;
}

export async function getChatById(params: GetChatByIdParams) {
  const result = await db.select().from(chats).where(eq(chats.id, params.id)).limit(1);
  return result[0] || null;
}

interface DeleteChatByIdParams {
  id: string;
  userId: string; // To ensure user can only delete their own chats
}

export async function deleteChatById(params: DeleteChatByIdParams): Promise<void> {
  // First, delete associated messages
  await db.delete(chatMessages).where(eq(chatMessages.chatId, params.id));
  // Then, delete the chat itself, ensuring the user owns it
  await db.delete(chats).where(and(eq(chats.id, params.id), eq(chats.userId, params.userId)));
}

// --- Chat Message Queries ---

interface SaveMessagesParams {
  messages: Array<{
    id: string;
    chatId: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    parts: UIMessage['parts'];
    content?: string; // Optional, as parts is preferred
    attachments?: any[]; // JSONB for attachments
    toolName?: string;
    toolCallId?: string;
    toolResult?: any; // JSONB for tool results
    createdAt?: Date;
  }>;
}

export async function saveMessages(params: SaveMessagesParams): Promise<void> {
  const messagesToInsert: NewChatMessageDB[] = params.messages.map(msg => ({
    id: msg.id,
    chatId: msg.chatId,
    role: msg.role,
    content: msg.content || null, // Handle optional content
    parts: msg.parts, 
    attachments: msg.attachments || null,
    toolName: msg.toolName || null,
    toolCallId: msg.toolCallId || null,
    toolResult: msg.toolResult || null,
    createdAt: msg.createdAt || new Date(),
  }));

  if (messagesToInsert.length > 0) {
    await db.insert(chatMessages).values(messagesToInsert);
  }
}

interface GetMessagesByChatIdParams {
  id: string;
  limit?: number;
}

export async function getMessagesByChatId(params: GetMessagesByChatIdParams) {
  return db.select()
    .from(chatMessages)
    .where(eq(chatMessages.chatId, params.id))
    .orderBy(desc(chatMessages.createdAt))
    .limit(params.limit || 100); // Default limit to 100, adjust as needed
}

interface GetMessageCountByUserIdParams {
  id: string;
  differenceInHours?: number; // Optional: to count messages within a recent time window
}

export async function getMessageCountByUserId(params: GetMessageCountByUserIdParams): Promise<number> {
  const whereConditions: SQL[] = [
    eq(chats.userId, params.id),
    eq(chatMessages.role, 'user') // Typically count user messages for rate limiting
  ];

  if (params.differenceInHours) {
    const sinceDate = new Date(new Date().getTime() - params.differenceInHours * 60 * 60 * 1000);
    whereConditions.push(gte(chatMessages.createdAt, sinceDate));
  }
  
  const result = await db.select({ value: count() }).from(chatMessages)
    .innerJoin(chats, eq(chatMessages.chatId, chats.id))
    .where(and(...whereConditions)); // Fixed: Apply all conditions once
    
  return result[0]?.value || 0;
}

// TODO: Implement functions for chatStreams if resumable streams are kept:
// export async function createStreamId({ streamId, chatId }: { streamId: string; chatId: string }): Promise<void> { ... }
// export async function getStreamIdsByChatId({ chatId }: { chatId: string }): Promise<string[]> { ... } 