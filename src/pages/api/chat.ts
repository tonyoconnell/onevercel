import type { APIRoute } from 'astro';
import { openai } from "@ai-sdk/openai";
import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";

const handler = createEdgeRuntimeAPI({
  model: openai("gpt-4o-mini"),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      return new Response('Request body is required', { status: 400 });
    }

    const body = await request.text();
    if (!body) {
      return new Response('Empty request body', { status: 400 });
    }

    const jsonData = JSON.parse(body);
    
    return handler.POST({
      ...request,
      json: async () => jsonData
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Invalid JSON payload', { status: 400 });
  }
};