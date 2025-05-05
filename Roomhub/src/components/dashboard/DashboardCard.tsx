import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change = null, 
  changeType = null, 
  children = null 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine color based on change type
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-[#7A8450]';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-black';
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-[#DCCCA3]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-black">{title}</p>
          <div className="mt-1 flex items-baseline">
            <h3 className="text-2xl font-semibold text-black">{value}</h3>
            
            {change && (
              <span className={`ml-2 flex items-baseline text-sm font-medium ${getChangeColor()}`}>
                {changeType === 'positive' && <ChevronUp className="h-4 w-4 flex-shrink-0" />}
                {changeType === 'negative' && <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                {change}
              </span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className="bg-[#FAF3E0] p-3 rounded-full">
            <Icon className="h-6 w-6 text-[#7A8450]" />
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-[#7A8450] hover:text-[#556B2F] flex items-center"
          >
            {expanded ? 'View less' : 'View details'}
            {expanded ? 
              <ChevronUp className="ml-1 h-4 w-4" /> : 
              <ChevronDown className="ml-1 h-4 w-4" />
            }
          </button>
          
          {expanded && <div className="mt-3 border-t border-[#DCCCA3] pt-3">{children}</div>}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
