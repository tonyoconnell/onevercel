// src/components/Right.tsx
import { useLayoutEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { layoutStore, layoutActions, PanelMode } from '../stores/layout';
import { MyThread } from "@/components/Chat";
import { Maximize2, PanelRightClose, X } from 'lucide-react';

interface RightProps {
  initialMode?: keyof typeof PanelMode;
  chatConfig?: any;
}

export default function Right({ initialMode = "Icon", chatConfig }: RightProps) {
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
      className="right-panel"
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
          <header className="flex-none p-4 border-b">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleModeChange("Full")}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Expand"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleModeChange("Half")}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Half"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
              <h2 className="font-semibold flex-1 text-center">Agent ONE</h2>
              <button
                onClick={() => handleModeChange("Icon")}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <MyThread config={chatConfig} />
          </main>
        </div>
      )}
    </aside>
  );
}