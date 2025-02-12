---
title: Installation & Setup
description: Get started with ONE framework in minutes
date: 2024-02-02
section: Introduction
order: 1
---

# Installation & Setup

Welcome to ONE! This guide will help you install and set up your first project.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher
- pnpm package manager
- An OpenAI API key
- Basic knowledge of Astro and React

## Quick Install

```bash
# Create new project
pnpm create astro@latest my-one-app -- --template one

# Navigate to project
cd my-one-app

# Install dependencies
pnpm install
```

## Environment Setup

1. Create a `.env` file:
```env
OPENAI_API_KEY=your_api_key_here
```

2. Configure basic settings:
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Your configuration here
});
```

## Verify Installation

Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to confirm everything is working.

## Project Structure

```
my-one-app/
├── src/
│   ├── components/     # UI components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Routes
│   ├── content/       # Markdown content
│   └── styles/        # Global styles
└── public/           # Static assets
```

## Next Steps

- [Create your first AI agent](/docs/getting-started/first-agent)
- [Configure chat system](/docs/core-concepts/chat-system)
- [Deploy your app](/docs/getting-started/deployment)

## Troubleshooting

### Common Issues

1. **Missing Dependencies**
   ```bash
   pnpm install
   ```

2. **API Key Issues**
   - Verify the key in your `.env` file
   - Check API key permissions

3. **Build Errors**
   ```bash
   # Clear cache and reinstall
   pnpm clean && pnpm install
   ```

Need help? Check our [FAQ](/docs/faq) or [contact support](mailto:support@one.ie).