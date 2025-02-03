// src/components/Header.tsx
import { useStore } from '@nanostores/react';
import { isRightVisible, toggleRight } from '../stores/layout-store';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

interface HeaderProps {
  showLeft?: boolean;
  showRight?: boolean;
}

export default function Header({ showLeft = true, showRight = true }: HeaderProps) {
  const rightVisible = useStore(isRightVisible);
  
  // Add this to ensure the component only renders when sidebar context is available
  try {
    useSidebar();
  } catch {
    return null; // Return null if sidebar context isn't ready yet
  }

  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b flex items-center gap-4 z-10">
      {showLeft && <SidebarTrigger />}
      
      <div className="flex-1">
        <nav className="text-sm">Home / Page</nav>
      </div>

      {showRight && (
        <div className="flex items-center gap-2">
          {/* Mobile toggle button */}
          <button 
            onClick={toggleRight}
            aria-label="Toggle AI panel"
            className="md:hidden"
          >
            {rightVisible ? '✕' : '⚙️'}
          </button>
        </div>
      )}
    </header>
  );
}