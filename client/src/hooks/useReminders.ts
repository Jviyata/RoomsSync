import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Reminder } from '@shared/schema';

export function useReminders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create reminder
  const createReminder = useMutation({
    mutationFn: (reminderData: Omit<Reminder, 'id' | 'createdAt'>) => 
      apiRequest('POST', '/api/reminders', reminderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: 'Reminder created',
        description: 'Your reminder has been successfully created',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error creating reminder',
        description: error.message || 'There was an error creating your reminder',
      });
    },
  });

  // Update reminder
  const updateReminder = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Reminder> }) => 
      apiRequest('PUT', `/api/reminders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: 'Reminder updated',
        description: 'Your reminder has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating reminder',
        description: error.message || 'There was an error updating your reminder',
      });
    },
  });

  // Delete reminder
  const deleteReminder = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/reminders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: 'Reminder deleted',
        description: 'Your reminder has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting reminder',
        description: error.message || 'There was an error deleting your reminder',
      });
    },
  });

  // Toggle reminder completion
  const toggleReminder = useMutation({
    mutationFn: (reminder: Reminder) => 
      apiRequest('PUT', `/api/reminders/${reminder.id}`, { ...reminder, completed: !reminder.completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating reminder',
        description: error.message || 'There was an error updating the reminder status',
      });
    },
  });

  // Format date from reminder
  const formatReminderDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Format for today
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      // Check if it's yesterday or tomorrow
      return now > date ? 'Yesterday' : 'Tomorrow';
    } else if (diffDays < 7) {
      // Format for within a week
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      // Format for dates more than a week ago
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return {
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    formatReminderDate,
  };
}
