import { useState } from 'react';
import { Bell, Calendar, Home, Menu, Users, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Reminders', href: '/reminders', icon: Bell },
    { name: 'Guests', href: '/guests', icon: Users },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col items-center justify-center space-y-6 p-4 bg-[#FAF3E0] bg-opacity-90 shadow-lg">
      {/* App Logo - Top */}
      <Link href="/dashboard">
        <a className="mb-8 p-3 rounded-full bg-[#7A8450] shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
          <div className="text-white font-bold text-lg">RH</div>
        </a>
      </Link>
      
      {/* Navigation Icons */}
      {navigationItems.map((item) => (
        <Link key={item.name} href={item.href}>
          <a 
            className={`p-3 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 ${
              isActive(item.href) 
                ? 'bg-[#7A8450] text-white' 
                : 'bg-white text-[#7A8450] hover:bg-[#DCCCA3] hover:text-[#556B2F]'
            }`}
            title={item.name}
          >
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.name}</span>
          </a>
        </Link>
      ))}
      
      {/* User Profile - Bottom */}
      <div className="mt-8 p-3 rounded-full bg-[#7A8450] shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
        <div className="h-5 w-5 text-white flex items-center justify-center">
          RA
        </div>
      </div>
      
      {/* Mobile menu button - only visible on small screens */}
      <div className="fixed top-4 right-4 md:hidden">
        <button
          type="button"
          className="p-2 rounded-full bg-white shadow-md text-[#7A8450] hover:bg-[#DCCCA3] focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#7A8450] bg-opacity-90 z-40 md:hidden flex items-center justify-center">
          <div className="flex flex-col items-center space-y-8 p-6 rounded-lg">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
              >
                <a 
                  className="flex flex-col items-center justify-center p-4 rounded-full bg-white text-[#7A8450] shadow-lg hover:bg-[#DCCCA3] transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
