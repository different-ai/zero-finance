---
name: ai-sdk
description: Use AI SDK 6 with OpenAI models - gpt-5.2 for complex tasks, gpt-5-mini for fast actions
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: ai-integration
---

## What I Do

- Provide correct patterns for AI SDK 6 with OpenAI
- Ensure consistent model usage across the codebase
- Handle text generation, structured output, and tool calling

## Model Selection

| Model        | Use Case                            | Examples                                        |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| `gpt-5.2`    | Complex reasoning, multi-step tasks | Email agents, document analysis, KYB assistance |
| `gpt-5-mini` | Fast actions, simple extraction     | Invoice field extraction, quick classifications |

**Default to `gpt-5.2`** unless speed is critical and the task is simple.

## Setup Pattern

Always create the OpenAI provider inline - no abstraction layer needed:

```typescript
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
```

## Core Patterns

### 1. Text Generation

```typescript
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const result = await generateText({
  model: openai('gpt-5.2'),
  system: 'You are a helpful assistant.',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(result.text);
```

### 2. Structured Output (generateObject)

For extracting structured data with type safety:

```typescript
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  amount: z.number(),
});

const result = await generateObject({
  model: openai('gpt-5-mini'), // Use mini for simple extraction
  schema,
  messages: [
    { role: 'user', content: 'Extract: John Doe, john@example.com, $500' },
  ],
});

console.log(result.object); // Typed as { name: string, email: string, amount: number }
```

### 3. Tool Calling with Agentic Loops

For multi-step AI agents:

```typescript
import { generateText, tool, stepCountIs } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const result = await generateText({
  model: openai('gpt-5.2'), // Use full model for complex tool orchestration
  system: 'You are an assistant that can look up information.',
  messages: [{ role: 'user', content: 'What is the weather in Tokyo?' }],
  tools: {
    getWeather: tool({
      description: 'Get weather for a city',
      inputSchema: z.object({
        city: z.string().describe('City name'),
      }),
      execute: async ({ city }) => {
        // Your implementation
        return { temperature: 22, condition: 'sunny' };
      },
    }),
  },
  stopWhen: stepCountIs(5), // Allow up to 5 tool call steps
});

// Access tool calls made
const toolCalls = result.steps.flatMap(
  (step) => step.toolCalls?.map((tc) => tc.toolName) || [],
);
```

### 4. Streaming (for UI)

```typescript
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const result = await streamText({
  model: openai('gpt-5.2'),
  messages: [{ role: 'user', content: 'Write a poem' }],
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## Schema Tips for AI SDK 6

When using `generateObject`, schemas must be carefully structured:

```typescript
// GOOD: Use nullable() for optional fields in AI extraction
const schema = z.object({
  required: z.string(),
  optional: z.string().nullable(), // AI can return null
});

// GOOD: Describe fields for better extraction
const schema = z.object({
  amount: z.number().describe('Invoice amount as a positive number'),
  currency: z.string().describe('Currency code: USD, EUR, GBP'),
});

// BAD: Don't use optional() - use nullable() instead
const schema = z.object({
  field: z.string().optional(), // May cause issues with some models
});
```

## Lazy Loading

For edge runtimes or to reduce bundle size, use dynamic imports:

```typescript
// Lazily import to avoid bundling in edge runtimes if unused
const { createOpenAI } = await import('@ai-sdk/openai');
const { generateObject } = await import('ai');

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
```

## Error Handling

```typescript
try {
  const result = await generateObject({
    model: openai('gpt-5-mini'),
    schema,
    messages,
  });
  return result.object;
} catch (error) {
  if (error instanceof Error) {
    console.error('[AI] Generation failed:', error.message);
  }
  // Optionally retry with simpler schema or different model
  throw error;
}
```

## Existing Usage in Codebase

| File                                                 | Model      | Purpose                  |
| ---------------------------------------------------- | ---------- | ------------------------ |
| `src/app/api/ai-email/route.ts`                      | gpt-5.2    | Email agent with tools   |
| `src/server/routers/invoice-router.ts`               | gpt-5-mini | Invoice field extraction |
| `src/app/api/kyb-assistant/route.ts`                 | gpt-5.2    | KYB form assistance      |
| `src/app/api/generate-shareholder-registry/route.ts` | gpt-5.2    | Document generation      |
| `src/server/routers/funding-source-router.ts`        | gpt-5-mini | Quick extraction         |

## When to Use This Skill

- Adding new AI-powered features
- Implementing structured data extraction
- Building AI agents with tool calling
- Migrating from older AI SDK versions
- Choosing between gpt-5.2 and gpt-5-mini
