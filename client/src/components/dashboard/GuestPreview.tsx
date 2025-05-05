import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Calendar, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const GuestCard = ({ guest }) => {
  const initials = guest.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-[#DCCCA3] flex items-center justify-center text-[#556B2F] text-xl font-bold">
              {initials}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-black">{guest.name}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {guest.relationship && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FAF3E0] text-[#556B2F]">
                  {guest.relationship}
                </span>
              )}
              {guest.tags && guest.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-medium text-[#7A8450]">Today</p>
            <p className="text-xs text-[#555555]">
              {guest.visitTime} {guest.visitEndTime ? `- ${guest.visitEndTime}` : ''}
            </p>
          </div>
        </div>
        
        <div className="mt-4 border-t border-[#DCCCA3] pt-3">
          {guest.isFirstTime && (
            <div className="flex items-center text-sm text-[#555555]">
              <Info className="h-4 w-4 mr-1 text-[#7A8450]" />
              <span>First-time visitor</span>
            </div>
          )}
          {guest.notes && (
            <p className="mt-2 text-sm text-[#555555]">{guest.notes}</p>
          )}
        </div>
        
        <div className="mt-3 flex justify-end">
          <Link href={`/guests/${guest.id}`}>
            <a className="text-[#7A8450] hover:text-[#556B2F] text-sm flex items-center">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

const UpcomingVisits = ({ guests }) => {
  if (!guests || guests.length === 0) return null;

  return (
    <div className="mt-4 bg-[#FAF3E0] rounded-lg p-4 border border-[#DCCCA3]">
      <h3 className="font-medium flex items-center">
        <Calendar className="h-5 w-5 mr-1 text-[#7A8450]" />
        Upcoming Visits
      </h3>
      
      <div className="mt-3 space-y-3">
        {guests.map((guest) => (
          <div key={guest.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{guest.name}</p>
              <p className="text-xs text-[#555555]">{guest.relationship}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-[#7A8450]">
                {new Date(guest.visitDate).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <p className="text-xs">{guest.visitTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GuestPreview = () => {
  const { data: todayGuests, isLoading: isTodayLoading } = useQuery({
    queryKey: ['/api/guests/today'],
  });

  const { data: allGuests, isLoading: isAllLoading } = useQuery({
    queryKey: ['/api/guests'],
  });

  const today = new Date().toISOString().split('T')[0];
  
  // Filter upcoming guests (not today)
  const upcomingGuests = allGuests?.filter(guest => 
    guest.visitDate > today
  ).sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate)).slice(0, 2) || [];

  if (isTodayLoading || isAllLoading) {
    return (
      <div>
        <Skeleton className="h-[200px] w-full mb-4" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  return (
    <div>
      {todayGuests && todayGuests.length > 0 ? (
        <GuestCard guest={todayGuests[0]} />
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No guests expected today</p>
        </div>
      )}
      
      {upcomingGuests.length > 0 && <UpcomingVisits guests={upcomingGuests} />}
    </div>
  );
};

const GuestPreviewSection = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#333333]">Expected Guests</h2>
        <Link href="/guests">
          <a className="text-[#7A8450] hover:text-[#556B2F] flex items-center">
            Add Guest
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      <GuestPreview />
    </div>
  );
};

export default GuestPreviewSection;
