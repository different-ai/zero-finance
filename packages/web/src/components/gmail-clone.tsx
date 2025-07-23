"use client"
import Image from "next/image"
import { Printer, Reply, Send, Settings, ArrowLeft, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTypewriter } from "@/hooks/use-typewriter"
import ForwardView from "./forward-view"

function Typewriter({ text, speed }: { text: string; speed: number }) {
  const displayText = useTypewriter(text, speed)
  return (
    <p>
      {displayText}
      <span className="animate-pulse">|</span>
    </p>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
        <CheckCircle className="h-16 w-16 text-green-500" />
      </motion.div>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">All caught up</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Your inbox is clear. Well done.</p>
    </div>
  )
}

interface GmailCloneProps {
  messages: Message[]
  conversationMessages: Message[]
  onSelectMessage: (threadId: string | null) => void
  typingMessageId?: string | null
  typingSpeed?: number
  isForwarding?: boolean
  highlightedButton?: string | null
  forwardBody?: string
}

const viewVariants = {
  initial: { x: "100%", opacity: 0 },
  enter: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
}

export default function GmailClone({
  messages,
  conversationMessages,
  onSelectMessage,
  typingMessageId,
  typingSpeed = 50,
  isForwarding = false,
  highlightedButton,
  forwardBody,
}: GmailCloneProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentMessage = conversationMessages.length > 0 ? conversationMessages[conversationMessages.length - 1] : null

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversationMessages])

  const formatTimestamp = (timestamp: string, format: "time" | "full") => {
    const date = new Date(timestamp)
    if (format === "time") {
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    }
    return date.toLocaleString([], {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b bg-white px-4 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Image src="/logos/gmail.svg" width={28} height={28} alt="Gmail Logo" />
            <span className="text-xl text-gray-500">Gmail</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/benjamin.png" alt="Benjamin" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="relative flex-1 overflow-y-auto">
          <AnimatePresence initial={false} mode="wait">
            {conversationMessages.length === 0 ? (
              <motion.div
                key="list-view"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {messages.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <div className="p-2">
                      <h1 className="px-2 text-lg font-medium">Inbox {unreadCount > 0 && `(${unreadCount})`}</h1>
                    </div>
                    <motion.div variants={listVariants} initial="hidden" animate="visible" className="overflow-y-auto">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.button
                            key={message.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 border-b p-3 text-left transition-colors duration-200",
                              !message.isRead && "bg-white font-bold dark:bg-gray-800",
                            )}
                            onClick={() => onSelectMessage(message.threadId || null)}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={message.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-baseline justify-between text-sm">
                                <p
                                  className={cn(
                                    "truncate",
                                    !message.isRead
                                      ? "text-gray-900 dark:text-gray-50"
                                      : "text-gray-600 dark:text-gray-400",
                                  )}
                                >
                                  {message.sender}
                                </p>
                                <p
                                  className={cn(
                                    "whitespace-nowrap pl-2 text-xs",
                                    !message.isRead
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-500 dark:text-gray-400",
                                  )}
                                >
                                  {formatTimestamp(message.timestamp, "time")}
                                </p>
                              </div>
                              <p
                                className={cn(
                                  "truncate text-sm",
                                  !message.isRead
                                    ? "text-gray-800 dark:text-gray-200"
                                    : "text-gray-600 dark:text-gray-400",
                                )}
                              >
                                {message.subject}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                className="absolute inset-0 flex flex-col bg-white dark:bg-gray-800"
                variants={viewVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              >
                {currentMessage && (
                  <>
                    <div className="flex flex-shrink-0 items-center justify-between border-b p-2">
                      <div className="flex items-center overflow-hidden">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onSelectMessage(null)}
                              className={cn(
                                "flex-shrink-0",
                                highlightedButton === "back" && "animate-pulse ring-2 ring-blue-500",
                              )}
                            >
                              <ArrowLeft className="h-5 w-5" />
                              <span className="sr-only">Back to inbox</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Back to inbox</TooltipContent>
                        </Tooltip>
                        <h2 className="truncate px-2 text-lg font-bold">{currentMessage.subject}</h2>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(highlightedButton === "reply" && "animate-pulse ring-2 ring-blue-500")}
                            >
                              <Reply className="h-5 w-5" />
                              <span className="sr-only">Reply</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reply</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(highlightedButton === "forward" && "animate-pulse ring-2 ring-blue-500")}
                            >
                              <Send className="h-5 w-5" />
                              <span className="sr-only">Forward</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Forward</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Printer className="h-5 w-5" />
                              <span className="sr-only">Print</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Print</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
                      <AnimatePresence>
                        {conversationMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            layout
                            className="border-b py-6 last:border-b-0 dark:border-gray-700"
                          >
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={message.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 gap-1">
                                <div className="flex flex-wrap items-center gap-x-2">
                                  <p className="font-semibold">{message.sender}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    &lt;{message.senderEmail}&gt;
                                  </p>
                                  <p className="ml-auto whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimestamp(message.timestamp, "full")}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">to {message.recipient}</p>
                              </div>
                            </div>
                            <div className="prose prose-sm mt-4 max-w-none pl-14 text-gray-800 dark:text-gray-200">
                              {typingMessageId === message.id && typeof message.body === "string" ? (
                                <Typewriter text={message.body} speed={typingSpeed} />
                              ) : (
                                message.body
                              )}
                              {message.isForwarded && message.previousMessage && (
                                <div className="mt-4 rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                  <p className="text-xs text-gray-500">---------- Forwarded message ---------</p>
                                  <p className="text-xs text-gray-500">From: {message.previousMessage.sender}</p>
                                  <p className="text-xs text-gray-500">
                                    Date: {new Date(message.previousMessage.timestamp).toDateString()}
                                  </p>
                                  <p className="text-xs text-gray-500">Subject: {message.previousMessage.subject}</p>
                                  <p className="text-xs text-gray-500">To: {message.previousMessage.recipient}</p>
                                  <div className="prose prose-sm mt-4 text-gray-800 dark:text-gray-200">
                                    {message.previousMessage.body}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isForwarding && currentMessage && (
              <ForwardView
                originalMessage={currentMessage}
                typingSpeed={typingSpeed}
                highlightedButton={highlightedButton}
                body={forwardBody}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </TooltipProvider>
  )
}
