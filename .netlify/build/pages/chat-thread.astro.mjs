/* empty css                                       */
import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Drq0HSre.mjs';
import { $ as $$Layout } from '../chunks/Layout_D90Tq4SH.mjs';
import { jsx } from 'react/jsx-runtime';
import { u as useEdgeRuntime, t as thread_default } from '../chunks/assistant-ui-chunk_Crc0Mnfx.mjs';
export { renderers } from '../renderers.mjs';

function MyThread() {
  const runtime = useEdgeRuntime({
    api: "/api/chat"
  });
  return /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(thread_default, { runtime }) });
}

const $$ChatThread = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Chat" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-[800px] h-[800px]"> ${renderComponent($$result2, "MyThread", MyThread, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/toc/Server/ONE/local/astro-shadcn/src/components/ChatThread", "client:component-export": "MyThread" })} </div> ` })}`;
}, "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/chat-thread.astro", undefined);

const $$file = "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/chat-thread.astro";
const $$url = "/chat-thread";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChatThread,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
