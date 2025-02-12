import { describe, test, expect } from 'vitest'
import { ONE, ComponentSchema } from './1'
import { render, screen } from '@testing-library/react'

describe('ONE', () => {
  test('validates component schema', () => {
    const validProps = {
      name: 'ONE',
      version: '1.0.0',
      mode: 'light' as const,
      theme: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#0066ff'
      }
    }

    expect(() => ComponentSchema.parse(validProps)).not.toThrow()
  })

  test('renders core component', () => {
    render(
      <ONE 
        name="ONE"
        version="1.0.0"
        mode="light"
        theme={{
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#0066ff'
        }}
      />
    )

    expect(screen.getByText('ONE v1.0.0')).toBeInTheDocument()
  })

  test('handles mode switching', () => {
    const { rerender } = render(
      <ONE 
        name="ONE"
        version="1.0.0"
        mode="light"
        theme={{
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#0066ff'
        }}
      />
    )

    let container = screen.getByRole('main')
    expect(container.parentElement).toHaveAttribute('data-mode', 'light')

    rerender(
      <ONE 
        name="ONE"
        version="1.0.0"
        mode="dark"
        theme={{
          primary: '#ffffff',
          secondary: '#000000',
          accent: '#0066ff'
        }}
      />
    )

    expect(container.parentElement).toHaveAttribute('data-mode', 'dark')
  })

  test('handles invalid props', () => {
    const invalidProps = {
      name: '',
      version: '1.0.0',
      mode: 'invalid' as const,
      theme: {
        primary: 'not-a-color'
      }
    }

    // @ts-expect-error - Testing invalid props
    expect(() => ComponentSchema.parse(invalidProps)).toThrow()
  })
})
