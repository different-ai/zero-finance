import { useState } from 'react';
import { useAgentStepsStore } from '@/stores/agent-steps-store';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '@/stores/api-key-store';
import { markdownSearch } from './tools/markdown-search';

interface MarkdownResult {
  success: boolean;
  data?: {
    results: Array<{
      type: 'markdown';
      content: {
        text: string;
        filePath: string;
        fileName: string;
        lineNumber?: number;
        matchContext?: string;
        metadata?: {
          title?: string;
          tags?: string[];
          created?: string;
          updated?: string;
          [key: string]: any;
        };
      };
    }>;
  };
  error?: string;
}

export function useAsyncMarkdown(recognizedItemId: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MarkdownResult | null>(null);
  const addStep = useAgentStepsStore((state) => state.addStep);

  const processMarkdown = async (query: string) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const openaiApiKey = getApiKey();
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not found');
      }

      const openai = createOpenAI({ apiKey: openaiApiKey });

      // Add initial step
      addStep(recognizedItemId, {
        humanAction: 'Starting markdown search',
        finishReason: 'complete',
      });

      const systemInstructions = `
You are a markdown search assistant. Your task is to:
1) Search through markdown files based on the user's query
2) Use semantic search to find relevant content
3) Start with a broad search and then refine based on initial results
4) Look for both exact matches and semantically related content
5) Consider metadata and tags when available
6) Return the most relevant results first

The search should be thorough but efficient:
- Start with high-confidence matches
- Then expand to related content
- Use fuzzy matching for broader results
- Consider file metadata and context

Format results to show:
- The most relevant excerpt
- File location and name
- Any relevant metadata or tags
`;

      const { text, toolCalls, toolResults } = await generateText({
        model: openai('gpt-4o'),
        maxSteps: 5,
        toolChoice: 'auto',
        tools: {
          markdownSearch,
        },
        messages: [
          {
            role: 'system',
            content: systemInstructions,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        onStepFinish({ text, toolCalls, toolResults, finishReason }) {
          addStep(recognizedItemId, {
            text,
            toolCalls,
            toolResults,
            finishReason,
            humanAction: 'Searching markdown files',
          });
        },
      });

      // Process results
      const searchResults = toolResults?.flatMap((result) => {
        if ('result' in result && Array.isArray(result.result)) {
          return result.result;
        }
        return [];
      });

      setResult({
        success: true,
        data: {
          results: searchResults || [],
        },
      });

      // Add final step
      addStep(recognizedItemId, {
        text: text || '',
        humanResult: 'Search complete',
        finishReason: 'complete',
      });
    } catch (error) {
      console.error('0xHypr', 'Error processing markdown:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Add error step
      addStep(recognizedItemId, {
        text: error instanceof Error ? error.message : 'Unknown error',
        finishReason: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    result,
    processMarkdown,
  };
} 