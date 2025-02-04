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

  useLayoutEffect(() => {
    setMounted(true);
    setRightSize(initialSize);

    const handleResize = () => {
      if (window.innerWidth < 768 && state.rightPanelSize !== 'icon') {
        setRightSize('icon');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const isIcon = state.rightPanelSize === 'icon';
  
  return (
    <aside 
      className={cn(
        "fixed right-0 top-0 h-full bg-background/95 backdrop-blur",
        "border-l shadow-lg transition-all duration-200",
        {
          'w-full md:w-[600px]': state.rightPanelSize === 'full',
          'w-1/2': state.rightPanelSize === 'half',
          'w-[400px]': state.rightPanelSize === 'quarter',
          'w-12 h-12 bottom-4 right-4 top-auto rounded-full border': isIcon
        }
      )}
      style={{
        transform: state.rightVisible || isIcon ? 'none' : 'translateX(100%)',
        zIndex: isIcon ? 20 : 50
      }}
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
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Agent ONE</h2>
              <button
                onClick={() => setRightSize('icon')}
                className="p-2 hover:bg-accent rounded-full"
                aria-label="Minimize"
              >
                —
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