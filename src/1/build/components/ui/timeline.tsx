import { ReactNode } from 'react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
  from: string;
  to: string;
  value: number;
}

interface TimelineProps {
  events: TimelineEvent[];
  children: (event: TimelineEvent) => ReactNode;
}

export const Timeline = ({ events, children }: TimelineProps) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="relative pl-6 pb-4">
          <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />
          <div className={`absolute left-[-4px] top-2 h-2 w-2 rounded-full ${event.color.replace('text-', 'bg-')}`} />
          {children(event)}
        </div>
      ))}
    </div>
  );
}; 