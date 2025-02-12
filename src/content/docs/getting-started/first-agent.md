---
title: Your First AI Agent
description: Create and deploy your first AI agent with ONE
date: 2024-02-02
section: Introduction
order: 2
---

# Creating Your First AI Agent

Learn how to create a custom AI agent in just a few minutes. We'll build a simple assistant that can help users with your application.

## Prerequisites

- Completed the [installation guide](/docs/getting-started/installation)
- Basic understanding of Astro and React
- OpenAI API key configured

## Step 1: Create Your Page

Create a new file `src/pages/my-agent.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import { ChatConfigSchema } from '../schema/chat';

const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: "You are a helpful assistant that guides users through this application. You can explain features, provide tips, and help with common tasks."
  }],
  welcome: {
    message: "👋 How can I help you today?",
    avatar: "/icon.svg",
    suggestions: [
      {
        label: "Features",
        prompt: "What can this application do?"
      },
      {
        label: "Get Started",
        prompt: "How do I get started?"
      }
    ]
  }
});
---

<Layout
  title="My First Agent"
  chatConfig={chatConfig}
  rightPanelMode="quarter"
>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">
      Welcome to My App
    </h1>
    <p class="text-lg text-muted-foreground">
      Ask our AI assistant for help using the chat panel.
    </p>
  </main>
</Layout>
```

## Step 2: Configure Your Agent

### System Prompt

The system prompt defines your agent's role and capabilities:

```typescript
systemPrompt: [{
  type: "text",
  text: `You are an expert in [your domain] who helps users with [specific tasks].
  Your key responsibilities:
  1. [Primary task]
  2. [Secondary task]
  3. [Additional capabilities]`
}]
```

### Welcome Screen

Configure the initial interaction:

```typescript
welcome: {
  message: "Your welcome message",
  avatar: "/path/to/avatar.png",
  suggestions: [
    {
      label: "First Option",
      prompt: "What would you like to know about..."
    }
  ]
}
```

## Step 3: Enhance Your Agent

### Add Domain Knowledge

Provide context about your application:

```typescript
const pageContent = `
# Application Features
- Feature 1: Description
- Feature 2: Description
`;

const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: `You are an expert on this application. Here are the features:
    ${pageContent}`
  }],
  // ... rest of config
});
```

### Configure Chat Layout

Choose from different display modes:
- `quarter`: 25% width side panel
- `half`: 50% width side panel
- `full`: Full screen chat
- `floating`: Detached window
- `icon`: Minimized chat button

```astro
<Layout
  chatConfig={chatConfig}
  rightPanelMode="quarter" // Try different modes
>
```

## Step 4: Test Your Agent

1. Start the development server:
```bash
pnpm dev
```

2. Visit `http://localhost:3000/my-agent`
3. Try different prompts and interactions
4. Refine the system prompt based on responses

## Best Practices

1. **Clear Role Definition**
   - Be specific about your agent's expertise
   - Define boundaries clearly
   - List key capabilities

2. **User Experience**
   - Provide helpful suggestions
   - Use clear, friendly language
   - Include relevant examples

3. **Content Organization**
   - Structure information logically
   - Use consistent formatting
   - Include necessary context

## Troubleshooting

### Common Issues

1. **Agent Not Responding**
   - Check API key configuration
   - Verify network connectivity
   - Check console for errors

2. **Incorrect Responses**
   - Review system prompt
   - Add more context
   - Specify constraints clearly

3. **Layout Issues**
   - Try different panel modes
   - Check responsive design
   - Verify CSS classes

## Next Steps

- [Customize chat appearance](/docs/core-concepts/chat-system)
- [Add advanced features](/docs/tutorials/advanced-agents)
- [Deploy your application](/docs/getting-started/deployment)

Need help? Check our [FAQ](/docs/faq) or join our [community](https://github.com/one-ie/one/discussions).