import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function Calendar({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const tasksForDay = tasks.filter(task => task.date === dateString)
            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center p-2 text-sm ${
                  tasksForDay.length > 0 ? 'bg-primary/20 rounded-md' : ''
                }`}
              >
                <span className={tasksForDay.length > 0 ? 'font-bold' : ''}>{day}</span>
                {tasksForDay.length > 0 && (
                  <span className="text-xs text-primary">{tasksForDay.length} task{tasksForDay.length > 1 ? 's' : ''}</span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

