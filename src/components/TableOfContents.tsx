import { useEffect, useState, type ReactElement } from "react";

interface Heading {
  depth: number;
  text: string;
  slug: string;
}

interface HeadingNode extends Heading {
  children: HeadingNode[];
}

interface Props {
  headings?: Heading[];
  "client:load"?: boolean;
  "client:visible"?: boolean;
  "client:media"?: string;
  "client:only"?: boolean;
  "client:idle"?: boolean;
}

export default function TableOfContents({ headings = [] }: Props): ReactElement | null {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.slug);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const buildToc = (headings: Heading[]): HeadingNode[] => {
    const toc: HeadingNode[] = [];
    const parentHeadings = new Map<number, HeadingNode>();

    headings.forEach((heading) => {
      const node: HeadingNode = { ...heading, children: [] };

      if (heading.depth === 2) {
        toc.push(node);
        parentHeadings.set(heading.depth, node);
      } else {
        const parentDepth = heading.depth - 1;
        const parent = parentHeadings.get(parentDepth);
        if (parent) {
          parent.children.push(node);
          parentHeadings.set(heading.depth, node);
        }
      }
    });

    return toc;
  };

  const renderTocItem = ({ text, slug, children }: HeadingNode): ReactElement => {
    const isActive = activeId === slug;

    return (
      <li key={slug} className="my-2">
        <a
          href={`#${slug}`}
          className={`block py-1.5 px-4 text-sm rounded-md transition-all duration-200 ${
            isActive
              ? "bg-primary/10 text-primary font-medium shadow-sm"
              : "text-muted-foreground hover:text-primary hover:bg-muted/50"
          }`}
        >
          {text}
        </a>
        {children.length > 0 && (
          <ul className="pl-4 mt-2 border-l border-muted">
            {children.map((child) => renderTocItem(child))}
          </ul>
        )}
      </li>
    );
  };

  const toc = buildToc(headings);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2" aria-label="Table of Contents">
      <div className="sticky top-16 -mt-10 pt-4 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-4rem)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        <div className="pl-8 pr-4">
          <div className="font-medium mb-4 text-sm px-4">On This Page</div>
          <ul className="space-y-2">
            {toc.map((heading) => renderTocItem(heading))}
          </ul>
        </div>
      </div>
    </nav>
  );
}