import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// For Day 1, a very simple confidence heuristic based on keywords.
// For Day 2, this will involve more sophisticated o4-mini prompting.
export async function getSimpleEmailConfidence(
  subject?: string | null,
  snippet?: string | null,
  attachmentCount?: number,
): Promise<number> {
  let score = 30; // Base score
  const keywords = ['invoice', 'receipt', 'bill', 'payment', 'due', 'statement'];

  const textToSearch = `${subject?.toLowerCase() || ''} ${snippet?.toLowerCase() || ''}`;

  for (const keyword of keywords) {
    if (textToSearch.includes(keyword)) {
      score += 10;
    }
  }

  if (attachmentCount && attachmentCount > 0) {
    score += 20;
  }

  // Simulate some variability like a real model would have
  score += Math.floor(Math.random() * 10) - 5;

  return Math.max(0, Math.min(100, score)); // Cap between 0-100
} 