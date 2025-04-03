# Vercel AI SDK Tool Streaming

## What We Learned

When implementing real-time tool execution feedback in chat interfaces using the Vercel AI SDK, we discovered several important details about handling toolCallStreaming:

1. The SDK emits three different states during tool execution that need handling:
   - `partial-call`: Emitted when the tool call is being formed (parameters being generated)
   - `call`: Emitted when the tool call is complete and ready for execution
   - `result`: Emitted when the tool execution is complete

2. Each status needs its own UI treatment:
   - During `partial-call`, show a "preparing" or "thinking" state
   - During `call` (before result), show a "processing" state
   - After `result`, show a "complete" state with results

## Implementation References

This pattern was used in the ToolIndicator and ToolExecutionPanel components to create a more transparent tool execution experience. 

Key components:
- `app/components/tool-indicator.tsx` - Individual tool status indicators
- `app/components/tool-indicator-group.tsx` - Group of active tools
- `app/components/tool-execution-panel.tsx` - Fixed panel showing real-time progress

## How to Apply

When implementing tool streaming in future components:

```tsx
// In API route
import { StreamingTextResponse, experimental_StreamData } from 'ai';

// Enable tool streaming in the request
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages,
  tools,
  stream: true,
  tool_choice: "auto",
});

// Create stream data for tool results
const data = new experimental_StreamData();
const stream = OpenAIStream(response, {
  async experimental_onToolCall(call) {
    // Handle tool call and send result
    const result = await executeToolCall(call);
    data.append({ tool_call_id: call.id, content: result });
    return result;
  },
  experimental_streamData: true,
});

// Return streaming response with data
return new StreamingTextResponse(stream, {}, data);

// In the client component
const { messages, input, handleSubmit, handleInputChange, isLoading, streamData } = useChat({
  api: '/api/chat',
  experimental_onToolCall: async (call) => {
    // Logic for handling tool call
  }
});

// Access activeToolCalls for displaying UI
const activeToolCalls = streamData?.activeToolCalls || [];
``` 