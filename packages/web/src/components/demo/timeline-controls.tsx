"use client"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, RotateCcw, Timer, SkipBack, EyeOff, Eye, Mic, ListChecks } from "lucide-react"
import { useDemoTimeline } from "@/context/demo-timeline-context"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function TimelineControls() {
  const {
    scenes, // Get all scenes
    currentScene,
    currentSceneIndex,
    isPlaying,
    playDemo,
    pauseDemo,
    nextScene,
    prevScene,
    resetDemo,
    totalDuration,
    elapsedTime,
    jumpToScene, // For jumping from the script list
  } = useDemoTimeline()
  const [isContentVisible, setIsContentVisible] = useState(true)
  const pathname = usePathname()
  const currentStepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pathname === "/") {
      setIsContentVisible(false)
    } else {
      setIsContentVisible(true)
    }
  }, [pathname])

  useEffect(() => {
    if (isContentVisible && currentStepRef.current) {
      currentStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [currentSceneIndex, isContentVisible])

  if (!currentScene) return null

  const progressPercentage = totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0

  return (
    <div className="h-full flex flex-col p-4 relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsContentVisible(!isContentVisible)}
        className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm border shadow-md"
        title={isContentVisible ? "Hide Demo Details" : "Show Demo Details"}
      >
        {isContentVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="sr-only">{isContentVisible ? "Hide Details" : "Show Details"}</span>
      </Button>

      <AnimatePresence>
        {isContentVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-full h-full flex flex-col overflow-hidden pt-8"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo Controls</div>
              <div className="text-xs text-muted-foreground flex items-center">
                <Timer className="inline h-3.5 w-3.5 mr-1" />
                {elapsedTime.toFixed(1)}s / {totalDuration.toFixed(0)}s
              </div>
            </div>
            <Progress value={progressPercentage} className="w-full h-1.5 mb-3" />

            {/* Current Step Details (can be kept or removed if full script view is enough) */}
            <div className="mb-3 border-b pb-3">
              <p className="text-xs text-foreground mb-1 font-medium">
                Current Step ({currentScene.timeStart}s - {currentScene.timeEnd}s):
              </p>
              <p className="text-xs text-muted-foreground leading-tight">{currentScene.description}</p>
              {currentScene.voiceOver && (
                <>
                  <p className="text-xs text-foreground mb-1 mt-2 font-medium flex items-center">
                    <Mic className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Script:
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight bg-muted/50 p-2 rounded-md">
                    {currentScene.voiceOver}
                  </p>
                </>
              )}
            </div>

            {/* Scrollable Full Script/Scene List */}
            <div className="flex items-center text-xs text-foreground mb-1 font-medium">
              <ListChecks className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Full Demo Script:
            </div>
            <ScrollArea className="flex-1 pr-3 -mr-3 mb-3 border rounded-md">
              <div className="p-2 space-y-1">
                {scenes.map((sceneItem, index) => (
                  <div
                    key={sceneItem.timeStart + "-" + index}
                    ref={index === currentSceneIndex ? currentStepRef : null}
                    onClick={() => jumpToScene(index)}
                    className={cn(
                      "p-1.5 rounded-md cursor-pointer hover:bg-muted/80 transition-colors",
                      index === currentSceneIndex ? "bg-muted ring-1 ring-primary/50 shadow-sm" : "bg-muted/30",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[11px] font-medium",
                        index === currentSceneIndex ? "text-primary" : "text-foreground/80",
                      )}
                    >
                      {sceneItem.timeStart}s - {sceneItem.timeEnd}s: {sceneItem.description}
                    </p>
                    {sceneItem.voiceOver && (
                      <p
                        className={cn(
                          "text-[10px] mt-0.5",
                          index === currentSceneIndex ? "text-muted-foreground" : "text-muted-foreground/70",
                        )}
                      >
                        <em>
                          "{sceneItem.voiceOver.substring(0, 100)}
                          {sceneItem.voiceOver.length > 100 ? "..." : ""}"
                        </em>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2 mt-auto">
              <Button variant="ghost" size="icon" onClick={resetDemo} title="Reset (R)">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={prevScene} title="Previous Scene (P)">
                <SkipBack className="h-4 w-4" />
              </Button>
              {isPlaying ? (
                <Button
                  variant="default"
                  size="icon"
                  onClick={pauseDemo}
                  title="Pause (Space)"
                  className="bg-primary hover:bg-primary/90 w-10 h-10"
                >
                  <Pause className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="icon"
                  onClick={playDemo}
                  title="Play (Space)"
                  className="bg-primary hover:bg-primary/90 w-10 h-10"
                >
                  <Play className="h-5 w-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={nextScene} title="Next Scene (N)">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Use <kbd className="p-1 text-xs font-semibold bg-muted rounded">Space</kbd>,{" "}
              <kbd className="p-1 text-xs font-semibold bg-muted rounded">N</kbd>,{" "}
              <kbd className="p-1 text-xs font-semibold bg-muted rounded">P</kbd>,{" "}
              <kbd className="p-1 text-xs font-semibold bg-muted rounded">R</kbd> for controls.
            </p>
          </motion.div>
        )}
        {!isContentVisible && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Demo details hidden.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
