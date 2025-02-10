# 🚀 ONE - Build AI-Powered Businesses

Combining Astro's performance with Shadcn's beautiful components, featuring AI agents, crypto payments, and content automation.

## ✨ Key Features

- 🤖 **AI Agents**: Built-in support for intelligent AI assistants
- 💰 **Crypto Payments**: Integrated cryptocurrency payment system
- 📝 **Content Automation**: Automated content generation and management
- 🎯 **Token System**: Flexible token-based authentication and authorization
- ⚡ **High Performance**: Lightning-fast page loads and optimal SEO
- 🎨 **Beautiful UI**: Pre-configured Shadcn components

### 🎨 Screenshots
![Dark Mode](https://astro-shadcn.one.ie/screenshots/screenshot-dark.png)
![Light Mode](https://astro-shadcn.one.ie/screenshots/screenshot-light.png)

## ⚡ Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or pnpm or yarn
- Git (optional)

### Installation

1. **Clone the Repository**
```bash
# Clone the repository
git clone https://github.com/one-ie/one.git

# Navigate to project
cd one
```

2. **Install Dependencies**
```bash
# Using npm
npm install

# OR using pnpm
pnpm install

# OR using yarn
yarn install
```

3. **Set Up Environment Variables**
```bash
# Copy the example environment file
cp .env.example .env
```

4. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:4321` - You're ready to go! 🎉

## 📝 Creating Your First Page

### Adding a Markdown Page

1. **Create a New File**
Create `src/pages/my-first-page.md`:

```markdown
---
title: My First Page
layout: ../layouts/Layout.astro
---

# Welcome to My First Page

This is a markdown page with full support for:
- ✨ Markdown syntax
- 🎨 Tailwind CSS classes
- 🧩 Shadcn/UI components
```

2. **Using Components in Markdown**
```markdown
---
title: Interactive Page
layout: ../layouts/Layout.astro
---

import { Button } from "@/components/ui/button"

# Interactive Markdown

<Button client:load>Click Me!</Button>
```

### Creating an Astro Page

1. **Create a New File**
Create `src/pages/my-component-page.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
---

<Layout title="Component Page">
  <main class="container mx-auto p-4">
    <Card>
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
      </CardHeader>
      <CardContent>
        <Button client:load>Interactive Button</Button>
      </CardContent>
    </Card>
  </main>
</Layout>
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
your-project/
├── src/
│   ├── components/
│   │   └── ui/          # All Shadcn components
│   ├── layouts/
│   │   └── Layout.astro # Base layout
│   └── pages/
│       └── index.astro  # Homepage
├── astro.config.mjs     # Astro configuration
└── tailwind.config.cjs  # Tailwind configuration
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

## 📊 Performance & Screenshots

### ⚡ Lighthouse Scores
![Desktop Performance](https://astro-shadcn.one.ie/screenshots/lighthouse-desktop.png)
![Mobile Performance](https://astro-shadcn.one.ie/screenshots/lighthouse-mobile.png)

Perfect scores across all metrics:
- 🚀 Performance: 100
- ♿ Accessibility: 100
- 🔧 Best Practices: 100
- 🔍 SEO: 100

## 📚 Quick Links

- [Astro Documentation](https://docs.astro.build)
- [Shadcn/UI Components](https://ui.shadcn.com/docs/components/accordion)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Need Help?

- Join [Astro Discord](https://astro.build/chat)
- Check [Astro Documentation](https://docs.astro.build)
- File an [Issue on GitHub](https://github.com/one-ie/one/issues)

---

Built with 🚀 Astro, 🎨 Shadcn/UI and Vercel AI SDL by [ONE](https://one.ie)
