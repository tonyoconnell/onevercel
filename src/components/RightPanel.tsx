import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatSimple } from "@/components/ChatSimple";


interface RightPanelProps {
    children?: React.ReactNode;
    panelContent?: React.ReactNode;
    defaultWidth?: "quarter" | "half";
    defaultOpen?: boolean;
}

export function RightPanel({ 
    children, 
    defaultWidth = "quarter",
    defaultOpen = true 
}: RightPanelProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);
    const [panelWidth, setPanelWidth] = useState<"quarter" | "half">(defaultWidth);

    return (
        <div className="flex h-screen w-full">
            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${
                    isPanelOpen 
                        ? panelWidth === "quarter" 
                            ? "w-3/4" 
                            : "w-1/2" 
                        : "w-full"
                }`}
            >
                <div className="p-4">
                    <Button 
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        variant="outline"
                        size="sm"
                        className="mb-4"
                    >
                        {isPanelOpen ? "Hide Panel" : "Show Panel"}
                    </Button>
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div
                className={`h-full bg-background border-l transition-all duration-300 ${
                    isPanelOpen
                        ? panelWidth === "quarter"
                            ? "w-1/4"
                            : "w-1/2"
                        : "w-0 overflow-hidden"
                }`}
            >
                <div className="h-full flex flex-col">
                    <div className="flex gap-2 p-4">
                        <Button
                            size="sm"
                            onClick={() => setPanelWidth("quarter")}
                            variant={panelWidth === "quarter" ? "default" : "outline"}
                        >
                            1/4
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setPanelWidth("half")}
                            variant={panelWidth === "half" ? "default" : "outline"}
                        >
                            1/2
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ChatSimple />
                    </div>
                </div>
            </div>
        </div>
    );
}