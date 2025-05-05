import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SchedulePreview = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/events/today'],
  });

  const formatDateString = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const today = new Date().toISOString().split('T')[0];
  const formattedDate = formatDateString(today);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between bg-[#FAF3E0]">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="divide-y divide-[#DCCCA3]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3">
              <div className="flex">
                <Skeleton className="w-20 h-5 mr-4" />
                <div className="w-full">
                  <Skeleton className="h-5 w-full max-w-[200px] mb-2" />
                  <Skeleton className="h-4 w-full max-w-[150px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center text-red-600">
        <p>Error loading schedule: {error.message}</p>
      </div>
    );
  }

  if (events && events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between bg-[#FAF3E0]">
          <h3 className="font-semibold">{formattedDate}</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          <p>No events scheduled for today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-[#FAF3E0]">
        <h3 className="font-semibold">{formattedDate}</h3>
      </div>
      
      <div className="divide-y divide-[#DCCCA3]">
        {events && events.map((event) => (
          <div key={event.id} className="p-3 hover:bg-[#FAF3E0]">
            <div className="flex">
              <div className="w-20 text-[#7A8450] font-medium">
                {event.startTime}
              </div>
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-[#555555]">
                  {event.space} - {Array.isArray(event.attendees) ? event.attendees.join(', ') : event.attendees}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SchedulePreviewSection = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#333333]">Today's Schedule</h2>
        <Link href="/schedule">
          <a className="text-[#7A8450] hover:text-[#556B2F] flex items-center">
            View Full Calendar
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      <SchedulePreview />
    </div>
  );
};

export default SchedulePreviewSection;
