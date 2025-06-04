'use server';
import type { UIMessage } from 'ai';

// Placeholder for generateTitleFromUserMessage server action
export async function generateTitleFromUserMessage(
  params: { message: UIMessage }
): Promise<string> {
  console.warn('[Placeholder] Using mock generateTitleFromUserMessage() in @/actions/chat-actions.ts');
  const content = params.message.parts.map(part => (part as any).text || '').join(' ').trim();
  return content.substring(0, 50) || 'New Chat';
} 