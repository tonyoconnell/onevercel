// src/components/Header.tsx
import { useStore } from '@nanostores/react';
import { isRightVisible, toggleRight, layoutState } from '../stores/layout-store';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HeaderProps {
  showLeft?: boolean;
  showRight?: boolean;
}

function HeaderContent({ showLeft = true, showRight = true }: HeaderProps) {
  const rightVisible = useStore(isRightVisible);
  const { rightPanelSize } = useStore(layoutState);
  const isIcon = rightPanelSize === 'icon';
  
  // Add this to ensure the component only renders when sidebar context is available
  try {
    useSidebar();
  } catch {
    return null;
  }

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="container flex h-full items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showLeft && (
            <SidebarTrigger 
              data-sidebar-trigger="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
            />
          )}
          <a href="/" className="flex items-center gap-2 md:gap-3">
            <img 
              src="/logo.svg" 
              alt="Logo"
              className="h-6 w-auto md:h-8"
              width={32}
              height={32}
            />
            <span className="hidden font-semibold md:inline-block">
              Your Brand
            </span>
          </a>
        </div>

        {/* Center section - Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="/features" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Features
          </a>
          <a 
            href="/docs" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Documentation
          </a>
          <a 
            href="/pricing" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Pricing
          </a>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {showRight && !isIcon && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRight}
              className="md:hidden"
              aria-label={rightVisible ? 'Close AI panel' : 'Open AI panel'}
            >
              {rightVisible ? (
                <X className="h-4 w-4" />
              ) : (
                <span className="font-semibold">AI</span>
              )}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:inline-flex"
          >
            Sign In
          </Button>
          <Button 
            size="sm"
            className="hidden md:inline-flex"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

// Export wrapped with Suspense and error handling
export default function Header(props: HeaderProps) {
  return (
    <Suspense fallback={
      <div 
        className="h-[var(--header-height)] border-b bg-background/95 backdrop-blur"
        aria-hidden="true" 
      />
    }>
      <HeaderContent {...props} />
    </Suspense>
  );
}