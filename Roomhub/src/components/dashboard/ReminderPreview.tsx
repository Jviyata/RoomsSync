import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ReminderPreview = () => {
  const { data: reminders, isLoading, error } = useQuery({
    queryKey: ['/api/reminders'],
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-6 w-[60px]" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center text-red-600">
        <p>Error loading reminders: {error.message}</p>
      </div>
    );
  }

  if (!reminders || reminders.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <p className="text-gray-500">No reminders available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getBorderColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-[#7A8450]';
      case 'low':
      default: return 'border-[#DCCCA3]';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High</span>;
      case 'medium':
        return <span className="text-xs bg-[#FAF3E0] text-[#556B2F] px-2 py-1 rounded">Medium</span>;
      case 'low':
      default:
        return <span className="text-xs bg-[#FAF3E0] text-[#556B2F] px-2 py-1 rounded">Low</span>;
    }
  };

  // Sort reminders by createdAt (newest first) and priority (high first)
  const sortedReminders = [...reminders].sort((a, b) => {
    // First sort by priority
    const priorityMap = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityMap[b.priority] - priorityMap[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-3">
      {sortedReminders.slice(0, 3).map((reminder) => (
        <div 
          key={reminder.id} 
          className={`bg-white p-4 rounded-lg shadow border-l-4 ${getBorderColor(reminder.priority)}`}
        >
          <div className="flex justify-between">
            <h3 className="font-medium">{reminder.text.split('.')[0]}</h3>
            {getPriorityBadge(reminder.priority)}
          </div>
          <p className="text-sm text-[#555555] mt-1">{reminder.text}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-[#777777]">
            <span>From: {reminder.fromUser}</span>
            <span>{formatDate(reminder.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReminderPreviewSection = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#333333]">Recent Reminders</h2>
        <Link href="/reminders">
          <a className="text-[#7A8450] hover:text-[#556B2F] flex items-center">
            Add Reminder
            <Plus className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      <ReminderPreview />
    </div>
  );
};

export default ReminderPreviewSection;
