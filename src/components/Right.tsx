// src/components/Right.tsx
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { rightSize, setRightSize, isRightVisible } from '../stores/layout-store';
import { useEffect, useLayoutEffect } from 'react';

const sizeMap: Record<'full' | 'half' | 'quarter' | 'icon', string> = {
  full: 'var(--right-width-full)',
  half: 'var(--right-width-half)',
  quarter: 'var(--right-width-quarter)',
  icon: 'var(--right-width-icon)'
};

const Right = ({ initialSize = 'full' }: { initialSize?: 'full' | 'half' | 'quarter' | 'icon' }) => {
  const currentSize = useStore(rightSize);
  const visible = useStore(isRightVisible);

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

  return (
    <aside 
      className={cn(
        "right-sidebar bg-background border-l shadow-lg",
        visible ? "sidebar-active" : "",
        "fixed h-full",
        // Adjust positioning based on size
        currentSize === 'full' && "top-0 left-0 w-[100vw] z-30",
        currentSize === 'half' && "top-0 right-0 w-[50%] z-20",
        currentSize === 'quarter' && "top-0 right-0 w-[25%] z-20",
        currentSize === 'icon' && "bottom-4 right-4 w-12 h-12 rounded-full top-auto shadow-2xl z-20", // Icon mode styling
        "transition-all duration-200",
        "flex flex-col"
      )}
    >
      {currentSize === 'icon' ? (
        // Icon view
        <button 
          onClick={() => setRightSize('quarter')}
          className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          aria-label="Open AI Assistant"
        >
          AI
        </button>
      ) : (
        // Regular view
        <>
          <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="p-4">
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
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

          <div className="flex-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
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