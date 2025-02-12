import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { useNetwork } from '../web/useNetwork';
import { ValueExchange } from '../tests/types';
import { Timeline, TimelineEvent } from './ui/timeline';

export const NetworkActivity = () => {
  const { network } = useNetwork();
  const [activities, setActivities] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const processExchange = (exchange: ValueExchange) => ({
      id: exchange.id.toString(),
      title: `${exchange.valueType} Exchange`,
      description: exchange.metadata,
      timestamp: new Date(exchange.timestamp),
      icon: getExchangeIcon(exchange.valueType),
      color: getExchangeColor(exchange.valueType),
      from: exchange.from,
      to: exchange.to,
      value: exchange.amount
    });

    const loadActivities = async () => {
      const exchanges = Array.from(network.edges.values())
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
        .map(processExchange);
      
      setActivities(exchanges);
    };

    loadActivities();
    // Set up real-time updates
    const interval = setInterval(loadActivities, 5000);
    return () => clearInterval(interval);
  }, [network]);

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Network Activity</h2>
      <Timeline events={activities}>
        {(event) => (
          <div className="flex items-center gap-4">
            <div className={`text-2xl ${event.color}`}>{event.icon}</div>
            <div>
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-gray-500">
                From {event.from} to {event.to}
              </div>
              <div className="text-sm">{event.description}</div>
              <div className="text-sm font-medium">
                Value: {event.value}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {event.timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}
      </Timeline>
    </Card>
  );
};

// Helper functions
const getExchangeIcon = (type: string) => {
  switch (type) {
    case 'KNOWLEDGE': return '🧠';
    case 'EDUCATION': return '📚';
    case 'TECHNOLOGY': return '💻';
    case 'TOKEN': return '🪙';
    default: return '💫';
  }
};

const getExchangeColor = (type: string) => {
  switch (type) {
    case 'KNOWLEDGE': return 'text-green-500';
    case 'EDUCATION': return 'text-blue-500';
    case 'TECHNOLOGY': return 'text-purple-500';
    case 'TOKEN': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
}; 