import { CheckCircle, AlertTriangle, XCircle, Clock, InfoIcon } from 'lucide-react';

const statusConfig = {
  operational: {
    icon: CheckCircle,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    label: 'Operational'
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Degraded Performance'
  },
  outage: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: 'Major Outage'
  },
  maintenance: {
    icon: Clock,
    color: 'text-black',
    bgColor: 'bg-gray-200',
    label: 'Scheduled Maintenance'
  },
  unknown: {
    icon: InfoIcon,
    color: 'text-black',
    bgColor: 'bg-gray-100',
    label: 'Unknown'
  },
  locked: {
    icon: CheckCircle,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    label: 'Locked'
  },
  unlocked: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Unlocked'
  }
};

const SystemStatusCard = ({ 
  serviceName,
  status = 'unknown',
  lastUpdated = null,
  message = '',
  actions = null,
  onClick = null
}) => {
  const { icon: StatusIcon, color, bgColor, label } = statusConfig[status] || statusConfig.unknown;
  
  const formatLastUpdated = (date) => {
    if (!date) return null;
    
    // Convert date string to Date object if it's a string
    const lastUpdatedDate = typeof date === 'string' ? new Date(date) : date;
    
    // Calculate time difference in minutes
    const diffInMinutes = Math.floor((new Date() - lastUpdatedDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return lastUpdatedDate.toLocaleDateString();
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border border-gray-200 mb-4 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${bgColor} p-2 rounded-full`}>
            <StatusIcon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-black">{serviceName}</h3>
            <p className={`text-sm ${color} font-medium`}>{label}</p>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="text-right">
            <p className="text-xs text-black">Last updated</p>
            <p className="text-sm font-medium">{formatLastUpdated(lastUpdated)}</p>
          </div>
        )}
      </div>
      
      {(message || actions) && (
        <div className="mt-3 text-sm text-black">
          {message && (
            <div className="flex items-center justify-between">
              <p>{message}</p>
              {actions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemStatusCard;
