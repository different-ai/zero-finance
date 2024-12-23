import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClassificationStore } from '@/stores/classification-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

export function AIAgentStore() {
  const agents = useClassificationStore((state) => state.agents);
  const toggleAgent = useClassificationStore((state) => state.toggleAgent);
  const isDemoMode = useDashboardStore((state) => state.isDemoMode);
  const setDemoMode = useDashboardStore((state) => state.setDemoMode);
  const [viewingAgent, setViewingAgent] = useState<string | null>(null);

  const handleDemoToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("0xHypr", "Toggling demo mode from", isDemoMode, "to", !isDemoMode);
    setDemoMode(!isDemoMode);
  };

  const currentViewingAgent = agents.find(agent => agent.id === viewingAgent);

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle>AI Agents</CardTitle>
          <CardDescription>Enable or disable AI agents</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {agent.view && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingAgent(agent.id)}
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant={agent.isActive ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAgent(agent.id);
                  }}
                >
                  {agent.isActive ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <h3 className="font-medium">Demo Mode</h3>
              <p className="text-sm text-muted-foreground">Toggle demo data for testing</p>
            </div>
            <Button
              variant={isDemoMode ? "default" : "outline"}
              onClick={handleDemoToggle}
              className="z-10"
            >
              {isDemoMode ? "Disable Demo" : "Enable Demo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewingAgent} onOpenChange={() => setViewingAgent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentViewingAgent?.name}</DialogTitle>
          </DialogHeader>
          {currentViewingAgent?.view?.()}
        </DialogContent>
      </Dialog>
    </>
  );
}

