"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  CreditCard,
  FileText,
  Inbox,
  Landmark,
  LogOut,
  Percent,
  Search,
  Settings,
  User,
  Brain,
} from "lucide-react"
import { usePathname } from "next/navigation"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [hasSafeActions, setHasSafeActions] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { name: "Inbox", icon: Inbox, path: "/" },
    { name: "Balances", icon: CreditCard, path: "/balances" },
    { name: "Ledger", icon: BarChart3, path: "/ledger" },
    { name: "Invoices", icon: FileText, path: "/invoices" },
    { name: "Tax", icon: Landmark, path: "/tax" },
    { name: "Yield", icon: Percent, path: "/yield" },
    { name: "Memory", icon: Brain, path: "/memory" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-lg">hyper</span>

              <div className="h-8 px-1 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
                stable
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)}
                    tooltip={item.name}
                  >
                    <a href={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="text-xs text-muted-foreground">Version 1.0.0</div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header Bar */}
          <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2" />
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Quick search (⌘K)" className="pl-8 h-9" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {hasSafeActions && (
                <Button size="sm" className="h-9">
                  Approve all safe
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
