"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  X,
  Mail,
  BanknoteIcon as BankIcon,
  StickerIcon as StripeIcon,
  ShieldAlert,
  UserCircle,
  AlertTriangle,
  Send,
  Sparkles,
  Edit3,
} from "lucide-react"
import type { InboxCard, Comment, SuggestedInboxCardUpdate, Memory } from "@/types/inbox"
import { useInboxStore } from "@/lib/store"
import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"

interface InboxDetailSidebarProps {
  card: InboxCard
  onClose: () => void
}

export function InboxDetailSidebar({ card, onClose }: InboxDetailSidebarProps) {
  const { executeCard, updateCard, addCommentToCard, addMemory, applySuggestedUpdate, addToast } = useInboxStore()
  const [newComment, setNewComment] = useState("")
  const commentsEndRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   commentsEndRef.current?.scrollIntoView({ 
  //     behavior: "smooth", 
  //     block: "center",
  //     inline: "nearest"
  //   })
  // }, [card.comments])

  const handleApprove = () => {
    executeCard(card.id)
    onClose()
  }

  const getCardTypeIcon = () => {
    switch (card.icon) {
      case "bank":
        return "🏦"
      case "invoice":
        return "📄"
      case "compliance":
        return "🛡️"
      case "fx":
        return "✈️"
      default:
        return "📋"
    }
  }

  const getSourceIcon = (size = "h-5 w-5") => {
    const className = `${size} text-muted-foreground`
    switch (card.sourceType) {
      case "email":
        return <Mail className={className} />
      case "bank_transaction":
        return <BankIcon className={className} />
      case "stripe":
        return <StripeIcon className={className} />
      case "hyperstable_bank":
        return <ShieldAlert className={`${size} text-blue-500`} />
      case "manual":
        return <UserCircle className={className} />
      case "system_alert":
        return <AlertTriangle className={`${size} text-destructive`} />
      default:
        return null
    }
  }

  // Mock AI processing
  const processUserCommentWithAI = (userComment: Comment) => {
    let aiResponseText = "Thanks for your input. I've noted that."
    let suggestedUpdate: SuggestedInboxCardUpdate | undefined = undefined
    let isAiSuggestionPending = false
    let memoryToCreate: Memory | undefined = undefined

    const lowerCaseText = userComment.text.toLowerCase()

    if (lowerCaseText.includes("change amount to") || lowerCaseText.includes("adjust to $")) {
      const match = lowerCaseText.match(/\$?([\d,]+(\.\d{1,2})?)/)
      if (match && match[1]) {
        const newAmount = Number.parseFloat(match[1].replace(/,/g, ""))
        aiResponseText = `Understood. I can update the proposed transaction amount to $${newAmount.toLocaleString()}. Would you like to apply this change?`
        suggestedUpdate = {
          title: card.title.replace(/\$[\d,]+(\.\d{1,2})?/, `$${newAmount.toLocaleString()}`), // Basic title update
          subtitle: card.subtitle.replace(/\$[\d,]+(\.\d{1,2})?/, `$${newAmount.toLocaleString()}`),
          impact: { ...card.impact, postActionBalance: card.impact.currentBalance - newAmount }, // Example impact update
        }
        isAiSuggestionPending = true
      }
    } else if (
      lowerCaseText.includes("prefer") ||
      lowerCaseText.includes("in the future") ||
      lowerCaseText.includes("remember this pattern")
    ) {
      aiResponseText = `Okay, I'll remember that preference for future similar tasks: "${userComment.text.substring(0, 50)}..."`
      memoryToCreate = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        description: `User preference: ${userComment.text}`,
        sourceCardId: card.id,
        triggeringCommentId: userComment.id,
      }
    } else if (lowerCaseText.includes("why is confidence") || lowerCaseText.includes("explain rationale")) {
      aiResponseText = `The confidence score of ${card.confidence}% is based on: ${card.rationale.substring(0, 100)}... For a full breakdown, please check the chain of thought.`
    }

    const aiComment: Comment = {
      id: uuidv4(),
      userId: "ai_assistant_01",
      authorName: "AI Assistant",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      timestamp: new Date().toISOString(),
      text: aiResponseText,
      role: "ai",
    }
    addCommentToCard(card.id, aiComment)

    if (suggestedUpdate) {
      updateCard(card.id, { suggestedUpdate, isAiSuggestionPending })
    }
    if (memoryToCreate) {
      addMemory(memoryToCreate)
      addToast({ message: "New memory added by AI based on your feedback!", status: "success" })
    }
  }

  const handleAddComment = () => {
    if (newComment.trim() === "") return
    const userComment: Comment = {
      id: uuidv4(),
      userId: "current_user_placeholder",
      authorName: "You",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      timestamp: new Date().toISOString(),
      text: newComment.trim(),
      role: "user",
    }
    addCommentToCard(card.id, userComment)
    setNewComment("")
    // Simulate AI processing after a short delay
    setTimeout(() => processUserCommentWithAI(userComment), 500)
  }

  const handleApplySuggestion = () => {
    applySuggestedUpdate(card.id)
    addToast({ message: "AI suggestion applied to the task.", status: "success" })
  }

  return (
    <div className="w-96 border-l h-full flex flex-col bg-background shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Action Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Summary Section */}
          <div className="flex items-start gap-3">
            <div className="text-3xl mt-1">{getCardTypeIcon()}</div>
            <div>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.subtitle}</p>
            </div>
          </div>

          {card.isAiSuggestionPending && card.suggestedUpdate && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                <span>AI Suggestion Pending</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                The AI has proposed changes based on the conversation. Review the latest AI comment.
              </p>
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8"
                onClick={handleApplySuggestion}
              >
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Apply AI Suggestion
              </Button>
            </div>
          )}

          <Separator />

          {/* Source Information */}
          <div>
            <h4 className="text-sm font-medium mb-1.5 text-muted-foreground">Source</h4>
            <div className="flex items-center gap-2 text-sm">
              {getSourceIcon("h-4 w-4")}
              <span>{card.sourceDetails.name}</span>
              {card.sourceDetails.identifier && (
                <span className="text-xs text-muted-foreground truncate">({card.sourceDetails.identifier})</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Chain of Thought */}
          <div>
            <h4 className="text-sm font-medium mb-1.5 text-muted-foreground">Chain of Thought</h4>
            <ol className="space-y-1.5 text-sm pl-5 list-decimal marker:text-primary/70">
              {card.chainOfThought.map((step, index) => (
                <li key={index} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          {/* Impact Analysis */}
          <div>
            <h4 className="text-sm font-medium mb-1.5 text-muted-foreground">Impact</h4>
            <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded-md space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Current balance:</span>
                <span className="font-medium">${card.impact.currentBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Post-action balance:</span>
                <span className="font-medium">${card.impact.postActionBalance.toLocaleString()}</span>
              </div>
              {card.impact.yield && (
                <div className="flex justify-between text-sm">
                  <span>Expected yield:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">+{card.impact.yield}%</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Log Information */}
          <div>
            <h4 className="text-sm font-medium mb-1.5 text-muted-foreground">Log Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs bg-muted dark:bg-muted/30 px-1.5 py-0.5 rounded">{card.logId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span>{new Date(card.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{card.confidence}%</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Discussion</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {card.comments && card.comments.length > 0 ? (
                card.comments.map((comment) => (
                  <div key={comment.id} className={cn("flex items-start gap-2.5", comment.role === "ai" && "ml-4")}>
                    <UIAvatar className="h-8 w-8">
                      <AvatarImage src={comment.avatarUrl || "/placeholder.svg"} alt={comment.authorName} />
                      <AvatarFallback>{comment.authorName.substring(0, 1)}</AvatarFallback>
                    </UIAvatar>
                    <div
                      className={cn(
                        "flex-1 p-2.5 rounded-md",
                        comment.role === "user" ? "bg-primary/10 dark:bg-primary/20" : "bg-sky-100 dark:bg-sky-900/30",
                      )}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            comment.role === "ai" && "text-sky-700 dark:text-sky-300",
                          )}
                        >
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No comments yet. Start the conversation!</p>
              )}
              <div ref={commentsEndRef} />
            </div>
            <div className="mt-3 flex gap-2 items-end">
              <Textarea
                placeholder="Ask AI or add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAddComment()
                  }
                }}
                className="text-sm min-h-[40px]"
                rows={1}
              />
              <Button size="icon" onClick={handleAddComment} disabled={newComment.trim() === ""}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button className="w-full h-10" onClick={handleApprove} disabled={card.isAiSuggestionPending}>
          Approve & Close
        </Button>
        {card.isAiSuggestionPending && (
          <p className="text-xs text-center mt-1 text-muted-foreground">
            Apply or discuss AI suggestion before approving.
          </p>
        )}
      </div>
    </div>
  )
}
