// src/components/Right.tsx
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { rightSize, setRightSize, isRightVisible } from '../stores/layout-store';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Maximize2, Minimize2, X, Layout, Columns } from 'lucide-react';
import { MyThread } from "@/components/Chat";

const sizeMap: Record<'full' | 'half' | 'quarter' | 'icon', string> = {
  full: 'var(--right-width-full)',
  half: 'var(--right-width-half)',
  quarter: 'var(--right-width-quarter)',
  icon: 'var(--right-width-icon)'
};

interface RightProps {
  initialSize?: 'full' | 'half' | 'quarter' | 'icon';
  chatConfig?: any;
}

const Right = ({ initialSize = 'full', chatConfig }: RightProps) => {
  const currentSize = useStore(rightSize);
  const visible = useStore(isRightVisible);
  const [isMobile, setIsMobile] = useState(false);

  const handleIconClick = () => {
    // On mobile (< 640px) go to full, otherwise go to quarter
    const isMobile = window.innerWidth < 640;
    setRightSize(isMobile ? 'full' : 'quarter');
  };

  useLayoutEffect(() => {
    // Initialize the visibility state
    isRightVisible.set(true);
    // Initialize the size
    setRightSize(initialSize);
  }, [initialSize]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--right-panel-width',
      sizeMap[currentSize]
    );
  }, [currentSize]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <aside 
      className={cn(
        "right-sidebar bg-background border-l shadow-lg",
        visible ? "sidebar-active" : "",
        "fixed",
        // Adjust positioning based on size
        currentSize === 'full' && "top-0 left-0 w-full h-full z-30",
        currentSize === 'half' && "top-0 right-0 h-full z-20",
        currentSize === 'quarter' && "top-0 right-0 h-full z-20",
        currentSize === 'icon' && "bottom-4 right-4 w-12 h-12 rounded-full z-10",
        "transition-all duration-200",
        "flex flex-col"
      )}
      style={{
        width: currentSize === 'full' ? '100%' : 
               currentSize === 'half' ? '50%' : 
               currentSize === 'quarter' ? '25%' : 
               '3rem'
      }}
    >
      {currentSize === 'icon' ? (
        // Icon view
        <button 
          onClick={handleIconClick}
          className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          aria-label="Open AI Assistant"
        >
          AI
        </button>
      ) : (
        // Regular view
        <>
          <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
            <div className="p-4 max-w-[100vw] flex items-center">
              {!isMobile && (
                <div className="flex gap-2 mr-4">
                  <button
                    onClick={() => setRightSize('full')}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      currentSize === 'full' ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    )}
                    aria-label="Full width"
                  >
                    <Maximize2 size={16} />
                  </button>
                  <button
                    onClick={() => setRightSize('half')}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      currentSize === 'half' ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    )}
                    aria-label="Half width"
                  >
                    <Layout size={16} />
                  </button>
                  <button
                    onClick={() => setRightSize('quarter')}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      currentSize === 'quarter' ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    )}
                    aria-label="Quarter width"
                  >
                    <Columns size={16} />
                  </button>
                </div>
              )}
              
              <h2 className="font-semibold text-lg flex-1">AI Assistant</h2>
              
              {!isMobile && (
                <button
                  onClick={() => setRightSize('icon')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    "hover:bg-gray-100"
                  )}
                  aria-label="Minimize"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

      
              <MyThread config={chatConfig} />
          
        </>
      )}
    </aside>
  );
};

export default Right;