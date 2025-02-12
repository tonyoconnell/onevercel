import { useState } from 'react'
import { z } from 'zod'
import type { APIResponse } from './api/1'

// Core React component schema
const ComponentSchema = z.object({
  name: z.string(),
  version: z.string(),
  mode: z.enum(['light', 'dark']),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string()
  })
})

type ComponentProps = z.infer<typeof ComponentSchema>

// Core React component
export const ONE: React.FC<ComponentProps> = ({ 
  name,
  version,
  mode,
  theme
}) => {
  const [state, setState] = useState({
    initialized: false,
    error: null
  })

  return (
    <div className="one-container" data-mode={mode}>
      <header className="one-header">
        <h1>{name} v{version}</h1>
      </header>
      <main className="one-content">
        {/* Core content */}
      </main>
    </div>
  )
}

// Export schema for type generation
export { ComponentSchema } 