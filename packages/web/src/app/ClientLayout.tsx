"use client"

import type React from "react"
import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { Toaster } from "sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"

  return (
    <>
      <SidebarProvider defaultOpen={isDashboard}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          {isDashboard && <AppSidebar />}

          <div className="flex flex-1 flex-col overflow-y-auto">
            <Suspense fallback={null}>
              <div className="flex flex-1 flex-col">
                {isDashboard && (
                  <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                    <SidebarTrigger />
                    <span className="text-lg font-semibold">Zero Finance</span>
                  </header>
                )}
                <main className="flex-1 bg-background text-foreground">{children}</main>
              </div>
            </Suspense>
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
      <SpeedInsights />
      <Analytics />
    </>
  )
}
