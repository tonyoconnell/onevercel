import { useEffect, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { useNetwork } from '../web/useNetwork';
import { Member, ValueExchange } from '../tests/types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface NetworkData {
  nodes: Array<{
    id: string;
    type: 'human' | 'agent';
    value: number;
    reputation: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
    type: string;
  }>;
}

export const NetworkVisualization = () => {
  const graphRef = useRef<any>();
  const { network, analyzeNetwork } = useNetwork();
  
  // Transform network data for visualization
  const transformData = (
    members: Map<string, Member>,
    exchanges: Map<string, ValueExchange>
  ): NetworkData => {
    const nodes = Array.from(members.values()).map(member => ({
      id: member.id,
      type: member.type,
      value: member.tokenBalance,
      reputation: member.reputation
    }));

    const links = Array.from(exchanges.values()).map(exchange => ({
      source: exchange.from,
      target: exchange.to,
      value: exchange.amount,
      type: exchange.valueType
    }));

    return { nodes, links };
  };

  useEffect(() => {
    const data = transformData(network.nodes, network.edges);
    
    // Configure force graph
    if (graphRef.current) {
      graphRef.current
        .nodeColor(node => node.type === 'human' ? '#0D76FF' : '#FF3366')
        .nodeRelSize(6)
        .nodeLabel(node => `
          ${node.id}
          Value: ${node.value}
          Reputation: ${node.reputation}
        `)
        .linkWidth(link => Math.sqrt(link.value) * 0.5)
        .linkColor(link => {
          switch (link.type) {
            case 'KNOWLEDGE': return '#4CAF50';
            case 'EDUCATION': return '#2196F3';
            case 'TECHNOLOGY': return '#9C27B0';
            case 'TOKEN': return '#FFC107';
            default: return '#757575';
          }
        })
        .d3Force('charge', -100)
        .d3Force('link', 50)
        .d3Force('center', 0.1);
    }
  }, [network]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Network Visualization</h2>
        <div className="flex gap-2">
          <Badge variant="primary">Humans</Badge>
          <Badge variant="secondary">Agents</Badge>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Value Types</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge style={{ backgroundColor: '#4CAF50' }}>Knowledge</Badge>
            <Badge style={{ backgroundColor: '#2196F3' }}>Education</Badge>
            <Badge style={{ backgroundColor: '#9C27B0' }}>Technology</Badge>
            <Badge style={{ backgroundColor: '#FFC107' }}>Token</Badge>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold mb-2">Network Stats</h3>
          <NetworkStats />
        </div>
      </div>

      <div className="h-[600px] border rounded-lg overflow-hidden">
        <ForceGraph2D
          ref={graphRef}
          graphData={transformData(network.nodes, network.edges)}
          enableNodeDrag={false}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      </div>
    </Card>
  );
};

const NetworkStats = () => {
  const { metrics } = useNetwork();

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-sm text-gray-500">Total Value</div>
        <div className="text-xl font-bold">{metrics.totalValue}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Active Members</div>
        <div className="text-xl font-bold">{metrics.topContributors.size}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Exchanges</div>
        <div className="text-xl font-bold">
          {metrics.knowledgeExchanges + 
           metrics.educationExchanges + 
           metrics.technologyExchanges + 
           metrics.tokenExchanges}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Connections</div>
        <div className="text-xl font-bold">
          {metrics.mostValuableConnections.size}
        </div>
      </div>
    </div>
  );
}; 