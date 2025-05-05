import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@shared/schema';

export function useEvents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create event
  const createEvent = useMutation({
    mutationFn: (eventData: Omit<Event, 'id'>) => 
      apiRequest('POST', '/api/events', eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/today'] });
      toast({
        title: 'Event created',
        description: 'Your event has been successfully created',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error creating event',
        description: error.message || 'There was an error creating your event',
      });
    },
  });

  // Update event
  const updateEvent = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) => 
      apiRequest('PUT', `/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/today'] });
      toast({
        title: 'Event updated',
        description: 'Your event has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating event',
        description: error.message || 'There was an error updating your event',
      });
    },
  });

  // Delete event
  const deleteEvent = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/today'] });
      toast({
        title: 'Event deleted',
        description: 'Your event has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting event',
        description: error.message || 'There was an error deleting your event',
      });
    },
  });

  // Check for scheduling conflicts
  const checkConflicts = (newEvent: Partial<Event>, currentEvents: Event[], excludeId?: number) => {
    if (!newEvent.date || !newEvent.space) return [];

    return currentEvents.filter(event => {
      // Don't compare with itself when editing
      if (excludeId && event.id === excludeId) return false;
      
      // If dates don't match, no conflict
      if (event.date !== newEvent.date) return false;
      
      // If spaces don't match, no conflict
      if (event.space !== newEvent.space) return false;
      
      // If both are all-day events, conflict
      if (event.isAllDay && newEvent.isAllDay) return true;
      
      // If one is all-day, conflict
      if (event.isAllDay || newEvent.isAllDay) return true;
      
      // Check time overlap
      const eventStart = event.startTime ? new Date(`2000-01-01T${event.startTime}`) : null;
      const eventEnd = event.endTime ? new Date(`2000-01-01T${event.endTime}`) : null;
      const newStart = newEvent.startTime ? new Date(`2000-01-01T${newEvent.startTime}`) : null;
      const newEnd = newEvent.endTime ? new Date(`2000-01-01T${newEvent.endTime}`) : null;
      
      if (!eventStart || !eventEnd || !newStart || !newEnd) return false;
      
      return (
        (newStart >= eventStart && newStart < eventEnd) || // New event starts during existing event
        (newEnd > eventStart && newEnd <= eventEnd) || // New event ends during existing event
        (newStart <= eventStart && newEnd >= eventEnd) // New event completely encompasses existing event
      );
    });
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    checkConflicts,
  };
}
