---
title: Troubleshooting Guide
description: Solutions for common issues and problems when building with ONE
date: 2024-02-02
section: Development
order: 4
---

# Troubleshooting Guide

This guide helps you diagnose and fix common issues you might encounter when building applications with ONE framework.

## Quick Solutions

### Common Issues and Fixes

| Issue | Solution |
|-------|----------|
| Chat not loading | Check API key configuration |
| Build errors | Clear cache and reinstall dependencies |
| API errors | Verify rate limits and permissions |
| Layout problems | Check panel mode configuration |
| Type errors | Update TypeScript definitions |

## Installation Issues

### 1. Dependency Errors

```bash
# Error: Failed to resolve dependencies
pnpm install fails with package conflicts
```

**Solution:**
```bash
# Clear dependency cache
rm -rf node_modules
rm pnpm-lock.yaml

# Clean install
pnpm install --force
```

### 2. Build Errors

```bash
# Error: Type errors during build
[vite] found X TypeScript errors
```

**Solution:**
```bash
# Update TypeScript definitions
pnpm clean
pnpm build

# If problems persist
rm -rf .astro
pnpm dev
```

## Chat System Issues

### 1. Chat Not Loading

#### Symptoms:
- Chat interface doesn't appear
- Loading spinner never completes
- Console errors related to chat initialization

#### Solutions:

1. **API Key Configuration**
```env
# .env
OPENAI_API_KEY=your_key_here # Must be valid and active
```

2. **Chat Configuration**
```typescript
// Verify chat configuration
const chatConfig = ChatConfigSchema.parse({
  provider: "openai",
  model: "gpt-4o-mini", // Verify model name
  systemPrompt: [{
    type: "text",
    text: "Your prompt here"
  }]
});
```

3. **Panel Mode**
```astro
<Layout
  chatConfig={chatConfig}
  rightPanelMode="quarter" // Try different modes
>
```

### 2. AI Response Issues

#### Symptoms:
- No responses from AI
- Timeout errors
- Incomplete responses

#### Solutions:

1. **Rate Limiting**
```typescript
// Implement rate limiting
const rateLimit = {
  tokens: 100000, // Adjust based on your plan
  interval: "1m"  // Time window
};

// Monitor usage
console.log('Token usage:', tokenCount);
```

2. **Context Length**
```typescript
// Manage context length
const maxTokens = 4000;
const truncateContext = (messages: Message[]) => {
  let totalTokens = 0;
  return messages.filter(msg => {
    totalTokens += estimateTokens(msg.content);
    return totalTokens <= maxTokens;
  });
};
```

3. **Error Handling**
```typescript
try {
  const response = await chat.sendMessage(message);
} catch (error) {
  if (error.code === 'context_length_exceeded') {
    // Truncate context and retry
    const truncatedMessages = truncateContext(messages);
    return chat.sendMessage(message, truncatedMessages);
  }
  // Handle other errors
  console.error('Chat error:', error);
}
```

## Layout Issues

### 1. Panel Mode Problems

#### Symptoms:
- Incorrect panel positioning
- Responsive layout issues
- Panel not showing/hiding properly

#### Solutions:

1. **Check Layout Props**
```astro
<Layout
  title="Your Page"
  chatConfig={chatConfig}
  rightPanelMode="quarter" // Verify mode
  header={true} // Check visibility
  footer={true} // Check visibility
>
```

2. **CSS Troubleshooting**
```css
/* Add debugging outlines */
.layout-debug * {
  outline: 1px solid red;
}

/* Fix z-index issues */
.chat-panel {
  z-index: 50;
  position: relative;
}
```

3. **Responsive Fixes**
```typescript
// Adjust panel mode based on screen size
const getPanelMode = (width: number) => {
  if (width < 768) return 'full';
  if (width < 1024) return 'half';
  return 'quarter';
};
```

## Performance Issues

### 1. Slow Response Times

#### Symptoms:
- Delayed AI responses
- Slow page loads
- High memory usage

#### Solutions:

1. **Enable Edge Runtime**
```typescript
// src/pages/api/chat.ts
export const config = {
  runtime: 'edge',
  regions: ['all'],
};
```

2. **Implement Caching**
```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  maxAge: 1000 * 60 * 5 // 5 minutes
});

// Cache responses
const getCachedResponse = async (key: string) => {
  if (cache.has(key)) return cache.get(key);
  const response = await generateResponse(key);
  cache.set(key, response);
  return response;
};
```

3. **Optimize Assets**
```typescript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    minify: true,
  },
});
```

## TypeScript Errors

### 1. Type Definition Issues

#### Symptoms:
- "Cannot find module" errors
- Type mismatch errors
- Missing property errors

#### Solutions:

1. **Update Type Definitions**
```bash
# Regenerate TypeScript definitions
pnpm astro sync
```

2. **Fix Common Type Errors**
```typescript
// Add proper type annotations
interface ChatConfig {
  provider: string;
  model: string;
  systemPrompt: SystemPrompt[];
}

// Use type assertions when necessary
const config = chatConfig as ChatConfig;
```

3. **Check tsconfig.json**
```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "jsxImportSource": "react"
  }
}
```

## Debug Checklist

When encountering issues:

1. **Check Console**
   - Look for error messages
   - Verify network requests
   - Monitor performance metrics

2. **Verify Configuration**
   - Environment variables
   - Chat configuration
   - TypeScript settings
   - Build configuration

3. **Test Components**
   - Isolate problem areas
   - Try different panel modes
   - Test responsive behavior
   - Check API responses

4. **Review Code**
   - Check type definitions
   - Verify imports
   - Review async operations
   - Check error handling

## Getting Help

If you're still having issues:

1. Check our [FAQ](/docs/faq)
2. Join our [Discord community](https://discord.gg/one)
3. Open an [issue on GitHub](https://github.com/one-ie/one/issues)
4. Contact [support@one.ie](mailto:support@one.ie)

Remember to include:
- Error messages
- Environment details
- Steps to reproduce
- Relevant code snippets