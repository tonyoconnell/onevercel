import { ChatSimple } from "./ChatSimple";

export function PanelChatWrapper() {
    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
            <ChatSimple />
        </div>
    );
}