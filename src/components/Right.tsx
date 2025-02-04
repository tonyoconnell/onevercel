// src/components/Right.tsx
import { useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { layoutState, setRightSize } from '../stores/layout-store';
import { MyThread } from "@/components/Chat";
import { Maximize2, PanelRightClose, X } from 'lucide-react';

interface RightProps {
  initialSize?: 'full' | 'half' | 'quarter' | 'icon';
  chatConfig?: any;
}

const Right = ({ initialSize = 'quarter', chatConfig }: RightProps) => {
  const state = useStore(layoutState);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    setRightSize(initialSize);
    
    // Handle initial mobile view
    if (window.innerWidth < 768) {
      setRightSize('icon');
    }
  }, []);

  useLayoutEffect(() => {
    const sizes = {
      full: '100%',
      half: '50%',
      quarter: '400px',
      icon: '48px'
    };

    const isMobile = window.innerWidth < 768;
    const width = sizes[state.rightPanelSize];
    
    if (!state.rightVisible) {
      document.documentElement.style.setProperty('--right-panel-width', '0px');
    } else if (isMobile) {
      document.documentElement.style.setProperty('--right-panel-width', 
        state.rightPanelSize === 'icon' ? '48px' : '100%');
    } else {
      document.documentElement.style.setProperty('--right-panel-width', width);
    }

  }, [state.rightPanelSize, state.rightVisible]);

  if (!mounted) return null;

  const isIcon = state.rightPanelSize === 'icon';
  
  return (
    <aside 
      className={cn(
        "right-panel",
        {
          'right-panel-full': state.rightPanelSize === 'full',
          'right-panel-half': state.rightPanelSize === 'half',
          'right-panel-quarter': state.rightPanelSize === 'quarter',
          'right-panel-icon': isIcon,
          'slide-enter': state.rightVisible,
          'slide-exit': !state.rightVisible && !isIcon
        }
      )}
    >
      {isIcon ? (
        <button 
          onClick={() => setRightSize('quarter')}
          className="w-full h-full bg-primary text-primary-foreground rounded-full 
                     flex items-center justify-center hover:bg-primary/90"
          aria-label="Open AI Assistant"
        >
          AI
        </button>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-none p-4 border-b">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRightSize('full')}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Expand to full screen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setRightSize('half')}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Half screen"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
              <h2 className="font-semibold flex-1 text-center">Agent ONE</h2>
              <button
                onClick={() => setRightSize('icon')}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <MyThread config={chatConfig} />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Right;