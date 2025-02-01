import type { APIRoute } from 'astro';
import { openai } from "@ai-sdk/openai";
import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";
import { type ChatConfig, createDefaultConfig } from '@/lib/chatConfig';
import type { Message } from 'ai';

interface ChatRequest {
  messages: Message[];
  body?: {
    config?: Partial<ChatConfig>;
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const requestData = await request.json() as ChatRequest;
    
    // Get configuration with defaults and any overrides
    const config = createDefaultConfig(requestData.body?.config);

    console.log('Processing chat request with config:', {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      systemPromptCount: config.systemPrompt.length
    });

    // Transform messages to the format expected by assistant-ui
    const transformedMessages = requestData.messages.map(msg => ({
      ...msg,
      content: [{
        type: 'text' as const,
        text: msg.content
      }]
    }));

    // Create handler with model configuration from the page
    const handler = createEdgeRuntimeAPI({
      model: openai(config.model),
      temperature: config.temperature,
      maxTokens: config.maxTokens
    });

    const response = await handler.POST({
      ...request,
      json: async () => ({
        messages: transformedMessages,
        functions: [], // Required by Vercel AI SDK
        function_call: null // Required by Vercel AI SDK
      })
    });

    if (!response.ok) {
      throw new Error(`Edge runtime error: ${response.statusText}`);
    }

    return response;

  } catch (error) {
    console.error('Chat API error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};