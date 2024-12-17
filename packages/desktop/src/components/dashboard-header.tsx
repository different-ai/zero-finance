import { motion } from 'framer-motion'
import { Activity, Bell, Zap, Layers, Settings, User, BarChart, Beaker } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ClassificationLog } from '@/components/classification-log'
import { useState } from 'react'
import { useDashboardStore } from '@/stores/dashboard-store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const menuItems = [
  { id: 'overview', icon: Activity, label: 'Overview' },
  { id: 'tasks', icon: Zap, label: 'Tasks & Automations' },
  { id: 'integrations', icon: Layers, label: 'Integrations' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'aiAgents', icon: User, label: 'AI Agents' },
  { id: 'insights', icon: BarChart, label: 'Insights' },
]

export function DashboardHeader({ activePanel, setActivePanel }) {
  const [showLog, setShowLog] = useState(false)
  const { isDemoMode, toggleDemoMode } = useDashboardStore()
  
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-primary">
            hyprsqrl
          </span>
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`relative nav-item ${activePanel === item.id ? 'text-primary' : 'text-foreground'}`}
                onClick={() => setActivePanel(item.id)}
              >
                <item.icon className={`h-5 w-5 mr-2 ${activePanel === item.id ? 'text-primary' : ''}`} />
                {item.label}
                {activePanel === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activePanel"
                  />
                )}
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => setShowLog(true)}>
                View Classification Log
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center">
                  <Beaker className="mr-2 h-4 w-4" />
                  <span>Demo Mode</span>
                </div>
                <Switch
                  checked={isDemoMode}
                  onCheckedChange={toggleDemoMode}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ClassificationLog 
          open={showLog} 
          onOpenChange={setShowLog}
        />
      </div>
    </header>
  )
}

