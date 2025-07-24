"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import GmailClone from "@/components/gmail-clone"
import DemoPlayer from "@/components/demo-player"
import { ValuePopup } from "@/components/value-popup"
import { ValueBanner } from "@/components/value-banner"
import { Play } from "lucide-react"
import type { Message, DemoStep } from "@/lib/types"

interface ConfigurableDemoProps {
  messages: Message[]
  demoScript: DemoStep[]
  showPlayer?: boolean
  showValuePopups?: boolean
  valuePopups?: Array<{
    trigger: number // Step number that triggers this popup
    message: string
    detail?: string
    icon?: "savings" | "time" | "security" | "speed" | "success" | "automation"
    color?: "blue" | "green" | "orange" | "purple"
    delay?: number
    duration?: number
  }>
  autoPlay?: boolean
  className?: string
  useValueBanners?: boolean // Use banners instead of popups
  backgroundColor?: string // Custom background color
}

export function ConfigurableDemo({
  messages: allPossibleMessages,
  demoScript,
  showPlayer = true,
  showValuePopups = true,
  valuePopups = [],
  autoPlay = false,
  className = "",
  useValueBanners = false,
  backgroundColor = "bg-gray-100 dark:bg-gray-900",
}: ConfigurableDemoProps) {
  const [visibleInboxIds, setVisibleInboxIds] = useState<string[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [currentThreadMessageId, setCurrentThreadMessageId] = useState<string | null>(null)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [isForwarding, setIsForwarding] = useState(false)
  const [highlightedButton, setHighlightedButton] = useState<string | null>(null)
  const [forwardBody, setForwardBody] = useState("")
  const [activePopups, setActivePopups] = useState<number[]>([])
  const [currentValueBanner, setCurrentValueBanner] = useState<string>("") 
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const TYPING_SPEED = 60
  const calculateTypingDelay = (text: string, speed = TYPING_SPEED) => text.length * speed + 1000

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

    // Check for value popups/banners
    if (showValuePopups) {
      const popupsForStep = valuePopups.filter(p => p.trigger === stepIndex)
      if (popupsForStep.length > 0) {
        if (useValueBanners && popupsForStep[0]) {
          // Set new banner - it will persist until the next one
          setCurrentValueBanner(popupsForStep[0].message)
        } else {
          setActivePopups(prev => [...prev, ...popupsForStep.map((_, idx) => stepIndex * 100 + idx)])
        }
      }
    }

    // Handle all the demo actions
    switch (step.action) {
      case "START_WITH_MESSAGES":
        const messageIds = step.messageIds || []
        setVisibleInboxIds(messageIds)
        break
      case "ADD_MESSAGE":
        if (step.messageId) {
          setVisibleInboxIds((prev) => [...prev, step.messageId!])
        }
        break
      case "AI_WELCOME":
        const welcomeMsg = allPossibleMessages.find(m => m.sender === "0.finance AI CFO" && m.threadId === "welcome-thread")
        if (welcomeMsg) {
          setVisibleInboxIds((prev) => [welcomeMsg.id, ...prev])
        }
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
            const forwardedMsg = allPossibleMessages.find(m => 
              m.isForwarded && m.previousMessage?.id === step.messageId
            )
            if (forwardedMsg) {
              setCurrentThreadMessageId(forwardedMsg.id)
            }
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
  }, [allPossibleMessages, demoScript, showValuePopups, valuePopups])

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
  }, [isPlaying, currentStep, runStep, demoScript])

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        handlePlay()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoPlay])

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
    setVisibleInboxIds([])
    setSelectedThreadId(null)
    setCurrentThreadMessageId(null)
    setIsForwarding(false)
    setHighlightedButton(null)
    setForwardBody("")
    setActivePopups([])
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
    <div className={`${!useValueBanners ? 'flex h-screen w-full' : ''} ${backgroundColor} ${className}`}>
      {/* Value Banner when using banners */}
      {useValueBanners && (
        <ValueBanner message={currentValueBanner} isVisible={!!currentValueBanner} />
      )}
      
      <div className={useValueBanners ? '' : 'flex h-screen w-full'}>
      <main className={`flex flex-1 items-center justify-center p-4 lg:p-8 ${backgroundColor} transition-all duration-300 ${!showPlayer ? 'relative' : ''}`}>
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border-4 border-black bg-white aspect-[9/19.5] transition-all duration-300">
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
        
        {/* Floating Play Button when player is hidden */}
        {!showPlayer && !isPlaying && currentStep === -1 && (
          <button
            onClick={handlePlay}
            className="absolute bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center gap-2"
          >
            <Play className="w-6 h-6" />
            <span className="pr-2">Start Demo</span>
          </button>
        )}
        
        {/* Reset button when playing without player */}
        {!showPlayer && (isPlaying || currentStep > -1) && (
          <button
            onClick={handleReset}
            className="absolute bottom-8 right-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-2 shadow-lg transition-all text-sm"
          >
            Reset Demo
          </button>
        )}
      </main>
      
      {showPlayer && (
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
      )}
      
      {/* Value Popups (only when not using banners) */}
      {showValuePopups && !useValueBanners && valuePopups.map((popup, idx) => {
        const popupKey = popup.trigger * 100 + idx
        return activePopups.includes(popupKey) ? (
          <ValuePopup
            key={popupKey}
            message={popup.message}
            detail={popup.detail}
            icon={popup.icon}
            color={popup.color}
            delay={popup.delay || 500}
            duration={popup.duration || 5000}
          />
        ) : null
      })}
      </div>
    </div>
  )
}