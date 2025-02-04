// src/components/Left.tsx
import * as React from "react";
import { useStore } from '@nanostores/react';
import { layoutState, toggleSidebar } from '../stores/layout-store';
import { cn } from "@/lib/utils";

interface LeftSimpleProps {
  children: React.ReactNode;
}

export function LeftSimple({ children }: LeftSimpleProps) {
  const state = useStore(layoutState);

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full w-[var(--left-sidebar-width)]",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-r transition-transform duration-200",
        !state.sidebarOpen && "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <button
          onClick={() => toggleSidebar()}
          className="absolute -right-10 top-4 p-2 md:hidden"
          aria-label="Toggle sidebar"
        >
          {state.sidebarOpen ? '✕' : '☰'}
        </button>
      </div>
    </div>
  );
}