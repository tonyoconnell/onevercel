import { NetworkVisualization } from './NetworkVisualization';
import { ValueFlowChart } from './ValueFlowChart';
import { MemberContributionChart } from './MemberContributionChart';
import { NetworkMetricsGrid } from './NetworkMetricsGrid';
import { NetworkActivity } from './NetworkActivity';

export const NetworkDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <NetworkMetricsGrid />
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <NetworkVisualization />
        </div>
        <div className="space-y-6">
          <NetworkActivity />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ValueFlowChart />
        <MemberContributionChart />
      </div>
    </div>
  );
}; 