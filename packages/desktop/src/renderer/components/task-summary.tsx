'use client';

import React from 'react'
import { TaskList } from './task-list/task-list'
import { useTaskStore } from '@/renderer/stores/task-store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star } from 'lucide-react'

export function TaskSummary() {
  const { tasks, handleTaskToggle, filteredTasks } = useTaskStore()

  const onOpenFile = async (filePath: string) => {
    if (window.api.openFile) {
      await window.api.openFile(filePath)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tasks Summary</h3>
          <Badge variant="secondary">
            {tasks.length} Tasks
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Today</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>{tasks.filter(t => t.automated).length} Automated</span>
            </div>
          </div>

          <TaskList 
            onToggle={(taskId) => handleTaskToggle(taskId)}
            onOpenFile={onOpenFile}
            filteredTasks={filteredTasks}
          />
        </div>
      </CardContent>
    </Card>
  )
}
