import React from 'react';

interface RoomhubIconProps {
  className?: string;
  size?: number;
}

const RoomhubIcon: React.FC<RoomhubIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* House */}
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      
      {/* Door */}
      <path d="M9 22V12h6v10" />
      
      {/* Window */}
      <path d="M14 7h.01" />
      
      {/* Circular element representing people/community */}
      <circle cx="12" cy="7" r="2" />
    </svg>
  );
};

export default RoomhubIcon;