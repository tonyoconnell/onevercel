const GenerationFlow = {
  // 1. Read source files
  source: [
    '1.ts',    // Types and models
    '1.yaml',  // Business config
    '1.json',  // Runtime config
    '1.css'    // Core styles
  ],
  
  // 2. Generate Astro files
  output: {
    'src/pages': {
      from: ['1.ts', '1.yaml'],
      template: 'astro'
    },
    'src/components': {
      from: ['1.tsx', '1.css'],
      template: 'react'
    },
    'src/layouts': {
      from: ['1.astro', '1.css'],
      template: 'astro'
    }
  }
} 