"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import GmailClone from "@/components/gmail-clone"
import DemoPlayer from "@/components/demo-player"
import type { Message, DemoStep } from "@/lib/types"

const TYPING_SPEED = 60

const calculateTypingDelay = (text: string, speed = TYPING_SPEED) => text.length * speed + 1000

// --- MESSAGE & THREAD DEFINITIONS ---

function linkThread(thread: Message[], threadId: string): Message[] {
  return thread.map((msg, index) => ({
    ...msg,
    threadId,
    isActionable: true, // Mark all messages in solution threads as actionable
    previousMessage: index > 0 && !msg.isForwarded ? thread[index - 1] : msg.previousMessage,
  }))
}

// -- Chaos Emails (Actionable)
const pgBill: Message = {
  id: "chaos-1",
  sender: "P&G",
  senderEmail: "billing@pg.com",
  recipient: "Benjamin",
  subject: "Action Required: Your P&G Invoice is Due",
  body: "Your invoice for $150 is due soon. Please pay to avoid service interruption.",
  timestamp: "2025-07-22T08:30:00Z",
  isRead: false,
  avatar: "/avatars/pg.png",
  isActionable: true,
}

const bankStatement: Message = {
  id: "chaos-2",
  sender: "MyBank",
  senderEmail: "statements@mybank.com",
  recipient: "Benjamin",
  subject: "Your Monthly Statement is Ready",
  body: "Your monthly bank statement is now available. Your checking account balance is $152,345.00.",
  timestamp: "2025-07-22T08:32:00Z",
  isRead: false,
  avatar: "/avatars/bank.png",
  isActionable: true,
}

const taxReminder: Message = {
  id: "chaos-3",
  sender: "Tax Experts LLC",
  senderEmail: "cpa@taxexperts.com",
  recipient: "Benjamin",
  subject: "Tax Season is Here!",
  body: "Just a friendly reminder that tax season is upon us. Please send over your financial documents as soon as possible.",
  timestamp: "2025-07-22T08:35:00Z",
  isRead: false,
  avatar: "/avatars/accountant.png",
  isActionable: true,
}

// -- Chaos Emails (Non-Actionable Clutter)
const notionBill: Message = {
  id: "chaos-4",
  sender: "Notion",
  senderEmail: "team@m.notion.so",
  recipient: "Benjamin",
  subject: "Your Notion invoice",
  body: "Your workspace has been charged $10. Thanks for using Notion!",
  timestamp: "2025-07-22T08:36:00Z",
  isRead: false,
  avatar: "/notion-logo.png",
  threadId: "notion-thread",
  isActionable: false,
}

const amazonOrder: Message = {
  id: "chaos-5",
  sender: "Amazon.com",
  senderEmail: "order-update@amazon.com",
  recipient: "Benjamin",
  subject: "Your Amazon.com order of 'Standing Desk' has shipped!",
  body: "Your order will be delivered tomorrow. We hope you enjoy it!",
  timestamp: "2025-07-22T08:37:00Z",
  isRead: false,
  avatar: "/amazon-logo.png",
  threadId: "amazon-thread",
  isActionable: false,
}

const randomNewsletter: Message = {
  id: "chaos-6",
  sender: "Tech Weekly",
  senderEmail: "newsletter@techweekly.com",
  recipient: "Benjamin",
  subject: "This Week's Top Tech News",
  body: "From AI breakthroughs to the latest gadget reviews, here's what you missed.",
  timestamp: "2025-07-22T08:20:00Z",
  isRead: false,
  avatar: "/letter-t-typography.png",
  isActionable: false,
}

const socialMediaNotif: Message = {
  id: "chaos-7",
  sender: "LinkedIn",
  senderEmail: "messaging-digest-noreply@linkedin.com",
  recipient: "Benjamin",
  subject: "You have 2 new messages",
  body: "Don't miss messages from your network.",
  timestamp: "2025-07-22T08:15:00Z",
  isRead: false,
  avatar: "/letter-L-nature.png",
  isActionable: false,
}

const chaosMessages = [
  randomNewsletter,
  socialMediaNotif,
  pgBill,
  bankStatement,
  taxReminder,
  notionBill,
  amazonOrder,
]

const chaosMessageIds = chaosMessages.map(m => m.id)

// -- 0.finance Welcome
const zeroWelcome: Message = {
  id: "welcome-zero",
  sender: "0.finance AI CFO",
  senderEmail: "ai@0.finance",
  recipient: "Benjamin",
  subject: "Welcome to 0.finance!",
  body: "Hey Benjamin, I'm your new AI CFO. I'm here to handle all this financial noise for you. Just forward me bills, ask me questions, and I'll take care of the rest.",
  timestamp: "2025-07-22T09:00:00Z",
  isRead: false,
  avatar: "/avatars/zero-finance.png",
  threadId: "welcome-thread",
  isActionable: true,
}

// -- Solution Threads
const pgThread = linkThread(
  [
    pgBill,
    {
      id: "pg-forward",
      sender: "Benjamin",
      senderEmail: "benjamin.shafii@gmail.com",
      recipient: "ai@0.finance",
      subject: "Fwd: Action Required: Your P&G Invoice is Due",
      body: "can you pay this?",
      timestamp: "2025-07-22T09:05:00Z",
      isRead: true,
      avatar: "/avatars/benjamin.png",
      isForwarded: true,
      previousMessage: pgBill,
    },
    {
      id: "pg-reply",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Benjamin",
      subject: "Re: Fwd: Action Required: Your P&G Invoice is Due",
      body: "Done. The $150 invoice to P&G has been paid. You won't see it again.",
      timestamp: "2025-07-22T09:06:00Z",
      isRead: false,
      avatar: "/avatars/zero-finance.png",
    },
  ],
  "pg-thread",
)

const taxThread = linkThread(
  [
    taxReminder,
    {
      id: "tax-q",
      sender: "Benjamin",
      senderEmail: "benjamin.shafii@gmail.com",
      recipient: "ai@0.finance",
      subject: "Re: Tax Season is Here!",
      body: "Hey, can you help me get ready for this?",
      timestamp: "2025-07-22T09:10:00Z",
      isRead: true,
      avatar: "/avatars/benjamin.png",
    },
    {
      id: "tax-a1",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Benjamin",
      subject: "Re: Tax Season is Here!",
      body: "Of course. I've reviewed your transactions and noticed some uncategorized expenses. To ensure your books are accurate for tax filing, shall I auto-categorize them for you?",
      timestamp: "2025-07-22T09:11:00Z",
      isRead: false,
      avatar: "/avatars/zero-finance.png",
    },
    {
      id: "tax-q2",
      sender: "Benjamin",
      senderEmail: "benjamin.shafii@gmail.com",
      recipient: "ai@0.finance",
      subject: "Re: Tax Season is Here!",
      body: "Yes, please do.",
      timestamp: "2025-07-22T09:12:00Z",
      isRead: true,
      avatar: "/avatars/benjamin.png",
    },
    {
      id: "tax-a2",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Benjamin",
      subject: "Re: Tax Season is Here!",
      body: "Great. I've categorized the expenses and prepared a summary. I've already sent it to Tax Experts LLC. You're all set.",
      timestamp: "2025-07-22T09:13:00Z",
      isRead: false,
      avatar: "/avatars/zero-finance.png",
    },
  ],
  "tax-thread",
)

const savingsThread = linkThread(
  [
    bankStatement,
    {
      id: "savings-q",
      sender: "Benjamin",
      senderEmail: "benjamin.shafii@gmail.com",
      recipient: "ai@0.finance",
      subject: "Re: Your Monthly Statement is Ready",
      body: "Is there anything I can do to optimize this cash balance?",
      timestamp: "2025-07-22T09:20:00Z",
      isRead: true,
      avatar: "/avatars/benjamin.png",
    },
    {
      id: "savings-a",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Benjamin",
      subject: "Re: Your Monthly Statement is Ready",
      body: "Good question. Your checking account has a balance of over $150,000. You could be earning 4-8% APY on that. Would you like me to set up a rule to sweep idle cash into a high-yield vault?",
      timestamp: "2025-07-22T09:21:00Z",
      isRead: false,
      avatar: "/avatars/zero-finance.png",
    },
    {
      id: "savings-q2",
      sender: "Benjamin",
      senderEmail: "benjamin.shafii@gmail.com",
      recipient: "ai@0.finance",
      subject: "Re: Your Monthly Statement is Ready",
      body: "Yes, that's a great idea. Please set it up.",
      timestamp: "2025-07-22T09:22:00Z",
      isRead: true,
      avatar: "/avatars/benjamin.png",
    },
    {
      id: "savings-a2",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Benjamin",
      subject: "Re: Your Monthly Statement is Ready",
      body: "Confirmed. The automated rule is now active. You'll see the first sweep within 24 hours.",
      timestamp: "2025-07-22T09:23:00Z",
      isRead: false,
      avatar: "/avatars/zero-finance.png",
    },
  ],
  "savings-thread",
)

const cleanupThread = linkThread(
  [
    {
      id: "cleanup-q",
      sender: "Benjamin",
      senderEmail: "benjamin.shafii@gmail.com",
      recipient: "ai@0.finance",
      subject: "Anything else?",
      body: "Could you archive all my financial emails that don't require my intervention?",
      timestamp: "2025-07-22T09:30:00Z",
      isRead: true,
      avatar: "/avatars/benjamin.png",
    },
    {
      id: "cleanup-a",
      sender: "0.finance AI CFO",
      senderEmail: "ai@0.finance",
      recipient: "Benjamin",
      subject: "Re: Anything else?",
      body: "Done. I've archived all non-actionable financial notifications. Your inbox is now clean.",
      timestamp: "2025-07-22T09:31:00Z",
      isRead: false,
      avatar: "/avatars/zero-finance.png",
    },
  ],
  "cleanup-thread",
)

const allPossibleMessages = [
  ...pgThread,
  ...taxThread,
  ...savingsThread,
  ...cleanupThread,
  notionBill,
  amazonOrder,
  randomNewsletter,
  socialMediaNotif,
  zeroWelcome,
]

// --- DEMO SCRIPT ---

const demoScript: DemoStep[] = [
  {
    title: "Start with a cluttered inbox",
    description: "The demo begins with a few emails already present.",
    action: "START_WITH_MESSAGES",
    delayAfter: 2000,
  },
  {
    title: "The Financial Storm Begins",
    description: "Bills, alerts, and reminders start flooding in.",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[2],
    delayAfter: 800,
  },
  {
    title: "...",
    description: "The emails start coming faster...",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[3],
    delayAfter: 600,
  },
  {
    title: "...",
    description: "and faster...",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[4],
    delayAfter: 400,
  },
  {
    title: "...",
    description: "until the inbox is overwhelmed.",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[5],
    delayAfter: 400,
  },
  {
    title: "Inbox is Overwhelmed",
    description: "A typical, stressful inbox.",
    action: "ADD_MESSAGE",
    messageId: chaosMessageIds[6],
    delayAfter: 2000,
  },
  {
    title: "A Helping Hand Arrives",
    description: "The 0.finance AI CFO appears to restore order.",
    action: "AI_WELCOME",
    delayAfter: 2000,
  },
  {
    title: "Read the Welcome Email",
    description: "You open the email to see what it's about.",
    action: "OPEN_MESSAGE",
    messageId: zeroWelcome.id,
    threadId: "welcome-thread",
    delayAfter: 2500,
  },
  {
    title: "Return to Inbox",
    description: "After reading, you go back to the inbox view.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  // --- P&G Bill Scenario ---
  {
    title: "1. Tackle the First Bill",
    description: "You open the P&G bill to see what it is.",
    action: "OPEN_MESSAGE",
    messageId: pgBill.id,
    threadId: "pg-thread",
    delayAfter: 2000,
  },
  {
    title: "2. Forward to AI",
    description: "Instead of paying it manually, you forward it.",
    action: "FORWARD_MESSAGE",
    messageId: pgBill.id,
    highlightButton: "forward",
    delayAfter: 1500,
  },
  {
    title: "3. Add a Note & Send",
    description: "A quick instruction is all that's needed.",
    action: "TYPE_AND_SEND_FORWARD",
    messageId: pgBill.id,
    threadId: "pg-thread",
    forwardBody: "can you pay this?",
    delayAfter: calculateTypingDelay("can you pay this?") + 1000,
  },
  {
    title: "4. AI Confirms Payment",
    description: "The AI confirms the bill is paid instantly.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "pg-reply",
    threadId: "pg-thread",
    delayAfter: 3000,
  },
  {
    title: "5. Return to Inbox",
    description: "You go back to the inbox.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "6. Watch it Disappear",
    description: "The P&G bill is automatically cleared from the inbox.",
    action: "CLEAR_THREAD",
    threadId: "pg-thread",
    delayAfter: 2000,
  },
  // --- Tax Scenario ---
  {
    title: "7. Prepare for Taxes",
    description: "Next, you open the reminder from your accountant.",
    action: "OPEN_MESSAGE",
    messageId: taxReminder.id,
    threadId: "tax-thread",
    delayAfter: 2000,
  },
  {
    title: "8. Ask AI for Help",
    description: "You reply to your AI CFO to handle it.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "tax-q",
    threadId: "tax-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Hey, can you help me get ready for this?"),
  },
  {
    title: "9. AI Analyzes & Suggests",
    description: "The AI finds uncategorized transactions and offers to fix them.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "tax-a1",
    threadId: "tax-thread",
    delayAfter: 4000,
  },
  {
    title: "10. You Approve",
    description: "A simple 'yes' is enough.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "tax-q2",
    threadId: "tax-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Yes, please do."),
  },
  {
    title: "11. AI Confirms Completion",
    description: "The AI confirms the task is done and the accountant is updated.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "tax-a2",
    threadId: "tax-thread",
    delayAfter: 3000,
  },
  {
    title: "12. Return to Inbox",
    description: "You go back to the inbox.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "13. Another Task Done",
    description: "The tax reminder is cleared from the inbox.",
    action: "CLEAR_THREAD",
    threadId: "tax-thread",
    delayAfter: 2000,
  },
  // --- Savings Scenario ---
  {
    title: "14. Optimize Your Cash",
    description: "You open the bank statement.",
    action: "OPEN_MESSAGE",
    messageId: bankStatement.id,
    threadId: "savings-thread",
    delayAfter: 2000,
  },
  {
    title: "15. Ask for Advice",
    description: "You ask your AI CFO for optimization ideas.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "savings-q",
    threadId: "savings-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Is there anything I can do to optimize this cash balance?"),
  },
  {
    title: "16. AI Identifies Opportunity",
    description: "The AI suggests moving idle cash to a high-yield vault.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "savings-a",
    threadId: "savings-thread",
    delayAfter: 4000,
  },
  {
    title: "17. You Agree",
    description: "You approve the strategy.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "savings-q2",
    threadId: "savings-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Yes, that's a great idea. Please set it up."),
  },
  {
    title: "18. AI Activates Rule",
    description: "The AI confirms the automated rule is active.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "savings-a2",
    threadId: "savings-thread",
    delayAfter: 3000,
  },
  {
    title: "19. Return to Inbox",
    description: "You go back to the inbox.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "20. Final Task Complete",
    description: "The bank statement is now resolved.",
    action: "CLEAR_THREAD",
    threadId: "savings-thread",
    delayAfter: 2000,
  },
  // --- Final Cleanup ---
  {
    title: "21. One Last Thing...",
    description: "You ask the AI to clean up the rest.",
    action: "OPEN_MESSAGE",
    messageId: "cleanup-q",
    threadId: "cleanup-thread",
    isTyping: true,
    delayAfter: calculateTypingDelay("Could you archive all my financial emails that don't require my intervention?"),
  },
  {
    title: "22. AI Tidies Up",
    description: "The AI confirms the cleanup is complete.",
    action: "SHOW_MESSAGE_IN_THREAD",
    messageId: "cleanup-a",
    threadId: "cleanup-thread",
    delayAfter: 3000,
  },
  {
    title: "23. Return to a Clean Inbox",
    description: "You go back to the inbox one last time.",
    action: "GO_TO_INBOX",
    highlightButton: "back",
    delayAfter: 1500,
  },
  {
    title: "24. Archive the Clutter",
    description: "The remaining non-actionable emails are archived.",
    action: "ARCHIVE_NON_ACTIONABLE",
    delayAfter: 2000,
  },
  // --- Conclusion ---
  {
    title: "Achieve Inbox Zero",
    description: "0.finance has handled everything. Your inbox is clean.",
    action: "FINISH_EMPTY",
    delayAfter: 5000,
  },
  {
    title: "Demo Complete",
    description: "This is how 0.finance simplifies financial management.",
    action: "END",
    delayAfter: 0,
  },
]

export default function DemoPage() {
  const [visibleInboxIds, setVisibleInboxIds] = useState<string[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [currentThreadMessageId, setCurrentThreadMessageId] = useState<string | null>(null)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [isForwarding, setIsForwarding] = useState(false)
  const [highlightedButton, setHighlightedButton] = useState<string | null>(null)
  const [forwardBody, setForwardBody] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handlePlay = () => {
    setIsPlaying(true)
    if (currentStep === -1) {
      runStep(0)
    }
  }

  const runStep = useCallback((stepIndex: number) => {
    if (stepIndex >= demoScript.length) {
      setIsPlaying(false)
      return
    }
    const step = demoScript[stepIndex]
    if (!step) return

    setCurrentStep(stepIndex)
    setTypingMessageId(step.isTyping ? step.messageId || null : null)
    setHighlightedButton(step.highlightButton || null)
    if (step.action !== "TYPE_AND_SEND_FORWARD") {
      setForwardBody("")
    }

    switch (step.action) {
      case "START_WITH_MESSAGES":
        setVisibleInboxIds([chaosMessageIds[0], chaosMessageIds[1]])
        break
      case "ADD_MESSAGE":
        if (step.messageId) {
          setVisibleInboxIds((prev) => [...prev, step.messageId!])
        }
        break
      case "AI_WELCOME":
        setVisibleInboxIds((prev) => [zeroWelcome.id, ...prev])
        break
      case "OPEN_MESSAGE":
        setSelectedThreadId(step.threadId || null)
        setCurrentThreadMessageId(step.messageId || null)
        break
      case "GO_TO_INBOX":
        setSelectedThreadId(null)
        setCurrentThreadMessageId(null)
        break
      case "FORWARD_MESSAGE":
        setIsForwarding(true)
        break
      case "TYPE_AND_SEND_FORWARD":
        setForwardBody(step.forwardBody || "")
        setTimeout(
          () => {
            setIsForwarding(false)
            setCurrentThreadMessageId("pg-forward")
          },
          calculateTypingDelay(step.forwardBody || "") - 500,
        )
        break
      case "SHOW_MESSAGE_IN_THREAD":
        setCurrentThreadMessageId(step.messageId || null)
        break
      case "CLEAR_THREAD":
        const threadToClear = allPossibleMessages.filter((m) => m.threadId === step.threadId)
        const rootMessageId = threadToClear.length > 0 ? threadToClear[0].id : null
        if (rootMessageId) {
          setVisibleInboxIds((prev) => prev.filter((id) => id !== rootMessageId))
        }
        setSelectedThreadId(null)
        setCurrentThreadMessageId(null)
        break
      case "ARCHIVE_NON_ACTIONABLE":
        const actionableIds = new Set(allPossibleMessages.filter((m) => m.isActionable).map((m) => m.id))
        setVisibleInboxIds((prev) => prev.filter((id) => actionableIds.has(id)))
        break
      case "FINISH_EMPTY":
        setVisibleInboxIds([])
        setSelectedThreadId(null)
        break
      case "END":
        setIsPlaying(false)
        break
    }
  }, [])

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!isPlaying) return

    const step = demoScript[currentStep]
    if (!step || step.action === "END") {
      setIsPlaying(false)
      return
    }

    timeoutRef.current = setTimeout(() => {
      runStep(currentStep + 1)
    }, step.delayAfter)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPlaying, currentStep, runStep])

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
    setVisibleInboxIds([])
    setSelectedThreadId(null)
    setCurrentThreadMessageId(null)
    setIsForwarding(false)
    setHighlightedButton(null)
    setForwardBody("")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const visibleInboxMessages = visibleInboxIds
    .map((id) => allPossibleMessages.find((m) => m.id === id))
    .filter((m): m is Message => !!m)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const fullSelectedThread = allPossibleMessages
    .filter((m) => m.threadId === selectedThreadId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const currentMessageIndex = fullSelectedThread.findIndex((m) => m.id === currentThreadMessageId)
  const conversationMessages = currentMessageIndex > -1 ? fullSelectedThread.slice(0, currentMessageIndex + 1) : []

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-1 items-center justify-center p-4 lg:p-8 bg-gray-100 dark:bg-gray-900 transition-all duration-300">
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border-4 border-black bg-white shadow-2xl aspect-[9/19.5] transition-all duration-300">
          <GmailClone
            messages={visibleInboxMessages}
            conversationMessages={conversationMessages}
            onSelectMessage={(threadId) => {
              const thread = allPossibleMessages.filter((m) => m.threadId === threadId)
              if (thread.length > 0) {
                setSelectedThreadId(threadId)
                setCurrentThreadMessageId(thread[0].id)
              }
            }}
            typingMessageId={typingMessageId}
            typingSpeed={TYPING_SPEED}
            isForwarding={isForwarding}
            highlightedButton={highlightedButton}
            forwardBody={forwardBody}
          />
        </div>
      </main>
      <aside className="w-96 flex-shrink-0 border-l bg-white dark:border-gray-700 dark:bg-gray-800 transition-all duration-300">
        <DemoPlayer
          script={demoScript}
          currentStep={currentStep}
          onNextStep={() => runStep(currentStep + 1)}
          onReset={handleReset}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={() => setIsPlaying(false)}
        />
      </aside>
    </div>
  )
}
