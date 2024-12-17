import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Calendar, CheckSquare } from 'lucide-react'
import { useClassificationStore } from '@/stores/classification-store'
import type { RecognizedItem } from '@/stores/classification-store'

export function RecognizedItems() {
  const { recognizedItems, removeRecognizedItem, agents } = useClassificationStore()

  const getAgentIcon = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent?.icon || null
  }

  const renderItemContent = (item: RecognizedItem) => {
    const AgentIcon = getAgentIcon(item.agentId)

    return (
      <div className="relative flex flex-col space-y-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {AgentIcon && <AgentIcon className="h-4 w-4 text-muted-foreground" />}
            <h4 className="font-medium">{item.data.title}</h4>
          </div>
          <Badge variant={item.confidence > 0.8 ? 'default' : 'secondary'}>
            {Math.round(item.confidence * 100)}%
          </Badge>
        </div>

        {item.data.details && (
          <p className="text-sm text-muted-foreground">{item.data.details}</p>
        )}

        {item.type === 'event' && (
          <div className="text-sm space-y-1">
            <p>Start: {new Date(item.data.startTime).toLocaleString()}</p>
            <p>End: {new Date(item.data.endTime).toLocaleString()}</p>
            {item.data.location && <p>Location: {item.data.location}</p>}
            {item.data.attendees?.length > 0 && (
              <p>Attendees: {item.data.attendees.join(', ')}</p>
            )}
          </div>
        )}

        <Button 
          size="sm" 
          variant="ghost"
          className="absolute top-2 right-2"
          onClick={() => removeRecognizedItem(item.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const taskItems = recognizedItems.filter(item => item.type === 'task')
  const eventItems = recognizedItems.filter(item => item.type === 'event')

  return (
    <div className="space-y-6">
      {taskItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <CardTitle>Recognized Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskItems.map(item => (
              <div key={item.id} className="rounded-lg border bg-card">
                {renderItemContent(item)}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {eventItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Recognized Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventItems.map(item => (
              <div key={item.id} className="rounded-lg border bg-card">
                {renderItemContent(item)}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 