// src/components/Header.tsx
import { useStore } from '@nanostores/react';
import { cn } from '@/lib/utils';
import { 
  isLeftExpanded, 
  isRightVisible, 
  rightSize,
  toggleLeft, 
  toggleRight,
  setRightSize 
} from '../stores/layout-store';

export default function Header({ showLeft, showRight }: { 
  showLeft: boolean; 
  showRight: boolean 
}) {
  const rightVisible = useStore(isRightVisible);
  const leftExpanded = useStore(isLeftExpanded);
  const currentSize = useStore(rightSize);

  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b flex items-center gap-4 z-10">
      {showLeft && (
        <button 
          onClick={toggleLeft}
          aria-label="Toggle navigation menu"
          className="md:hidden"
        >
          {leftExpanded ? '✕' : '☰'}
        </button>
      )}
      
      <div className="flex-1">
        <nav className="text-sm">Home / Page</nav>
      </div>

      {showRight && (
        <div className="flex items-center gap-2">
          {/* Resize controls */}
          <div className="hidden md:flex gap-1">
            <button 
              onClick={() => setRightSize('full')}
              aria-label="Full width"
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                currentSize === 'full' && "bg-gray-100"
              )}
            >
              ↔️
            </button>
            <button 
              onClick={() => setRightSize('half')}
              aria-label="Half width"
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                currentSize === 'half' && "bg-gray-100"
              )}
            >
              ⇔
            </button>
            <button 
              onClick={() => setRightSize('quarter')}
              aria-label="Quarter width"
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                currentSize === 'quarter' && "bg-gray-100"
              )}
            >
              →
            </button>
            <button 
              onClick={() => setRightSize('icon')}
              aria-label="Collapse"
              className={cn(
                "p-2 hover:bg-gray-100 rounded",
                currentSize === 'icon' && "bg-gray-100"
              )}
            >
              ⚊
            </button>
          </div>

          {/* Mobile toggle button */}
          <button 
            onClick={toggleRight}
            aria-label="Toggle AI panel"
            className="md:hidden"
          >
            {rightVisible ? '✕' : '⚙️'}
          </button>
        </div>
      )}
    </header>
  );
}