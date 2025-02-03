import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/HeaderWithSidebar";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

interface HeaderWithSidebarProps {
  children: React.ReactNode;
}

// Cookie name for persisting sidebar state
const SIDEBAR_COOKIE_NAME = "sidebar:state"

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  // Get the initial state from cookie if available
  const [defaultOpen] = React.useState(() => {
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      return cookie ? cookie.split('=')[1] === 'true' : true
    }
    return true
  })

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1">
          <div className="flex items-center h-16 px-6 border-b">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

// Export HeaderWithSidebar as a named component
export function HeaderWithSidebar({ children }: HeaderWithSidebarProps) {
  return <Header>{children}</Header>
}