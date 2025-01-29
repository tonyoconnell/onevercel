import { c as createComponent, r as renderTemplate, d as addAttribute, j as renderScript, k as renderHead, a as renderComponent, f as renderSlot, b as createAstro } from './astro/server_Drq0HSre.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sun, Moon, Menu, LayoutPanelTop, Home, FileText, Scale, Waves } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
/* empty css                          */

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

function ModeToggle() {
  const [theme, setThemeState] = React.useState("dark");
  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    }
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);
  React.useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "icon",
      onClick: () => setThemeState(theme === "dark" ? "theme-light" : "dark"),
      children: [
        /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
      ]
    }
  );
}

const layoutStore = atom("sidebar");
function setLayout(layout) {
  layoutStore.set(layout);
  if (window.innerWidth >= 768) {
    localStorage.setItem("layoutPreference", layout);
  }
  document.documentElement.setAttribute("data-layout", layout);
}

const icons = {
  Home,
  FileText,
  Scale,
  Waves
};
function isHeaderLayout(layout) {
  return layout === "header";
}
function Sidebar({ navigation }) {
  const [activePath, setActivePath] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentLayout = useStore(layoutStore);
  useEffect(() => {
    const checkLayout = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setLayout("header");
      }
    };
    checkLayout();
    window.addEventListener("resize", checkLayout);
    return () => window.removeEventListener("resize", checkLayout);
  }, []);
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);
  useEffect(() => {
    setIsHovered(false);
  }, [currentLayout]);
  if (isMobile) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("header", { className: "fixed top-0 left-0 right-0 h-16 bg-[var(--sidebar-bg)] z-40 flex items-center px-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
            className: "text-[hsl(var(--sidebar-fg))]",
            children: /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex-1 flex justify-center", children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Logo", className: "h-8" }) }),
        /* @__PURE__ */ jsx(ModeToggle, {})
      ] }),
      /* @__PURE__ */ jsxs(
        "aside",
        {
          className: cn(
            "fixed inset-y-0 left-0 w-64 bg-[var(--sidebar-bg)] z-50 transform transition-transform duration-200 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            "flex flex-col"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "h-16 flex items-center px-4", children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Logo", className: "h-8" }) }),
            /* @__PURE__ */ jsx("nav", { className: "flex-1 py-4", children: navigation.map((item) => {
              const Icon = icons[item.icon];
              const isActive = activePath === item.path;
              return /* @__PURE__ */ jsxs(
                "a",
                {
                  href: item.path,
                  onClick: () => setIsMobileMenuOpen(false),
                  className: cn(
                    "flex items-center h-11 px-4 text-[hsl(var(--sidebar-fg)_/_0.8)]",
                    "hover:bg-[var(--sidebar-hover)] hover:text-[hsl(var(--sidebar-fg))]",
                    isActive && "bg-[var(--sidebar-active)] text-[hsl(var(--sidebar-fg))]"
                  ),
                  children: [
                    Icon && /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 mr-3" }),
                    /* @__PURE__ */ jsx("span", { children: item.title })
                  ]
                },
                item.path
              );
            }) }),
            /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-[var(--sidebar-hover)]", children: /* @__PURE__ */ jsx(ModeToggle, {}) })
          ]
        }
      ),
      isMobileMenuOpen && /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/50 z-40",
          onClick: () => setIsMobileMenuOpen(false)
        }
      )
    ] });
  }
  if (currentLayout === "header") {
    return /* @__PURE__ */ jsxs("header", { className: "fixed top-0 left-0 right-0 h-16 bg-[var(--sidebar-bg)] z-40 flex items-center px-5", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center h-full", children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Logo", className: "h-8" }) }),
      /* @__PURE__ */ jsx("nav", { className: "flex items-center space-x-6 ml-8 flex-1", children: navigation.map((item) => {
        const Icon = icons[item.icon];
        const isActive = activePath === item.path;
        return /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.path,
            className: cn(
              "flex items-center text-[hsl(var(--sidebar-fg)_/_0.8)] hover:text-[hsl(var(--sidebar-fg))]",
              "hover:bg-[var(--sidebar-hover)] px-3 py-2 rounded-md transition-colors",
              isActive && "text-[hsl(var(--sidebar-fg))] bg-[var(--sidebar-active)]"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 mr-2" }),
              /* @__PURE__ */ jsx("span", { children: item.title })
            ]
          },
          item.path
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setLayout("sidebar"),
            className: "text-[hsl(var(--sidebar-fg)_/_0.8)] hover:text-[hsl(var(--sidebar-fg))]\n                       p-2 hover:bg-[var(--sidebar-hover)] rounded-md transition-colors",
            children: /* @__PURE__ */ jsx(LayoutPanelTop, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(ModeToggle, {})
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: cn(
        "group fixed left-0 h-screen w-16 hover:w-64",
        "bg-[var(--sidebar-bg)] hover:z-50",
        "transition-all duration-200 ease-out z-30",
        "flex flex-col",
        isHovered && "sidebar-expanded"
      ),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/",
            className: "h-16 flex items-center hover:bg-[var(--sidebar-hover)] transition-colors px-4",
            children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: isHovered || isHeaderLayout(currentLayout) ? "/logo.png" : "/icon.svg",
                alt: "Logo",
                className: cn(
                  "transition-all duration-200",
                  isHovered ? "h-8" : "h-6"
                )
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 py-4", children: navigation?.map((item) => {
          const Icon = icons[item.icon];
          const isActive = activePath === item.path;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              href: item.path,
              className: cn(
                "group flex items-center h-11 w-full hover:bg-[var(--sidebar-hover)] relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-white/5 before:translate-x-[-100%] before:hover:translate-x-0 before:transition-transform before:duration-300",
                isActive && "bg-[var(--sidebar-active)]"
              ),
              children: [
                /* @__PURE__ */ jsx("div", { className: "min-w-[64px] flex items-center justify-center relative z-10", children: Icon && /* @__PURE__ */ jsx(Icon, { className: "sidebar-icon" }) }),
                /* @__PURE__ */ jsx("span", { className: "sidebar-text relative z-10", children: item.title }),
                isActive && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-0.5 bg-[hsl(var(--sidebar-fg))]" })
              ]
            },
            item.path
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "py-4 border-t border-[var(--sidebar-hover)]", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setLayout("header"),
              className: cn(
                "group flex items-center h-11 w-full hover:bg-[var(--sidebar-hover)] relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-white/5 before:translate-x-[-100%] before:hover:translate-x-0 before:transition-transform before:duration-300"
              ),
              children: [
                /* @__PURE__ */ jsx("div", { className: "min-w-[64px] flex items-center justify-center relative z-10", children: /* @__PURE__ */ jsx(LayoutPanelTop, { className: "sidebar-icon" }) }),
                /* @__PURE__ */ jsx("span", { className: "sidebar-text", children: "Switch Layout" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "group flex items-center h-11 w-full hover:bg-[var(--sidebar-hover)] relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-white/5 before:translate-x-[-100%] before:hover:translate-x-0 before:transition-transform before:duration-300"
              ),
              children: [
                /* @__PURE__ */ jsx("div", { className: "min-w-[64px] flex items-center justify-center relative z-10", children: /* @__PURE__ */ jsx(ModeToggle, {}) }),
                /* @__PURE__ */ jsx("span", { className: "sidebar-text", children: "Switch Theme" })
              ]
            }
          )
        ] })
      ]
    }
  );
}

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const navigation = [
    {
      title: "Home",
      path: "/",
      icon: "Home"
    },
    {
      title: "Chat",
      path: "/chat",
      icon: "Waves"
    },
    {
      title: "README",
      path: "/readme",
      icon: "FileText"
    },
    {
      title: "MIT License",
      path: "/mit-license",
      icon: "Scale"
    }
  ];
  const {
    title,
    description = "A beautiful dashboard built with Astro and shadcn/ui"
  } = Astro2.props;
  const preconnectUrls = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com"
  ];
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description"${addAttribute(description, "content")}><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="preconnect" href="/" crossorigin="anonymous"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Resource hints -->${preconnectUrls.map((url) => renderTemplate`<link rel="preconnect"${addAttribute(url, "href")} crossorigin="anonymous">`)}<!-- Preload critical assets --><title>${title}</title><!-- Defer non-critical JS -->${renderScript($$result, "/Users/toc/Server/ONE/local/astro-shadcn/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body class="min-h-screen bg-background font-sans antialiased"> <div class="flex min-h-screen optimize-gpu"> ${renderComponent($$result, "Sidebar", Sidebar, { "navigation": navigation, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Sidebar", "client:component-export": "Sidebar" })} <div id="main-content" class="flex-1 min-h-screen pl-[80px]"> <main class="py-6 min-h-[calc(100vh-3rem)] max-w-[1000px] mx-auto px-4"> ${renderSlot($$result, $$slots["default"])} </main> </div> </div> </body></html>`;
}, "/Users/toc/Server/ONE/local/astro-shadcn/src/layouts/Layout.astro", undefined);

export { $$Layout as $, cn as c };
