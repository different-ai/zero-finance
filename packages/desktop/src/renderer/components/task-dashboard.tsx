'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/renderer/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/renderer/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/renderer/components/ui/tabs';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import {
  AlertCircle,
  Book,
  CheckCircle2,
  FileText,
  List,
  Plus,
  Search,
  Tag,
} from 'lucide-react';
import { streamObject } from 'ai';
import { z } from 'zod';
import { useApiKeyStore } from '@/stores/api-key-store';
import { createOpenAI } from '@ai-sdk/openai';
import { TaskSummary } from './task-summary';
import { getAllTasks } from '@/renderer/task-utils';
import type { Task } from '@/renderer/task-utils';
import { ApiKeyRequirement } from './api-key-requirement';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { useDebounce } from 'use-debounce';

interface TaskFilters {
  status: 'all' | 'open' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
  search: string;
}

export function TaskDashboard({ vaultPath }: { vaultPath: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  const [debouncedSearch] = useDebounce(filters.search, 300);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === 'all'
          ? true
          : filters.status === 'completed'
          ? task.completed
          : !task.completed;

      const matchesSearch =
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

      return matchesStatus && matchesSearch;
    });
  }, [tasks, filters.status, debouncedSearch]);

  // Load tasks with error handling
  useEffect(() => {
    const loadTasks = async () => {
      if (!vaultPath) return;
      setIsLoading(true);
      setError(null);

      try {
        const allTasks = await getAllTasks(vaultPath);
        setTasks(allTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [vaultPath]);

  const handleTaskToggle = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const content = await window.api.readMarkdownFile(task.filePath);
      const updatedContent = content.content.replace(
        /- \[([ xX])\] (.*)/g,
        (match: string, check: string, text: string) => {
          if (text.includes(task.title)) {
            return `- [${check === ' ' ? 'x' : ' '}] ${text}`;
          }
          return match;
        }
      );

      await window.api.writeMarkdownFile(task.filePath, updatedContent);
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const handleBulkAction = async (completed: boolean) => {
    const tasksToUpdate =
      selectedTasks.length > 0 ? selectedTasks : filteredTasks.map((t) => t.id);

    try {
      await Promise.all(
        tasksToUpdate.map((taskId) => handleTaskToggle(taskId))
      );
      setSelectedTasks([]);
    } catch (err) {
      setError('Failed to update multiple tasks. Please try again.');
    }
  };

  const { apiKey } = useApiKeyStore();

  if (!apiKey) {
    return <ApiKeyRequirement />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-lg">
        <AlertCircle className="h-5 w-5 inline mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
  

          <div className="flex items-center gap-2">
            <Select>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="overview" className="m-0">
            <TaskSummary vaultPath={vaultPath} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
