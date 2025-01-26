"use client";

import { useEdgeRuntime, AssistantRuntimeProvider, useAssistantInstructions } from "@assistant-ui/react";
import { MyThread } from "./thread";

export const ThreadWrapper = () => {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });

  useAssistantInstructions({
    instruction: "I am a helpful AI assistant. How can I help you today?",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-full">
        <MyThread />
      </div>
    </AssistantRuntimeProvider>
  );
};