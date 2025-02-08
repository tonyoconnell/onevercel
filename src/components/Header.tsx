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
    <header className="grid grid-cols-3 items-center h-[65px] border-b bg-background/95 backdrop-blur">
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
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-50 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className={`flex flex-col items-center justify-center h-full space-y-8 transition-all duration-300 transform ${isSidebarOpen ? 'translate-y-0' : '-translate-y-8'}`}>
            <a href="/" className="text-2xl font-medium hover:text-primary transition-colors">Home</a>
            <a href="/docs" className="text-2xl font-medium hover:text-primary transition-colors">Docs</a>
            <a href="/blog" className="text-2xl font-medium hover:text-primary transition-colors">Blog</a>
            <a href="/chat" className="text-2xl font-medium hover:text-primary transition-colors">Chat</a>
            <button
              onClick={toggleSidebar}
              className="mt-8 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Close Menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export { Header };