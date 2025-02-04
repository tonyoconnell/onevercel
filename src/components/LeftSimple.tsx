// src/components/Left.tsx
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { isLeftExpanded, toggleLeft } from '../stores/layout-store';
import { useLayoutEffect } from 'react';

const Left = ({ initialSize = 'expanded' }: { initialSize?: 'expanded' | 'collapsed' }) => {
  const expanded = useStore(isLeftExpanded);
  
  useLayoutEffect(() => {
    isLeftExpanded.set(initialSize === 'expanded');
  }, [initialSize]);

  return (
    <aside className={cn(
      "left-sidebar bg-background border-r",
      "md:block",
      expanded ? "w-[var(--left-width-expanded)]" : "w-[var(--left-width-collapsed)]",
      expanded ? "sidebar-active" : "translate-x-[-100%] md:translate-x-0"
    )}>
      <nav className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={toggleLeft} aria-label="Close menu">
              ✕
            </button>
            {expanded && <span>Navigation</span>}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Left;