import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Send,
  ListTodo,
  GitFork,
  ClipboardList,
  Key,
  Clock,
  MessageSquarePlus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/renderer/components/ui/button';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { MarkdownContent } from '@/renderer/types';
import { useChat } from 'ai/react';
import { createOpenAI } from '@ai-sdk/openai';
import { CoreTool, streamText } from 'ai';
import { useApiKeyStore } from '@/stores/api-key-store';
import { useModelStore } from '@/stores/model-store';
import { ModelSelector } from '@/renderer/components/model-selector';
import { Resizable } from '@/renderer/components/ui/resizable';

import { z } from 'zod';
import { ApiKeyRequirement } from './api-key-requirement';

export const tools = {
  add_task: {
    description:
      "Creates a new task file in the user's vault with Obsidian-compatible task formatting using the content of the current file",
    parameters: z.object({
      name: z.string().describe('The name/title of the task'),
      description: z
        .string()
        .describe('The task description and subtasks in markdown format'),
    }),
    execute: async (
      { name, description }: { name: string; description: string },
      vaultPath: string
    ) => {
      console.log(
        'Executing add_task tool with name:',
        name,
        'and description:',
        description
      );
      const sanitizedName = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const timestamp = new Date().toISOString();
      const dateFormatted = new Date().toISOString().split('T')[0];
      // print all the variables
      console.log('Date formatted:', dateFormatted);
      console.log('Timestamp:', timestamp);
      console.log('Sanitized name:', sanitizedName, 'vaultPath:', vaultPath);

      // Create markdown content with frontmatter and task formatting
      const content = `---
type: task
created: ${timestamp}
status: active
due: ${dateFormatted}
tags: [task]
---

# ${name}

## Status
- [ ] Completed

## Description
${description}

## Progress
- [ ] Started
- [ ] In Progress
- [ ] Ready for Review
- [ ] Done

## Related
- Backlinks: [[Tasks]]
`;

      console.log('Content:', content);
      // Create file in Tasks directory
      await window.api.writeMarkdownToVault(`${sanitizedName}.md`, content)
      return {
        success: true,
        path: `${sanitizedName}.md`,
        message: `Created task: ${name}`,
      };
    },
  },
};

// Separate component for the chat interface
function ChatInterface({
  currentFile,
  apiKey,
}: {
  currentFile: ChatViewProps['currentFile'];
  apiKey: string;
}) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedModel } = useModelStore();

  const { messages, input, setInput, handleSubmit, isLoading, setMessages } =
    useChat({
      api: '/api/chat',
      body: {
        context: currentFile,
      },

      fetch: async (url, options) => {
        const { messages, context } = JSON.parse(options?.body as string);
        const openai = createOpenAI({
          apiKey,
        });

        const getSystemPrompt = (context: ChatViewProps['currentFile']) => {
          if (!context)
            return `You are a helpful AI assistant. You can help create and manage tasks.
            When a user wants to create a task, use the add_task function.`;
          return `You are a helpful AI assistant. You are looking at the file ${
            context.path
          }. 
          Here is the content of the file:
          ${JSON.stringify(context.content)}
          
          You can help create and manage tasks. When a user wants to create a task, use the add_task function.`;
        };
        const result = await streamText({
          model: openai(selectedModel),
          system: getSystemPrompt(context),
          messages,
          tools: tools as unknown as Record<string, CoreTool<any, any>>,
        });
        return result.toDataStreamResponse();
      },
      onFinish: (message) => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      },
    });

  const handleCreateSubtasks = () => {
    setInput(
      'Please break down the content into a detailed list of subtasks. Format it as a numbered list with clear, actionable items.'
    );
    handleSubmit(new Event('submit'));
  };

  const handleCreateTask = () => {
    setInput(
      'Please create a new task based on the content. Include a clear title and description.'
    );
    handleSubmit(new Event('submit'));
  };

  const handleRetrieveTasks = () => {
    setInput('Please show me the current list of tasks and subtasks.');
    handleSubmit(new Event('submit'));
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      <div className="p-2 border-b border-gray-200 bg-gray-50 flex justify-between">
        <p className="text-sm text-gray-600">
          {currentFile ? `📄 ${currentFile.path}` : 'No file selected'}
        </p>
        <Button
          onClick={handleClearConversation}
          variant="outline"
          disabled={isLoading}
          className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
        >
          <Trash2 className="w-4 h-4 mr-2 text-red-600" />
          Clear Chat
        </Button>
      </div>

      <ScrollArea className="flex-grow p-4">
        <AnimatePresence>
          {messages.map((m, index) => (
            <motion.div
              key={m.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div
                className={`max-w-[70%] ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg p-3 shadow-sm`}
              >
                {m.role === 'user' ? (
                  <p className="text-sm">{m.content}</p>
                ) : (
                  <ReactMarkdown className="text-sm prose prose-slate max-w-none">
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 ml-4">
              <Button
                onClick={handleCreateSubtasks}
                variant="outline"
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              >
                <ListTodo className="w-4 h-4 mr-2 text-emerald-600" />
                Create Subtasks
              </Button>
              <Button
                onClick={handleCreateTask}
                variant="outline"
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              >
                <GitFork className="w-4 h-4 mr-2 text-violet-600" />
                Create Task
              </Button>
              <Button
                onClick={handleRetrieveTasks}
                variant="outline"
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              >
                <ClipboardList className="w-4 h-4 mr-2 text-blue-600" />
                Show Tasks
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px] max-h-[200px] resize-none pl-5 py-4 pr-16 rounded-lg disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(new Event('submit'));
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white h-[45px] aspect-square disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        {/* <ModelSelector /> */}
      </div>
    </div>
  );
}

interface ChatViewProps {
  currentFile: {
    path: string;
    content: MarkdownContent;
  } | null;
}

export function ChatView({ currentFile }: ChatViewProps) {
  const { apiKey } = useApiKeyStore();

  if (!apiKey) {
    return <ApiKeyRequirement />;
  }

  return (
    <Resizable
      defaultWidth={700}
      minWidth={600}
      maxWidth={1000}
      className="h-full"
    >
      <ChatInterface currentFile={currentFile} apiKey={apiKey} />
    </Resizable>
  );
}
