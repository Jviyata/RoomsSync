import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import CalendarView from '@/components/schedule/CalendarView';
import EventForm from '@/components/schedule/EventForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Schedule = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/events'],
  });

  // Mutations for events
  const createEvent = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setShowEventForm(false);
      toast({
        title: 'Event created',
        description: 'Your event has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error creating event',
        description: error.message || 'There was an error creating your event.',
      });
    }
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, data }) => apiRequest('PUT', `/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setShowEventForm(false);
      setSelectedEvent(null);
      toast({
        title: 'Event updated',
        description: 'Your event has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating event',
        description: error.message || 'There was an error updating your event.',
      });
    }
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setSelectedEvent(null);
      toast({
        title: 'Event deleted',
        description: 'Your event has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting event',
        description: error.message || 'There was an error deleting your event.',
      });
    }
  });

  const handleAddEvent = () => {
    setSelectedEvent(null);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setShowEventForm(true);
    } else {
      setShowEventForm(true);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleFormSubmit = (data) => {
    // Format date if using selectedDate
    if (selectedDate && !data.date) {
      data.date = selectedDate.toISOString().split('T')[0];
    }

    if (selectedEvent) {
      // Update existing event
      updateEvent.mutate({ id: selectedEvent.id, data });
    } else {
      // Create new event
      createEvent.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = () => {
    if (selectedEvent && window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent.mutate(selectedEvent.id);
      setShowEventForm(false);
    }
  };

  // Check for conflicting events when selecting a date/time
  const checkForConflicts = (newEvent) => {
    if (!events) return [];

    const conflicts = events.filter(event => {
      // If it's the same event (when editing), there's no conflict
      if (selectedEvent && event.id === selectedEvent.id) return false;
      
      // If dates don't match, no conflict
      if (event.date !== newEvent.date) return false;
      
      // If both are all-day events, conflict
      if (event.isAllDay && newEvent.isAllDay) return true;
      
      // If one is all-day, conflict
      if (event.isAllDay || newEvent.isAllDay) return true;
      
      // If same space
      if (event.space === newEvent.space) {
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
      }
      
      return false;
    });
    
    return conflicts;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6 text-[#333333]">Schedule</h1>
        <div className="animate-pulse bg-white h-96 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6 text-[#333333]">Schedule</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load schedule. {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6 text-[#333333]">Schedule</h1>
      
      <div className="mb-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Schedule shared spaces</AlertTitle>
          <AlertDescription>
            Reserve common areas like the kitchen, living room, or laundry room to avoid conflicts with roommates.
          </AlertDescription>
        </Alert>
      </div>
      
      <CalendarView 
        events={events}
        onEventClick={handleEventClick} 
        onAddEvent={handleAddEvent}
        onDateSelect={handleDateSelect}
      />

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none">
          <EventForm 
            event={selectedEvent}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            onDelete={selectedEvent ? handleEventDelete : null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
