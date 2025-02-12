---
title: Frequently Asked Questions
description: Common questions and answers about using ONE framework
date: 2024-02-02
section: Development
order: 5
---

# Frequently Asked Questions (FAQ)

Quick answers to common questions about ONE framework, organized by topic.

## General

### Q: What is ONE framework?
**A:** ONE is an AI-powered web framework built on Astro that combines static site generation with dynamic AI capabilities. It provides tools for creating intelligent web applications with features like AI chat interfaces, content generation, and more.

### Q: Is ONE free to use?
**A:** Yes, ONE's core features are completely free and open source. Optional token-based features are available for enterprise users who need white-labeling or additional capabilities.

### Q: What are the system requirements?
**A:** You need:
- Node.js 18 or higher
- pnpm package manager
- Modern web browser
- OpenAI API key (for AI features)

## Installation

### Q: How do I install ONE?
**A:** Install using pnpm:
```bash
# Create new project
pnpm create astro@latest my-one-app -- --template one

# Install dependencies
cd my-one-app
pnpm install
```

### Q: How do I update ONE?
**A:** Update dependencies:
```bash
pnpm update @one/core @one/ui @one/chat
```

### Q: Can I use npm or yarn instead of pnpm?
**A:** While possible, we recommend pnpm for better performance and consistency. If you must use npm:
```bash
npm install
npm run dev
```

## AI Features

### Q: How do I configure the OpenAI API?
**A:** Add your API key to `.env`:
```env
OPENAI_API_KEY=your_key_here
```

### Q: Which AI models are supported?
**A:** ONE supports:
- OpenAI GPT models
- Anthropic models (with configuration)
- Custom AI providers (with integration)

### Q: How do I customize AI behavior?
**A:** Use system prompts and chat configuration:
```typescript
const chatConfig = {
  systemPrompt: [{
    type: "text",
    text: "Define AI behavior here"
  }],
  temperature: 0.7,
  maxTokens: 2000
};
```

## Chat Interface

### Q: How do I add chat to a page?
**A:** Use the Layout component:
```astro
---
import Layout from "../layouts/Layout.astro";
import { ChatConfigSchema } from '../schema/chat';

const chatConfig = ChatConfigSchema.parse({
  // Your config here
});
---

<Layout
  chatConfig={chatConfig}
  rightPanelMode="quarter"
>
  <!-- Your content -->
</Layout>
```

### Q: Which panel modes are available?
**A:** Available modes:
- `quarter`: 25% width (default)
- `half`: 50% width
- `full`: Full screen
- `floating`: Detached window
- `icon`: Minimized button
- `hidden`: No chat interface

### Q: How do I style the chat interface?
**A:** Use Tailwind classes or custom CSS:
```typescript
// Custom theme
const theme = {
  colors: {
    primary: "blue",
    background: "white"
  },
  spacing: "comfortable"
};
```

## Development

### Q: How do I create a custom AI agent?
**A:** Define a specialized configuration:
```typescript
const customAgent = {
  systemPrompt: [{
    type: "text",
    text: "Define agent's expertise"
  }],
  welcome: {
    message: "Custom welcome",
    suggestions: [...]
  }
};
```

### Q: How do I add authentication?
**A:** Integrate with your preferred auth provider:
```typescript
// Example with Auth.js
import { getSession } from '@auth/astro';

const session = await getSession(Astro.request);
if (!session) {
  return Astro.redirect('/login');
}
```

### Q: How do I handle errors?
**A:** Use try-catch and error boundaries:
```typescript
try {
  const response = await chat.sendMessage(message);
} catch (error) {
  if (error.code === 'rate_limit') {
    // Handle rate limiting
  }
  // Log error
  console.error('Chat error:', error);
}
```

## Performance

### Q: How do I optimize performance?
**A:** Key optimization strategies:
1. Enable edge runtime
2. Implement caching
3. Use streaming responses
4. Optimize assets

### Q: How do I implement caching?
**A:** Use the built-in caching system:
```typescript
import { cache } from '@one/core';

const cachedResponse = await cache.wrap(
  key,
  async () => generateResponse(),
  { ttl: 3600 }
);
```

### Q: How do I monitor performance?
**A:** Use the monitoring tools:
```typescript
import { metrics } from '@one/core';

metrics.timing('chat.response', responseTime);
metrics.increment('chat.requests');
```

## Deployment

### Q: How do I deploy to production?
**A:** Multiple options:
1. Vercel (recommended):
```bash
vercel deploy
```

2. Cloudflare:
```bash
wrangler deploy
```

3. Custom server:
```bash
pnpm build
node server.js
```

### Q: How do I handle environment variables?
**A:** Set up environment-specific variables:
```env
# .env.production
OPENAI_API_KEY=prod_key
DATABASE_URL=prod_url
```

### Q: How do I enable SSL?
**A:** Most platforms handle SSL automatically. For custom servers:
```typescript
import https from 'https';
import { readFileSync } from 'fs';

const options = {
  key: readFileSync('private.key'),
  cert: readFileSync('certificate.crt')
};

https.createServer(options, app);
```

## Troubleshooting

### Q: Chat interface not showing?
**A:** Check:
1. ChatConfig syntax
2. API key configuration
3. Panel mode setting
4. Console errors

### Q: Build failing?
**A:** Try:
```bash
# Clear cache
pnpm clean

# Fresh install
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Q: TypeScript errors?
**A:** Update types:
```bash
# Regenerate types
pnpm astro sync

# Check configuration
pnpm tsc --noEmit
```

## Getting Help

### Q: Where can I get support?
**A:** Several options:
1. [Documentation](/docs)
2. [GitHub Issues](https://github.com/one-ie/one/issues)
3. [Discord Community](https://discord.gg/one)
4. Email: support@one.ie

### Q: How do I report bugs?
**A:** Open an issue with:
- Error message
- Steps to reproduce
- Environment details
- Code sample

### Q: How do I request features?
**A:** Use our [feature request](https://github.com/one-ie/one/issues/new?template=feature_request.md) template on GitHub.

Need more help? Join our [Discord community](https://discord.gg/one) for real-time support.