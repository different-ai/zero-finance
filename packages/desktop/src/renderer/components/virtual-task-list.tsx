import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// Define the Task type - adjust properties based on your actual task structure
interface Task {
  id: string;
  // ... other task properties
}

interface VirtualTaskListProps {
  tasks: Task[];
  renderTask: (task: Task, index: number) => React.ReactNode;
}

export function VirtualTaskList({ tasks, renderTask }: VirtualTaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderTask(tasks[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
} 