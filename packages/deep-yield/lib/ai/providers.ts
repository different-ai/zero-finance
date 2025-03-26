import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { openai } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai.responses('gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai.responses('o3-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai.responses('gpt-4o-mini'),
        'artifact-model': openai.responses('o3-mini'),
      },
      imageModels: {
        // 'small-model': openai('gpt-4o-mini'),
      },
    });
