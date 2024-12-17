import React from 'react'
import { useTaskStore } from '@/renderer/stores/task-store'

export function AutomationInsights() {
  const { tasks } = useTaskStore()

  // Calculate automation metrics
  const totalTasks = tasks.length
  const automatedTasks = tasks.filter(task => task.automated).length
  const automationRate = totalTasks ? (automatedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Automation Insights</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-lg font-medium mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-lg font-medium mb-2">Automated Tasks</h3>
          <p className="text-3xl font-bold">{automatedTasks}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-lg font-medium mb-2">Automation Rate</h3>
          <p className="text-3xl font-bold">{automationRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}

