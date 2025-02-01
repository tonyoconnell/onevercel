import type { APIRoute } from 'astro';
import { openai } from "@ai-sdk/openai";
import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  userPrompt?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      return new Response('Request body is required', { status: 400 });
    }

    const body = await request.text();
    if (!body) {
      return new Response('Empty request body', { status: 400 });
    }

    const jsonData: ChatRequest = JSON.parse(body);
    
    console.log('Request body:', {
      model: jsonData.model,
      systemPrompt: jsonData.systemPrompt,
      messages: jsonData.messages?.length
    });

    // Create messages array with system prompt if provided
    const messages = jsonData.systemPrompt
      ? [{ role: 'system', content: jsonData.systemPrompt }, ...jsonData.messages]
      : jsonData.messages;

    console.log('Final messages:', messages);

    // Create handler with model configuration
    const handler = createEdgeRuntimeAPI({
      model: openai(jsonData.model || "gpt-4o-mini"),
      temperature: jsonData.temperature || 0.7,
      maxTokens: jsonData.maxTokens || 2000
    });
    
    return handler.POST({
      ...request,
      json: async () => ({
        messages,
        functions: [], // Required by Vercel AI SDK
        function_call: null // Required by Vercel AI SDK
      })
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Invalid JSON payload', { status: 400 });
  }
};