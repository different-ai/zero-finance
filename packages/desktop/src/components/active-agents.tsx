import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { useClassificationStore } from '@/stores/classification-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import type { RecognizedContext } from '@/agents/base-agent';
import { RecognizedItem } from './event-classification';

export function ActiveAgents() {
  const { agents, recognizedItems, setRecognizedItems } = useClassificationStore();
  const { setActivePanel } = useDashboardStore();
  
  // Ensure recognizedItems is always an array
  const items = Array.isArray(recognizedItems) ? recognizedItems : [];
  
  const getAgentStats = (agentId: string) => {
    const agentItems = items.filter(item => item.agentId === agentId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayItems = agentItems.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= today;
    });

    return {
      total: agentItems.length,
      today: todayItems.length,
      items: agentItems
    };
  };

  const removeRecognizedItem = (id: string) => {
    setRecognizedItems(items.filter(item => item.id !== id));
  };

  const activeAgents = agents.filter(agent => agent.isActive);

  const renderRecognizedItem = (item: RecognizedItem) => {
    const agent = agents.find(a => a.id === item.agentId);
    if (!agent) return null;

    // Create a proper RecognizedContext from the item
    const context: RecognizedContext = {
      id: item.id,
      type: item.type,
      content: item.content,
      timestamp: item.timestamp,
      confidence: item.confidence,
      source: item.source,
      summary: item.summary,
      category: item.category,
      priority: item.priority,
      dueDate: item.dueDate,
      people: item.people,
      location: item.location,
      amount: item.amount
    };

    return (
      <div key={item.id} className="space-y-2">
        {agent.render(context, () => removeRecognizedItem(item.id))}
      </div>
    );
  };

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
          const stats = getAgentStats(agent.id);

          return (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
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

                {/* Show recognized items for this agent */}
                <div className="space-y-2">
                  {stats.items.map(renderRecognizedItem)}
                </div>
              </CardContent>
            </Card>
          );
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
  );
} 