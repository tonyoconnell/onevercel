/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Drq0HSre.mjs';
import { c as cn, B as Button, $ as $$Layout } from '../chunks/Layout_DRjY1juE.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { forwardRef } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ArrowDownIcon, SendHorizontalIcon, PencilIcon, AudioLinesIcon, StopCircleIcon, CheckIcon, CopyIcon, RefreshCwIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { makeMarkdownText } from '@assistant-ui/react-markdown';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism/index.js';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { T as ThreadPrimitiveRoot, a as ThreadPrimitiveViewport, b as ThreadPrimitiveMessages, d as ThreadPrimitiveScrollToBottom, e as ThreadPrimitiveEmpty, C as ComposerPrimitiveRoot, f as ComposerPrimitiveInput, g as ThreadPrimitiveIf, h as ComposerPrimitiveSend, i as ComposerPrimitiveCancel, M as MessagePrimitiveRoot, j as MessagePrimitiveContent, A as ActionBarPrimitiveRoot, k as ActionBarPrimitiveEdit, l as MessagePrimitiveIf, m as ActionBarPrimitiveSpeak, n as ActionBarPrimitiveStopSpeaking, o as ActionBarPrimitiveCopy, p as ActionBarPrimitiveReload, B as BranchPickerPrimitiveRoot, q as BranchPickerPrimitivePrevious, r as BranchPickerPrimitiveNumber, s as BranchPickerPrimitiveCount, t as BranchPickerPrimitiveNext, u as useEdgeRuntime, v as AssistantRuntimeProvider } from '../chunks/assistant-ui-chunk_C7cKFYmL.mjs';
export { renderers } from '../renderers.mjs';

const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

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

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipIconButton = forwardRef(({ children, tooltip, side = "bottom", className, ...rest }, ref) => {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "icon",
        ...rest,
        className: cn("size-6 p-1", className),
        ref,
        children: [
          children,
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: tooltip })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(TooltipContent, { side, children: tooltip })
  ] }) });
});
TooltipIconButton.displayName = "TooltipIconButton";

const MyThread$1 = () => {
  return /* @__PURE__ */ jsx(ThreadPrimitiveRoot, { className: "bg-background h-full", children: /* @__PURE__ */ jsxs(ThreadPrimitiveViewport, { className: "flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8", children: [
    /* @__PURE__ */ jsx(MyThreadWelcome, {}),
    /* @__PURE__ */ jsx(
      ThreadPrimitiveMessages,
      {
        components: {
          UserMessage: MyUserMessage,
          EditComposer: MyEditComposer,
          AssistantMessage: MyAssistantMessage
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-8 flex-grow" }),
    /* @__PURE__ */ jsxs("div", { className: "sticky bottom-0 mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4", children: [
      /* @__PURE__ */ jsx(MyThreadScrollToBottom, {}),
      /* @__PURE__ */ jsx(MyComposer, {})
    ] })
  ] }) });
};
const MyThreadScrollToBottom = () => {
  return /* @__PURE__ */ jsx(ThreadPrimitiveScrollToBottom, { asChild: true, children: /* @__PURE__ */ jsx(
    TooltipIconButton,
    {
      tooltip: "Scroll to bottom",
      variant: "outline",
      className: "absolute -top-8 rounded-full disabled:invisible",
      children: /* @__PURE__ */ jsx(ArrowDownIcon, {})
    }
  ) });
};
const MyThreadWelcome = () => {
  return /* @__PURE__ */ jsx(ThreadPrimitiveEmpty, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-grow flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx(Avatar, { children: /* @__PURE__ */ jsx(AvatarFallback, { children: "C" }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 font-medium", children: "How can I help you today" })
  ] }) });
};
const MyComposer = () => {
  return /* @__PURE__ */ jsxs(ComposerPrimitiveRoot, { className: "flex w-full flex-wrap items-end rounded-full border bg-inherit px-4 shadow-sm transition-colors ease-in focus-within:border-ring/20", children: [
    /* @__PURE__ */ jsx(
      ComposerPrimitiveInput,
      {
        autoFocus: true,
        placeholder: "Write a message...",
        rows: 1,
        className: "placeholder:text-muted-foreground max-h-40 flex-grow resize-none rounded-full border-none bg-transparent px-2 py-3 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      }
    ),
    /* @__PURE__ */ jsx(ThreadPrimitiveIf, { running: false, children: /* @__PURE__ */ jsx(ComposerPrimitiveSend, { asChild: true, children: /* @__PURE__ */ jsx(
      TooltipIconButton,
      {
        tooltip: "Send",
        variant: "default",
        className: "my-2.5 size-8 p-2 transition-opacity ease-in",
        children: /* @__PURE__ */ jsx(SendHorizontalIcon, {})
      }
    ) }) }),
    /* @__PURE__ */ jsx(ThreadPrimitiveIf, { running: true, children: /* @__PURE__ */ jsx(ComposerPrimitiveCancel, { asChild: true, children: /* @__PURE__ */ jsx(
      TooltipIconButton,
      {
        tooltip: "Cancel",
        variant: "default",
        className: "my-2.5 size-8 p-2 transition-opacity ease-in",
        children: /* @__PURE__ */ jsx(CircleStopIcon, {})
      }
    ) }) })
  ] });
};
const MyUserMessage = () => {
  return /* @__PURE__ */ jsxs(MessagePrimitiveRoot, { className: "grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4", children: [
    /* @__PURE__ */ jsx(MyUserActionBar, {}),
    /* @__PURE__ */ jsx("div", { className: "bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5", children: /* @__PURE__ */ jsx(MessagePrimitiveContent, {}) }),
    /* @__PURE__ */ jsx(MyBranchPicker, { className: "col-span-full col-start-1 row-start-2 -mr-1 justify-end" })
  ] });
};
const MyUserActionBar = () => {
  return /* @__PURE__ */ jsx(
    ActionBarPrimitiveRoot,
    {
      hideWhenRunning: true,
      autohide: "not-last",
      className: "col-start-1 mr-3 mt-2.5 flex flex-col items-end",
      children: /* @__PURE__ */ jsx(ActionBarPrimitiveEdit, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Edit", children: /* @__PURE__ */ jsx(PencilIcon, {}) }) })
    }
  );
};
const MyEditComposer = () => {
  return /* @__PURE__ */ jsxs(ComposerPrimitiveRoot, { className: "bg-muted my-4 flex w-full max-w-2xl flex-col gap-2 rounded-xl", children: [
    /* @__PURE__ */ jsx(ComposerPrimitiveInput, { className: "text-foreground flex h-8 w-full resize-none border-none bg-transparent p-4 pb-0 outline-none focus:ring-0" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-3 mb-3 flex items-center justify-center gap-2 self-end", children: [
      /* @__PURE__ */ jsx(ComposerPrimitiveCancel, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", children: "Cancel" }) }),
      /* @__PURE__ */ jsx(ComposerPrimitiveSend, { asChild: true, children: /* @__PURE__ */ jsx(Button, { children: "Send" }) })
    ] })
  ] });
};
const MyAssistantMessage = () => {
  return /* @__PURE__ */ jsxs(MessagePrimitiveRoot, { className: "relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4", children: [
    /* @__PURE__ */ jsx(Avatar, { className: "col-start-1 row-span-full row-start-1 mr-4", children: /* @__PURE__ */ jsx(AvatarFallback, { children: "A" }) }),
    /* @__PURE__ */ jsx("div", { className: "text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7", children: /* @__PURE__ */ jsx(MessagePrimitiveContent, { components: { Text: MarkdownText } }) }),
    /* @__PURE__ */ jsx(MyAssistantActionBar, {}),
    /* @__PURE__ */ jsx(MyBranchPicker, { className: "col-start-2 row-start-2 -ml-2 mr-2" })
  ] });
};
const MyAssistantActionBar = () => {
  return /* @__PURE__ */ jsxs(
    ActionBarPrimitiveRoot,
    {
      hideWhenRunning: true,
      autohide: "not-last",
      autohideFloat: "single-branch",
      className: "text-muted-foreground data-[floating]:bg-background col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm",
      children: [
        /* @__PURE__ */ jsx(MessagePrimitiveIf, { speaking: false, children: /* @__PURE__ */ jsx(ActionBarPrimitiveSpeak, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Read aloud", children: /* @__PURE__ */ jsx(AudioLinesIcon, {}) }) }) }),
        /* @__PURE__ */ jsx(MessagePrimitiveIf, { speaking: true, children: /* @__PURE__ */ jsx(ActionBarPrimitiveStopSpeaking, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Stop", children: /* @__PURE__ */ jsx(StopCircleIcon, {}) }) }) }),
        /* @__PURE__ */ jsx(ActionBarPrimitiveCopy, { asChild: true, children: /* @__PURE__ */ jsxs(TooltipIconButton, { tooltip: "Copy", children: [
          /* @__PURE__ */ jsx(MessagePrimitiveIf, { copied: true, children: /* @__PURE__ */ jsx(CheckIcon, {}) }),
          /* @__PURE__ */ jsx(MessagePrimitiveIf, { copied: false, children: /* @__PURE__ */ jsx(CopyIcon, {}) })
        ] }) }),
        /* @__PURE__ */ jsx(ActionBarPrimitiveReload, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Refresh", children: /* @__PURE__ */ jsx(RefreshCwIcon, {}) }) })
      ]
    }
  );
};
const MyBranchPicker = ({
  className,
  ...rest
}) => {
  return /* @__PURE__ */ jsxs(
    BranchPickerPrimitiveRoot,
    {
      hideWhenSingleBranch: true,
      className: cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className
      ),
      ...rest,
      children: [
        /* @__PURE__ */ jsx(BranchPickerPrimitivePrevious, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Previous", children: /* @__PURE__ */ jsx(ChevronLeftIcon, {}) }) }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          /* @__PURE__ */ jsx(BranchPickerPrimitiveNumber, {}),
          " / ",
          /* @__PURE__ */ jsx(BranchPickerPrimitiveCount, {})
        ] }),
        /* @__PURE__ */ jsx(BranchPickerPrimitiveNext, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Next", children: /* @__PURE__ */ jsx(ChevronRightIcon, {}) }) })
      ]
    }
  );
};
const CircleStopIcon = () => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      width: "16",
      height: "16",
      children: /* @__PURE__ */ jsx("rect", { width: "10", height: "10", x: "3", y: "3", rx: "2" })
    }
  );
};

function MyThread() {
  const runtime = useEdgeRuntime({
    api: "/api/chat"
  });
  return /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(AssistantRuntimeProvider, { runtime, children: /* @__PURE__ */ jsx(MyThread$1, {}) }) });
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
