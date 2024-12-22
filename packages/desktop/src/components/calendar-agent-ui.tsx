import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EventData } from '@/agents/base-agent';
import { calendarAgent } from '@/agents/calendar-agent';
import { useToast } from '@/hooks/use-toast';

interface CalendarAgentUIProps {
  initialData?: EventData;
  onSuccess?: () => void;
}

export function CalendarAgentUI({ initialData, onSuccess }: CalendarAgentUIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState<EventData>(initialData || {
    title: '',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    content: '',
    details: '',
    location: '',
    attendees: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await calendarAgent.action({
        id: crypto.randomUUID(),
        type: 'event',
        data: eventData,
        timestamp: new Date().toISOString(),
        agentId: calendarAgent.id,
        source: 'manual-entry',
        confidence: 1
      });

      toast({
        title: 'Event created',
        description: 'The event has been added to your calendar'
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('0xHypr', 'Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          {initialData ? 'Edit Event' : 'New Event'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={eventData.startTime.slice(0, 16)}
                onChange={(e) => setEventData({ ...eventData, startTime: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={eventData.endTime.slice(0, 16)}
                onChange={(e) => setEventData({ ...eventData, endTime: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={eventData.location || ''}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Input
              id="details"
              value={eventData.details || ''}
              onChange={(e) => setEventData({ ...eventData, details: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees (comma-separated)</Label>
            <Input
              id="attendees"
              value={eventData.attendees?.join(', ') || ''}
              onChange={(e) => setEventData({ 
                ...eventData, 
                attendees: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 