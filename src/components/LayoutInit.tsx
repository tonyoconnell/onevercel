import { useEffect } from 'react';
import { layoutStore, layoutActions, RightSize } from "@/stores/layout";
import type { LayoutState } from "../stores/layout";

export function LayoutInit() {
  useEffect(() => {
    // Initialize layout
    layoutActions.initLayout();

    // Get all UI elements
    const elements = {
      leftSidebar: document.getElementById('left-sidebar'),
      topHeader: document.getElementById('top-header'),
      bottomFooter: document.getElementById('bottom-footer'),
      rightPanel: document.getElementById('right-panel'),
      toggleLeft: document.getElementById('toggle-left'),
      toggleRight: document.getElementById('toggle-right'),
      rightFull: document.getElementById('right-full'),
      rightHalf: document.getElementById('right-half'),
      rightQuarter: document.getElementById('right-quarter'),
      rightClose: document.getElementById('right-close')
    };

    // Add click handlers
    elements.toggleLeft?.addEventListener('click', () => layoutActions.toggleLeft());
    elements.toggleRight?.addEventListener('click', () => layoutActions.toggleRight());
    elements.rightFull?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Full));
    elements.rightHalf?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Half));
    elements.rightQuarter?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Quarter));
    elements.rightClose?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Closed));

    // Subscribe to store updates
    const unsubscribe = layoutStore.subscribe((state: LayoutState) => {
      // Update visibility
      if (elements.leftSidebar) {
        elements.leftSidebar.style.display = state.showLeft ? 'block' : 'none';
      }
      if (elements.topHeader) {
        elements.topHeader.style.display = state.showTop ? 'flex' : 'none';
      }
      if (elements.bottomFooter) {
        elements.bottomFooter.style.display = state.showBottom ? 'flex' : 'none';
      }
      if (elements.rightPanel) {
        elements.rightPanel.style.display = state.showRight ? 'flex' : 'none';
        
        // Update width based on size
        switch(state.rightSize) {
          case RightSize.Full:
            elements.rightPanel.style.width = '100%';
            break;
          case RightSize.Half:
            elements.rightPanel.style.width = '50%';
            break;
          case RightSize.Quarter:
            elements.rightPanel.style.width = '400px';
            break;
          case RightSize.Closed:
            elements.rightPanel.style.width = '0';
            break;
        }
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      elements.toggleLeft?.removeEventListener('click', () => layoutActions.toggleLeft());
      elements.toggleRight?.removeEventListener('click', () => layoutActions.toggleRight());
      elements.rightFull?.removeEventListener('click', () => layoutActions.setRightSize(RightSize.Full));
      elements.rightHalf?.removeEventListener('click', () => layoutActions.setRightSize(RightSize.Half));
      elements.rightQuarter?.removeEventListener('click', () => layoutActions.setRightSize(RightSize.Quarter));
      elements.rightClose?.removeEventListener('click', () => layoutActions.setRightSize(RightSize.Closed));
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything
}