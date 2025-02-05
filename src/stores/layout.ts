import { atom } from 'nanostores';

/** Panel display modes and their layout configurations */
export const PanelMode = {
  Icon: {
    main: { width: '100%' },
    right: {
      width: '48px',
      height: '48px',
      position: 'fixed',
      bottom: 'max(1rem, env(safe-area-inset-bottom))',
      right: 'max(1rem, env(safe-area-inset-right))',
      zIndex: 100
    }
  },
  Floating: {
    main: { width: '100%' },
    right: {
      width: '320px',
      height: '480px',
      position: 'fixed',
      bottom: 'max(1rem, env(safe-area-inset-bottom))',
      right: 'max(1rem, env(safe-area-inset-right))',
      zIndex: 1000,
      borderRadius: '12px 12px 0 0'
    }
  },
  Quarter: {
    main: { width: '75%' },
    right: {
      width: '25%',
      minWidth: '320px',
      background: 'var(--background)',
      borderLeft: '1px solid var(--border)',
      height: '100%',
      zIndex: 2000
    }
  },
  Half: {
    main: { width: '50%' },
    right: {
      width: '50%',
      background: 'var(--background)',
      borderLeft: '1px solid var(--border)',
      height: '100%',
      zIndex: 2000
    }
  },
  Full: {
    main: { display: 'none' },
    right: { 
      width: '100%',
      background: 'var(--background)',
      height: '100%',
      zIndex: 2000
    }
  }
} as const;

export type PanelModeType = keyof typeof PanelMode;

interface LayoutState {
  mode: PanelModeType;
  isVisible: boolean;
}

const defaultLayout: LayoutState = {
  mode: 'Icon',
  isVisible: true
};

const store = atom<LayoutState>(defaultLayout);

export const layoutActions = {
  setMode(mode: PanelModeType) {
    const current = store.get();
    store.set({ ...current, mode });
  },

  toggleVisibility() {
    const current = store.get();
    store.set({ ...current, isVisible: !current.isVisible });
  },

  initLayout() {
    const saved = localStorage.getItem('layoutPreference');
    if (saved) {
      try {
        store.set(JSON.parse(saved) as LayoutState);
      } catch (e) {
        store.set(defaultLayout);
      }
    }
    
    const handleResize = () => {
      const current = store.get();
      const width = window.innerWidth;
      
      if (width < 768) {
        if (current.mode !== 'Icon') {
          store.set({ ...current, mode: 'Full' });
        }
      } else if (width < 1024) {
        if (current.mode === 'Half' || current.mode === 'Full') {
          store.set({ ...current, mode: 'Floating' });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    store.subscribe(state => localStorage.setItem('layoutPreference', JSON.stringify(state)));
  }
};

export const layoutStore = store;