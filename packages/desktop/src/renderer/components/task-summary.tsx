'use client';

import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/renderer/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useTaskStore } from '@/renderer/stores/task-store';
import { useFilterStore } from '@/renderer/stores/task-filter-store';
import { TaskList } from './task-list/task-list';
import { TaskFilters } from './task-filters';
import { TaskAI } from './task-ai/task-ai';

interface SummaryProps {
  vaultPath: string;
}

export function TaskSummary({ vaultPath }: SummaryProps) {
  const { tasks, loadTasks, isLoading } = useTaskStore();

  useEffect(() => {
    if (!vaultPath) return;
    loadTasks(vaultPath);
  }, [vaultPath, loadTasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full p-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {tasks.filter((task) => !task.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">Open Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {tasks.filter((task) => task.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {`${((tasks.filter((task) => task.completed).length / tasks.length) * 100).toFixed(2)}%`}
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Task List - Takes up 2 columns */}
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Manage your tasks</CardDescription>
                </div>
                <TaskFilters />
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <TaskList />
            </CardContent>
          </Card>
        </div>

        {/* AI Insights - Takes up 1 column */}
        <div className="col-span-1">
          <TaskAI />
        </div>
      </div>
    </div>
  );
}
