import { useMemo } from 'react';
import { Card } from './ui/card';
import { useNetwork } from '../web/useNetwork';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const ValueFlowChart = () => {
  const { metrics } = useNetwork();

  const flowData = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        name: 'Knowledge',
        exchanges: metrics.knowledgeExchanges,
        value: metrics.valueByType?.get('KNOWLEDGE') || 0
      },
      {
        name: 'Education',
        exchanges: metrics.educationExchanges,
        value: metrics.valueByType?.get('EDUCATION') || 0
      },
      {
        name: 'Technology',
        exchanges: metrics.technologyExchanges,
        value: metrics.valueByType?.get('TECHNOLOGY') || 0
      },
      {
        name: 'Token',
        exchanges: metrics.tokenExchanges,
        value: metrics.valueByType?.get('TOKEN') || 0
      }
    ];
  }, [metrics]);

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Value Flow Analysis</h2>
      <div className="h-[300px]">
        <BarChart width={600} height={300} data={flowData}>
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#0D76FF" />
          <YAxis yAxisId="right" orientation="right" stroke="#FF3366" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="exchanges" fill="#0D76FF" name="Exchanges" />
          <Bar yAxisId="right" dataKey="value" fill="#FF3366" name="Value" />
        </BarChart>
      </div>
    </Card>
  );
}; 