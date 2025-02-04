import { cn } from "@/lib/utils";
import { useStore } from "@nanostores/react";
import { layoutState } from "../stores/layout-store";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  const state = useStore(layoutState);

  return (
    <main 
      className={cn(
        "transition-all duration-200",
        "px-4 py-6 md:px-6 lg:px-8",
        "min-h-[calc(100vh-var(--header-height))]",
        state.rightPanelSize !== 'icon' && "md:mr-[var(--right-panel-width)]",
        className
      )}
    >
      {children}
    </main>
  );
} 