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
  layoutState.set({
    ...layoutState.get(),
    rightPanelSize: size,
    rightVisible: size !== 'icon'
  });
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