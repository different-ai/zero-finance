import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { useClassificationStore } from '@/stores/classification-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import type { RecognizedItem } from '@/agents/base-agent';

export function ActiveAgents() {
  const { agents, recognizedItems } = useClassificationStore();
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

  const activeAgents = agents.filter(agent => agent.isActive);

  const renderItemContent = (item: RecognizedItem) => {
    if (!item?.data) return null;
    
    return (
      <div 
        key={item.id} 
        className="p-3 rounded-lg bg-muted/50 border flex items-center justify-between"
      >
        <div>
          <p className="font-medium">{item.data.title}</p>
          {item.data.content && (
            <p className="text-sm text-muted-foreground">
              {item.data.content.length > 100 
                ? `${item.data.content.substring(0, 100)}...` 
                : item.data.content}
            </p>
          )}
        </div>
        <Button 
          size="sm"
          variant="outline"
          onClick={() => {
            console.log("0xHypr", "Action for item:", item);
          }}
        >
          {item.type === 'task' ? 'Create Task' :
           item.type === 'event' ? 'Add to Calendar' :
           item.type === 'invoice' ? 'Process Invoice' : 'Action'}
        </Button>
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
                  {stats.items.map(renderItemContent)}
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