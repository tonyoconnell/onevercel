# 🚀 ONE - Build AI-Powered Businesses

ONE is a powerful, modern web development framework that combines the blazing-fast performance of Astro with the elegant components of Shadcn/UI. This enterprise-ready starter kit empowers developers to build AI-powered applications with:

- ⚡ **High Performance**: Astro's partial hydration ensures minimal JavaScript
- 🎨 **Beautiful UI**: Pre-configured Shadcn components with full TypeScript support
- 🤖 **AI Integration**: Built-in tools for AI-powered features and automation
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🔒 **Type Safety**: Full TypeScript support throughout the codebase
- 🛠️ **Developer Experience**: Hot reloading, intuitive project structure, and comprehensive documentation

Perfect for building modern web applications, from simple landing pages to complex AI-powered platforms.

## ⚡ Quick Start

This guide will help you set up and start building AI-powered applications with ONE. ONE combines Astro, React, and modern AI capabilities to create intelligent web applications.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- pnpm package manager (`npm install -g pnpm`)
- An OpenAI API key (for AI capabilities)
- Basic knowledge of Astro and React

## Quick Start

### 1. Get the Project

You have three options to get started with ONE:

#### Option 1: Clone the repository
git clone https://github.com/one-ie/one.git

#### Option 2: Download the ZIP file
Visit: https://github.com/one-ie/one/archive/refs/heads/main.zip

#### Option 3: Fork the repository
Visit: https://github.com/one-ie/one/fork
```

You can also create a new project directly in GitHub Codespaces:
[Open in Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=one-ie/one)

### 2. Install Dependencies

```bash
# Navigate to project directory
cd one

# Install dependencies
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in your project root:

```env
OPENAI_API_KEY=your_api_key_here
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application running.

## Project Structure

```
one/
├── src/
│   ├── components/     # UI components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Routes and pages
│   ├── content/       # Markdown content
│   └── styles/        # Global styles
└── public/           # Static assets
```

## Adding AI Chat to a Page

1. Create a new page (e.g., `src/pages/chat.astro`):

```astro
---
import Layout from "../layouts/Layout.astro";
import { ChatConfigSchema } from '../schema/chat';

const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: "You are a helpful assistant."
  }],
  welcome: {
    message: "👋 How can I help you today?",
    avatar: "/icon.svg",
    suggestions: [
      {
        label: "Get Started",
        prompt: "How do I get started with ONE?"
      }
    ]
  }
});
---

<Layout 
  title="Chat Page"
  chatConfig={chatConfig}
  rightPanelMode="quarter"
>
  <main>
    <h1>Welcome to the Chat</h1>
    <!-- Your page content here -->
  </main>
</Layout>
```

## Customizing the Chat Interface

### Chat Configuration Options

```typescript
const chatConfig = {
  provider: "openai",          // AI provider
  model: "gpt-4o-mini",       // Model to use
  apiEndpoint: "https://api.openai.com/v1",
  temperature: 0.7,           // Response creativity (0-1)
  maxTokens: 2000,           // Maximum response length
  systemPrompt: "...",       // AI behavior definition
  welcome: {
    message: "...",          // Welcome message
    avatar: "/path/to/icon.svg",
    suggestions: [...]       // Quick start prompts
  }
};
```

### Panel Modes

The chat interface can be displayed in different modes:
- `quarter`: 25% width side panel
- `half`: 50% width side panel
- `full`: Full screen chat
- `floating`: Floating chat window
- `icon`: Minimized chat button

## Adding Page-Specific Knowledge

Make your AI assistant knowledgeable about specific pages:

```astro
---
const pageContent = "Your page content here";

const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: `You are an expert on ${pageContent}. Help users understand this content.`
  }],
  // ... other config options
});
---
```

## Basic Customization

### 1. Styling

Customize the appearance using Tailwind CSS classes:

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles here */
```

### 2. Layout

Adjust the layout using the Layout component props:

```astro
<Layout
  title="Your Page"
  description="Page description"
  header={true}        // Show/hide header
  footer={true}        // Show/hide footer
  rightPanelMode="quarter"
>
  <!-- Your content -->
</Layout>
```

### 3. Chat Features

Enable or disable specific chat features:

```typescript
const chatConfig = ChatConfigSchema.parse({
  // ... other options
  features: {
    textToSpeech: true,    // Enable voice synthesis
    codeHighlight: true,   // Enable code syntax highlighting
    markdown: true,        // Enable markdown rendering
    suggestions: true      // Enable quick suggestions
  }
});
```

## 🎨 Pre-installed Components

All Shadcn/UI components are pre-configured for Astro:

```astro
---
// Example usage in .astro file
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
---

<Button>Click me!</Button>
```

### Available Components
- ✅ Accordion
- ✅ Alert Dialog
- ✅ Avatar
- ✅ Badge
- ✅ Button
- ✅ Card
- ✅ Dialog
- ... and more!

## 🛠️ Project Structure

```text
src/
├── components/                # UI Components
│   ├── ui/                   # Shadcn/UI components
│   ├── chat/                 # Chat-related components
│   └── magicui/              # Enhanced UI components
│
├── content/                  # Content Collections
│   ├── blog/                 # Blog posts
│   ├── docs/                 # Documentation
│   └── prompts/              # AI prompts
│
├── hooks/                    # React hooks
│   ├── use-mobile.tsx
│   ├── use-theme.ts
│   └── use-toast.ts
│
├── layouts/                  # Page layouts
│   ├── Blog.astro
│   ├── Docs.astro
│   ├── Layout.astro
│   └── LeftRight.astro
│
├── lib/                      # Utility functions
│   ├── utils.ts
│   └── icons.ts
│
├── pages/                    # Routes and pages
│   ├── api/                  # API endpoints
│   ├── blog/                 # Blog routes
│   ├── docs/                 # Documentation routes
│   └── index.astro          # Homepage
│
├── schema/                   # Data schemas
│   └── chat.ts              # Chat-related schemas
│
├── stores/                   # State management
│   └── layout.ts            # Layout state
│
├── styles/                   # Global styles
│   └── global.css           # Global CSS
│
└── types/                    # TypeScript types
    └── env.d.ts             # Environment types
```

## 🚀 Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Using React Components in Astro**
   ```astro
   ---
   // Always add client:load for interactive components
   import { Dialog } from "@/components/ui/dialog"
   ---
   
   <Dialog client:load>
     <!-- Dialog content -->
   </Dialog>
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm run preview # Test the production build
   ```

## 🔍 Troubleshooting

### Common Issues Solved

✅ **Component Hydration**: All interactive components use `client:load`
✅ **Build Warnings**: Suppressed in configuration
✅ **Path Aliases**: Pre-configured for easy imports
✅ **React Integration**: Properly set up for Shadcn

## 💡 Pro Tips

1. **Component Usage in Astro**
   ```astro
   ---
   // Always import in the frontmatter
   import { Button } from "@/components/ui/button"
   ---
   
   <!-- Use in template -->
   <Button client:load>Click me!</Button>
   ```

2. **Styling with Tailwind**
   ```astro
   <div class="dark:bg-slate-800">
     <Button class="m-4">Styled Button</Button>
   </div>
   ```

3. **Layout Usage**
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   ---
   
   <Layout title="Home">
     <!-- Your content -->
   </Layout>
   ```

## 📚 Quick Links

- [Astro Documentation](https://docs.astro.build)
- [Shadcn/UI Components](https://ui.shadcn.com/docs/components/accordion)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Need Help?

- Join [Astro Discord](https://astro.build/chat)
- Check [Astro Documentation](https://docs.astro.build)
- File an [Issue on GitHub](https://github.com/one-ie/one/issues)

---

Built with 🚀 Astro, 🎨 Shadcn/UI and Vercel AI SDK by [ONE](https://one.ie)
