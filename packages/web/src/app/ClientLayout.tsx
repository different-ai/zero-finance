"use client"
import { DemoProvider, useDemoTimeline, type InboxItemData } from "@/context/demo-timeline-context"
import { Toaster } from "sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/demo/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TimelineControls } from "@/components/demo/timeline-controls"
import { ActionDetailsSidebar } from "@/components/demo/action-details-sidebar"
import { usePathname } from "next/navigation"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import type React from "react"
import { Suspense } from "react"

// New component to wrap content that uses DemoContext
function DemoAppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { currentScene, selectInboxItem } = useDemoTimeline() // Now safely called within DemoProvider's scope

  const isDashboard = pathname === "/dashboard"
  const isGmail = pathname === "/gmail"
  const isLandingPage = pathname === "/"

  // Determine if the 20% demo controls column should be shown
  const showDemoControlsColumn = (isDashboard || isGmail) && !isLandingPage
  const defaultSidebarOpen = isDashboard

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Left App Sidebar (fixed, handled by SidebarProvider) */}
        {isDashboard && <AppSidebar />}

        {/* Main Application Content Area */}
        <div className={`flex-grow flex flex-col overflow-y-auto ${showDemoControlsColumn ? "md:mr-[20vw]" : ""}`}>
          <Suspense fallback={null}>
            <div
              className={`flex flex-col flex-1 ${isDashboard ? "md:pl-[var(--sidebar-width)] group-data-[state=expanded]:md:pl-[var(--sidebar-width)] group-data-[state=collapsed]:md:pl-[var(--sidebar-width-icon)]" : ""} transition-[padding] duration-300 ease-in-out`}
            >
              {isDashboard && (
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                  <SidebarTrigger />
                  <span className="font-semibold text-lg">Zero Finance</span>
                </header>
              )}
              <main className={`flex-1 ${isGmail ? "bg-muted/40" : "bg-background"} text-foreground`}>{children}</main>
            </div>
          </Suspense>
        </div>

        {/* Demo Controls Column (fixed to the right, 20% width on md+) */}
        {showDemoControlsColumn && (
          <div className="fixed top-0 right-0 h-screen w-[20vw] hidden md:flex flex-col border-l bg-card text-card-foreground shadow-lg overflow-y-auto z-10">
            <TimelineControls />
          </div>
        )}

        {/* Action Details Sidebar - Fixed position, but its 'right' offset is dynamic */}
        {currentScene && (
          <ActionDetailsSidebar
            item={(currentScene.selectedInboxItem as InboxItemData | null) || null}
            isOpen={currentScene.showActionDetailsSidebar || false}
            onClose={() => selectInboxItem(null)}
            showDemoControlsColumn={showDemoControlsColumn}
          />
        )}
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoProvider>
        {/* Render DemoAppWrapper as a child of DemoProvider */}
        <DemoAppWrapper>{children}</DemoAppWrapper>
      </DemoProvider>
      <SpeedInsights />
      <Analytics />
    </>
  )
}
