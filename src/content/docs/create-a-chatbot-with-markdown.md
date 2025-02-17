---
title: Create a Chatbot with Markdown
description: Step-by-step guide to creating an AI chatbot using markdown files
date: 2024-02-02
section: Tutorials
order: 3
---

# Creating a Chatbot with Markdown

This tutorial will show you how to create a specialized AI chatbot a single markdown files in ONE. 

## Step 1: Create Your Markdown File

Create a new markdown file in your pages directory (e.g., `src/pages/your-page.md`): You can make a copy of chat-template.md to get started faster or just copy the text into a markdown file below. 

```markdown
---
layout: ../layouts/Text.astro
title: "Your Page Title"
description: "Your page description"
chatConfig:
  provider: openai
  model: "gpt-4o-mini"
  apiEndpoint: "https://api.openai.com/v1"
  temperature: 0.7
  maxTokens: 4000
  systemPrompt:
    - type: text
      text: "Define your AI assistant's role and expertise here"
  welcome:
    message: "👋 Your welcome message here"
    avatar: "/your-icon.svg"
    suggestions:
      - label: "First Option"
        prompt: "What would you like to know about...?"
---

# Your Content Here
```

## Step 2: Configure the Chat System

### Basic Configuration

In the frontmatter section of your markdown file, configure these essential parameters:

```yaml
chatConfig:
  provider: openai           # AI provider
  model: "gpt-4o-mini"      # Model to use
  temperature: 0.7          # Response creativity (0-1)
  maxTokens: 4000          # Maximum response length
```

### Define the AI's Role

Create a clear system prompt that defines your AI's expertise:

```yaml
systemPrompt:
  - type: text
    text: "You are an expert in [your topic] focused on helping visitors understand [specific aspects]. You provide clear, accurate information about [key areas]."
```

Example prompt for a license page: 
```yaml
systemPrompt:
  - type: text
    text: "You are a licensing expert focused on helping visitors understand the ONE License terms and benefits. You provide clear, accurate information about licensing terms, commercial rights, and usage requirements."
```

### Set Up the Welcome Screen

Configure the initial interaction:

```yaml
welcome:
  message: "👋 Your greeting message here"
  avatar: "/path/to/icon.svg"
  suggestions:
    - label: "💡 First Option"
      prompt: "What would you like to know about...?"
    - label: "🚀 Second Option"
      prompt: "Another suggested question..."
```

## Step 3: Structure Your Content

Organize your markdown content to help the AI understand the topic:

1. **Clear Headings**
   ```markdown
   # Main Title
   
   ## Key Section
   
   ### Subsection
   ```

2. **Structured Information**
   ```markdown
   ## Key Points
   
   - **First Point** - Detailed explanation
   - **Second Point** - More details
   ```

3. **Organized Sections**
   ```markdown
   ## Topic Area
   
   1. **Main Concept**
      - Detail one
      - Detail two
   
   2. **Another Concept**
      - More information
      - Additional details
   ```

## Step 4: Add Interactive Elements

Include elements that enhance user interaction:

### Quick Access Buttons

```yaml
suggestions:
  - label: "💡 Key Feature"
    prompt: "Tell me about this feature"
  - label: "🚀 Getting Started"
    prompt: "How do I begin?"
  - label: "⚖️ Requirements"
    prompt: "What are the requirements?"
```

### Contact Information

```markdown
Contact [support@example.com](mailto:support@example.com) for assistance.
```

## Real-World Example

Here's how a license page can implement these concepts:

```markdown
---
layout: ../layouts/Text.astro
title: "ONE License"
description: "Maximum Freedom. Zero Restrictions"
chatConfig:
  provider: openai
  model: "gpt-4o-mini"
  apiEndpoint: "https://api.openai.com/v1"
  temperature: 0.7
  maxTokens: 4000
  systemPrompt:
    - type: text
      text: "You are a licensing expert focused on helping visitors understand the ONE License terms and benefits. You provide clear, accurate information about licensing terms, commercial rights, and usage requirements."
  welcome:
    message: "👋 Hello! I can help explain the ONE License terms and how you can use them for your business."
    avatar: "/icon.svg"
    suggestions:
      - label: "💡 Commercial Rights"
        prompt: "What commercial rights do I get with the ONE License?"
      - label: "🚀 Getting Started"
        prompt: "What are the steps to start using the ONE License?"
---

# ONE License (Version 1.0)

## Unlimited Commercial Freedom

ONE License gives you complete commercial freedom...

## Key Benefits

- **✨ 100% Commercial Rights** - Sell products and services at any price point
- **🚀 Full Modification Rights** - Customize and adapt the software freely
```

## Best Practices

1. **System Prompt**
   - Be specific about the AI's role
   - Define clear areas of expertise
   - Set appropriate boundaries

2. **Welcome Message**
   - Keep it friendly and clear
   - Set proper expectations
   - Provide useful starting points

3. **Content Structure**
   - Use clear headings
   - Organize information logically
   - Include relevant details

4. **Suggestions**
   - Cover common questions
   - Use descriptive labels
   - Provide clear prompts

## Troubleshooting

### Common Issues

1. **AI Responses Off-Topic**
   - Review and refine system prompt
   - Check content organization
   - Add more specific context

2. **Welcome Message Not Showing**
   - Verify frontmatter formatting
   - Check avatar path
   - Validate YAML syntax

3. **Suggestions Not Working**
   - Check label/prompt format
   - Verify YAML indentation
   - Ensure unique labels

## Next Steps

After creating your chatbot:

1. Test different queries
2. Refine the system prompt
3. Add more suggestions
4. Monitor user interactions
5. Update content as needed
