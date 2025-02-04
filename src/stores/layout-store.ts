// src/stores/layout-store.ts
import { atom, computed } from 'nanostores';

// Layout state with type safety
interface LayoutState {
  rightPanelSize: 'full' | 'half' | 'quarter' | 'icon';
  rightVisible: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: LayoutState = {
  rightPanelSize: 'quarter',
  rightVisible: true,
  sidebarOpen: false,
  theme: 'light'
};

// Main store
export const layoutState = atom<LayoutState>(initialState);

// Try to restore persisted state
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    layoutState.set({
      ...initialState,
      theme: savedTheme as 'light' | 'dark'
    });
  }
} catch (e) {
  console.warn('Could not restore theme from localStorage');
}

// Computed values with memoization
export const rightSize = computed(layoutState, state => state.rightPanelSize);
export const isRightVisible = computed(layoutState, state => state.rightVisible);
export const isSidebarOpen = computed(layoutState, state => state.sidebarOpen);
export const currentTheme = computed(layoutState, state => state.theme);

// Action creators with error handling
export function setRightSize(size: LayoutState['rightPanelSize']) {
  try {
    layoutState.set({
      ...layoutState.get(),
      rightPanelSize: size
    });
  } catch (e) {
    console.error('Failed to update right panel size:', e);
  }
}

export function toggleRight() {
  try {
    layoutState.set({
      ...layoutState.get(),
      rightVisible: !layoutState.get().rightVisible
    });
  } catch (e) {
    console.error('Failed to toggle right panel:', e);
  }
}

export function toggleSidebar() {
  try {
    layoutState.set({
      ...layoutState.get(),
      sidebarOpen: !layoutState.get().sidebarOpen
    });
  } catch (e) {
    console.error('Failed to toggle sidebar:', e);
  }
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