import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, Calendar, Settings, MessageSquare, Twitter, Brain, LucideIcon } from 'lucide-react'
import { taskAgent } from '@/agents/task-agent'
import { calendarAgent } from '@/agents/calendar-agent'
import { useClassificationStore } from '@/stores/classification-store'
import { useDashboardStore } from '@/stores/dashboard-store'
import type { Agent } from '@/agents/base-agent'

type DemoAgent = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  isBuiltIn: boolean
  isActive: boolean
  features: string[]
  comingSoon: true
}

type ExtendedAgent = Agent & {
  description: string
  icon: LucideIcon
  features: string[]
  stats: { total: number; today: number }
  comingSoon?: false
}

type DisplayAgent = ExtendedAgent | DemoAgent

export function AIAgentStore() {
  const { agents, toggleAgent, recognizedItems } = useClassificationStore()
  const { isDemoMode } = useDashboardStore()

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

  const builtInAgents: ExtendedAgent[] = [
    {
      ...taskAgent,
      description: "Automatically recognize tasks and seamlessly add them to your Obsidian vault. Works with your daily notes and task lists.",
      icon: CheckSquare,
      features: [
        "Detects actionable tasks from screen content",
        "Adds tasks to your daily notes",
        "Includes context and metadata",
        "Priority and due date detection",
        "Integrates with your Obsidian workflow"
      ],
      stats: getAgentStats(taskAgent.id),
      comingSoon: false
    },
    {
      ...calendarAgent,
      description: "Automatically recognize calendar events and create ICS files on demand. Integrates with your calendar system.",
      icon: Calendar,
      features: [
        "Detects events and meetings from screen content",
        "Creates ICS files for calendar import",
        "Captures attendees and location",
        "Adds events to your vault for reference",
        "Syncs with your calendar app"
      ],
      stats: getAgentStats(calendarAgent.id),
      comingSoon: false
    }
  ]

  const demoAgents: DemoAgent[] = [
    {
      id: 'meeting-summarizer',
      name: 'Meeting Summarizer',
      description: "Automatically generate summaries from your meetings and calls. Creates structured notes with action items.",
      icon: MessageSquare,
      isBuiltIn: false,
      isActive: false,
      features: [
        "Transcribes meeting audio in real-time",
        "Extracts key discussion points",
        "Identifies action items and decisions",
        "Creates meeting minutes in Obsidian",
        "Supports multiple speakers"
      ],
      comingSoon: true
    },
    {
      id: 'tweet-drafter',
      name: 'Tweet Drafter',
      description: "Draft and schedule tweets based on your content. Helps maintain a consistent social media presence.",
      icon: Twitter,
      isBuiltIn: false,
      isActive: false,
      features: [
        "Generates tweet threads from your notes",
        "Suggests optimal posting times",
        "Maintains your writing style",
        "Handles thread formatting",
        "Schedules posts automatically"
      ],
      comingSoon: true
    },
    {
      id: 'content-analyzer',
      name: 'Content Analyzer',
      description: "Analyze your content for insights, topics, and patterns. Helps organize and connect your knowledge.",
      icon: Brain,
      isBuiltIn: false,
      isActive: false,
      features: [
        "Identifies key topics and themes",
        "Creates knowledge graphs",
        "Suggests content connections",
        "Generates topic summaries",
        "Tracks content evolution"
      ],
      comingSoon: true
    }
  ]

  const allAgents: DisplayAgent[] = isDemoMode ? [...builtInAgents, ...demoAgents] : builtInAgents

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agents</h2>
          <p className="text-muted-foreground">
            {isDemoMode ? 'Built-in and upcoming agents' : 'Core agents for task and event recognition'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {allAgents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center space-x-2">
                  <agent.icon className="h-5 w-5 text-primary" />
                  <span>{agent.name}</span>
                </div>
              </CardTitle>
              {agent.comingSoon ? (
                <Badge variant="secondary">Coming Soon</Badge>
              ) : (
                <Badge variant={agent.isActive ? 'default' : 'secondary'}>
                  {agent.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {agent.description}
              </p>
              <ul className="text-sm space-y-2 mb-4">
                {agent.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                {!agent.comingSoon && (
                  <Button
                    variant={agent.isActive ? 'default' : 'outline'}
                    onClick={() => toggleAgent(agent.id)}
                  >
                    {agent.isActive ? 'Disable' : 'Enable'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={agent.comingSoon}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

