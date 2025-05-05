import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Calendar, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import GuestProfileCard from '@/components/guests/GuestProfileCard';
import GuestForm from '@/components/guests/GuestForm';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Guests = () => {
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch guests
  const { data: guests, isLoading, error } = useQuery({
    queryKey: ['/api/guests'],
  });

  // Mutations for guests
  const createGuest = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/guests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      setShowGuestForm(false);
      toast({
        title: 'Guest added',
        description: 'Your guest has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error adding guest',
        description: error.message || 'There was an error adding your guest.',
      });
    }
  });

  const updateGuest = useMutation({
    mutationFn: ({ id, data }) => apiRequest('PUT', `/api/guests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      setShowGuestForm(false);
      setSelectedGuest(null);
      toast({
        title: 'Guest updated',
        description: 'Your guest has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating guest',
        description: error.message || 'There was an error updating your guest.',
      });
    }
  });

  const deleteGuest = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/guests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      toast({
        title: 'Guest deleted',
        description: 'Your guest has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting guest',
        description: error.message || 'There was an error deleting your guest.',
      });
    }
  });

  const handleAddGuest = () => {
    setSelectedGuest(null);
    setShowGuestForm(true);
  };

  const handleEditGuest = (guest) => {
    setSelectedGuest(guest);
    setShowGuestForm(true);
  };

  const handleDeleteGuest = (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      deleteGuest.mutate(id);
    }
  };

  const handleFormSubmit = (data) => {
    if (selectedGuest) {
      // Update existing guest
      updateGuest.mutate({ id: selectedGuest.id, data });
    } else {
      // Create new guest
      createGuest.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowGuestForm(false);
    setSelectedGuest(null);
  };

  // Group guests by date
  const getTodayGuests = () => {
    if (!guests) return [];
    const today = new Date().toISOString().split('T')[0];
    return guests.filter(guest => guest.visitDate === today);
  };

  const getUpcomingGuests = () => {
    if (!guests) return [];
    const today = new Date().toISOString().split('T')[0];
    return guests.filter(guest => guest.visitDate > today)
      .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
  };

  const getPastGuests = () => {
    if (!guests) return [];
    const today = new Date().toISOString().split('T')[0];
    return guests.filter(guest => guest.visitDate < today)
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#333333]">Guests</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#333333]">Guests</h1>
        <Button 
          onClick={handleAddGuest}
          className="bg-[#7A8450] hover:bg-[#556B2F] text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Guest
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load guests. {error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Guest Management</AlertTitle>
          <AlertDescription>
            Keep track of visitors and notify your roommates about expected guests.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="today" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#FAF3E0] data-[state=active]:text-[#556B2F]">
            Today ({getTodayGuests().length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#FAF3E0] data-[state=active]:text-[#556B2F]">
            Upcoming ({getUpcomingGuests().length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-[#FAF3E0] data-[state=active]:text-[#556B2F]">
            Past ({getPastGuests().length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {getTodayGuests().length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <Calendar className="mx-auto h-12 w-12 text-[#DCCCA3]" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No guests today</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any guests scheduled for today.</p>
              <Button 
                onClick={handleAddGuest} 
                className="mt-4 bg-[#7A8450] hover:bg-[#556B2F]"
              >
                Add a Guest
              </Button>
            </div>
          ) : (
            getTodayGuests().map(guest => (
              <GuestProfileCard 
                key={guest.id} 
                guest={guest} 
                onEdit={() => handleEditGuest(guest)}
                onDelete={() => handleDeleteGuest(guest.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {getUpcomingGuests().length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <Calendar className="mx-auto h-12 w-12 text-[#DCCCA3]" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming guests</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any guests scheduled for the future.</p>
              <Button 
                onClick={handleAddGuest} 
                className="mt-4 bg-[#7A8450] hover:bg-[#556B2F]"
              >
                Add a Guest
              </Button>
            </div>
          ) : (
            getUpcomingGuests().map(guest => (
              <GuestProfileCard 
                key={guest.id} 
                guest={guest} 
                onEdit={() => handleEditGuest(guest)}
                onDelete={() => handleDeleteGuest(guest.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {getPastGuests().length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <Calendar className="mx-auto h-12 w-12 text-[#DCCCA3]" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No past guests</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any past guest records.</p>
            </div>
          ) : (
            getPastGuests().map(guest => (
              <GuestProfileCard 
                key={guest.id} 
                guest={guest} 
                onEdit={() => handleEditGuest(guest)}
                onDelete={() => handleDeleteGuest(guest.id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Guest Form Dialog */}
      <Dialog open={showGuestForm} onOpenChange={setShowGuestForm}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none">
          <GuestForm 
            guest={selectedGuest}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Guests;
