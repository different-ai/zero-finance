"use client"

import { motion } from "framer-motion"
import { Send, X } from "lucide-react"
import { Button } from "./ui/button"
import type { Message } from "@/lib/types"
import { useTypewriter } from "@/hooks/use-typewriter"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ForwardViewProps {
  originalMessage: Message
  typingSpeed?: number
  highlightedButton?: string | null
  body?: string
}

function Typewriter({ text, speed, onFinished }: { text: string; speed: number; onFinished?: () => void }) {
  const displayText = useTypewriter(text, speed)
  useEffect(() => {
    if (text && displayText.length === text.length) {
      onFinished?.()
    }
  }, [displayText, text, onFinished])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function ForwardView({
  originalMessage,
  typingSpeed = 50,
  highlightedButton,
  body = "",
}: ForwardViewProps) {
  const [bodyTyped, setBodyTyped] = useState(false)

  useEffect(() => {
    if (body) {
      const timeout = setTimeout(() => setBodyTyped(true), body.length * typingSpeed + 500)
      return () => clearTimeout(timeout)
    }
  }, [body, typingSpeed])

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
      className="absolute inset-0 flex flex-col bg-white dark:bg-gray-800"
    >
      <header className="flex flex-shrink-0 items-center justify-between border-b p-2">
        <span className="px-2 text-lg font-semibold">Forward</span>
        <Button variant="ghost" size="icon">
          <X className="h-5 w-5" />
        </Button>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2 border-b pb-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">To:</span>
            <span className="font-medium">ai@0.finance</span>
          </div>
        </div>
        <div className="py-4">
          <Typewriter text={body} speed={typingSpeed} onFinished={() => setBodyTyped(true)} />
        </div>
        <div className="mt-4 border-t pt-4 text-xs text-gray-500">
          <p>---------- Forwarded message ---------</p>
          <p>From: {originalMessage.sender}</p>
          <p>Date: {new Date(originalMessage.timestamp).toDateString()}</p>
          <p>Subject: {originalMessage.subject}</p>
          <p>To: Benjamin</p>
          <div className="prose prose-sm mt-4 text-gray-800 dark:text-gray-200">{originalMessage.body}</div>
        </div>
      </div>
      <footer className="flex flex-shrink-0 items-center gap-2 border-t p-2">
        <Button
          disabled={!bodyTyped}
          className={cn(highlightedButton === "send" && "animate-pulse ring-2 ring-blue-500")}
        >
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </footer>
    </motion.div>
  )
}
