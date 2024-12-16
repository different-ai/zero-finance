import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Twitter, MessageSquare, ArrowRight } from 'lucide-react'

export function ActiveAgents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active AI Agents</CardTitle>
        <CardDescription>Currently running automations</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              <span>Tweet Drafter</span>
            </div>
            <Badge>Active</Badge>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span>Meeting Summarizer</span>
            </div>
            <Badge>Active</Badge>
          </li>
        </ul>
        <Button variant="link" className="mt-4 w-full">
          Manage AI Agents <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
} 