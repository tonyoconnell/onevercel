import { atom } from 'nanostores';

/** Layout right panel size options */
export const RightSize = {
  Full: "Full",
  Half: "Half",
  Quarter: "Quarter",
  Closed: "Closed"
} as const;

export type RightSizeType = typeof RightSize[keyof typeof RightSize];

/** Layout visibility state type */
export interface LayoutState {
  showLeft: boolean;
  showTop: boolean;
  showRight: boolean;
  showBottom: boolean;
  rightSize: RightSizeType;
}

// Default layout state
const defaultLayout: LayoutState = {
  showLeft: true,
  showTop: true,
  showRight: false,
  showBottom: true,
  rightSize: RightSize.Closed
};

// Create store with proper type
const store = atom<LayoutState>(defaultLayout);

// Layout-specific methods
export const layoutActions = {
  toggleLeft() {
    const current = store.get();
    store.set({ ...current, showLeft: !current.showLeft });
  },

  toggleRight() {
    const current = store.get();
    const isCurrentlyClosed = current.rightSize === RightSize.Closed;
    store.set({
      ...current,
      showRight: !current.showRight,
      rightSize: isCurrentlyClosed ? RightSize.Quarter : RightSize.Closed
    });
  },

  setRightSize(size: RightSizeType) {
    const current = store.get();
    store.set({
      ...current,
      showRight: size !== RightSize.Closed,
      rightSize: size
    });
  },

  toggleTop() {
    const current = store.get();
    store.set({ ...current, showTop: !current.showTop });
  },

  toggleBottom() {
    const current = store.get();
    store.set({ ...current, showBottom: !current.showBottom });
  },

  initLayout() {
    const saved = localStorage.getItem('layoutPreference');
    if (saved) {
      try {
        const savedState = JSON.parse(saved) as LayoutState;
        store.set(savedState);
      } catch (e) {
        store.set(defaultLayout);
      }
    }
    
    // Save layout changes to localStorage
    store.subscribe(state => {
      localStorage.setItem('layoutPreference', JSON.stringify(state));
    });
  }
};

// Export the store
export const layoutStore = store;