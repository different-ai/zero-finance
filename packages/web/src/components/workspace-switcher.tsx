'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();

  const { data: workspaces } = api.workspace.getUserWorkspaces.useQuery();
  const { data: currentWorkspace } =
    api.workspace.getOrCreateWorkspace.useQuery();
  const switchWorkspace = api.workspace.setActiveWorkspace.useMutation({
    onSuccess: async () => {
      toast.success('Workspace switched');
      // Invalidate all queries to force refetch with new workspace context
      await utils.invalidate();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to switch workspace');
    },
  });

  const currentWorkspaceId = currentWorkspace?.workspaceId;
  const currentWorkspaceName =
    workspaces?.find((ws) => ws.workspaceId === currentWorkspaceId)
      ?.workspaceName || 'Select workspace';

  if (!workspaces || workspaces.length <= 1) {
    // Don't show switcher if user only has one workspace
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <Building2 className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <span className="truncate">{currentWorkspaceName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandEmpty>No workspace found.</CommandEmpty>
          <CommandGroup>
            {workspaces.map((workspace) => (
              <CommandItem
                key={workspace.workspaceId}
                value={workspace.workspaceId}
                onSelect={() => {
                  if (workspace.workspaceId !== currentWorkspaceId) {
                    switchWorkspace.mutate({
                      workspaceId: workspace.workspaceId,
                    });
                  }
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    currentWorkspaceId === workspace.workspaceId
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {workspace.workspaceName || 'Unnamed Workspace'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {workspace.role}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
