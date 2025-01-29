"use client";

import { useEdgeRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import { MyThread as CustomThread } from "@/components/assistant-ui/thread";

export function MyThread() {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });

  return (
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <CustomThread />
      </AssistantRuntimeProvider>
    </div>
  );
}