// connected-apps.tsx
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Twitter, MessageSquare, Zap, Plus } from 'lucide-react'
import { BrandLogo } from './pipe-icon'

export function ConnectedApps() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">Connected Apps</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Your integrated services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {/* Active integration (Pipe) */}
          <Badge 
            variant="default" 
            className="flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 cursor-pointer"
          >
            <div className="w-5 h-5 mr-2.5 rounded-[4px] overflow-hidden bg-black/10 flex items-center justify-center">
              <BrandLogo 
                size="sm" 
                className="w-full h-full" 
              />
            </div>
            <span className="font-medium text-primary-foreground">Screenpipe</span>
          </Badge>

          {/* Inactive integrations */}
          {[
            { icon: Twitter, label: 'Twitter' },
            { icon: MessageSquare, label: 'Slack' },
            { icon: Zap, label: 'Zapier' },
          ].map((app) => (
            <Badge
              key={app.label}
              variant="secondary"
              className="flex items-center px-4 py-2 bg-muted/50 hover:bg-muted transition-colors cursor-pointer border border-muted-foreground/10"
            >
              <app.icon className="w-5 h-5 mr-2.5 opacity-70" />
              <span className="font-medium">{app.label}</span>
            </Badge>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="mt-6 w-full h-10 text-sm font-medium border-dashed hover:border-solid hover:bg-muted/50 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Integrations
        </Button>
      </CardContent>
    </Card>
  )
}