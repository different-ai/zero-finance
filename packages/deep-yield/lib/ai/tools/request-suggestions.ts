import { z } from 'zod';
import { Session } from 'next-auth';
import { DataStreamWriter, tool, generateText } from 'ai';
import { getDocumentById, saveSuggestions } from '../../db/queries';
import { Suggestion } from '../../db/schema';
import { generateUUID } from '../../utils';
import { myProvider } from '../providers';

interface RequestSuggestionsProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const requestSuggestions = ({
  session,
  dataStream,
}: RequestSuggestionsProps) =>
  tool({
    description: 'Request suggestions for a document',
    parameters: z.object({
      documentId: z
        .string()
        .describe('The ID of the document to request edits'),
    }),
    execute: async ({ documentId }) => {
      const document = await getDocumentById({ id: documentId });

      if (!document || !document.content) {
        return {
          error: 'Document not found',
        };
      }

      const suggestions: Array<
        Omit<Suggestion, 'userId' | 'createdAt' | 'documentCreatedAt'>
      > = [];

      const { textStream } = await generateText({
        model: myProvider.languageModel('artifact-model'),
        system:
          'You are a helpful writing assistant. Given a piece of writing, please offer suggestions to improve it. Return a JSON array of objects, where each object has the keys "originalSentence", "suggestedSentence", and "description". Ensure the edits contain full sentences. Provide a maximum of 5 suggestions. Example: [{"originalSentence": "...", "suggestedSentence": "...", "description": "..."}]',
        prompt: document.content,
      });

      let accumulatedJson = '';
      for await (const textPart of textStream) {
        accumulatedJson += textPart;
      }
      
      try {
        const parsedSuggestions = JSON.parse(accumulatedJson) as Array<{
          originalSentence: string;
          suggestedSentence: string;
          description: string;
        }>;

        for (const element of parsedSuggestions) {
          const suggestion = {
            originalText: element.originalSentence,
            suggestedText: element.suggestedSentence,
            description: element.description,
            id: generateUUID(),
            documentId: documentId,
            isResolved: false,
          };

          dataStream.writeData({
            type: 'suggestion',
            content: suggestion,
          });

          suggestions.push(suggestion);
        }
      } catch (e) {
        console.error("Failed to parse suggestions JSON from stream:", e);
        return {
          error: 'Failed to process suggestions from AI.',
        };
      }

      if (session.user?.id) {
        const userId = session.user.id;

        await saveSuggestions({
          suggestions: suggestions.map((suggestion) => ({
            ...suggestion,
            userId,
            createdAt: new Date(),
            documentCreatedAt: document.createdAt,
          })),
        });
      }

      return {
        id: documentId,
        title: document.title,
        kind: document.kind,
        message: 'Suggestions have been added to the document',
      };
    },
  });
