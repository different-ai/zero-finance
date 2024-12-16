import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, ArrowRight, type LucideIcon } from 'lucide-react'
import { useClassificationStore } from '@/stores/classification-store'
import { useDashboardStore } from '@/stores/dashboard-store'

// Add type for agent with icon
type DisplayAgent = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  isActive: boolean
  isBuiltIn: boolean
}

export function ActiveAgents() {
  const { agents, recognizedItems } = useClassificationStore()
  const { setActivePanel } = useDashboardStore()

  const getAgentStats = (agentId: string) => {
    const agentItems = recognizedItems.filter(item => item.agentId === agentId)
    return {
      total: agentItems.length,
      today: agentItems.filter(item => {
        const itemDate = new Date(item.timestamp)
        const today = new Date()
        return itemDate.toDateString() === today.toDateString()
      }).length
    }
  }

  // Make sure agents have icons
  const activeAgents = agents.filter(agent => agent.isActive && agent.icon)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Agents</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {activeAgents.length} Active
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActivePanel('aiAgents')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Agents
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {activeAgents.map((agent) => {
          const stats = getAgentStats(agent.id)
          const AgentIcon = agent.icon

          return (
            <Card key={agent.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center space-x-2">
                    {AgentIcon && <AgentIcon className="h-5 w-5 text-primary" />}
                    <span>{agent.name}</span>
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Today: {stats.today}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Total: {stats.total}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {agent.description}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0"
                  onClick={() => setActivePanel('aiAgents')}
                >
                  Configure <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )
        })}

        {activeAgents.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No active agents. Enable agents to start automating your workflow.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActivePanel('aiAgents')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Agents
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 