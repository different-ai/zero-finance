import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const initialNotifications = [
  { id: 1, message: 'New comment on your recent post', time: '5 minutes ago' },
  { id: 2, message: 'Your project "Alpha" has been approved', time: '1 hour ago' },
  { id: 3, message: 'Meeting reminder: Team sync at 3 PM', time: '2 hours ago' },
]

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground">No new notifications</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex items-start space-x-4">
                <Bell className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-grow">
                  <p>{notification.message}</p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => dismissNotification(notification.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

