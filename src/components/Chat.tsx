import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { MyThread as CustomThread } from "@/components/chat/thread";
import { type ChatConfig, createDefaultConfig } from "@/lib/chatConfig";
import { useChat } from "ai/react";
import type { Message } from "ai";
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
    initialMessages: [
      // System prompt
      ...(safeConfig.systemPrompt ? [{
        id: nanoid(),
        role: "system" as const,
        content: safeConfig.systemPrompt[0].text
      }] : []),
      // Initial user message
      ...(safeConfig.userPrompt ? [{
        id: nanoid(),
        role: "user" as const,
        content: safeConfig.userPrompt[0].text
      }] : []),
      // Initial assistant response
      ...(safeConfig.userPrompt ? [{
        id: nanoid(),
        role: "assistant" as const,
        content: "👋 Hello! I'm excited to help you explore and learn about ONE. What would you like to know more about?"
      }] : [])
    ] satisfies Message[],
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