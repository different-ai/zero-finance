import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, Slack, Mail, MessageSquare, GitBranch, BellIcon as BrandTelegram, Monitor, Twitter, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialIntegrations = [
  { id: 1, name: 'GitHub', icon: Github, status: 'Connected', type: 'Development' },
  { id: 2, name: 'Slack', icon: Slack, status: 'Connected', type: 'Communication' },
  { id: 3, name: 'Linear', icon: GitBranch, status: 'Disconnected', type: 'Project Management' },
  { id: 4, name: 'Telegram', icon: BrandTelegram, status: 'Disconnected', type: 'Communication' },
  { id: 5, name: 'Screenpipe', icon: Monitor, status: 'Connected', type: 'Screen Capture' },
  { id: 6, name: 'Email', icon: Mail, status: 'Connected', type: 'Communication' },
  { 
    id: 7, 
    name: 'Twitter', 
    icon: Twitter, 
    status: 'Connected', 
    type: 'Social Media',
    agent: {
      name: 'Create Tweet in Response to Message',
      description: 'Automatically drafts tweets based on messages, using Unconf\'s brand voice',
      configured: true
    }
  },
]

export function Integrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [twitterUsername, setTwitterUsername] = useState('@UnconfCrypto')

  const toggleConnection = (id) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, status: integration.status === 'Connected' ? 'Disconnected' : 'Connected' }
        : integration
    ))
  }

  const configureAgent = (id) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id && integration.agent
        ? { ...integration, agent: { ...integration.agent, configured: !integration.agent.configured } }
        : integration
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Apps</CardTitle>
          <CardDescription>Manage your integrated services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className={`p-4 flex flex-col items-center justify-center ${integration.status === 'Connected' ? 'bg-primary/10' : ''}`}>
                <integration.icon className="h-10 w-10 mb-2" />
                <h3 className="font-semibold text-center">{integration.name}</h3>
                <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                  {integration.status}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => toggleConnection(integration.id)}
                >
                  {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </Button>
              </Card>
            ))}
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
                <Plus className="h-10 w-10 mb-2" />
                <h3 className="font-semibold text-center">Add New Integration</h3>
                <Button variant="outline" size="sm" className="mt-2">
                  Browse Integrations
                </Button>
              </Card>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>Configure your connected apps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(i => i.status === 'Connected').map((integration) => (
              <div key={integration.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <integration.icon className="h-6 w-6" />
                  <span>{integration.name}</span>
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

