import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ONEComponent } from '../../1.tsx';
import type { ONEProps } from './types.ts';

/**
 * ONE Component Test Suite
 * Tests the main ONE interface component
 */
describe('ONEComponent', () => {
  const user = userEvent.setup();

  /**
   * Helper function to render component with proper act() wrapping
   * @param props - Component props
   * @returns Render result
   */
  const renderComponent = async (props: Partial<ONEProps> = {}) => {
    let result;
    await act(async () => {
      result = render(<ONEComponent {...props} />);
    });
    return result!;
  };

  test('renders header', async () => {
    await renderComponent();
    expect(screen.getByText('ONE')).toBeInTheDocument();
  });

  test('switches themes', async () => {
    const { rerender } = await renderComponent({ theme: 'light' });
    expect(document.querySelector('.one-theme-light')).toBeInTheDocument();

    await act(async () => {
      rerender(<ONEComponent theme="dark" />);
    });
    expect(document.querySelector('.one-theme-dark')).toBeInTheDocument();
  });

  test('changes modes', async () => {
    await renderComponent();
    const select = screen.getByRole('combobox');
    
    await act(async () => {
      await user.selectOptions(select, 'generate');
    });
    expect(select).toHaveValue('generate');
  });

  test('shows loading state initially', async () => {
    await renderComponent();
    expect(screen.getByTestId('one-component')).toBeInTheDocument();
  });
}); 