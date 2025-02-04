import React from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Header from "@/components/Header";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SidebarProvider 
      defaultOpen={false} 
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="flex min-h-screen">
        <div onMouseEnter={() => setIsOpen(true)}>
          <Sidebar variant="floating" collapsible="icon">
            <AppSidebar />
          </Sidebar>
        </div>
        <div className="flex-1">
          <Header showLeft={true} showRight={false} />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}