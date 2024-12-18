import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettingsStore } from '@/stores/settings-store';

const AVAILABLE_APPS = [
  { id: 'Telegram', label: 'Telegram' },
  { id: 'Arc', label: 'Arc Browser' },
  { id: 'Chrome', label: 'Google Chrome' },
  { id: 'Safari', label: 'Safari' },
  { id: 'Discord', label: 'Discord' },
  { id: 'Slack', label: 'Slack' },
  { id: 'Messages', label: 'Messages' },
];

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { monitoredApps, setMonitoredApps } = useSettingsStore();

  const handleAppToggle = (appId: string) => {
    if (monitoredApps.includes(appId)) {
      setMonitoredApps(monitoredApps.filter(app => app !== appId));
    } else {
      setMonitoredApps([...monitoredApps, appId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your HyprSqrl preferences
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Monitored Applications</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select which applications to monitor for tasks and events
              </p>
              <div className="space-y-3">
                {AVAILABLE_APPS.map((app) => (
                  <div key={app.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={app.id}
                      checked={monitoredApps.includes(app.id)}
                      onCheckedChange={() => handleAppToggle(app.id)}
                    />
                    <Label
                      htmlFor={app.id}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {app.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 