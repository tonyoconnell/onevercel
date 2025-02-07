// src/components/Header.tsx
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="grid grid-cols-3 items-center h-16 border-b bg-background/95 backdrop-blur">
      {/* Left column */}
      <div>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent rounded-md focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Center column with Logo */}
      <div className="flex justify-center">
        <a href="/" className="flex items-center gap-2">
          <img 
            src="/logo.svg" 
            alt="Logo"
            className="h-10 w-auto"
          />
        </a>
      </div>
      
      {/* Right column */}
      <div className="flex justify-end pr-4">
        <button className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
          <Download className="h-5 w-5" />
          <span>Download</span>
        </button>
      </div>
    </header>
  );
}

export { Header };