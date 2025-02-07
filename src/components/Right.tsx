// src/components/Right.tsx
import { useLayoutEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { layoutStore, layoutActions, PanelMode } from '../stores/layout';
import { MyThread } from "@/components/Chat";
import { Maximize2, PanelRightClose, Columns, LayoutPanelLeft, X } from 'lucide-react';

interface RightProps {
  chatConfig: any;
  rightPanelMode?: 'full' | 'half' | 'quarter' | 'floating' | 'hidden' | 'icon';
  content?: string;
}

export default function Right({ rightPanelMode, chatConfig, content }: RightProps) {
  const layout = useStore(layoutStore);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useLayoutEffect(() => {
    // Update main grid layout when panel mode changes
    const mainGrid = document.getElementById('main-grid');
    if (mainGrid) {
      mainGrid.setAttribute('data-panel-mode', layout.mode);
    }
  }, [layout.mode]);

  useLayoutEffect(() => {
    if (rightPanelMode) {
      const modeMap = {
        'full': 'Full',
        'half': 'Half',
        'quarter': 'Quarter',
        'floating': 'Floating',
        'hidden': 'Icon',
        'icon': 'Icon'
      } as const;
      
      // Check for mobile first
      if (window.innerWidth < 768) {
        layoutActions.setMode('Icon');
      } else {
        layoutActions.setMode(modeMap[rightPanelMode]);
      }
    }
  }, [rightPanelMode]);

  const handleModeChange = (mode: keyof typeof PanelMode) => {
    if (isMobile && mode !== 'Icon') {
      layoutActions.setMode('Full');
    } else {
      layoutActions.setMode(mode);
    }
  };

  if (!layout.isVisible) return null;

  const isIcon = layout.mode === "Icon";
  const styles = PanelMode[layout.mode].right;
  
  return (
    <aside 
      className={`right-panel ${layout.mode === 'Floating' ? 'floating' : ''}`}
      data-mode={layout.mode}
      style={styles}
    >
      {isIcon ? (
        <button 
          onClick={() => handleModeChange("Quarter")}
          className="w-full h-full bg-primary text-primary-foreground 
                     rounded-full flex items-center justify-center 
                     hover:bg-primary/90"
          aria-label="Open AI Assistant"
        >
          AI
        </button>
      ) : (
        <div className="h-full flex flex-col">
          <header className="flex-none p-4 h-16 border-b border-l">
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                {layout.mode !== 'Full' && (
                  <button
                    onClick={() => handleModeChange("Full")}
                    className="p-2 hover:bg-accent rounded-md"
                    aria-label="Full"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}
                {layout.mode !== 'Half' && (
                  <button
                    onClick={() => handleModeChange("Half")}
                    className="p-2 hover:bg-accent rounded-md"
                    aria-label="Half"
                  >
                    <PanelRightClose className="h-4 w-4" />
                  </button>
                )}
                {layout.mode !== 'Quarter' && (
                  <button
                    onClick={() => handleModeChange("Quarter")}
                    className="p-2 hover:bg-accent rounded-md"
                    aria-label="Quarter"
                  >
                    <Columns className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="font-semibold flex-1 text-center">Agent ONE</h2>
              <div className="flex items-center gap-2">
                {layout.mode !== 'Floating' && (
                  <button
                    onClick={() => handleModeChange("Floating")}
                    className="p-2 hover:bg-accent rounded-md"
                    aria-label="Float"
                  >
                    <LayoutPanelLeft className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleModeChange("Icon")}
                  className="p-2 hover:bg-accent rounded-md"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto mx-auto w-full max-w-[850px]">
            <MyThread config={chatConfig} content={content} />
          </main>
        </div>
      )}
    </aside>
  );
}