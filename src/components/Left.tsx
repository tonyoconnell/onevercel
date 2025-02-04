import React from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Use ResizeObserver to handle viewport changes
  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width < 768) {
        setIsOpen(false);
      }
    });

    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  // Enhanced click outside detection
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('[data-sidebar="true"]');
      const trigger = document.querySelector('[data-sidebar-trigger="true"]');
      
      if (
        sidebar && 
        !sidebar.contains(event.target as Node) && 
        trigger && 
        !trigger.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <SidebarProvider 
      defaultOpen={false} 
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="flex min-h-screen">
        <div 
          data-sidebar="true"
          className="transition-transform duration-200"
        >
          <Sidebar variant="floating" collapsible="icon">
            <AppSidebar />
          </Sidebar>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}