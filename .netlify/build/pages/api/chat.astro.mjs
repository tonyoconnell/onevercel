import { openai } from '@ai-sdk/openai';
import { c as createEdgeRuntimeAPI } from '../../chunks/assistant-ui-chunk_Crc0Mnfx.mjs';
export { renderers } from '../../renderers.mjs';

const handler = createEdgeRuntimeAPI({
  model: openai("gpt-4o-mini")
});
const POST = async ({ request }) => {
  try {
    if (!request.body) {
      return new Response("Request body is required", { status: 400 });
    }
    const body = await request.text();
    if (!body) {
      return new Response("Empty request body", { status: 400 });
    }
    const jsonData = JSON.parse(body);
    return handler.POST({
      ...request,
      json: async () => jsonData
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Invalid JSON payload", { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
