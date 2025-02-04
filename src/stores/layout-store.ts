// src/stores/layout-store.ts
import { atom, computed } from 'nanostores';

// Layout state with type safety
interface LayoutState {
  rightPanelSize: 'full' | 'half' | 'quarter' | 'icon';
  rightVisible: boolean;
  leftExpanded: boolean;
  theme: 'light' | 'dark';
}

export const layoutState = atom<LayoutState>({
  rightPanelSize: 'quarter',
  rightVisible: true,
  leftExpanded: false,
  theme: 'light',
});

// Try to restore persisted state
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    layoutState.set({
      ...layoutState.get(),
      theme: savedTheme
    });
  }
} catch (e) {
  console.warn('Could not restore theme from localStorage');
}

// Computed values with memoization
export const rightSize = computed(layoutState, state => state.rightPanelSize);
export const isRightVisible = computed(layoutState, state => state.rightVisible);
export const isLeftExpanded = computed(layoutState, state => state.leftExpanded);
export const currentTheme = computed(layoutState, state => state.theme);

// Action creators with error handling
export function setRightSize(size: LayoutState['rightPanelSize']) {
  const newState = {
    ...layoutState.get(),
    rightPanelSize: size,
    rightVisible: size !== 'icon'
  };
  
  layoutState.set(newState);
  
  // Update CSS variables
  const { rightWidth, mainWidth } = calculateLayoutWidths();
  document.documentElement.style.setProperty('--right-panel-width', rightWidth);
  document.documentElement.style.setProperty('--main-width', mainWidth);
}

export function toggleRight() {
  const state = layoutState.get();
  layoutState.set({
    ...state,
    rightVisible: !state.rightVisible
  });
}

export function toggleLeft() {
  const state = layoutState.get();
  layoutState.set({
    ...state,
    leftExpanded: !state.leftExpanded
  });
}

export function setTheme(theme: LayoutState['theme']) {
  try {
    layoutState.set({
      ...layoutState.get(),
      theme
    });
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.error('Failed to set theme:', e);
  }
}

// Utility to handle mobile/responsive states
export function handleResponsiveLayout(width: number) {
  const state = layoutState.get();
  
  if (width < 768) {
    // Mobile layout
    layoutState.set({
      ...state,
      rightPanelSize: 'icon',
      leftExpanded: false
    });
  } else if (width < 1024) {
    // Tablet layout
    layoutState.set({
      ...state,
      rightPanelSize: 'quarter'
    });
  }
}

// Add new function to handle width calculations
export function calculateLayoutWidths() {
  const state = layoutState.get();
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return {
      rightWidth: state.rightPanelSize === 'icon' ? '48px' : '100vw',
      mainWidth: '100%'
    };
  }

  if (!state.rightVisible) {
    return {
      rightWidth: '0px',
      mainWidth: '100%'
    };
  }

  switch (state.rightPanelSize) {
    case 'full':
      return {
        rightWidth: '100%',
        mainWidth: '0%'
      };
    case 'half':
      return {
        rightWidth: '50%',
        mainWidth: '50%'
      };
    case 'quarter':
      return {
        rightWidth: 'min(400px, 90vw)',
        mainWidth: 'calc(100% - min(400px, 90vw))'
      };
    case 'icon':
      return {
        rightWidth: '48px',
        mainWidth: '100%'
      };
    default:
      return {
        rightWidth: '0px',
        mainWidth: '100%'
      };
  }
}