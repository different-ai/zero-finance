'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Settings2, Plus, MoreVertical, Trash2, Edit2, GripVertical } from 'lucide-react';
// @ts-ignore - sonner toast import issue
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface ClassificationSettingsProps {
  className?: string;
}

export function ClassificationSettings({ className }: ClassificationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    enabled: true,
  });

  const utils = api.useUtils();
  const { data: settings, isLoading } = api.settings.classificationSettings.getUserClassificationSettings.useQuery();

  const createMutation = api.settings.classificationSettings.createClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('AI rule created successfully');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create AI rule');
    },
  });

  const updateMutation = api.settings.classificationSettings.updateClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('AI rule updated successfully');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update AI rule');
    },
  });

  const deleteMutation = api.settings.classificationSettings.deleteClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('AI rule deleted successfully');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete AI rule');
    },
  });

  const reorderMutation = api.settings.classificationSettings.reorderClassificationPrompts.useMutation({
    onSuccess: () => {
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({ name: '', prompt: '', enabled: true });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.prompt) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (setting: any) => {
    setEditingId(setting.id);
    setFormData({
      name: setting.name,
      prompt: setting.prompt,
      enabled: setting.enabled,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this AI rule?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    updateMutation.mutate({ id, enabled });
  };

  const canAddMore = (settings?.length || 0) < 10;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">AI Rules</h3>
          <p className="text-sm text-muted-foreground">
            Create rules to automatically process emails based on your criteria
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Loading...
            </div>
          ) : settings?.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              No AI rules yet
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {settings?.map((setting: any) => (
                <Card key={setting.id} className="p-3">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-move" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{setting.name}</h4>
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={(checked) => handleToggleEnabled(setting.id, checked)}
                          className="scale-75"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {setting.prompt}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(setting)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(setting.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit AI Rule' : 'Create AI Rule'}</DialogTitle>
            <DialogDescription>
              Define rules that automatically categorize and process your emails. You can specify conditions for tagging, categorization, or even auto-approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Auto-approve Dev Tools"
              />
            </div>
            <div>
              <Label htmlFor="prompt">Rule Description</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="e.g., If this is a receipt from developer tools like GitHub, Vercel, or AWS, categorize as 'Dev Tools' and mark as pre-approved"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Describe what emails should match and what actions to take. Use terms like &quot;auto-approve&quot; or &quot;pre-approve&quot; for automatic actions.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
              <Label htmlFor="enabled">Enable this rule</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 