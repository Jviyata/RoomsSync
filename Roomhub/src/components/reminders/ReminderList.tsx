import { useState } from 'react';
import { CheckCircle, Edit, Trash2, AlertCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const ReminderList = ({ 
  reminders = [], 
  onComplete, 
  onEdit, 
  onDelete,
  isLoading = false
}) => {
  const [filter, setFilter] = useState('all'); // all, completed, active, high, medium, low
  
  const getFilteredReminders = () => {
    if (filter === 'all') return reminders;
    if (filter === 'completed') return reminders.filter(reminder => reminder.completed);
    if (filter === 'active') return reminders.filter(reminder => !reminder.completed);
    if (['high', 'medium', 'low'].includes(filter)) return reminders.filter(reminder => reminder.priority === filter);
    return reminders;
  };

  const getBorderColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-[#7A8450]';
      case 'low': 
      default: return 'border-[#DCCCA3]';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High</span>;
      case 'medium':
        return <span className="text-xs bg-[#FAF3E0] text-[#556B2F] px-2 py-1 rounded">Medium</span>;
      case 'low':
      default:
        return <span className="text-xs bg-[#FAF3E0] text-[#556B2F] px-2 py-1 rounded">Low</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredReminders = getFilteredReminders();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7A8450]"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <AlertCircle className="mx-auto h-12 w-12 text-[#DCCCA3]" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No reminders yet</h3>
        <p className="mt-1 text-sm text-gray-500">Create a new reminder to get started.</p>
      </div>
    );
  }

  if (filteredReminders.length === 0) {
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Reminders</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>Completed</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('high')}>High Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('medium')}>Medium Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('low')}>Low Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <AlertCircle className="mx-auto h-12 w-12 text-[#DCCCA3]" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No matching reminders</h3>
          <p className="mt-1 text-sm text-gray-500">Try changing your filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter Reminders</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('active')}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('completed')}>Completed</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('high')}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('medium')}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('low')}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-4">
        {filteredReminders.map((reminder) => (
          <div 
            key={reminder.id} 
            className={`bg-white p-4 rounded-lg shadow border-l-4 ${getBorderColor(reminder.priority)} ${reminder.completed ? 'opacity-70' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div>
                  <Checkbox 
                    id={`reminder-${reminder.id}`}
                    checked={reminder.completed}
                    onCheckedChange={() => onComplete(reminder)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className={`font-medium ${reminder.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                      {reminder.text.split('.')[0]}
                    </h3>
                    <div className="ml-2">
                      {getPriorityBadge(reminder.priority)}
                    </div>
                  </div>
                  <p className={`text-sm ${reminder.completed ? 'line-through text-gray-400' : 'text-[#555555]'}`}>
                    {reminder.text}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-[#777777]">
                    <span>From: {reminder.fromUser}</span>
                    <span>{formatDate(reminder.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => onEdit(reminder)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-[#556B2F] hover:text-[#7A8450] hover:bg-[#FAF3E0]"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDelete(reminder.id)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderList;
