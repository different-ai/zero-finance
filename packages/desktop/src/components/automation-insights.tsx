import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AutomationInsights({ tasks }) {
  const automatedTasks = tasks.filter(task => task.automated)
  const manualTasks = tasks.filter(task => !task.automated)

  const data = [
    { name: 'Automated', value: automatedTasks.length },
    { name: 'Manual', value: manualTasks.length },
  ]

  const timeData = [
    { name: 'Mon', automated: 4, manual: 2 },
    { name: 'Tue', automated: 3, manual: 3 },
    { name: 'Wed', automated: 5, manual: 1 },
    { name: 'Thu', automated: 4, manual: 2 },
    { name: 'Fri', automated: 6, manual: 1 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Automation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Automation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="automated" fill="#8884d8" stackId="a" name="Automated Tasks" />
              <Bar dataKey="manual" fill="#82ca9d" stackId="a" name="Manual Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

