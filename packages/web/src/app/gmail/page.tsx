"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail } from "lucide-react"
import { useDemoTimeline } from "@/context/demo-timeline-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GmailPage() {
  const { currentScene, scenes, jumpToScene } = useDemoTimeline()
  const router = useRouter()

  useEffect(() => {
    // If the current scene is not meant to be on the Gmail page, redirect to its intended route
    if (currentScene?.currentRoute !== "/gmail") {
      const targetSceneIndex = scenes.findIndex((s) => s.timeStart === currentScene?.timeStart)
      if (targetSceneIndex !== -1 && scenes[targetSceneIndex].currentRoute !== "/gmail") {
        router.push(scenes[targetSceneIndex].currentRoute)
      } else if (targetSceneIndex === -1) {
        router.push("/") // Fallback to landing
      }
    }
  }, [currentScene, scenes, router])

  const handleBackToDashboard = () => {
    // Find the next dashboard scene or any dashboard scene to jump to
    const nextDashboardSceneIndex = scenes.findIndex(
      (s) => s.timeStart >= (currentScene?.timeEnd || 0) && s.currentRoute === "/dashboard",
    )
    if (nextDashboardSceneIndex !== -1) {
      jumpToScene(nextDashboardSceneIndex)
    } else {
      const anyDashboardScene = scenes.find((s) => s.currentRoute === "/dashboard")
      if (anyDashboardScene) {
        const anyDashboardSceneIndex = scenes.indexOf(anyDashboardScene)
        jumpToScene(anyDashboardSceneIndex)
      } else {
        router.push("/dashboard") // Absolute fallback
      }
    }
  }

  // This page will now primarily serve as a fallback or if explicitly navigated to outside the demo flow.
  // The previous "search view" logic is removed as it's no longer part of the main demo.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
        <header className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-medium text-gray-700">Gmail</h2>
          </div>
          <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </header>
        <div className="p-6 text-sm">
          <div className="flex justify-between text-gray-500 mb-1">
            <p>
              From: <span className="text-gray-800 font-medium">Zero Finance {"<noreply@zero.finance>"}</span>
            </p>
            <p>
              Date: <span className="text-gray-800">jun 11, 2025, 10:02 am</span>
            </p>
          </div>
          <p className="text-gray-500 mb-3">
            To: <span className="text-gray-800 font-medium">Acme Corp {"<billing@acme.example>"}</span>
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice #4128 for €8,500 Due</h3>

          <div className="space-y-3 text-gray-700">
            <p>Dear Acme Corp,</p>
            <p>Please find attached your invoice #4128 for €8,500. This invoice is due today.</p>
            <p>You can view and pay your invoice online using the link below:</p>
            <div className="my-4">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-block px-5 py-2.5 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Pay Invoice Now
              </a>
              <p className="text-xs text-gray-500 mt-1">(Mock link: https://pay.zero.finance/inv_4128)</p>
            </div>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Thank you,</p>
            <p className="font-medium">The Zero Finance Team</p>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">This is a mocked representation of an email.</p>
    </div>
  )
}
