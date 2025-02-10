import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatSimple } from "@/components/ChatSimple";
import { SidebarApp } from "@/components/ChatSidebar";
import { MessageSquare, PanelLeft } from "lucide-react";

export default function DualChatPage() {
  return (
    <div className="flex w-full">
      {/* Left sidebar */}
      <SidebarProvider>
        <SidebarApp />
        <SidebarInset className="flex flex-col h-screen overflow-y-auto">
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger>
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      ONE
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1">
            <div className="flex-1 p-4">
              <div className="rounded-lg border bg-card p-4 h-full">
                Main content goes here
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Right chat sidebar */}
      <SidebarProvider defaultOpen={false}>
        <div className="fixed right-4 top-3 z-50">
          <SidebarTrigger>
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Toggle Chat</span>
          </SidebarTrigger>
        </div>
        <div className="relative">
          <Sidebar 
            side="right" 
            className="w-[400px]"
            collapsible="offcanvas"
          >
            <ChatSimple />
          </Sidebar>
        </div>
      </SidebarProvider>
    </div>
  );
}