// src/stores/layout-store.ts
import { atom } from 'nanostores';

export const isLeftExpanded = atom(true);
export const isRightVisible = atom(true);
export const rightSize = atom<'full' | 'half' | 'quarter' | 'icon'>('full');

export const toggleLeft = () => isLeftExpanded.set(!isLeftExpanded.get());
export const toggleRight = () => isRightVisible.set(!isRightVisible.get());
export const setRightSize = (size: 'full' | 'half' | 'quarter' | 'icon') => rightSize.set(size);