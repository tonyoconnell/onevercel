import { Button } from "@/components/ui/button";

interface AIChatButtonProps {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    className?: string;
    children: React.ReactNode;
    onOpenPanel: () => void;
}

export function AIChatButton({
    variant = "default",
    size = "lg",
    className = "",
    children,
    onOpenPanel
}: AIChatButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={onOpenPanel}
        >
            {children}
        </Button>
    );
}