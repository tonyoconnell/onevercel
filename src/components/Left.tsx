import React from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Single effect for all sidebar management
  React.useEffect(() => {
    // Handle resize
    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect.width < 768) {
        setIsOpen(false);
      }
    });

    observer.observe(document.documentElement);

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('[data-sidebar="true"]');
      const trigger = document.querySelector('[data-sidebar-trigger="true"]');
      
      if (
        isOpen && 
        sidebar && 
        !sidebar.contains(e.target as Node) && 
        trigger && 
        !trigger.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SidebarProvider defaultOpen={false} open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex min-h-screen">
        <Sidebar variant="floating" collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}