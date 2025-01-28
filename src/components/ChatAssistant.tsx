import { AssistantModal, useEdgeRuntime } from "@assistant-ui/react";

export function ChatAssistant() {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });

  return <AssistantModal runtime={runtime} />;
}

