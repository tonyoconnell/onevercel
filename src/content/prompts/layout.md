---
title: "Layout Generator"
description: "A sophisticated mobile-first layout system for Astro pages with responsive sidebars and dynamic panels"
tags: ["layout", "astro", "react", "shadcn-ui", "responsive"]
date: 2024-02-03
---

# Advanced Layout System

This layout system provides a highly configurable, mobile-first design for Astro pages that adapts beautifully across mobile, tablet, and desktop views.

## Core Structure

The layout consists of three main sections:
- Left Sidebar (Navigation)
- Center Content
- Right Panel (AI Assistant)

### Center Content Structure
The center section is organized into three rows:
1. Header - Contains navigation controls and breadcrumbs
2. Main Content - Your page content
3. Footer - Optional footer content

## Key Components

### Layout.astro
The main layout component that orchestrates all parts. Configurable through props:

```typescript
interface LayoutProps {
  title: string;
  description?: string;
  children: any;
  chatConfig?: any;
  header?: boolean;     // Show/hide header
  footer?: boolean;     // Show/hide footer
  left?: boolean;       // Show/hide left sidebar
  leftSize?: "expanded" | "collapsed";
  right?: boolean;      // Show/hide right panel
  rightSize?: "full" | "half" | "quarter" | "icon";
}
```

### Header Component
Features:
- Left sidebar toggle (hidden if sidebar is disabled)
- Logo (centered in the exact center of the page )
- Right panel toggle (hidden if panel is disabled)
- Responsive breadcrumb navigation
- Sticky positioning with backdrop blur

### Left Sidebar (Navigation)
Built with shadcn-ui sidebar:
- Collapsible navigation menu
- Floating variant on desktop
- Icon-only collapsed state
- Full-width on mobile
- Mouse hover expansion
- Click outside to close on mobile

### Right Panel (AI Assistant)
Features:
- Four size modes:
  - Full (100% width)
  - Half (50% width)
  - Quarter (25% width, min 320px)
  - Icon (48px floating button)
- Mobile optimizations:
  - Slides in from right
  - Full-width when open
  - Floating icon when collapsed
- Smooth transitions
- Backdrop blur effects
- Size controls in header

## Responsive Behavior

### Mobile (<768px)
- Left sidebar: Full-width overlay when open
- Right panel: Full-width overlay or floating icon
- Single column layout
- Hamburger menu for navigation
- Touch-friendly interactions

### Tablet (768px - 1024px)
- Left sidebar: Icon mode or expanded
- Right panel: Adjustable width
- Fluid transitions
- Optional collapsing of panels

### Desktop (>1024px)
- Full three-column layout capability
- Hover interactions for sidebars
- Maximum content width constraints
- Optimal reading experience

## Usage Example

```astro
---
import Layout from "../layouts/Layout.astro";

const chatConfig = {
  // Your AI chat configuration
};
---

<Layout 
  title="My Page"
  description="Page description"
  header={true}
  footer={true}
  left={true}
  leftSize="expanded"
  right={true}
  rightSize="quarter"
  chatConfig={chatConfig}
>
  <main>
    Your content here
  </main>
</Layout>
```

## CSS Variables

The layout system uses CSS variables for consistent sizing:

```css
:root {
  --right-panel-width: var(--right-width-full);
  --right-width-full: 100vw;
  --right-width-half: 50%;
  --right-width-quarter: 25%;
  --right-width-icon: 48px;
  --left-sidebar-width: 240px;
  --header-height: 60px;
}
```

## Accessibility Features

- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly structure
- High contrast mode support
- Reduced motion preferences respected

## Performance Considerations

- Lazy-loaded components where appropriate
- Smooth transitions and animations
- Efficient re-renders
- Optimized mobile performance
- Minimal layout shifts

## Chat Configuration

The layout includes an AI chat system that can be customized through the `chatConfig` prop. Here's the configuration structure:

```typescript
interface ChatConfig {
  systemPrompt: {
    type: "text";
    text: string;
  }[];
  welcome: {
    message: string;
    avatar: string;
    suggestions: {
      label: string;
      prompt: string;
    }[];
  };
}
```

### Example Configuration

```typescript
const chatConfig = {
  systemPrompt: [{
    type: "text",
    text: "I am Agent ONE, an AI assistant focused on helping developers and businesses maximize value from free software. I provide clear, actionable guidance while maintaining a friendly and professional tone."
  }],
  welcome: {
    message: "👋 I'm Agent ONE, your guide to maximizing business value with free software. What would you like to explore today?",
    avatar: "/icon.svg",
    suggestions: [
      {
        label: "💡 How can I use ONE commercially?",
        prompt: "I'm interested in using ONE for my business. Can you explain the commercial rights and possibilities under the ONE License?"
      },
      {
        label: "🚀 Quick Start Guide",
        prompt: "What are the first 3 steps to get started with ONE for my project?"
      },
      {
        label: "💼 White-Label Options",
        prompt: "Tell me about the white-label possibilities with ONE. How can I brand it as my own solution?"
      }
    ]
  }
};
```

### Configuration Options

#### System Prompt
- Defines the AI assistant's personality and behavior
- Can include multiple prompt segments
- Type is currently limited to "text"

#### Welcome Message
- `message`: Initial greeting shown to users
- `avatar`: Path to the avatar image
- `suggestions`: Array of quick-start prompts
  - `label`: Button text shown to user
  - `prompt`: Actual message sent when clicked

### Integration with Right Panel

The chat interface appears in the Right Panel component and adapts to all panel sizes:
- Full width: Complete chat experience
- Half/Quarter: Compact but fully functional
- Icon mode: Click to expand

The chat maintains state and history across size changes and remains functional in all responsive breakpoints.
