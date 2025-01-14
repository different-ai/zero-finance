import { PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

export function ResizeHandle({ className = '', id }: { className?: string, id?: string }) {
  return (
    <PanelResizeHandle
      id={id}
      className={cn(
        'group relative flex w-2 flex-col items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full',
        className
      )}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground/50 transition group-hover:text-muted-foreground" />
    </PanelResizeHandle>
  );
} 