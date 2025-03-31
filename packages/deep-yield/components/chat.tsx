'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import type { Vote } from '../lib/db/schema';
import { fetcher, generateUUID } from '../lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '../hooks/use-artifact';
import { toast } from 'sonner';
import { ToolExecutionPanel } from './tool-execution-panel';
import { SimpleChatHeader } from './simple-chat-header';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure the chat ID is properly initialized before making API calls
  useEffect(() => {
    if (id) {
      console.log('Chat initialized with ID:', id);
      // Add a small delay to ensure server has time to register the chat ID
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [id]);

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    api: '/api/chat', // Make the endpoint explicit for debugging
    onFinish: () => {
      console.log('Chat API call finished successfully');
      mutate('/api/history');
    },
    onError: (error) => {
      console.error('Chat API call error:', error);
      toast.error('An error occured, please try again!');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    isInitialized && messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);
  
  // Get the last message to pass to the Tool Execution Panel
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isStreaming = status === 'streaming';

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Apply noise texture and scanline effects from web package */}
      <div className="noise-texture"></div>
      <div className="scanline"></div>
      
      <div className="flex flex-col min-w-0 h-dvh nostalgic-container">
        <SimpleChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto pt-6 px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl bg-white/50 border-t border-primary/10">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      {/* Tool Execution Panel shows at the bottom of the screen */}
      <ToolExecutionPanel
        message={lastMessage}
        isStreaming={isStreaming}
      />

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
