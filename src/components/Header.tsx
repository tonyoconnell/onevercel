// src/components/Header.tsx
import { useStore } from '@nanostores/react';
import { isRightVisible, toggleRight, layoutState } from '../stores/layout-store';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { computed } from 'nanostores';

interface HeaderProps {
  showLeft?: boolean;
  showRight?: boolean;
}

function HeaderContent({ showLeft = true, showRight = true }: HeaderProps) {
  const rightVisible = useStore(isRightVisible);
  const { rightPanelSize } = useStore(layoutState);
  const isIcon = rightPanelSize === 'icon';
  
  const sidebar = useSidebar();

  // Add mobile visibility check
  const isMobile = useStore(computed(layoutState, s => 
    s.rightPanelSize === 'icon' && window.innerWidth < 768
  ));

  return isMobile ? null : (
    <header 
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="container flex h-full items-center">
        {/* Left section */}
        <div className="flex items-center gap-2">
          {showLeft && (
            <SidebarTrigger 
              data-sidebar-trigger="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
            >
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
          )}
          <a href="/" className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="Logo"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
            <span className="hidden font-semibold sm:inline-block">
              ONE
            </span>
          </a>
        </div>

        {/* Center section - Navigation */}
        <nav className="mx-auto hidden md:flex items-center gap-6">
          <a 
            href="/features" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a 
            href="/docs" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </a>
          <a 
            href="/pricing" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2">
          {showRight && !isIcon && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRight}
              className="md:hidden"
              aria-label={rightVisible ? 'Close AI panel' : 'Open AI panel'}
            >
              {rightVisible ? (
                <X className="h-5 w-5" />
              ) : (
                <span className="font-semibold">AI</span>
              )}
            </Button>
          )}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
            >
              Sign In
            </Button>
            <Button 
              size="sm"
            >
              Get Started
            </Button>
          </div>
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