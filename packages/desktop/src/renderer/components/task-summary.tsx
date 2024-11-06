'use client';

import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/renderer/components/ui/card';
import { Loader2, ArrowUpDown } from 'lucide-react';
import { useTaskStore } from '@/renderer/stores/task-store';
import { useFilterStore } from '@/renderer/stores/task-filter-store';
import { TaskList } from './task-list/task-list';
import { TaskFilters } from './task-filters';
import { TaskAI } from './task-ai/task-ai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SummaryProps {
  vaultPath: string;
}

export function TaskSummary({ vaultPath }: SummaryProps) {
  const { tasks, loadTasks, isLoading, filteredTasks } = useTaskStore();
  const { getDateRangeLabel, sortOrder, setSortOrder } = useFilterStore();

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

  // Calculate stats based on filtered tasks instead of all tasks
  const openTasksCount = filteredTasks.filter((task) => !task.completed).length;
  const completedTasksCount = filteredTasks.filter((task) => task.completed).length;
  const completionRate = filteredTasks.length 
    ? ((completedTasksCount / filteredTasks.length) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-4 h-full p-4">
      {/* Filtering Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filter Tasks</CardTitle>
              <CardDescription>
                {getDateRangeLabel()} • {filteredTasks.length} tasks
              </CardDescription>
            </div>
            <TaskFilters />
          </div>
        </CardHeader>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {openTasksCount}
            </div>
            <div className="text-sm text-muted-foreground">Open Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {completedTasksCount}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {`${completionRate}%`}
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
                  <CardDescription>Showing {filteredTasks.length} tasks</CardDescription>
                </div>
                <Select
                  value={sortOrder}
                  onValueChange={(value: 'most-recent' | 'least-recent') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <SelectValue placeholder="Sort by created date" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-recent">Newest Created</SelectItem>
                    <SelectItem value="least-recent">Oldest Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <TaskList />
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Column */}
        <div className="col-span-1">
          <TaskAI />
        </div>
      </div>
    </div>
  );
}
