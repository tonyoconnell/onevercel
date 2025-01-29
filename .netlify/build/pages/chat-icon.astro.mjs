/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Drq0HSre.mjs';
import { $ as $$Layout } from '../chunks/Layout_DARiigJU.mjs';
import { jsx } from 'react/jsx-runtime';
import { u as useEdgeRuntime, w as assistant_modal_default } from '../chunks/assistant-ui-chunk_C7cKFYmL.mjs';
export { renderers } from '../renderers.mjs';

function ChatAssistant() {
  const runtime = useEdgeRuntime({
    api: "/api/chat"
  });
  return /* @__PURE__ */ jsx(assistant_modal_default, { runtime });
}

const prerender = false;
const $$ChatIcon = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Chat" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div> ${renderComponent($$result2, "ChatAssistant", ChatAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/toc/Server/ONE/local/astro-shadcn/src/components/ChatAssistant", "client:component-export": "ChatAssistant" })} </div> ` })}`;
}, "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/chat-icon.astro", undefined);

const $$file = "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/chat-icon.astro";
const $$url = "/chat-icon";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChatIcon,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
