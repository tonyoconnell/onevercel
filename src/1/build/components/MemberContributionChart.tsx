import { useMemo } from 'react';
import { Card } from './ui/card';
import { useNetwork } from '../web/useNetwork';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0D76FF', '#FF3366', '#4CAF50', '#FFC107'];

export const MemberContributionChart = () => {
  const { metrics } = useNetwork();

  const contributionData = useMemo(() => {
    if (!metrics?.topContributors) return [];
    return Array.from(metrics.topContributors.entries())
      .map(([id, value]) => ({
        name: id,
        value: Number(value)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [metrics]);

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Top Contributors</h2>
      <div className="h-[300px] flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={contributionData}
            cx={200}
            cy={150}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {contributionData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </Card>
  );
}; 