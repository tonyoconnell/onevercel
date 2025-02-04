// src/components/Right.tsx
import { useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { layoutState, setRightSize } from '../stores/layout-store';
import { MyThread } from "@/components/Chat";

interface RightProps {
  initialSize?: 'full' | 'half' | 'quarter' | 'icon';
  chatConfig?: any;
}

const Right = ({ initialSize = 'quarter', chatConfig }: RightProps) => {
  const state = useStore(layoutState);
  const [mounted, setMounted] = useState(false);

  // Initialize size and handle resize
  useLayoutEffect(() => {
    setMounted(true);
    if (initialSize !== state.rightPanelSize) {
      setRightSize(initialSize);
    }

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && state.rightPanelSize !== 'icon') {
        setRightSize('icon');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialSize, state.rightPanelSize]);

  if (!mounted) return null;

  return (
    <aside 
      className={cn(
        "fixed right-0 top-0 h-full",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-l shadow-lg",
        "transition-all duration-200 ease-in-out",
        {
          'z-50 w-full md:w-[600px]': state.rightPanelSize === 'full',
          'z-40 w-1/2': state.rightPanelSize === 'half',
          'z-30 w-[400px]': state.rightPanelSize === 'quarter',
          'z-20 w-12 h-12 top-auto bottom-4 right-4 rounded-full': state.rightPanelSize === 'icon'
        }
      )}
      style={{
        transform: state.rightVisible ? 'translateX(0)' : 'translateX(100%)'
      }}
    >
      {state.rightPanelSize === 'icon' ? (
        <button 
          onClick={() => setRightSize('quarter')}
          className="w-full h-full bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90"
          aria-label="Open AI Assistant"
        >
          AI
        </button>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-none p-4 border-b">
            <h2 className="font-semibold text-lg text-center">Agent ONE</h2>
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