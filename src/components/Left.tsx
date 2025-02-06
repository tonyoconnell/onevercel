import React from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // Handle mouse enter - open sidebar
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

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
      if (!sidebarRef.current?.contains(e.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SidebarProvider defaultOpen={false} open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex min-h-screen">
        <div ref={sidebarRef} onMouseEnter={handleMouseEnter}>
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