import { Mail, Phone, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-[#f5f5dc] mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">RoomHub</h2>
            <p className="mt-2 text-[#e5e5d0] text-sm">
              Shared living made simple
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/dashboard" className="text-[#e5e5d0] hover:text-white">Dashboard</a></li>
                <li><a href="/schedule" className="text-[#e5e5d0] hover:text-white">Schedule</a></li>
                <li><a href="/reminders" className="text-[#e5e5d0] hover:text-white">Reminders</a></li>
                <li><a href="/guests" className="text-[#e5e5d0] hover:text-white">Guests</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-[#e5e5d0] hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-[#e5e5d0] hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-[#e5e5d0] hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-[#e5e5d0]" />
                  <span className="text-[#f5f5dc]">support@roomhub.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-[#333333] pt-4 md:flex md:items-center md:justify-between">
          <p className="text-sm text-[#e5e5d0]">
            © {currentYear} RoomHub, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
