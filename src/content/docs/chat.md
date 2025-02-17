---
title: Chat System
description: Comprehensive guide to ONE's AI-powered chat system
date: 2024-02-02
section: Core Features
order: 1
---

# Chat System Overview

ONE's chat system combines Astro, React, and the Vercel AI SDK to deliver a powerful, flexible, and user-friendly chat interface with advanced AI capabilities.

## Architecture

The chat system is built on a modular architecture with several key components:

### 1. Frontend Components

#### Layout System
- **Panel Modes**:
  - `quarter`: 25% width side panel (default)
  - `half`: 50% width side panel
  - `full`: Full screen chat interface
  - `floating`: Detached floating window
  - `icon`: Minimized chat button
  - `hidden`: No chat interface

- **Responsive Behavior**:
  ```typescript
  interface LayoutProps {
    title: string;
    description?: string;
    header?: boolean;
    footer?: boolean;
    rightPanelMode?: 'hidden' | 'full' | 'half' | 'quarter' | 'floating' | 'icon';
    chatConfig?: ChatConfig;
    content?: string;
  }
  ```

#### Chat Components

##### Main Chat Page (`src/pages/chat.astro`)
- Entry point for the chat interface
- Configurable settings:
  - System prompts
  - Welcome messages
  - Quick suggestions
  - Layout modes
- Integration with page content
- AI context management

##### Thread Component (`src/components/chat/thread.tsx`)
- Core chat interface features:
  - Scrollable message area
  - Dynamic composition interface
  - Customizable welcome screen
  - Message styling and actions
  - Branch navigation
  - Voice synthesis

### 2. Backend Architecture

#### Chat API (`src/pages/api/chat.ts`)
- OpenAI API integration
- Configurable parameters:
  ```typescript
  interface ChatAPIConfig {
    provider: "openai";
    model: string;
    apiEndpoint: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string | SystemPrompt[];
    contextData?: string;
    functions?: ChatFunction[];
  }
  ```
- Edge runtime optimization
- Error handling and recovery
- Response streaming

## Advanced Features

### 1. Message Management
- Real-time streaming responses
- Markdown and code rendering
- Message editing and history
- Branch navigation
- Copy functionality
- Voice synthesis
- Code syntax highlighting

### 2. User Interface Modes

#### Quarter Mode (Default)
```typescript
<Layout rightPanelMode="quarter">
  <YourContent />
</Layout>
```
- 25% width side panel
- Ideal for documentation and content-heavy pages
- Maintains content visibility

#### Floating Mode
```typescript
<Layout rightPanelMode="floating">
  <YourContent />
</Layout>
```
- Detached window
- Draggable interface
- Minimal content interference

#### Icon Mode
```typescript
<Layout rightPanelMode="icon">
  <YourContent />
</Layout>
```
- Minimized chat button
- Expands on click
- Maximum content space

### 3. Configuration System

#### Basic Configuration
```typescript
const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: "I am a helpful assistant."
  }],
  welcome: {
    message: "👋 How can I help you today?",
    avatar: "/icon.svg",
    suggestions: [
      {
        label: "Get Started",
        prompt: "How do I get started?"
      }
    ]
  }
});
```

#### Advanced Configuration
```typescript
const advancedConfig = {
  provider: "openai",
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 2000,
  features: {
    textToSpeech: true,
    codeHighlight: true,
    markdown: true,
    suggestions: true,
    branchNavigation: true
  },
  styles: {
    theme: "light" | "dark" | "system",
    accentColor: "#0066FF",
    messageSpacing: "comfortable" | "compact"
  }
};
```