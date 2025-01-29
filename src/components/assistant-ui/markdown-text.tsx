import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { PrismAsyncLight } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { ComponentProps, ReactNode } from "react";

type CodeProps = ComponentProps<'code'> & {
  children?: ReactNode;
  className?: string;
};

const CodeBlock = ({ children, className }: CodeProps) => {
  // Convert children to string if needed
  const codeString = typeof children === 'string' ? children : String(children || '');
  const language = className?.replace('language-', '') || 'text';
  
  return (
    <div className="rounded-md border">
      <PrismAsyncLight
        language={language}
        style={coldarkDark}
        customStyle={{
          margin: 0,
          width: "100%",
          background: "transparent",
          padding: "1.5rem 1rem",
        }}
      >
        {codeString}
      </PrismAsyncLight>
    </div>
  );
};

export const MarkdownText = makeMarkdownText({
  components: {
    code: CodeBlock,
  }
});
