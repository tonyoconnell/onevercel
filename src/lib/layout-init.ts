import { layoutStore, layoutActions, RightSize } from "../stores/layout";
import type { LayoutState } from "../stores/layout";

export function initializeLayout() {
  // Initialize layout
  layoutActions.initLayout();

  // Add click handlers with bound methods
  document.getElementById('toggle-left')?.addEventListener('click', () => layoutActions.toggleLeft());
  document.getElementById('toggle-right')?.addEventListener('click', () => layoutActions.toggleRight());
  document.getElementById('right-full')?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Full));
  document.getElementById('right-half')?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Half));
  document.getElementById('right-quarter')?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Quarter));
  document.getElementById('right-close')?.addEventListener('click', () => layoutActions.setRightSize(RightSize.Closed));

  // Subscribe to store updates
  layoutStore.subscribe((state: LayoutState) => {
    const leftSidebar = document.getElementById('left-sidebar');
    const topHeader = document.getElementById('top-header');
    const bottomFooter = document.getElementById('bottom-footer');
    const rightPanel = document.getElementById('right-panel');

    // Update visibility
    if (leftSidebar) {
      leftSidebar.style.display = state.showLeft ? 'block' : 'none';
    }
    if (topHeader) {
      topHeader.style.display = state.showTop ? 'flex' : 'none';
    }
    if (bottomFooter) {
      bottomFooter.style.display = state.showBottom ? 'flex' : 'none';
    }
    if (rightPanel) {
      rightPanel.style.display = state.showRight ? 'flex' : 'none';
      
      // Update width based on size
      switch(state.rightSize) {
        case RightSize.Full:
          rightPanel.style.width = '100%';
          break;
        case RightSize.Half:
          rightPanel.style.width = '50%';
          break;
        case RightSize.Quarter:
          rightPanel.style.width = '400px';
          break;
        case RightSize.Closed:
          rightPanel.style.width = '0';
          break;
      }
    }
  });
}