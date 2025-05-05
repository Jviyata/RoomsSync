/*
 * COMPONENT REFERENCE FILE
 *
 * This file contains reference code snippets from the original project
 * that have been integrated into the application as proper TypeScript React components.
 * 
 * These are kept for reference purposes only and are not used in the actual application.
 */

// ==============================
// CalendarView Reference
// ==============================

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  // Mock events data
  const mockEvents = [
    { id: 1, title: 'Morning Shower', space: 'Bathroom', time: '7:00 AM - 7:30 AM', user: 'Roommate A', color: '#7A8450' },
    { id: 2, title: 'Cooking Dinner', space: 'Kitchen', time: '6:00 PM - 7:00 PM', user: 'Isabel "Belly" Conklin', color: '#556B2F' },
    { id: 3, title: 'Movie Night', space: 'Living Room', time: '8:00 PM - 10:00 PM', user: 'Roommate A', color: '#7A8450' },
  ];
  
  // Fetch events on component mount
  useEffect(() => {
    // In a real app, you would fetch events from an API
    setEvents(mockEvents);
  }, []);
  
  // Generate date grid for the current month
  const generateDatesForCurrentMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const calendar = [];
    let day = 1;
    
    // Create calendar grid (6 rows x 7 columns)
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDayIndex) {
          week.push({day: null, date: null});
        } else if (day > daysInMonth) {
          week.push({day: null, date: null});
        } else {
          const date = new Date(year, month, day);
          week.push({day, date});
          day++;
        }
      }
      calendar.push(week);
    }
    
    return calendar;
  };
  
  const calendar = generateDatesForCurrentMonth();
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Check if a date has events
  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date); // Assuming event.date is a string like "2023-05-01"
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Format month and year for display
  const formatMonthAndYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-[#7A8450]" />
        </button>
        
        <h2 className="text-xl font-semibold text-[#556B2F]">{formatMonthAndYear()}</h2>
        
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight className="h-5 w-5 text-[#7A8450]" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="bg-white p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {calendar.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((dateObj, dayIndex) => {
              const dateEvents = dateObj.date ? getEventsForDate(dateObj.date) : [];
              const isToday = dateObj.date ? 
                dateObj.date.toDateString() === new Date().toDateString() : false;
              
              return (
                <div 
                  key={dayIndex}
                  className={`bg-white p-1 min-h-[80px] border ${isToday ? 'border-[#7A8450]' : 'border-gray-100'}`}
                >
                  {dateObj.day && (
                    <>
                      <div className={`text-right text-sm ${isToday ? 'text-[#7A8450] font-bold' : 'text-gray-500'}`}>
                        {dateObj.day}
                      </div>
                      
                      <div className="mt-1 space-y-1">
                        {dateEvents.map(event => (
                          <div 
                            key={event.id}
                            className="text-xs p-1 rounded truncate"
                            style={{ backgroundColor: event.color + '20', color: event.color }}
                          >
                            {event.time} - {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#7A8450] mr-2"></div>
            <span className="text-xs text-gray-600">Roommate A</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#556B2F] mr-2"></div>
            <span className="text-xs text-gray-600">Isabel "Belly" Conklin</span>
          </div>
        </div>
        
        <button className="flex items-center bg-[#7A8450] text-white px-3 py-2 rounded-md text-sm hover:bg-[#556B2F]">
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </button>
      </div>
    </div>
  );
};

// ==============================
// DashboardCard Reference
// ==============================

const DashboardCard = ({ title, children, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-[#FAF3E0] border-b border-[#DCCCA3]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#556B2F] flex items-center">
            {Icon && <Icon className="mr-2 h-5 w-5 text-[#7A8450]" />}
            {title}
          </h3>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

// ==============================
// EventForm Reference
// ==============================

const EventForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    space: '',
    description: '',
    color: '#7A8450',
    attendees: [],
    isAllDay: false,
  });
  
  const spaces = [
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'living_room', label: 'Living Room' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'laundry', label: 'Laundry Room' },
  ];
  
  const roommates = [
    { id: 1, name: 'Roommate A' },
    { id: 2, name: 'Isabel "Belly" Conklin' },
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAttendeeChange = (roommateId) => {
    setFormData(prev => {
      const currentAttendees = [...prev.attendees];
      if (currentAttendees.includes(roommateId)) {
        return {
          ...prev,
          attendees: currentAttendees.filter(id => id !== roommateId)
        };
      } else {
        return {
          ...prev,
          attendees: [...currentAttendees, roommateId]
        };
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the data to an API
    console.log('Form submitted:', formData);
    onClose();
  };
  
  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-[#556B2F]">Schedule Space Usage</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="What are you planning?"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={formData.isAllDay}
                required={!formData.isAllDay}
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={formData.isAllDay}
                required={!formData.isAllDay}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAllDay"
              id="isAllDay"
              checked={formData.isAllDay}
              onChange={handleChange}
              className="h-4 w-4 text-[#7A8450] border-gray-300 rounded focus:ring-[#7A8450]"
            />
            <label htmlFor="isAllDay" className="ml-2 block text-sm text-gray-700">
              All day event
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Space</label>
            <select
              name="space"
              value={formData.space}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Select a space</option>
              {spaces.map(space => (
                <option key={space.value} value={space.value}>{space.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Add any details about your event..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="mt-1 block border border-gray-300 rounded-md shadow-sm p-1 w-full h-10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notify Roommates (Optional)</label>
            <div className="space-y-2">
              {roommates.map(roommate => (
                <div key={roommate.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`roommate-${roommate.id}`}
                    checked={formData.attendees.includes(roommate.id)}
                    onChange={() => handleAttendeeChange(roommate.id)}
                    className="h-4 w-4 text-[#7A8450] border-gray-300 rounded focus:ring-[#7A8450]"
                  />
                  <label htmlFor={`roommate-${roommate.id}`} className="ml-2 block text-sm text-gray-700">
                    {roommate.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7A8450] hover:bg-[#556B2F]"
          >
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

// ==============================
// Footer Reference
// ==============================

import { Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#556B2F] text-white mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">RoomHub</h2>
            <p className="mt-2 text-[#FAF3E0] text-sm">
              Shared living made simple
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/dashboard" className="text-[#DCCCA3] hover:text-white">Dashboard</a></li>
                <li><a href="/schedule" className="text-[#DCCCA3] hover:text-white">Schedule</a></li>
                <li><a href="/reminders" className="text-[#DCCCA3] hover:text-white">Reminders</a></li>
                <li><a href="/guests" className="text-[#DCCCA3] hover:text-white">Guests</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-[#DCCCA3] hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-[#DCCCA3] hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-[#DCCCA3] hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-[#DCCCA3]" />
                  <span className="text-[#FAF3E0]">support@roomhub.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-[#7A8450] pt-4 md:flex md:items-center md:justify-between">
          <p className="text-sm text-[#FAF3E0]">
            © {currentYear} RoomHub, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==============================
// Navbar Reference
// ==============================

import { useState } from 'react';
import { Bell, Calendar, Home, Menu, Settings, Users, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Reminders', href: '/reminders', icon: Bell },
    { name: 'Guests', href: '/guests', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/dashboard" className="text-xl font-bold text-[#7A8450]">RoomHub</a>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === item.href 
                      ? 'border-[#7A8450] text-black' 
                      : 'border-transparent text-black hover:text-[#556B2F] hover:border-[#7A8450]'
                  }`}
                >
                  <item.icon className={`mr-1 h-5 w-5 ${window.location.pathname === item.href ? 'text-[#7A8450]' : ''}`} />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-[#556B2F] hover:bg-[#FAF3E0] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7A8450]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* User profile section */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-3 relative">
              <div>
                <button className="max-w-xs bg-[#7A8450] rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#556B2F]">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[#7A8450] flex items-center justify-center text-white">
                    RA
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-[#FAF3E0]">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  window.location.pathname === item.href
                    ? 'bg-[#DCCCA3] border-l-4 border-[#7A8450] text-black'
                    : 'text-black hover:bg-[#DCCCA3] hover:text-[#556B2F]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5 text-[#7A8450]" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// ==============================
// ReminderForm Reference
// ==============================

const ReminderForm = ({ onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('normal');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, priority });
    setText('');
    setPriority('normal');
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-[#556B2F] mb-4">New Reminder</h3>
      
      <div className="mb-4">
        <label htmlFor="reminder-text" className="block text-sm font-medium text-gray-700 mb-1">
          Reminder Text
        </label>
        <textarea
          id="reminder-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#7A8450] focus:border-[#7A8450]"
          rows="3"
          placeholder="Enter your reminder here..."
          required
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="low"
              checked={priority === 'low'}
              onChange={() => setPriority('low')}
              className="h-4 w-4 text-[#7A8450] border-gray-300 focus:ring-[#7A8450]"
            />
            <span className="ml-2 text-sm text-gray-700">Low</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="normal"
              checked={priority === 'normal'}
              onChange={() => setPriority('normal')}
              className="h-4 w-4 text-[#7A8450] border-gray-300 focus:ring-[#7A8450]"
            />
            <span className="ml-2 text-sm text-gray-700">Normal</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="high"
              checked={priority === 'high'}
              onChange={() => setPriority('high')}
              className="h-4 w-4 text-[#7A8450] border-gray-300 focus:ring-[#7A8450]"
            />
            <span className="ml-2 text-sm text-gray-700">High</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#7A8450] border border-transparent rounded-md hover:bg-[#556B2F]"
        >
          Send Reminder
        </button>
      </div>
    </form>
  );
};

// ==============================
// ReminderList Reference
// ==============================

const ReminderList = ({ reminders = [], onMarkComplete }) => {
  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <div 
          key={reminder.id} 
          className={`flex items-start p-3 rounded-lg ${reminder.completed ? 'bg-gray-100' : 'bg-white'} border border-gray-200 shadow-sm`}
        >
          <input
            type="checkbox"
            checked={reminder.completed}
            onChange={() => onMarkComplete(reminder.id)}
            className="h-5 w-5 mt-0.5 text-[#7A8450] border-gray-300 rounded focus:ring-[#7A8450]"
          />
          
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <p className={`text-sm font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {reminder.text}
              </p>
              <span className="text-xs text-gray-500">{reminder.fromUser}</span>
            </div>
            
            <div className="mt-1 flex items-center">
              <span 
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(reminder.priority)}`}
              >
                {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {formatDate(reminder.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {reminders.length === 0 && (
        <div className="text-center py-6 text-gray-500 italic">
          No reminders yet. Add your first reminder!
        </div>
      )}
    </div>
  );
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'normal':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// ==============================
// SystemStatusCard Reference
// ==============================

import { Thermometer, Lock, Unlock } from 'lucide-react';

const SystemStatusCard = ({ temperature, doorLocked, onToggleDoor, onChangeTemperature }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-[#FAF3E0] border-b border-[#DCCCA3]">
        <h3 className="text-lg font-medium text-[#556B2F]">
          System Status
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Temperature Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="h-6 w-6 text-[#7A8450] mr-2" />
            <span className="text-gray-700">Temperature</span>
          </div>
          
          <div className="flex items-center">
            <input
              type="range"
              min="60"
              max="85"
              value={temperature}
              onChange={(e) => onChangeTemperature(parseInt(e.target.value))}
              className="mr-2 h-2 w-24 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7A8450]"
            />
            <span className="text-gray-900 font-medium min-w-[2.5rem]">{temperature}°F</span>
          </div>
        </div>
        
        {/* Door Lock Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {doorLocked ? (
              <Lock className="h-6 w-6 text-[#7A8450] mr-2" />
            ) : (
              <Unlock className="h-6 w-6 text-yellow-600 mr-2" />
            )}
            <span className="text-gray-700">Front Door</span>
          </div>
          
          <button
            onClick={onToggleDoor}
            className={`px-3 py-1 rounded-full text-sm font-medium ${doorLocked ? 'bg-[#7A8450] text-white' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}
          >
            {doorLocked ? 'Locked' : 'Unlocked'}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 italic">
          <p>* Temperature and door lock controls are simulated and not connected to real smart home devices.</p>
        </div>
      </div>
    </div>
  );
};
