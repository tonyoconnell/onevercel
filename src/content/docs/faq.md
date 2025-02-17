---
title: Development FAQ
description: Frequently asked questions about developing with ONE
date: 2024-02-02
section: Development
order: 5
---

# Development FAQ

Common questions and answers about developing applications with ONE framework.

## Getting Started

### Q: What are the minimum requirements to run ONE?
**A:** You need:
- Node.js 18 or higher
- pnpm package manager
- An OpenAI API key
- Basic knowledge of Astro and React

### Q: How do I install ONE?
**A:** Use the following commands:
```bash
# Create new project
git clone https://github.com/one-ie/one.git

# Install dependencies
cd one
pnpm install
```

### Q: How do I set up my OpenAI API key?
**A:** Create a `.env` file in your project root and add:
```env
OPENAI_API_KEY=your_api_key_here
```

You can copy the .env.example to .env 
## Chat System

### Q: How do I add chat to my page?
**A:** Add chat configuration to your page's frontmatter:
```yaml
---
layout: ../layouts/Layout.astro
chatConfig:
  provider: openai
  model: "gpt-4o-mini"
  temperature: 0.7
  maxTokens: 2000
  systemPrompt:
    - type: text
      text: "Your system prompt here"
---
```

### Q: How do I customize the chat panel position?
**A:** Use the `rightPanelMode` prop in your Layout component:
```astro
<Layout
  title="Your Page"
  chatConfig={chatConfig}
  rightPanelMode="quarter" // or "half", "full", "floating", "icon"
>
  <!-- Your content -->
</Layout>
```

### Q: Can I customize the welcome message and suggestions?
**A:** Yes, in your chat configuration:
```yaml
chatConfig:
  welcome:
    message: "👋 Your welcome message"
    avatar: "/path/to/icon.svg"
    suggestions:
      - label: "💡 First Option"
        prompt: "Your prompt here"
```

## Content Management

### Q: How do I create a chatbot for my markdown content?
**A:** Create a markdown file with chat configuration in the frontmatter:
```markdown
---
layout: ../layouts/Layout.astro
title: "Your Title"
chatConfig:
  systemPrompt:
    - type: text
      text: "Define your AI's expertise"
---

Your content here
```

See the tutorial [[create-a-chatbot-with-markdown]]
### Q: How do I organize my documentation?
**A:** Use the following structure:
```
src/content/docs/
├── index.md         # Main documentation page
├── getting-started/ # Getting started guides
├── features/       # Feature documentation
└── api/           # API documentation
```


## Styling and Theming

### Q: How do I customize the appearance?
**A:** ONE uses Tailwind CSS. Customize in `tailwind.config.mjs`:
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
}
```

### Q: How do I switch between light and dark themes?
**A:** Use the built-in theme system:
```typescript
import { useTheme } from "@/hooks/use-theme";

const { theme, setTheme } = useTheme();
```

## Troubleshooting

### Q: Why isn't my chat interface showing up?
**A:** Check these common issues:
1. Verify chatConfig in frontmatter
2. Ensure OpenAI API key is set
3. Check for console errors
4. Verify rightPanelMode setting

### Q: Why are my API calls failing?
**A:** Common solutions:
1. Verify API key in .env
2. Check API endpoint configuration
3. Verify rate limits
4. Check network connectivity

### Q: How do I debug streaming responses?
**A:** Use the browser's network tab:
1. Open DevTools
2. Go to Network tab
3. Filter for 'Fetch/XHR'
4. Look for streaming responses

## Deployment

### Q: How do I deploy my ONE application?
**A:** Several options:
1. Vercel 
2. Netlify
3. CloudFlare (under development)
4. Any Node.js server - AWS, Google Cloud or using Coolify on Hetzner is a great option

### Q: How do I handle environment variables in production?
**A:** Set them in your hosting platform:
```env
OPENAI_API_KEY=production_key
```

## Development Best Practices

### Q: What's the recommended way to structure a large application?
**A:** Follow this structure:
```
src/
├── components/    # Reusable components
├── layouts/       # Page layouts
├── content/       # Markdown content
├── pages/         # Routes
├── styles/        # Global styles
└── lib/          # Utilities
```

### Q: How do I implement proper error handling?
**A:** Use try-catch blocks and error boundaries:
```typescript
try {
  // API calls
} catch (error) {
  if (error.response?.status === 429) {
    // Handle rate limiting
  }
  // Handle other errors
}
```

### Q: How do I test my AI interactions?
**A:** Use test modes and mock responses:
```typescript
const testConfig = {
  ...chatConfig,
  provider: 'test',
  mockResponses: [...]
};
```

## Commercial Usage

### Q: Can I use ONE in a commercial project?
**A:** Yes, ONE License provides:
- Full commercial rights
- No royalty fees
## Support and Resources

### Q: Where can I get help?
**A:** Several options:
5. [Documentation](/docs)
6. [GitHub Issues](https://github.com/one-ie/one/issues)
7. Email support@one.ie

### Q: How do I report bugs?
**A:** Open an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details