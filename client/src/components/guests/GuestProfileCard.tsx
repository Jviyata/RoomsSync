import { useState } from 'react';
import { Calendar, Info, User, Clock, Tag, Edit, Trash, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const GuestProfileCard = ({ 
  guest, 
  compact = false,
  onEdit = null,
  onDelete = null
}) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!guest) return null;
  
  const initials = guest.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };
  
  const isTomorrow = (dateString) => {
    if (!dateString) return false;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return dateString === tomorrowStr;
  };
  
  const getDateLabel = (dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isTomorrow(dateString)) return 'Tomorrow';
    return formatDate(dateString);
  };
  
  // Compact view for dashboard preview
  if (compact) {
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
              <p className="text-sm font-medium text-[#7A8450]">{getDateLabel(guest.visitDate)}</p>
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
  }
  
  // Full detailed view
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-[#DCCCA3] flex items-center justify-center text-[#556B2F] text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">{guest.name}</h2>
              {guest.relationship && (
                <p className="text-[#555555]">{guest.relationship}</p>
              )}
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(guest)}
                  variant="outline"
                  className="border-[#7A8450] text-[#7A8450] hover:bg-[#FAF3E0]"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(guest.id)}
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FAF3E0] p-4 rounded-lg">
            <h3 className="font-medium flex items-center mb-3">
              <Calendar className="h-5 w-5 mr-2 text-[#7A8450]" />
              Visit Details
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-[#7A8450]" />
                <span className="font-medium mr-2">Date:</span>
                <span>{formatDate(guest.visitDate)}</span>
              </li>
              <li className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-[#7A8450]" />
                <span className="font-medium mr-2">Time:</span>
                <span>{guest.visitTime} {guest.visitEndTime ? `- ${guest.visitEndTime}` : ''}</span>
              </li>
              {guest.isFirstTime && (
                <li className="flex items-center text-sm">
                  <Info className="h-4 w-4 mr-2 text-[#7A8450]" />
                  <span className="text-[#556B2F] font-medium">First-time visitor</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="bg-[#FAF3E0] p-4 rounded-lg">
            <h3 className="font-medium flex items-center mb-3">
              <Tag className="h-5 w-5 mr-2 text-[#7A8450]" />
              Tags & Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {guest.relationship && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#DCCCA3] text-[#556B2F]">
                  {guest.relationship}
                </span>
              )}
              {guest.tags && guest.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {guest.notes && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-[#7A8450] hover:text-[#556B2F] mb-2"
            >
              <Info className="h-5 w-5 mr-1" />
              {expanded ? "Hide Notes" : "Show Notes"}
            </button>
            
            {expanded && (
              <div className="bg-[#FAF3E0] p-4 rounded-lg">
                <p className="text-[#555555]">{guest.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestProfileCard;
