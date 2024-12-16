// connected-apps.tsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor, Plus, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/stores/dashboard-store'

type Integration = {
  id: string
  name: string
  icon: LucideIcon
  status: 'Connected' | 'Disconnected'
  type: string
  isDemo?: boolean
  description?: string
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'screenpipe',
    name: 'Screenpipe',
    icon: Monitor,
    status: 'Connected',
    type: 'Screen Capture',
    description: 'Captures and processes screen content for task and event detection'
  }
]

export function ConnectedApps() {
  const { setActivePanel } = useDashboardStore()

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {INTEGRATIONS.map((integration) => (
            <Card 
              key={integration.id} 
              className="relative p-6 flex flex-col bg-card border-0 shadow-none"
            >
              <div className="flex flex-col space-y-2">
                <integration.icon className="h-8 w-8 text-foreground mb-2" />
                <h3 className="font-semibold text-lg">{integration.name}</h3>
                <Badge 
                  variant="default" 
                  className="w-fit text-xs font-medium"
                >
                  {integration.status}
                </Badge>
                {integration.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {integration.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
          <Card 
            className="relative p-6 flex flex-col items-center justify-center border border-dashed bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <Plus className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Add Integration</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActivePanel('integrations')}
              >
                View Available
              </Button>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}