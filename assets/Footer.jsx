import { Mail, Phone, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#556B2F] text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">MyApp</h2>
            <p className="mt-2 text-[#FAF3E0] text-sm">
              Simplifying your management experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/dashboard" className="text-[#DCCCA3] hover:text-white">Dashboard</a></li>
                <li><a href="/schedule" className="text-[#DCCCA3] hover:text-white">Schedule</a></li>
                <li><a href="/reminders" className="text-[#DCCCA3] hover:text-white">Reminders</a></li>
                <li><a href="/guests" className="text-[#DCCCA3] hover:text-white">Guests</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/help" className="text-[#DCCCA3] hover:text-white">Help Center</a></li>
                <li><a href="/faq" className="text-[#DCCCA3] hover:text-white">FAQ</a></li>
                <li><a href="/contact" className="text-[#DCCCA3] hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-[#DCCCA3]" />
                  <span className="text-[#FAF3E0]">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-[#DCCCA3]" />
                  <span className="text-[#FAF3E0]">support@myapp.com</span>
                </li>
                <li className="flex items-center">
                  <Github className="h-5 w-5 mr-2 text-[#DCCCA3]" />
                  <span className="text-[#FAF3E0]">github.com/myapp</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-[#7A8450] pt-4 md:flex md:items-center md:justify-between">
          <p className="text-sm text-[#FAF3E0]">
            © {currentYear} MyApp, Inc. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-[#DCCCA3] hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[#DCCCA3] hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-[#DCCCA3] hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;