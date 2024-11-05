import { Button } from '@/components/ui/button';
import { Panel } from 'react-resizable-panels';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsiblePaneProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  side?: 'left' | 'right';
  className?: string;
}

export function CollapsiblePane({
  children,
  defaultSize = 20,
  minSize = 10,
  maxSize = 40,
  isCollapsed = false,
  onCollapse,
  side = 'left',
  className,
}: CollapsiblePaneProps) {
  return (
    <Panel
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      className={cn('relative', className)}
      style={{ display: isCollapsed ? 'none' : undefined }}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute top-2 z-10 h-6 w-6',
          side === 'left' ? '-right-3' : '-left-3'
        )}
        onClick={onCollapse}
      >
        {side === 'left' ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      {children}
    </Panel>
  );
} 