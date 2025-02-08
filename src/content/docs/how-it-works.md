---
title: How it works
description: Detailed explanation of ONE's architecture and operation
date: 2024-02-02
section: Introduction
order: 2
---

# How ONE Works

ONE is a comprehensive framework for building AI-powered web applications with Astro. It combines high-performance static site generation with dynamic AI capabilities to create intelligent, responsive web experiences.

## Core Architecture

### Tech Stack
- **Astro** - The core framework that enables high-performance static site generation
- **React** - Used for interactive components and UI elements
- **Assistant UI** - Provides the chat interface and AI interaction components
- **Vercel AI SDK** - Handles AI model integration and streaming responses
- **Tailwind CSS** - For responsive and customizable styling

### Layout System

The framework uses a flexible layout system with three main components:

1. **Main Grid**
   - Configurable grid layout system
   - Support for responsive design
   - Dynamic panel sizing and positioning

2. **Panel Modes**
   ```typescript
   type PanelMode = 'hidden' | 'full' | 'half' | 'quarter' | 'floating' | 'icon';
   ```
   - `quarter`: 25% width side panel
   - `half`: 50% width side panel
   - `full`: Full screen display
   - `floating`: Detached floating window
   - `icon`: Minimized chat button
   - `hidden`: No chat interface

3. **Responsive Behavior**
   - Automatic adaptation to screen sizes
   - Mobile-first design approach
   - Smooth transitions between states

### AI Agent Implementation

Every page in ONE can have its own AI Agent, with specific knowledge about the page content:

1. **Configuration Layer**
```typescript
{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiEndpoint": "https://api.openai.com/v1",
    "runtime": "edge",
    "temperature": 0.7,
    "maxTokens": 2000,
    "systemPrompt": "You are a helpful AI assistant.",
    "userPrompt": "main content of the markdown file below"
}
```

2. **Chat Interface Layer**
- Real-time message streaming
- Markdown rendering
- Message history and branching
- Text-to-speech capabilities
- Code syntax highlighting
- Copy/edit functionality

3. **Edge Runtime Layer**
- Edge-based processing
- Efficient data streaming
- Optimized response handling

## Content Management

### 1. Blog System
- Markdown-based content
- Multiple view modes (list, grid, magazine)
- Automatic reading time calculation
- Rich media support
- Category and tag organization

### 2. Documentation System
- Hierarchical structure
- Section-based organization
- Automated navigation
- Version control support

### 3. Page-Specific AI Agents
- Contextual awareness
- Custom knowledge base
- Tailored responses
- Dynamic suggestions

## Advanced Features

### 1. Real-time Interaction
- Streaming responses
- Interactive components
- Dynamic content updates
- Branch navigation
- Message history

### 2. UI Components
- Floating chat interface
- Customizable welcome screen
- Quick suggestion buttons
- Progress indicators
- Error states

### 3. Performance Optimization
- Edge computing
- Asset optimization
- Lazy loading
- Caching strategies
- Response streaming

## Configuration Examples

### 1. Basic Chat Setup
```typescript
const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: "You are a helpful AI assistant."
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
```

### 2. Custom Layout Configuration
```typescript
<Layout 
  title="Your Page"
  chatConfig={chatConfig}
  rightPanelMode="quarter"
  header={true}
  footer={true}
>
  {/* Your content */}
</Layout>
```

### 3. Page-Specific Agent
```typescript
const pageSpecificAgent = {
  systemPrompt: `You are an expert on ${topic}...`,
  contextData: pageContent,
  parameters: {
    temperature: 0.7,
    maxTokens: 2000
  }
};
```