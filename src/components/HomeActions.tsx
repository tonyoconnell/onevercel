import { useState } from 'react';
import { AIChatButton } from './AIChatButton';

interface HomeActionsProps {
    className?: string;
    variant?: 'primary' | 'secondary';
}

export function HomeActions({ className = '', variant = 'primary' }: HomeActionsProps) {
    const handleOpenPanel = () => {
        const event = new CustomEvent('toggle-panel', { detail: { open: true } });
        window.dispatchEvent(event);
    };

    const buttonProps = variant === 'primary' 
        ? {
            className: "bg-blue-600 hover:bg-blue-700 text-white",
            children: "Add AI to Your Website"
        }
        : {
            variant: "outline" as const,
            className: "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
            children: "Open AI Chat Demo"
        };

    return (
        <AIChatButton 
            {...buttonProps}
            onOpenPanel={handleOpenPanel}
        />
    );
}