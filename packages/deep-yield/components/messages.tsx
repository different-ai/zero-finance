import { UIMessage } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { memo, useEffect } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import { UseChatHelpers } from '@ai-sdk/react';
import { ResearchPlanDisplay } from './research-plan';
import { useResearchPlanStore } from '@/lib/store/research-plan-store';

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  votes: Array<Vote> | undefined;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  isArtifactVisible: boolean;
}

function PureMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  // Get research plan from store
  const { plan, isActive, isVisible } = useResearchPlanStore();

  // Update research plan from message content containing tool calls
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // Look for planYieldResearch tool calls in assistant messages
    let foundPlan = false;
    let latestPlan = null;

    // Process messages in reverse order to find the most recent plan
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role !== 'assistant' || !message?.toolInvocations) continue;

      const planToolCall = message.toolInvocations.find(
        (toolCall) => toolCall.toolName === 'planYieldResearch',
      );

      try {
        const result = JSON.parse(
          planToolCall?.state === 'result' && planToolCall?.result,
        );
        if (result.success && result.plan) {
          latestPlan = result.plan;
          foundPlan = true;
          break; // Found the most recent plan
        }
      } catch (error) {
        console.error('Failed to parse research plan tool result:', error);
      }
    }

    // Only update the plan if we found a valid one and it's different from the current one
    if (foundPlan && latestPlan) {
      // Update the plan in the store
      useResearchPlanStore.getState().setPlan(latestPlan);
    }
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {/* Display research plan if active and visible */}
      {isActive && isVisible && plan && (
        <div className="px-4 md:px-6 lg:px-8">
          <ResearchPlanDisplay plan={plan} />
        </div>
      )}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === 'streaming' && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {status === 'submitted' &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
