import { Thread, useEdgeRuntime } from "@assistant-ui/react";
import { MarkdownText } from "./assistant-ui/markdown-text";

export function MyThread() {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });

  return (
    <div className="h-full">
      <Thread 
        runtime={runtime} 
        assistantMessage={{ components: { Text: MarkdownText } }}
      />
    </div>
  );
}