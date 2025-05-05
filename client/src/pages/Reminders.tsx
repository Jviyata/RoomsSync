import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ReminderForm from '@/components/reminders/ReminderForm';
import ReminderList from '@/components/reminders/ReminderList';
import { useToast } from '@/hooks/use-toast';

const Reminders = () => {
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reminders
  const { data: reminders, isLoading, error } = useQuery({
    queryKey: ['/api/reminders'],
  });

  // Mutations for reminders
  const createReminder = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/reminders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      setShowReminderForm(false);
      toast({
        title: 'Reminder created',
        description: 'Your reminder has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error creating reminder',
        description: error.message || 'There was an error creating your reminder.',
      });
    }
  });

  const updateReminder = useMutation({
    mutationFn: ({ id, data }) => apiRequest('PUT', `/api/reminders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      setShowReminderForm(false);
      setSelectedReminder(null);
      toast({
        title: 'Reminder updated',
        description: 'Your reminder has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating reminder',
        description: error.message || 'There was an error updating your reminder.',
      });
    }
  });

  const deleteReminder = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/reminders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: 'Reminder deleted',
        description: 'Your reminder has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting reminder',
        description: error.message || 'There was an error deleting your reminder.',
      });
    }
  });

  const handleAddReminder = () => {
    setSelectedReminder(null);
    setShowReminderForm(true);
  };

  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setShowReminderForm(true);
  };

  const handleDeleteReminder = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder.mutate(id);
    }
  };

  const handleToggleComplete = (reminder) => {
    updateReminder.mutate({
      id: reminder.id,
      data: { ...reminder, completed: !reminder.completed }
    });
  };

  const handleFormSubmit = (data) => {
    if (selectedReminder) {
      // Update existing reminder
      updateReminder.mutate({ id: selectedReminder.id, data });
    } else {
      // Create new reminder
      createReminder.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowReminderForm(false);
    setSelectedReminder(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#333333]">Reminders</h1>
        <Button 
          onClick={handleAddReminder}
          className="bg-[#7A8450] hover:bg-[#556B2F] text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Reminder
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load reminders. {error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-[#FAF3E0] rounded-lg p-6">
        <ReminderList 
          reminders={reminders}
          onComplete={handleToggleComplete}
          onEdit={handleEditReminder}
          onDelete={handleDeleteReminder}
          isLoading={isLoading}
        />
      </div>

      {/* Reminder Form Dialog */}
      <Dialog open={showReminderForm} onOpenChange={setShowReminderForm}>
        <DialogContent className="sm:max-w-[550px]">
          <h2 className="text-xl font-semibold mb-4">
            {selectedReminder ? 'Edit Reminder' : 'Add New Reminder'}
          </h2>
          <ReminderForm 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            initialData={selectedReminder}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;
