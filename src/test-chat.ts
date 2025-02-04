import { ChatConfigSchema } from './schema/chat';
import type { Message } from 'ai';

async function testChatRequest() {
  const config = ChatConfigSchema.parse({
    model: "gpt-4o-mini",
    apiEndpoint: "https://api.openai.com/v1",
    runtime: "edge",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: [{
      type: "text" as const,
      text: "reply in irish language"
    }],
    userPrompt: [{
      type: "text" as const,
      text: "tell a joke"
    }],
    welcome: {
      message: "I am Agent ONE. How can I help you today?",
      avatar: "/icon.svg",
      suggestions: [
        {
          label: "Tell me about ONE",
          prompt: "What is ONE and how can it help me?"
        }
      ]
    }
  });

  const message: Message = {
    id: '1',
    role: 'user',
    content: 'Hello'
  };

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [message],
        config
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testChatRequest().catch(console.error);