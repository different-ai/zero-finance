import { format } from 'date-fns'
import { Trash2, Clock } from 'lucide-react'
import { Button } from '@/renderer/components/ui/button'
import { useChatHistoryStore } from '@/stores/chat-history-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/renderer/components/ui/dropdown-menu'
import { ScrollArea } from '@/renderer/components/ui/scroll-area'

export function ChatHistory() {
  const { 
    sessions, 
    currentSessionId, 
    setCurrentSession, 
    deleteSession 
  } = useChatHistoryStore()

  if (sessions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-gray-50"
        >
          <Clock className="w-4 h-4 mr-2" />
          History
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[300px]"
      >
        <ScrollArea className="h-[400px]">
          {sessions.map((session) => (
            <DropdownMenuItem
              key={session.id}
              className={`flex flex-col items-stretch p-2 cursor-pointer
                ${currentSessionId === session.id 
                  ? 'bg-blue-50' 
                  : 'hover:bg-gray-50'
                }`}
              onClick={() => setCurrentSession(session.id)}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium">
                  {format(session.timestamp, 'MMM d, h:mm a')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              {session.filePath && (
                <p className="text-xs text-gray-500 truncate mt-1">
                  {session.filePath}
                </p>
              )}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 