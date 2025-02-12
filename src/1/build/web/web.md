# ONE Web Development Framework

A modern, type-safe web development framework built on Astro, React, and TypeScript. Emphasizing simplicity, performance, and developer experience.

## Core Principles

1. **Type Safety First**
   - TypeScript 5.7+ for static typing
   - Zod for runtime validation
   - Type-safe API routes
   - Inferred types from schemas

2. **Component Architecture**
   - Shadcn/UI for base components
   - Astro islands for interactivity
   - React for dynamic features
   - MDX for rich content

3. **Performance by Default**
   - Static generation with Astro
   - Partial hydration
   - Edge-ready
   - Optimized assets

4. **Developer Experience**
   - PNPM for fast, reliable package management
   - Vitest for testing
   - ESLint + Prettier for code quality
   - Hot Module Replacement

## Project Structure

```
src/                       # Source directory
├── components/            # UI Components
│   ├── ui/               # shadcn/ui components
│   └── islands/          # Interactive components
├── content/              # Content collections
├── layouts/              # Page layouts
├── pages/                # File-based routing
└── styles/              # Global styles
```

## Component Patterns

```typescript
// Island Component Pattern
import { useState } from 'react';

export const InteractiveFeature = () => {
  const [state, setState] = useState(initial);
  
  return (
    <div className="interactive-feature">
      {/* Interactive content */}
    </div>
  );
};

// Static Component Pattern
export const StaticContent = () => {
  return (
    <section className="static-content">
      {/* Static content */}
    </section>
  );
};
```

## Data Validation

```typescript
import { z } from 'zod';

// Define schema once
const pageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  meta: z.object({
    description: z.string(),
    image: z.string().optional()
  })
});

// Type inference
type Page = z.infer<typeof pageSchema>;
```

## Testing Strategy

```typescript
import { test, expect } from 'vitest';
import { render } from '@testing-library/react';

test('component renders correctly', () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});
```

## Performance Optimization

1. **Static Assets**
   - Image optimization
   - Font subsetting
   - CSS minification
   - JS tree shaking

2. **Dynamic Content**
   - Partial hydration
   - Lazy loading
   - Content streaming
   - Edge caching

3. **Build Optimization**
   - Route-based code splitting
   - Critical CSS extraction
   - Asset preloading
   - Bundle analysis

## Development Workflow

1. **Setup**
   ```bash
   pnpm create astro@latest
   pnpm add @astrojs/react
   pnpm add -D vitest
   ```

2. **Development**
   ```bash
   pnpm dev        # Start development server
   pnpm test       # Run tests
   pnpm lint       # Check code quality
   ```

3. **Deployment**
   ```bash
   pnpm build      # Production build
   pnpm preview    # Preview build
   ```

## Best Practices

1. **Component Design**
   - Use TypeScript for all components
   - Implement proper prop validation
   - Follow atomic design principles
   - Document with JSDoc

2. **State Management**
   - Use Nanostores for global state
   - Leverage React hooks for local state
   - Implement proper error boundaries
   - Handle loading states

3. **Performance**
   - Minimize client-side JavaScript
   - Optimize images and fonts
   - Implement proper caching
   - Monitor Core Web Vitals

4. **Accessibility**
   - Follow WCAG guidelines
   - Implement proper ARIA attributes
   - Ensure keyboard navigation
   - Test with screen readers

## Quality Assurance

1. **Testing**
   - Unit tests with Vitest
   - Component tests with Testing Library
   - E2E tests with Playwright
   - Visual regression tests

2. **Code Quality**
   - ESLint for linting
   - Prettier for formatting
   - TypeScript strict mode
   - Husky for git hooks

3. **Monitoring**
   - Error tracking
   - Performance monitoring
   - Usage analytics
   - User feedback
