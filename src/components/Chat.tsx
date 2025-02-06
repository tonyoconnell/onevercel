import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { MyThread as CustomThread } from "@/components/chat/thread";
import { type ChatConfig, createDefaultConfig } from "@/schema/chat";
import { useChat } from "ai/react";
import { useCallback } from 'react';
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
    initialMessages: [{
      id: nanoid(),
      role: "system",
      content: safeConfig.systemPrompt?.[0]?.text || "I am an AI assistant. How can I help you?"
    }],
    body: {
      config: safeConfig
    },
    onError: (error) => {
      console.error("Chat error:", error);
    }
  });

  const runtime = useVercelUseChatRuntime(chat);

  // Handle suggestion clicks
  const handleSuggestionClick = useCallback((prompt: string) => {
    chat.setInput(prompt);

    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
      target: {
        message: { value: prompt }
      }
    } as any;

    chat.handleSubmit(syntheticEvent);
  }, [chat]);

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