/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Drq0HSre.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dv0_qXyB.mjs';
import { jsx } from 'react/jsx-runtime';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism/index.js';
import { u as useEdgeRuntime, t as thread_default } from '../chunks/assistant-ui-chunk_Crc0Mnfx.mjs';
export { renderers } from '../renderers.mjs';

const CodeBlock = ({ children, className }) => {
  const codeString = typeof children === "string" ? children : String(children || "");
  const language = className?.replace("language-", "") || "text";
  return /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsx(
    PrismAsyncLight,
    {
      language,
      style: coldarkDark,
      customStyle: {
        margin: 0,
        width: "100%",
        background: "transparent",
        padding: "1.5rem 1rem"
      },
      children: codeString
    }
  ) });
};
const MarkdownText = makeMarkdownText({
  components: {
    code: CodeBlock
  }
});

function MyThread() {
  const runtime = useEdgeRuntime({
    api: "/api/chat"
  });
  return /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(
    thread_default,
    {
      runtime,
      assistantMessage: { components: { Text: MarkdownText } }
    }
  ) });
}

const $$Chat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Chat" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-[800px] h-[800px]"> ${renderComponent($$result2, "MyThread", MyThread, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/toc/Server/ONE/local/astro-shadcn/src/components/ChatThread", "client:component-export": "MyThread" })} </div> ` })}`;
}, "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/chat.astro", undefined);

const $$file = "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/chat.astro";
const $$url = "/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Chat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
