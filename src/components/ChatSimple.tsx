import {
    ChatInput,
    ChatInputSubmit,
    ChatInputTextArea,
} from "@/components/chat/chat-input";
import {
    ChatMessage,
    ChatMessageAvatar,
    ChatMessageContent,
} from "@/components/chat/chat-message";
import { ChatMessageArea } from "@/components/chat/chat-message-area";
import { useChat } from "ai/react";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatSimple({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
        useChat({
            api: "/api/chatsimple",
            body: {
                config: {
                    provider: "mistral",
                    model: "mistral-large-latest",
                }
            },
            initialMessages: [
                {
                    id: "initial-assistant",
                    content:
                        "Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
                    role: "assistant",
                },
                {
                    id: "initial-user",
                    content:
                        "Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
                    role: "user",
                },
            ],
        });

    const handleSubmitMessage = () => {
        if (isLoading) {
            return;
        }
        handleSubmit();
    };

    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                const behavior = isLoading ? "auto" : "smooth";
                messagesEndRef.current.scrollIntoView({ behavior });
            }
        };
        
        scrollToBottom();
        
        // Additional scroll after content updates
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isLoading, isFocused]);

    return (
        <div className={cn(
            "flex flex-col h-full overflow-hidden bg-background/50",
            className
        )} {...props}>
            {/* Messages container */}
            <div className="flex-1 min-h-0 overflow-y-auto pb-[68px]">
                <ChatMessageArea scrollButtonAlignment="center">
                    <div className="w-full p-3 space-y-3">
                        {messages.map((message) => {
                            if (message.role !== "user") {
                                return (
                                    <ChatMessage key={message.id} id={message.id}>
                                        <ChatMessageAvatar />
                                        <ChatMessageContent content={message.content} />
                                    </ChatMessage>
                                );
                            }
                            return (
                                <ChatMessage
                                    key={message.id}
                                    id={message.id}
                                    variant="bubble"
                                    type="outgoing"
                                >
                                    <ChatMessageContent content={message.content} />
                                </ChatMessage>
                            );
                        })}
                        
                        {isLoading && (
                            <div className="flex items-center gap-2 text-muted-foreground animate-in fade-in duration-200">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">AI is typing...</span>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} className="h-px" />
                    </div>
                </ChatMessageArea>
            </div>

            {/* Fixed input at bottom */}
            <div className={cn(
                "fixed bottom-0 inset-x-0 z-10", 
                "border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "transition-all duration-200",
                isFocused ? "shadow-md" : "shadow-sm"
            )}>
                <div className="p-3">
                    <ChatInput
                        value={input}
                        onChange={handleInputChange}
                        onSubmit={handleSubmitMessage}
                        loading={isLoading}
                        onStop={stop}
                        className="bg-background"
                    >
                        <ChatInputTextArea 
                            placeholder="Type a message..." 
                            className="min-h-[44px] max-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg resize-none scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        <ChatInputSubmit 
                            className={cn(
                                "mb-1 mr-1 transition-all duration-200",
                                "hover:scale-105 active:scale-95",
                                "disabled:opacity-50 disabled:hover:scale-100",
                                isLoading && "opacity-70"
                            )}
                        />
                    </ChatInput>
                </div>
            </div>
        </div>
    );
}
