"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DemoStep } from "@/lib/types"
import { CheckCircle, Circle, Play, Pause, RotateCcw } from "lucide-react"

interface DemoPlayerProps {
  script: DemoStep[]
  currentStep: number
  onNextStep: () => void
  onReset: () => void
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

export default function DemoPlayer({
  script,
  currentStep,
  onNextStep,
  onReset,
  isPlaying,
  onPlay,
  onPause,
}: DemoPlayerProps) {
  return (
    <div className="flex h-full flex-col p-4">
      {/* Controls moved to top */}
      <div className="mb-4 flex-shrink-0 space-y-2 border-b pb-4 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={onReset} variant="outline" className="bg-transparent">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          {isPlaying ? (
            <Button onClick={onPause} className="col-span-2">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button onClick={onPlay} disabled={currentStep >= script.length - 1} className="col-span-2">
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
          )}
        </div>
        <Button
          onClick={onNextStep}
          disabled={isPlaying || currentStep >= script.length - 1}
          variant="ghost"
          className="w-full"
        >
          Next Step
        </Button>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Demo Player</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Press Play to start the automated demo sequence.</p>
      <div className="flex-grow space-y-4 overflow-y-auto">
        {script.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div
              key={step.title}
              className={cn(
                "rounded-lg border p-3 transition-all",
                isCurrent ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700",
                isCompleted ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "",
              )}
            >
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                ) : isCurrent ? (
                  <Play className="h-5 w-5 flex-shrink-0 text-blue-600 animate-pulse" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 text-gray-400" />
                )}
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{step.title}</h3>
              </div>
              <p className="mt-1 pl-8 text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
