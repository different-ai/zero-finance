'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { Settings2, Plus, MoreVertical, Trash2, Edit2, GripVertical } from 'lucide-react';
// @ts-ignore - sonner toast import issue
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ClassificationSettingsProps {
  className?: string;
}

export function ClassificationSettings({ className }: ClassificationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    enabled: true,
  });

  const utils = api.useUtils();
  const { data: settings, isLoading } = api.settings.classificationSettings.getUserClassificationSettings.useQuery();

  const createMutation = api.settings.classificationSettings.createClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('Classification prompt created');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
      resetForm();
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create classification prompt');
    },
  });

  const updateMutation = api.settings.classificationSettings.updateClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('Classification prompt updated');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
      resetForm();
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update classification prompt');
    },
  });

  const deleteMutation = api.settings.classificationSettings.deleteClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('Classification prompt deleted');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete classification prompt');
    },
  });

  const reorderMutation = api.settings.classificationSettings.reorderClassificationPrompts.useMutation({
    onSuccess: () => {
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
    },
  });

  const resetForm = () => {
    setEditingPrompt(null);
    setFormData({
      name: '',
      prompt: '',
      enabled: true,
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.prompt.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingPrompt) {
      updateMutation.mutate({
        id: editingPrompt,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (setting: any) => {
    setEditingPrompt(setting.id);
    setFormData({
      name: setting.name,
      prompt: setting.prompt,
      enabled: setting.enabled,
    });
    setIsDropdownOpen(false);
  };

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    updateMutation.mutate({
      id,
      enabled,
    });
  };

  const canAddMore = (settings?.length || 0) < 10;

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn("gap-2", className)}
          >
            <Settings2 className="h-4 w-4" />
            Classification
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Classification Settings</h3>
              {canAddMore && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="h-8 px-2"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                Loading...
              </div>
            ) : settings?.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                No classification prompts yet
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
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            handleEdit(setting);
                            setIsOpen(true);
                          }}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteMutation.mutate({ id: setting.id })}
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
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                setIsOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              Manage All Prompts
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {editingPrompt ? 'Edit Classification Prompt' : 'Create Classification Prompt'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g., Vendor Categorization"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Classification Prompt</label>
              <Textarea
                placeholder="e.g., If the email is from Amazon, AWS, or mentions Amazon services, classify it as 'Cloud Infrastructure'"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This prompt will be added to the AI&apos;s classification logic
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
              <label htmlFor="enabled" className="text-sm font-medium cursor-pointer">
                Enable this prompt
              </label>
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
              {editingPrompt ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 