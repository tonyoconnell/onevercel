import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { MyThread as CustomThread } from "@/components/assistant-ui/thread";
import { type ChatConfig, createDefaultConfig } from "@/lib/chatConfig";
import { useChat } from "ai/react";
import { nanoid } from 'nanoid';

export function MyThread({
  config = createDefaultConfig()
}: {
  config?: ChatConfig
}) {
  // Ensure we always have a valid config
  const safeConfig = config || createDefaultConfig();

  const chat = useChat({
    api: "/api/chat",
    initialMessages: safeConfig.systemPrompt ? [
      {
        id: nanoid(),
        role: "system",
        // Convert content parts array to string for AI SDK
        content: safeConfig.systemPrompt.map(part => part.text).join('\n')
      }
    ] : [],
    body: {
      config: safeConfig
    }
  });

  const runtime = useVercelUseChatRuntime(chat);

  return (
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <CustomThread welcome={safeConfig.welcome} />
      </AssistantRuntimeProvider>
    </div>
  );
}