"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface ActionToastProps {
  message: string
  status: "success" | "error" | "loading"
  onUndo?: () => void
  autoClose?: boolean
  duration?: number
  onClose: () => void
}

export function ActionToast({ message, status, onUndo, autoClose = true, duration = 5000, onClose }: ActionToastProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!autoClose || status === "loading") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer)
          setVisible(false)
          setTimeout(() => onClose(), 300)
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [autoClose, duration, onClose, status])

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg border bg-background p-4 shadow-lg transition-opacity duration-300",
        status === "loading" && "animate-pulse",
      )}
    >
      {status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      {status === "error" && <XCircle className="h-5 w-5 text-destructive" />}

      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {autoClose && status === "success" && onUndo && (
          <p className="text-xs text-muted-foreground">Undo available for {Math.ceil(timeLeft / 1000)}s</p>
        )}
      </div>

      {status === "success" && onUndo && (
        <Button size="sm" variant="ghost" onClick={onUndo}>
          Undo
        </Button>
      )}
    </div>
  )
}
