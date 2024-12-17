import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, CheckSquare } from 'lucide-react'
import { useClassificationStore } from '@/stores/classification-store'
import { useDashboardStore } from '@/stores/dashboard-store'

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

  const activeAgents = agents.filter(agent => agent.isActive)

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
          const AgentIcon = agent.icon || CheckSquare

          return (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AgentIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{agent.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      Today: {stats.today}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Total: {stats.total}
                    </Badge>
                  </div>
                </div>
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