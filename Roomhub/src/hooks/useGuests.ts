import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Guest } from '@shared/schema';

export function useGuests() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create guest
  const createGuest = useMutation({
    mutationFn: (guestData: Omit<Guest, 'id'>) => 
      apiRequest('POST', '/api/guests', guestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/guests/today'] });
      toast({
        title: 'Guest added',
        description: 'Your guest has been successfully added',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error adding guest',
        description: error.message || 'There was an error adding your guest',
      });
    },
  });

  // Update guest
  const updateGuest = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Guest> }) => 
      apiRequest('PUT', `/api/guests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/guests/today'] });
      toast({
        title: 'Guest updated',
        description: 'Your guest has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating guest',
        description: error.message || 'There was an error updating your guest',
      });
    },
  });

  // Delete guest
  const deleteGuest = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/guests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/guests/today'] });
      toast({
        title: 'Guest deleted',
        description: 'Your guest has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting guest',
        description: error.message || 'There was an error deleting your guest',
      });
    },
  });

  // Format date from guest's visit date
  const formatVisitDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    // For other dates, format them nicely
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get guest initials from name
  const getGuestInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return {
    createGuest,
    updateGuest,
    deleteGuest,
    formatVisitDate,
    getGuestInitials,
  };
}
