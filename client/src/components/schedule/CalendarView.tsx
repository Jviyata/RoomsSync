import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const CalendarView = ({ onEventClick, onAddEvent, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month'); // month, week, day
  
  const { data: events = [] } = useQuery({ 
    queryKey: ['/api/events'],
  });
  
  // Get current month name and year
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Helper function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Helper function to get day of week (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    return days;
  };
  
  // Handle navigation
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Get events for a specific date
  const getEventsForDate = (day) => {
    if (!day) return [];
    
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = checkDate.toISOString().split('T')[0];
    
    return events.filter(event => event.date === dateString);
  };
  
  // Handle day click
  const handleDayClick = (day) => {
    if (!day) return;
    
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };
  
  // Handle event click
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  // Get today's date for highlighting
  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-[#FAF3E0]">
        <div>
          <h2 className="text-lg font-semibold text-black">
            {currentMonth} {currentYear}
          </h2>
        </div>
        
        <div className="flex items-center">
          {/* View Selector */}
          <div className="mr-4">
            <select 
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-[#DCCCA3] focus:outline-none focus:ring-[#7A8450] focus:border-[#7A8450] sm:text-sm rounded-md bg-white text-black"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          </div>
          
          {/* Navigation */}
          <div className="flex">
            <button
              onClick={navigatePrevious}
              className="p-1 rounded-full hover:bg-[#DCCCA3] text-[#556B2F]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="mx-2 px-2 py-1 text-sm rounded hover:bg-[#DCCCA3] text-[#556B2F]"
            >
              Today
            </button>
            <button
              onClick={navigateNext}
              className="p-1 rounded-full hover:bg-[#DCCCA3] text-[#556B2F]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Add Event Button */}
          {onAddEvent && (
            <button
              onClick={onAddEvent}
              className="ml-4 px-3 py-1 bg-[#7A8450] text-white rounded-md flex items-center hover:bg-[#556B2F]"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </button>
          )}
        </div>
      </div>
      
      {/* Calendar Body - Month View */}
      {currentView === 'month' && (
        <div className="calendar-body">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-px bg-[#DCCCA3]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
              <div key={dayName} className="px-3 py-2 text-center text-sm font-medium text-black bg-[#FAF3E0]">
                {dayName}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-[#DCCCA3]">
            {calendarDays.map((dateObj, index) => {
              const dayEvents = getEventsForDate(dateObj.day);
              
              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(dateObj.day)}
                  className={`h-24 bg-white p-2 ${dateObj.isCurrentMonth ? 'cursor-pointer hover:bg-[#FAF3E0]' : 'bg-[#FAF3E0]/50'}`}
                >
                  {dateObj.day && (
                    <>
                      <div 
                        className={`text-right font-medium text-sm ${
                          isToday(dateObj.day) 
                            ? 'bg-[#7A8450] text-white h-6 w-6 rounded-full flex items-center justify-center ml-auto' 
                            : 'text-black'
                        }`}
                      >
                        {dateObj.day}
                      </div>
                      
                      <div className="mt-1 max-h-16 overflow-y-auto">
                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`px-2 py-1 rounded text-xs font-medium mb-1 truncate ${
                              event.color ? `bg-${event.color.replace('#', '')}` : 'bg-[#DCCCA3] text-[#556B2F]'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-[#7A8450] pl-2">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Week View Placeholder */}
      {currentView === 'week' && (
        <div className="p-4 bg-[#FAF3E0]">
          <p className="text-center text-[#556B2F]">Week view implementation here</p>
        </div>
      )}
      
      {/* Day View Placeholder */}
      {currentView === 'day' && (
        <div className="p-4 bg-[#FAF3E0]">
          <p className="text-center text-[#556B2F]">Day view implementation here</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
