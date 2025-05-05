import { CheckCircle, AlertTriangle, XCircle, Clock, InfoIcon } from 'lucide-react';

const statusConfig = {
  operational: {
    icon: CheckCircle,
    color: 'text-[#7A8450]',
    bgColor: 'bg-[#FAF3E0]',
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
    color: 'text-[#556B2F]',
    bgColor: 'bg-[#DCCCA3]',
    label: 'Scheduled Maintenance'
  },
  unknown: {
    icon: InfoIcon,
    color: 'text-black',
    bgColor: 'bg-[#FAF3E0]',
    label: 'Unknown'
  }
};

const SystemStatusCard = ({ 
  serviceName,
  status = 'unknown',
  lastUpdated = null,
  message = '',
  onClick = null
}) => {
  const { icon: StatusIcon, color, bgColor, label } = statusConfig[status] || statusConfig.unknown;
  
  return (
    <div 
      className={`p-4 rounded-lg border border-[#DCCCA3] mb-4 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
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
            <p className="text-sm font-medium">{lastUpdated}</p>
          </div>
        )}
      </div>
      
      {message && (
        <div className="mt-3 text-sm text-black">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default SystemStatusCard;