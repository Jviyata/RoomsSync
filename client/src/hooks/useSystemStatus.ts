import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SystemStatus } from '@shared/schema';

export function useSystemStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Update system status
  const updateSystemStatus = useMutation({
    mutationFn: ({ name, data }: { name: string; data: Partial<SystemStatus> }) => 
      apiRequest('PUT', `/api/system-status/${name}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system-status'] });
      toast({
        title: 'Status updated',
        description: 'System status has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating status',
        description: error.message || 'There was an error updating the system status',
      });
    },
  });

  // Format last updated timestamp
  const formatLastUpdated = (date: Date | string) => {
    if (!date) return null;
    
    // Convert date string to Date object if it's a string
    const lastUpdatedDate = typeof date === 'string' ? new Date(date) : date;
    
    // Calculate time difference in minutes
    const diffInMinutes = Math.floor((new Date().getTime() - lastUpdatedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return lastUpdatedDate.toLocaleDateString();
  };

  // Handle temperature change
  const handleTemperatureChange = (direction: 'up' | 'down', currentValue: string) => {
    const tempMatch = currentValue.match(/(\d+)/);
    if (!tempMatch) return currentValue;
    
    const currentTemp = parseInt(tempMatch[0]);
    if (isNaN(currentTemp)) return currentValue;
    
    const newTemp = direction === 'up' ? currentTemp + 1 : currentTemp - 1;
    return `${newTemp}°F`;
  };

  // Toggle door lock status
  const toggleDoorLock = (currentStatus: SystemStatus) => {
    if (!currentStatus) return null;
    
    const isLocked = currentStatus.status === 'locked';
    return {
      status: isLocked ? 'unlocked' : 'locked',
      value: isLocked ? 'Front door is unlocked' : 'Front door is locked'
    };
  };

  return {
    updateSystemStatus,
    formatLastUpdated,
    handleTemperatureChange,
    toggleDoorLock,
  };
}
