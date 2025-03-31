import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '../../../(auth)/auth';
import { systemPrompt } from '../../../../lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '../../../../lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '../../../../lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '../../../../lib/ai/tools/create-document';
import { updateDocument } from '../../../../lib/ai/tools/update-document';
import { requestSuggestions } from '../../../../lib/ai/tools/request-suggestions';
import { isProductionEnvironment } from '../../../../lib/constants';
import { myProvider } from '../../../../lib/ai/providers';
import { yieldSearch } from '../../../../lib/ai/tools/yield-search';
import { getTokenPrice } from '../../../../lib/ai/tools/get-token-price';
import { getSwapEstimate } from '../../../../lib/ai/tools/get-swap-estimate';
import { planYieldResearch } from '../../../../lib/ai/tools/plan-yield-research';
import { executeYieldResearch } from '../../../../lib/ai/tools/execute-yield-research';
import { getProtocolTvl } from '../../../../lib/ai/tools/get-protocol-tvl';
import { getChainTvl } from '../../../../lib/ai/tools/get-chain-tvl';
import { getProtocolFees } from '../../../../lib/ai/tools/get-protocol-fees';
import { deepSearch } from '../../../../lib/ai/tools/deep-search';
import { getBridgeQuote } from '../../../../lib/ai/tools/getBridgeQuote';
import { getTokenInfo } from '../../../../lib/ai/tools/getTokenInfo';
import { openai } from '@ai-sdk/openai';

// Increase max duration to accommodate longer research tasks with multiple API calls
export const maxDuration = 120;

export async function POST(request: Request) {
  console.log('=== API ROUTE CALLED: POST /api/chat ===');
  console.log('POST request received');
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    console.log('before auth');
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('before getMostRecentUserMessage');
    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    console.log('before getChatById');
    const chat = await getChatById({ id });

    if (!chat) {
      console.log('before generateTitleFromUserMessage');
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      console.log('before saveChat');
      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    console.log('before saveMessages');
    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    // Check if this is a research request
    const isResearchRequest = checkIfResearchRequest(
      userMessage.parts.join(' '),
    );
    const maxToolSteps = isResearchRequest ? 15 : 5; // Allow more steps for research planning & execution

    console.log(
      'before createDataStreamResponse',
      isResearchRequest ? '(Research mode active)' : '',
    );
    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({
            selectedChatModel,
            isResearchRequest,
          }),
          messages,
          maxSteps: maxToolSteps,
          // Enable tool call streaming for better UX

          toolCallStreaming: true,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? [
                  'planYieldResearch',
                  'executeYieldResearch',
                  'yieldSearch',
                  'getTokenPrice',
                  'getSwapEstimate',
                  'getProtocolTvl',
                  'getChainTvl',
                  'getProtocolFees',
                  'getBridgeQuote',
                  'getTokenInfo',
                  'deepSearch',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ]
              : [
                  'web_search_preview',
                  'planYieldResearch',
                  'executeYieldResearch',
                  'yieldSearch',
                  'getTokenPrice',
                  'getSwapEstimate',
                  'getProtocolTvl',
                  'getChainTvl',
                  'getProtocolFees',
                  'getBridgeQuote',
                  'getTokenInfo',
                  'deepSearch',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            web_search_preview: openai.tools.webSearchPreview({
              // optional configuration:
              searchContextSize: 'high',
              userLocation: {
                type: 'approximate',
                city: 'San Francisco',
                region: 'California',
              },
            }),
            planYieldResearch,
            executeYieldResearch,
            yieldSearch,
            getTokenPrice,
            getSwapEstimate,
            getProtocolTvl,
            getChainTvl,
            getProtocolFees,
            getBridgeQuote,
            getTokenInfo,
            deepSearch,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            console.log('onFinish');
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: isResearchRequest
              ? 'stream-text-research-orchestrated'
              : 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('Error in stream processing:', error);
        return 'Oops, an error occurred! Please try again.';
      },
    });
  } catch (error) {
    console.log('error', error);
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

// Helper function to identify research requests
function checkIfResearchRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Keywords that indicate this might be a research request
  const researchKeywords = [
    'yield',
    'apy',
    'interest',
    'staking',
    'farming',
    'invest',
    'return',
    'profits',
    'best place',
    'where should i',
    'compare',
    'analysis',
    'research',
    'opportunity',
    'opportunities',
    'tvl',
    'fees',
    'revenue',
    'protocol',
    'defi',
    'locked value',
    'earnings',
    'generating',
    'bridge',
    'bridging',
    'cross-chain',
    'move tokens',
    'transfer',
    'L2',
    'layer 2',
    'gas cost',
  ];

  return researchKeywords.some((keyword) => lowerMessage.includes(keyword));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
