import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Calendar, Bell, Users, Home, Thermometer, Lock, Unlock, Plus, Minus } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import SystemStatusCard from '@/components/dashboard/SystemStatusCard';
import SchedulePreviewSection from '@/components/dashboard/SchedulePreview';
import ReminderPreviewSection from '@/components/dashboard/ReminderPreview';
import GuestPreviewSection from '@/components/dashboard/GuestPreview';

const Dashboard = () => {
  const queryClient = useQueryClient();
  
  // Get system statuses
  const { data: systemStatuses, isLoading: isLoadingStatuses } = useQuery({
    queryKey: ['/api/system-status'],
  });

  // Get today's events
  const { data: todayEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/events/today'],
  });

  // Get reminders
  const { data: reminders, isLoading: isLoadingReminders } = useQuery({
    queryKey: ['/api/reminders'],
  });

  // Get today's guests
  const { data: todayGuests, isLoading: isLoadingGuests } = useQuery({
    queryKey: ['/api/guests/today'],
  });

  // Get all events to calculate available spaces
  const { data: allEvents = [] } = useQuery({
    queryKey: ['/api/events'],
  });

  // Mutations for system status
  const updateSystemStatus = useMutation({
    mutationFn: ({ name, data }) => 
      apiRequest('PUT', `/api/system-status/${name}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system-status'] });
    }
  });

  // Temperature controls
  const handleTemperatureChange = (direction) => {
    const temperature = systemStatuses.find(s => s.name === 'temperature');
    if (!temperature) return;
    
    const currentTemp = parseInt(temperature.value);
    if (isNaN(currentTemp)) return;
    
    const newTemp = direction === 'up' ? currentTemp + 1 : currentTemp - 1;
    updateSystemStatus.mutate({
      name: 'temperature',
      data: {
        value: `${newTemp}°F`
      }
    });
  };

  // Door lock controls
  const handleDoorLockToggle = () => {
    const doorLock = systemStatuses?.find(s => s.name === 'doorLock');
    if (!doorLock) return;
    
    const isLocked = doorLock.status === 'locked';
    updateSystemStatus.mutate({
      name: 'doorLock',
      data: {
        status: isLocked ? 'unlocked' : 'locked',
        value: isLocked ? 'Front door is unlocked' : 'Front door is locked'
      }
    });
  };

  // Calculate stats
  const getPendingRemindersCount = () => {
    if (!reminders) return 0;
    return reminders.filter(r => !r.completed).length;
  };

  const getExpectedGuestsCount = () => {
    if (!todayGuests) return 0;
    return todayGuests.length;
  };

  const getAvailableSpaces = () => {
    if (!allEvents) return '0/0';
    
    const spaces = ['Kitchen', 'Living Room', 'Bathroom', 'Laundry Room'];
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    
    // Filter today's events that are happening right now
    const currentEvents = allEvents.filter(event => {
      if (event.date !== today) return false;
      
      if (event.isAllDay) return true;
      
      const startHour = parseInt(event.startTime?.split(':')[0] || '0');
      const endHour = parseInt(event.endTime?.split(':')[0] || '24');
      
      return currentHour >= startHour && currentHour < endHour;
    });
    
    // Get occupied spaces
    const occupiedSpaces = currentEvents.map(event => event.space);
    const uniqueOccupiedSpaces = [...new Set(occupiedSpaces)];
    
    const availableCount = spaces.length - uniqueOccupiedSpaces.length;
    return `${availableCount}/${spaces.length}`;
  };

  // Loading states
  if (isLoadingStatuses || isLoadingEvents || isLoadingReminders || isLoadingGuests) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/5 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#333333]">Welcome back, Jamie</h1>
        <p className="text-[#555555]">Here's what's happening in your home today</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Today's Events */}
        <DashboardCard
          title="Today's Events"
          value={todayEvents?.length || 0}
          icon={Calendar}
          change={todayEvents?.length > 1 ? `${todayEvents?.length - 1} more than yesterday` : null}
          changeType={todayEvents?.length > 1 ? 'positive' : null}
        >
          <ul className="text-sm space-y-2">
            {todayEvents && todayEvents.slice(0, 3).map(event => (
              <li key={event.id} className="flex justify-between">
                <span>{event.title}</span>
                <span className="text-[#7A8450]">{event.startTime} - {event.endTime || 'End'}</span>
              </li>
            ))}
            {todayEvents && todayEvents.length > 3 && (
              <li className="text-[#7A8450] text-center">+{todayEvents.length - 3} more events</li>
            )}
          </ul>
        </DashboardCard>

        {/* Pending Reminders */}
        <DashboardCard
          title="Pending Reminders"
          value={getPendingRemindersCount()}
          icon={Bell}
          change={getPendingRemindersCount() > 0 ? `${getPendingRemindersCount()} unresolved` : null}
          changeType={getPendingRemindersCount() > 0 ? 'negative' : null}
        >
          <ul className="text-sm space-y-2">
            {reminders && reminders.filter(r => !r.completed).slice(0, 2).map(reminder => (
              <li key={reminder.id} className="flex justify-between">
                <span>{reminder.text.substring(0, 30)}{reminder.text.length > 30 ? '...' : ''}</span>
                <span className={reminder.priority === 'high' ? 'text-red-600' : 'text-[#7A8450]'}>
                  {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} priority
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>

        {/* Expected Guests */}
        <DashboardCard
          title="Expected Guests"
          value={getExpectedGuestsCount()}
          icon={Users}
        >
          {todayGuests && todayGuests.length > 0 ? (
            <div className="space-y-2">
              {todayGuests.map(guest => (
                <div key={guest.id} className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-[#DCCCA3] flex items-center justify-center text-[#556B2F] font-bold">
                    {guest.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-xs text-[#555555]">Arriving at {guest.visitTime}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#555555]">No guests expected today</p>
          )}
        </DashboardCard>

        {/* Available Spaces */}
        <DashboardCard
          title="Available Spaces"
          value={getAvailableSpaces()}
          icon={Home}
        >
          <ul className="text-sm space-y-1">
            {allEvents && ['Kitchen', 'Living Room', 'Bathroom', 'Laundry Room'].map(space => {
              const today = new Date().toISOString().split('T')[0];
              const currentHour = new Date().getHours();
              
              const isOccupied = allEvents.some(event => {
                if (event.date !== today || event.space !== space) return false;
                
                if (event.isAllDay) return true;
                
                const startHour = parseInt(event.startTime?.split(':')[0] || '0');
                const endHour = parseInt(event.endTime?.split(':')[0] || '24');
                
                return currentHour >= startHour && currentHour < endHour;
              });
              
              const occupyingEvent = allEvents.find(event => 
                event.date === today && 
                event.space === space && 
                ((event.isAllDay) || 
                  (currentHour >= parseInt(event.startTime?.split(':')[0] || '0') && 
                  currentHour < parseInt(event.endTime?.split(':')[0] || '24')))
              );

              return (
                <li key={space} className="flex justify-between">
                  <span>{space}</span>
                  {isOccupied ? (
                    <span className="text-red-600">
                      Reserved {occupyingEvent?.startTime} - {occupyingEvent?.endTime}
                    </span>
                  ) : (
                    <span className="text-[#7A8450]">Available</span>
                  )}
                </li>
              );
            })}
          </ul>
        </DashboardCard>
      </div>

      {/* System Status Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#333333]">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature Status */}
          {systemStatuses && systemStatuses.find(s => s.name === 'temperature') && (
            <SystemStatusCard
              serviceName="Temperature"
              status="operational"
              lastUpdated={systemStatuses.find(s => s.name === 'temperature').lastUpdated}
              message={`Current temperature: ${systemStatuses.find(s => s.name === 'temperature').value}`}
              actions={
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleTemperatureChange('down')}
                    className="bg-[#FAF3E0] hover:bg-[#DCCCA3] text-[#556B2F] w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleTemperatureChange('up')}
                    className="bg-[#FAF3E0] hover:bg-[#DCCCA3] text-[#556B2F] w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              }
            />
          )}

          {/* Door Lock Status */}
          {systemStatuses && systemStatuses.find(s => s.name === 'doorLock') && (
            <SystemStatusCard
              serviceName="Door Lock"
              status={systemStatuses.find(s => s.name === 'doorLock').status}
              lastUpdated={systemStatuses.find(s => s.name === 'doorLock').lastUpdated}
              message={systemStatuses.find(s => s.name === 'doorLock').value}
              actions={
                <button 
                  onClick={handleDoorLockToggle}
                  className="bg-[#FAF3E0] hover:bg-[#DCCCA3] text-[#556B2F] px-3 py-1 rounded-md flex items-center"
                >
                  {systemStatuses.find(s => s.name === 'doorLock').status === 'locked' ? (
                    <>
                      <Unlock className="h-4 w-4 mr-1" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-1" />
                      Lock
                    </>
                  )}
                </button>
              }
            />
          )}
        </div>
      </div>

      {/* Calendar Preview Section */}
      <SchedulePreviewSection />

      {/* Reminders & Guests Section - Two Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reminders Column */}
        <ReminderPreviewSection />
        
        {/* Guests Column */}
        <GuestPreviewSection />
      </div>
    </div>
  );
};

export default Dashboard;
