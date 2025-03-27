'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { DocumentToolCall, DocumentToolResult } from './document';
import { PencilEditIcon, SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import { UseChatHelpers } from '@ai-sdk/react';
import { ToolIndicator, ToolIndicatorGroup } from './tool-indicator';

// Helper function to extract tool invocations from message parts
const extractToolInvocations = (message: UIMessage) => {
  if (!message.parts) return [];
  
  return message.parts
    .filter(part => part.type === 'tool-invocation')
    .map(part => {
      const { toolInvocation } = part as any;
      return {
        toolName: toolInvocation.toolName,
        state: toolInvocation.state,
        toolCallId: toolInvocation.toolCallId
      };
    });
};

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const toolInvocations = extractToolInvocations(message);
  
  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-primary/10 blue-overlay">
              <div className="translate-y-px">
                <SparklesIcon size={14} className="text-primary" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {message.experimental_attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}
            
            {/* Show tool indicator group at the top of assistant messages */}
            {message.role === 'assistant' && toolInvocations.length > 0 && (
              <div className="tool-indicators mb-2">
                <ToolIndicatorGroup toolInvocations={toolInvocations} />
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === 'user' && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode('edit');
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-4 py-3 rounded-xl':
                            message.role === 'user',
                          'bg-white border border-primary/10 px-4 py-3 rounded-lg':
                            message.role === 'assistant',
                        })}
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === 'tool-invocation') {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;
                
                // Show individual tool indicator right before the tool content
                return (
                  <div key={toolCallId}>
                    {/* Individual tool indicator - redundant with group, so removed
                    <div className="mb-2">
                      <ToolIndicator 
                        toolName={toolName} 
                        state={state} 
                      />
                    </div>
                    */}

                    {state === 'call' && (
                      <div
                        className={cx('mt-2', {
                          skeleton: ['getWeather'].includes(toolName),
                        })}
                      >
                        {toolName === 'getWeather' ? (
                          <Weather />
                        ) : toolName === 'createDocument' ? (
                          <DocumentPreview isReadonly={isReadonly} args={toolInvocation.args} />
                        ) : toolName === 'updateDocument' ? (
                          <DocumentToolCall
                            type="update"
                            args={toolInvocation.args}
                            isReadonly={isReadonly}
                          />
                        ) : toolName === 'requestSuggestions' ? (
                          <DocumentToolCall
                            type="request-suggestions"
                            args={toolInvocation.args}
                            isReadonly={isReadonly}
                          />
                        ) : null}
                      </div>
                    )}

                    {state === 'result' && (
                      <div className="mt-2">
                        {toolName === 'getWeather' ? (
                          <Weather weatherAtLocation={toolInvocation.result} />
                        ) : toolName === 'createDocument' ? (
                          <DocumentPreview
                            isReadonly={isReadonly}
                            result={toolInvocation.result}
                          />
                        ) : toolName === 'updateDocument' ? (
                          <DocumentToolResult
                            type="update"
                            result={toolInvocation.result}
                            isReadonly={isReadonly}
                          />
                        ) : toolName === 'requestSuggestions' ? (
                          <DocumentToolResult
                            type="request-suggestions"
                            result={toolInvocation.result}
                            isReadonly={isReadonly}
                          />
                        ) : (
                          <pre className="p-3 bg-gray-50 rounded-md text-sm overflow-x-auto">
                            {JSON.stringify(toolInvocation.result, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className="flex gap-4 w-full"
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-primary/10 blue-overlay">
          <SparklesIcon size={14} className="text-primary" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-primary/80 bg-white border border-primary/10 px-4 py-3 rounded-lg">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
