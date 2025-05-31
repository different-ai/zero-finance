// @ts-nocheck
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { InboxCard } from "@/types/inbox"

interface LowConfidenceModalProps {
  card: InboxCard
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (card: InboxCard, answers: Record<string, string>) => void
}

export function LowConfidenceModal({ card, open, onOpenChange, onConfirm }: LowConfidenceModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [newConfidence, setNewConfidence] = useState(card.confidence)

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers({
      ...answers,
      [question]: answer,
    })

    // Simulate confidence recalculation
    setNewConfidence(Math.min(95, card.confidence + 15))
  }

  const handleConfirm = () => {
    onConfirm(card, answers)
    onOpenChange(false)
  }

  // Example questions based on card type
  const questions = [
    {
      id: "client_payment",
      question: `Is '${card.title.split(" ").slice(-1)}' a client payment?`,
      options: ["Yes", "No", "Unsure"],
    },
    {
      id: "recurring",
      question: "Is this a recurring transaction?",
      options: ["Yes", "No", "Unsure"],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Required</DialogTitle>
          <DialogDescription>We need additional information to process this action with confidence.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label>{q.question}</Label>
              <RadioGroup onValueChange={(value) => handleAnswerChange(q.id, value)} defaultValue={answers[q.id]}>
                {q.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                    <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">New confidence score:</span>
              <span className="text-sm font-bold">
                {newConfidence}%
                {newConfidence > card.confidence && (
                  <span className="text-green-600 ml-1">(+{(newConfidence - card.confidence).toFixed(0)}%)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={Object.keys(answers).length < questions.length}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
