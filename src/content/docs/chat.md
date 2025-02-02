---
title: Chat
description: Detailed Overview of Chat Features
date: 2024-02-02
section: Introduction
order: 0
---
# Chat System Overview

The chat system is built using Astro, React, and the Assistant UI framework, providing a modern, interactive chat interface with AI capabilities.

## Architecture

The chat system consists of several key components:

### 1. Frontend Components

#### Chat Page (`src/pages/chat.astro`)
- Serves as the main entry point for the chat interface
- Configures the chat system with customizable settings like:
  - System prompt
  - Welcome message
  - Quick suggestions
- Uses a layout that keeps the right panel closed for better chat experience

#### Thread Component (`src/components/assistant-ui/thread.tsx`)
- Core UI component handling the chat interface
- Features:
  - Scrollable message area
  - Message composition
  - Welcome screen with customizable avatar and suggestions
  - User and assistant message components with different styling
  - Action buttons for messages (edit, copy, refresh)
  - Branch navigation for conversation history
  - Text-to-speech capability for assistant messages

### 2. Backend API

#### Chat API (`src/pages/api/chat.ts`)
- Handles chat requests using the OpenAI API
- Processes messages with configurable parameters:
  - Model selection
  - Temperature control
  - Maximum tokens
  - System prompts
- Includes error handling and response formatting
- Uses the Vercel AI SDK for edge runtime compatibility

## Key Features

### Message Handling
- Supports both user and assistant messages
- Real-time message streaming
- Markdown rendering for assistant responses
- Message editing capabilities
- Copy to clipboard functionality
- Message branching for alternate responses

### User Interface
- Clean, modern design with responsive layout
- Floating composition bar with send/cancel controls
- Avatar support for assistant messages
- Loading states and animations
- Hover actions for message management
- Scroll-to-bottom functionality

### Configuration
- Customizable system prompts
- Welcome message configuration
- Suggestion buttons for quick starts
- Configurable model parameters
- Error handling and recovery

## Implementation Details

### Message Components

1. **User Messages**
   - Right-aligned design
   - Edit capability
   - Branch navigation

2. **Assistant Messages**
   - Left-aligned with avatar
   - Markdown rendering
   - Text-to-speech option
   - Copy/refresh actions
   - Branch selection

### Composition Interface
- Auto-expanding text area
- Send/Cancel toggle based on state
- Character limit handling
- Focus management

### State Management
- Uses Assistant UI runtime for state handling
- Manages message history and branches
- Handles loading and error states
- Controls message streaming

## Usage

The chat interface can be customized through the configuration object in `chat.astro`:

```typescript
const chatConfig = ChatConfigSchema.parse({
  systemPrompt: [{
    type: "text",
    text: "Your system prompt here"
  }],
  welcome: {
    message: "Custom welcome message",
    avatar: "/path/to/avatar.svg",
    suggestions: [
      {
        label: "Suggestion Label",
        prompt: "Actual prompt text"
      }
    ]
  }
});
```

## Development Considerations

- Uses edge runtime for optimal performance
- Implements proper error handling
- Provides fallback states for loading and errors
- Maintains responsive design across devices
- Follows accessibility best practices
