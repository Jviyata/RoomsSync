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
      
      {/* Heart inside the house */}
      <path 
        d="M12 15l-2-2c-0.8-0.8-0.8-2 0-2.8s2-0.8 2.8 0l0.2 0.2 0.2-0.2c0.8-0.8 2-0.8 2.8 0s0.8 2 0 2.8L12 15z" 
        strokeWidth="1.5" 
        fill="currentColor"
      />
    </svg>
  );
};

export default RoomhubIcon;