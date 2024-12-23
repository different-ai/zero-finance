import { Agent, RecognizedContext, AgentType } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as React from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { createOpenAI } from '@ai-sdk/openai';
import { getApiKey } from '../stores/api-key-store';
import { createEvents, EventAttributes } from 'ics';

const calendarFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
  attendees: z.array(z.string().email()).optional(),
});

type CalendarFormValues = z.infer<typeof calendarFormSchema>;

const calendarParserSchema = z.object({
  event: z.object({
    title: z.string(),
    description: z.string().optional(),
    startDate: z.string(),
    startTime: z.string(),
    endDate: z.string(),
    endTime: z.string(),
    location: z.string().optional(),
    attendees: z.array(z.string()).optional(),
  }),
});

interface AddToCalendarUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const AddToCalendarUI: React.FC<AddToCalendarUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CalendarFormValues>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      attendees: [],
    },
  });

  const parseContext = async () => {
    try {
      setIsLoading(true);
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key in settings');
      }

      const openai = createOpenAI({ apiKey });
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: calendarParserSchema,
        prompt: `
          Extract calendar event information from the following content:
          
          Content:
          ${context.title}
          
          Vital Information:
          ${context.vitalInformation}
          
          Parse this into a well-formatted calendar event.
          Format dates as YYYY-MM-DD.
          Format times as HH:mm (24-hour format).
          Extract any mentioned location and attendee emails.
        `.trim(),
      });

      const result = calendarParserSchema.parse(object);

      form.reset({
        title: result.event.title,
        description: result.event.description || '',
        startDate: result.event.startDate,
        startTime: result.event.startTime,
        endDate: result.event.endDate,
        endTime: result.event.endTime,
        location: result.event.location || '',
        attendees: result.event.attendees || [],
      });

      setOpen(true);
    } catch (error) {
      console.error('0xHypr', 'Error parsing calendar data:', error);
      toast.error('Failed to parse calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: CalendarFormValues) => {
    try {
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

      const event: EventAttributes = {
        start: [
          startDateTime.getFullYear(),
          startDateTime.getMonth() + 1,
          startDateTime.getDate(),
          startDateTime.getHours(),
          startDateTime.getMinutes(),
        ] as [number, number, number, number, number],
        end: [
          endDateTime.getFullYear(),
          endDateTime.getMonth() + 1,
          endDateTime.getDate(),
          endDateTime.getHours(),
          endDateTime.getMinutes(),
        ] as [number, number, number, number, number],
        title: values.title,
        description: values.description || '',
        location: values.location,
        attendees: values.attendees?.map(email => ({ email })) || [],
        startInputType: 'local',
        endInputType: 'local',
      };

      createEvents([event], (error: Error | undefined, value: string | undefined) => {
        if (error) {
          throw error;
        }
        
        toast.success('Event created successfully');
        setOpen(false);
        onSuccess?.();
      });
    } catch (error) {
      console.error('0xHypr', 'Error creating calendar event:', error);
      toast.error('Failed to create calendar event');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex flex-col">
        <h3 className="font-medium">Calendar Event Detected</h3>
        <p className="text-sm text-muted-foreground">{context.title}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={parseContext}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Create Event'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Calendar Event</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Event
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AddToMacCalendarAgent: Agent = {
  id: 'add-to-mac-calendar',
  name: 'Add to Calendar',
  description: 'Creates calendar events from detected content',
  type: 'event' as AgentType,
  isActive: true,

  render(context: RecognizedContext, onSuccess?: () => void): React.ReactNode {
    return <AddToCalendarUI context={context} onSuccess={onSuccess} />;
  },
}; 