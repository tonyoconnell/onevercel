// src/components/Header.tsx
import { useStore } from '@nanostores/react';
import { isRightVisible, toggleRight } from '../stores/layout-store';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Suspense } from 'react';

interface HeaderProps {
  showLeft?: boolean;
  showRight?: boolean;
}

function HeaderContent({ showLeft = true, showRight = true }: HeaderProps) {
  const rightVisible = useStore(isRightVisible);
  
  // Add this to ensure the component only renders when sidebar context is available
  try {
    useSidebar();
  } catch {
    return null; // Return null if sidebar context isn't ready yet
  }

  return (
    <header 
      className="sticky top-0 z-10 grid grid-cols-3 items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      style={{ height: 'var(--header-height)' }}
    >
      {/* Left section */}
      <div className="flex items-center pl-4">
        {showLeft && <SidebarTrigger data-sidebar-trigger="true" />}
      </div>

      {/* Center section - Logo */}
      <div className="flex justify-center">
        <img 
          src="/logo.svg" 
          alt="Logo"
          className="h-8 w-auto"
          width={32}
          height={32}
        />
      </div>

      {/* Right section */}
      <div className="flex justify-end pr-4">
        {showRight && (
          <button 
            onClick={toggleRight}
            aria-label="Toggle AI panel"
            className="md:hidden p-2"
          >
            <span className="sr-only">Toggle AI Panel</span>
            {rightVisible ? '✕' : '⚙️'}
          </button>
        )}
      </div>
    </header>
  );
}

// Export wrapped with Suspense and error handling
export default function Header(props: HeaderProps) {
  return (
    <Suspense fallback={<div style={{ height: 'var(--header-height)' }} />}>
      <HeaderContent {...props} />
    </Suspense>
  );
}