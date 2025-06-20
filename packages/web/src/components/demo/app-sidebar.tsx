"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar" // Assuming this is the shadcn sidebar from docs [^1]
import { Home, FileText, Settings, Landmark, HandCoins, BarChart3, LogOut, Package2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarNavItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Invoices", icon: FileText, href: "#" },
  { title: "Tax Vault", icon: Landmark, href: "#" },
  { title: "Ledger", icon: HandCoins, href: "#" },
  { title: "Reports", icon: BarChart3, href: "#" },
  { title: "Settings", icon: Settings, href: "#" },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" className="border-r hidden md:flex">
      {" "}
      {/* Use collapsible="icon" [^1] */}
      <SidebarHeader className="p-4 flex justify-between items-center h-14 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg group-data-[state=collapsed]:hidden">
          <Package2 className="h-6 w-6 text-primary" />
          <span>Zero Finance</span>
        </Link>
        <SidebarTrigger className="group-data-[state=expanded]:ml-auto" />
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup className="py-2">
          <SidebarMenu>
            {sidebarNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.title, side: "right", align: "center" }}
                  className="justify-start"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[state=collapsed]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: "Logout", side: "right", align: "center" }}
              className="justify-start"
            >
              <Link href="#" className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span className="group-data-[state=collapsed]:hidden">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
