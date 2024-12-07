import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, Calendar, FileText, Mail, PenTool, Search, Twitter } from 'lucide-react'

const initialAgents = [
  { 
    id: 1, 
    name: 'Tweet Drafter', 
    icon: Twitter, 
    installed: true,
    description: 'Automatically drafts tweets based on your content and schedule.'
  },
  { 
    id: 2, 
    name: 'Meeting Scheduler', 
    icon: Calendar, 
    installed: false,
    description: 'Coordinates and schedules meetings based on participants\' availability.'
  },
  { 
    id: 3, 
    name: 'Email Summarizer', 
    icon: Mail, 
    installed: true,
    description: 'Provides concise summaries of long emails and threads.'
  },
  { 
    id: 4, 
    name: 'Document Drafter', 
    icon: FileText, 
    installed: false,
    description: 'Creates initial drafts of documents based on your inputs and templates.'
  },
  { 
    id: 5, 
    name: 'Research Assistant', 
    icon: Search, 
    installed: false,
    description: 'Gathers and summarizes information on specified topics from reliable sources.'
  },
  { 
    id: 6, 
    name: 'Presentation Creator', 
    icon: PenTool, 
    installed: false,
    description: 'Generates presentation outlines and slides based on your content.'
  },
]

export function AIAgentStore() {
  const [agents, setAgents] = useState(initialAgents)

  const toggleInstallation = (id) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, installed: !agent.installed } : agent
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Store</CardTitle>
          <CardDescription>Discover and manage AI agents to automate your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <agent.icon className="h-6 w-6" />
                    <span>{agent.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={agent.installed ? 'default' : 'secondary'}>
                      {agent.installed ? 'Installed' : 'Available'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => toggleInstallation(agent.id)}>
                      {agent.installed ? 'Uninstall' : 'Install'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active AI Agents</CardTitle>
          <CardDescription>Currently running automations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.filter(agent => agent.installed).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <agent.icon className="h-6 w-6" />
                  <span>{agent.name}</span>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

