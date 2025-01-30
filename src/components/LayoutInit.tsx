import { useEffect } from 'react';
import { initRightPanel } from './RightPanel';

export function LayoutInit() {
  useEffect(() => {
    initRightPanel();
  }, []);

  return null;
}