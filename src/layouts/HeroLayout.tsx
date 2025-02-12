import "../styles/global.css";
import { useState, useEffect } from "react";
import { RightPanel } from "@/components/RightPanel";

interface HeroLayoutProps {
    children: React.ReactNode;
    defaultWidth?: "quarter" | "half";
    defaultOpen?: boolean;
}

export function HeroLayout({
    children,
    defaultWidth = "half",
    defaultOpen = false
}: HeroLayoutProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);

    useEffect(() => {
        const handlePanelOpen = () => {
            setIsPanelOpen(true);
        };

        // Listen for the custom event
        window.addEventListener('openAIPanel', handlePanelOpen);

        // Cleanup listener
        return () => {
            window.removeEventListener('openAIPanel', handlePanelOpen);
        };
    }, []);

    return (
        <RightPanel defaultWidth={defaultWidth} defaultOpen={isPanelOpen}>
            {children}
        </RightPanel>
    );
}