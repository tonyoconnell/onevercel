// src/components/Right.tsx
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { rightSize, setRightSize, isRightVisible } from '../stores/layout-store';
import { useEffect, useLayoutEffect, useState } from 'react';

const sizeMap: Record<'full' | 'half' | 'quarter' | 'icon', string> = {
  full: 'var(--right-width-full)',
  half: 'var(--right-width-half)',
  quarter: 'var(--right-width-quarter)',
  icon: 'var(--right-width-icon)'
};

const Right = ({ initialSize = 'full' }: { initialSize?: 'full' | 'half' | 'quarter' | 'icon' }) => {
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
            <div className="p-4 max-w-[100vw] flex justify-between items-center">
              <h2 className="font-semibold">AI Assistant</h2>
              {!isMobile && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setRightSize('quarter')}
                    className={cn(
                      "p-1.5 rounded text-xs",
                      currentSize === 'quarter' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    )}
                    aria-label="Quarter width"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => setRightSize('half')}
                    className={cn(
                      "p-1.5 rounded text-xs",
                      currentSize === 'half' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    )}
                    aria-label="Half width"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setRightSize('icon')}
                    className="p-1.5 rounded hover:bg-gray-100"
                    aria-label="Minimize"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto w-full">
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    AI
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      Hello! I'm your AI assistant. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 w-full">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Right;