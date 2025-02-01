import { useEdgeRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import { MyThread as CustomThread, type WelcomeConfig } from "@/components/assistant-ui/thread";
import { useEffect } from "react";

export interface RuntimeConfig {
  model: string;
  apiEndpoint: string;
  runtime: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  userPrompt: string;
}

export type MyThreadProps = RuntimeConfig & {
  welcome?: WelcomeConfig;
}

export function MyThread({
  model,
  apiEndpoint,
  runtime,
  temperature,
  maxTokens,
  systemPrompt,
  userPrompt,
  welcome,
}: MyThreadProps) {
  const runtimeOptions = {
    api: "/api/chat",
    initialMessages: systemPrompt ? [{ role: 'system', content: systemPrompt }] : [],
    body: {
      model,
      temperature,
      maxTokens,
    }
  };

  const runtimeInstance = useEdgeRuntime(runtimeOptions);

  return (
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtimeInstance}>
        <CustomThread welcome={welcome} />
      </AssistantRuntimeProvider>
    </div>
  );
}