import { Card } from './ui/card';
import { useNetwork } from '../web/useNetwork';

export const NetworkMetricsGrid = () => {
  const { metrics } = useNetwork();

  if (!metrics) return null;

  const gridItems = [
    {
      label: 'Total Value',
      value: metrics.totalValue,
      icon: '💎',
      color: 'bg-blue-100'
    },
    {
      label: 'Knowledge Exchanges',
      value: metrics.knowledgeExchanges,
      icon: '🧠',
      color: 'bg-green-100'
    },
    {
      label: 'Education Transfers',
      value: metrics.educationExchanges,
      icon: '📚',
      color: 'bg-purple-100'
    },
    {
      label: 'Technology Shares',
      value: metrics.technologyExchanges,
      icon: '💻',
      color: 'bg-yellow-100'
    },
    {
      label: 'Token Transactions',
      value: metrics.tokenExchanges,
      icon: '🪙',
      color: 'bg-orange-100'
    },
    {
      label: 'Active Connections',
      value: metrics.mostValuableConnections.size,
      icon: '🔗',
      color: 'bg-pink-100'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {gridItems.map((item, index) => (
        <Card key={index} className={`p-4 ${item.color}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-xl font-bold">{item.value}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 