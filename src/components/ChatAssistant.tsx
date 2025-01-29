import { AssistantModal, useEdgeRuntime } from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function ChatAssistant() {
  const [showChat, setShowChat] = useState(false);
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });

  return (
    <>
      {!showChat && (
        <Button
          onClick={() => setShowChat(true)}
          className="h-12 w-12 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}
      
      {showChat && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              height: "700px",
              backgroundColor: "var(--background)",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              overflow: "hidden"
            }}
          >
            <Button
              onClick={() => setShowChat(false)}
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full p-0"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
            <AssistantModal runtime={runtime} />
          </div>
        </div>
      )}
    </>
  );
}