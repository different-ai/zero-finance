import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useDashboardStore } from '@/stores/dashboard-store'

export function AutomationProgress() {
  const { tasks, automationRate } = useDashboardStore()
  const rate = automationRate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Automation Progress</CardTitle>
        <CardDescription>Percentage of tasks automated</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted-foreground stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="text-primary stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${rate * 2.51327}, 251.327`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">
                {Math.round(rate)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {tasks.filter((task) => task.automated).length} /{' '}
                {tasks.length} tasks
              </span>
            </div>
          </div>
          <Progress value={rate} className="w-full" />
        </div>
      </CardContent>
    </Card>
  )
} 