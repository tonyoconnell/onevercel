import '../styles/right-panel.css';

export function initRightPanel() {
  const rightPanel = document.getElementById('right-panel');
  const fullButton = document.getElementById('right-full');
  const halfButton = document.getElementById('right-half');
  const quarterButton = document.getElementById('right-quarter');
  const closeButton = document.getElementById('right-close');

  if (!rightPanel || !fullButton || !halfButton || !closeButton) return;

  const setSize = (size: 'full' | 'half' | 'quarter' | 'closed') => {
    rightPanel.classList.remove('right-panel-full', 'right-panel-half', 'right-panel-quarter', 'right-panel-closed');
    rightPanel.classList.add(`right-panel-${size}`);

    if (size === 'closed') {
      rightPanel.classList.add('right-panel-exit');
      rightPanel.addEventListener('animationend', () => {
        rightPanel.classList.remove('right-panel-exit');
      }, { once: true });
    } else {
      rightPanel.classList.add('right-panel-enter');
      rightPanel.addEventListener('animationend', () => {
        rightPanel.classList.remove('right-panel-enter');
      }, { once: true });
    }
  };

  fullButton.addEventListener('click', () => setSize('full'));
  halfButton.addEventListener('click', () => setSize('half'));
  quarterButton?.addEventListener('click', () => setSize('quarter'));
  closeButton.addEventListener('click', () => setSize('closed'));
}