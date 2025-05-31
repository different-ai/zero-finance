"use client"

import { useInboxStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CalendarDays, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MemoryContent() {
  const { memories } = useInboxStore()

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">AI Memory is Empty</h2>
        <p className="text-muted-foreground max-w-md">
          As you interact with the AI in the inbox comments and provide preferences, the AI will store learned
          information here.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI Memory Log</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => (
          <Card key={memory.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Learned Preference
              </CardTitle>
              <CardDescription className="flex items-center text-xs pt-1">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                Logged: {new Date(memory.timestamp).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm">{memory.description}</p>
            </CardContent>
            {memory.sourceCardId && (
              <CardFooter>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                  {/* In a real app, this would link to the specific card/comment */}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <Link2 className="h-3 w-3 mr-1" />
                    View Originating Context
                  </a>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
