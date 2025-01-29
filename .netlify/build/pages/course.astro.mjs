/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, b as createAstro, m as maybeRenderHead, d as addAttribute, e as renderTransition } from '../chunks/astro/server_Drq0HSre.mjs';
import { c as cn, $ as $$Layout } from '../chunks/Layout_DARiigJU.mjs';
import { g as getCollection } from '../chunks/_astro_content_DfUrMGMT.mjs';
import { C as Card } from '../chunks/card_bMWbr7Fc.mjs';
import { jsx } from 'react/jsx-runtime';
import 'react';
import { cva } from 'class-variance-authority';
import { List, Grid, Calendar } from 'lucide-react';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const entries = await getCollection("course");
  const viewMode = Astro2.url.searchParams.get("view") || "list";
  const gridColumns = Astro2.url.searchParams.get("columns") || "2";
  function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Course", "description": "Browse all available lessons" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto"> <div class="flex justify-between items-center mb-8"> <h1 class="text-4xl font-bold">Course</h1> <div class="flex gap-2 items-center"> <a href="/course?view=list"${addAttribute(`p-2 rounded-md hover:bg-accent hover:scale-110 transition-all duration-200 ${viewMode === "list" ? "bg-accent" : ""}`, "class")} title="List view"> ${renderComponent($$result2, "List", List, { "className": "w-5 h-5" })} </a> <a href="/course?view=grid&columns=2"${addAttribute(`p-2 rounded-md hover:bg-accent hover:scale-110 transition-all duration-200 ${viewMode === "grid" && gridColumns === "2" ? "bg-accent" : ""}`, "class")} title="2 columns grid"> ${renderComponent($$result2, "Grid", Grid, { "className": "w-5 h-5" })} </a> <a href="/course?view=grid&columns=3"${addAttribute(`p-2 rounded-md hover:bg-accent hover:scale-110 transition-all duration-200 ${viewMode === "grid" && gridColumns === "3" ? "bg-accent" : ""}`, "class")} title="3 columns grid"> <div class="w-5 h-5 grid grid-cols-3 gap-0.5"> <div class="bg-current rounded-sm"></div> <div class="bg-current rounded-sm"></div> <div class="bg-current rounded-sm"></div> </div> </a> <a href="/course?view=grid&columns=4"${addAttribute(`p-2 rounded-md hover:bg-accent hover:scale-110 transition-all duration-200 ${viewMode === "grid" && gridColumns === "4" ? "bg-accent" : ""}`, "class")} title="4 columns grid"> <div class="w-5 h-5 grid grid-cols-2 grid-rows-2 gap-0.5"> <div class="bg-current rounded-sm"></div> <div class="bg-current rounded-sm"></div> <div class="bg-current rounded-sm"></div> <div class="bg-current rounded-sm"></div> </div> </a> </div> </div> <div${addAttribute(viewMode === "grid" ? `grid gap-4 sm:gap-6 grid-cols-1 ${gridColumns === "2" ? "sm:grid-cols-2" : gridColumns === "3" ? "sm:grid-cols-3" : "sm:grid-cols-4"}` : "space-y-4 sm:space-y-6", "class")}${addAttribute(renderTransition($$result2, "lw3yi7bc"), "data-astro-transition-scope")}> ${entries.map((entry) => renderTemplate`${renderComponent($$result2, "Card", Card, { "className": `overflow-hidden transition-all duration-200 hover:shadow-lg ${viewMode === "list" ? "flex" : "hover:-translate-y-1"}` }, { "default": ($$result3) => renderTemplate` <a${addAttribute(`/course/${entry.slug}`, "href")}${addAttribute(`block hover:opacity-80 transition-opacity ${viewMode === "list" ? "flex flex-1" : ""}`, "class")}> ${entry.data.picture && viewMode === "list" && renderTemplate`<div class="w-48 shrink-0"> <img${addAttribute(entry.data.picture, "src")}${addAttribute(entry.data.title, "alt")} class="w-full h-full object-cover"> </div>`} <div class="p-6 flex-1"> <div class="flex items-center gap-2 mb-4"> ${renderComponent($$result3, "Badge", Badge, { "variant": "secondary", "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ui/badge", "client:component-export": "Badge" }, { "default": ($$result4) => renderTemplate`${entry.data.type || "Course"}` })} <span class="text-sm text-muted-foreground flex items-center"> ${renderComponent($$result3, "Calendar", Calendar, { "className": "w-4 h-4 mr-1", "client:load": true, "client:component-hydration": "load", "client:component-path": "lucide-react", "client:component-export": "Calendar" })} ${formatDate(new Date(entry.data.date))} </span> </div> <h2 class="text-2xl font-bold mb-2">${entry.data.title}</h2> <p class="text-muted-foreground">${entry.data.description}</p> </div> ${entry.data.picture && viewMode === "grid" && renderTemplate`<div class="aspect-video w-full"> <img${addAttribute(entry.data.picture, "src")}${addAttribute(entry.data.title, "alt")} class="w-full h-full object-cover"> </div>`} </a> ` })}`)} </div> </div> ` })}`;
}, "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/course/index.astro", "self");

const $$file = "/Users/toc/Server/ONE/local/astro-shadcn/src/pages/course/index.astro";
const $$url = "/course";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
