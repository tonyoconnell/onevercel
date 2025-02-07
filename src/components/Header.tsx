// src/components/Header.tsx
import { Download } from 'lucide-react';

export default function Header() {
  return (
    <header className="grid grid-cols-3 items-center h-16 border-b bg-background/95 backdrop-blur">
      {/* Left column */}
      <div>
        
          <button
            data-sidebar-trigger="true"
            className="p-2 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {/* Sidebar Trigger Icon */}
            &#9776;
          </button>
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