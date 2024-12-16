import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Twitter, MessageSquare, Zap } from 'lucide-react'

export function ConnectedApps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Apps</CardTitle>
        <CardDescription>Your integrated services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <Twitter className="w-4 h-4 mr-1" />
            Twitter
          </Badge>
          <Badge variant="secondary">
            <MessageSquare className="w-4 h-4 mr-1" />
            Slack
          </Badge>
          <Badge variant="secondary">
            <Zap className="w-4 h-4 mr-1" />
            Zapier
          </Badge>
        </div>
        <Button variant="outline" className="mt-4 w-full">
          Add More Integrations
        </Button>
      </CardContent>
    </Card>
  )
} 