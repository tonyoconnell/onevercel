import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { MyThread as CustomThread } from "@/components/chat/thread";
import { type ChatConfig, createDefaultConfig } from "@/schema/chat";
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
    initialMessages: [],
    body: {
      config: safeConfig
    },
    onError: (error) => {
      console.error("Chat error:", error);
    }
  });

  const runtime = useVercelUseChatRuntime(chat);

  // Handle suggestion clicks
  const handleSuggestionClick = (prompt: string) => {
    if (chat.messages.length === 0) {
      // If this is the first message, add system prompt first
      chat.append({
        id: nanoid(),
        role: "system",
        content: safeConfig.systemPrompt?.[0]?.text || "I am an AI assistant. How can I help you?"
      });
    }
    chat.append({
      id: nanoid(),
      role: "user",
      content: prompt
    });
  };

  return (
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <CustomThread 
          welcome={safeConfig.welcome}
          onSuggestionClick={handleSuggestionClick}
        />
      </AssistantRuntimeProvider>
    </div>
  );
}