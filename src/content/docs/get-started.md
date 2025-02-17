---
title: Getting Started with ONE
description: Learn how to set up and start building with the ONE framework
date: 2024-02-02
section: Introduction
order: 1
---

# Getting Started with ONE

This guide will help you set up and start building AI-powered applications using the ONE framework. ONE combines Astro, React, and modern AI capabilities to create intelligent web applications.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- pnpm package manager (`npm install -g pnpm`) is recommend but you can use NPM (npm install) or Yarn
- An OpenAI API key (for AI capabilities)
- Basic knowledge of Astro and React

## Quick Start

### 1. Get the Project

You have three options to get started with ONE:

```bash
# Option 1: Clone the repository
git clone https://github.com/one-ie/one.git

# Option 2: Download the ZIP file
# Visit: https://github.com/one-ie/one/archive/refs/heads/main.zip

# Option 3: Fork the repository
# Visit: https://github.com/one-ie/one/fork
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

## Common Issues

### Troubleshooting

1. **API Key Issues**
   - Ensure your OpenAI API key is properly set in `.env`
   - Check API key permissions and quotas

2. **Build Errors**
   - Run `pnpm clean` to clear cache
   - Ensure all dependencies are installed
   - Check for Node.js version compatibility

3. **Chat Not Working**
   - Verify API endpoint configuration
   - Check browser console for errors
   - Ensure proper network connectivity

## Support

Need help? Try these resources:

- [GitHub Issues](https://github.com/yourusername/one/issues)
- [Documentation](/docs)
- Email: support@one.ie

Remember to check the [Frequently Asked Questions](/docs/faq) for common queries and solutions.