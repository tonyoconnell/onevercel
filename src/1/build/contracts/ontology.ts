import { z } from 'zod';

// Core value types that can be exchanged in the network
export const ValueTypes = {
  KNOWLEDGE: 'KNOWLEDGE',
  EDUCATION: 'EDUCATION', 
  TECHNOLOGY: 'TECHNOLOGY',
  TOKEN: 'TOKEN'
} as const;

// Schema for value exchange metadata
export const ValueMetadataSchema = z.object({
  type: z.enum([
    ValueTypes.KNOWLEDGE,
    ValueTypes.EDUCATION,
    ValueTypes.TECHNOLOGY, 
    ValueTypes.TOKEN
  ]),
  timestamp: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
  value: z.number()
});

// Schema for network members
export const MemberSchema = z.object({
  id: z.string(),
  type: z.enum(['HUMAN', 'AI']),
  capabilities: z.array(z.string()),
  reputation: z.number(),
  knowledge: z.array(z.string()),
  certifications: z.array(z.string()),
  connections: z.array(z.string())
});

// Schema for value exchanges between members
export const ExchangeSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  valueType: z.enum([
    ValueTypes.KNOWLEDGE,
    ValueTypes.EDUCATION,
    ValueTypes.TECHNOLOGY,
    ValueTypes.TOKEN
  ]),
  amount: z.number(),
  metadata: ValueMetadataSchema,
  timestamp: z.number()
});

// Network metrics tracking
export const MetricsSchema = z.object({
  totalValue: z.number(),
  knowledgeExchanges: z.number(),
  educationExchanges: z.number(), 
  technologyExchanges: z.number(),
  tokenExchanges: z.number(),
  topContributors: z.map(z.string(), z.number()),
  mostValuableConnections: z.map(
    z.string(),
    z.array(z.string())
  )
});

// Core network graph structure
export class NetworkGraph {
  nodes: Map<string, z.infer<typeof MemberSchema>>;
  edges: Map<string, z.infer<typeof ExchangeSchema>>;
  metrics: z.infer<typeof MetricsSchema>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.metrics = {
      totalValue: 0,
      knowledgeExchanges: 0,
      educationExchanges: 0,
      technologyExchanges: 0, 
      tokenExchanges: 0,
      topContributors: new Map(),
      mostValuableConnections: new Map()
    };
  }

  addNode(member: z.infer<typeof MemberSchema>) {
    this.nodes.set(member.id, member);
  }

  addEdge(exchange: z.infer<typeof ExchangeSchema>) {
    this.edges.set(exchange.id, exchange);
    this.updateMetrics(exchange);
  }

  private updateMetrics(exchange: z.infer<typeof ExchangeSchema>) {
    // Update exchange counts
    this.metrics.totalValue += exchange.amount;
    
    switch(exchange.valueType) {
      case ValueTypes.KNOWLEDGE:
        this.metrics.knowledgeExchanges++;
        break;
      case ValueTypes.EDUCATION:
        this.metrics.educationExchanges++;
        break;
      case ValueTypes.TECHNOLOGY:
        this.metrics.technologyExchanges++;
        break;
      case ValueTypes.TOKEN:
        this.metrics.tokenExchanges++;
        break;
    }

    // Update contributor metrics
    const fromValue = this.metrics.topContributors.get(exchange.from) || 0;
    this.metrics.topContributors.set(exchange.from, fromValue + exchange.amount);

    // Update connection metrics
    const connections = this.metrics.mostValuableConnections.get(exchange.from) || [];
    if (!connections.includes(exchange.to)) {
      connections.push(exchange.to);
      this.metrics.mostValuableConnections.set(exchange.from, connections);
    }
  }
}

// Export types
export type ValueMetadata = z.infer<typeof ValueMetadataSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Exchange = z.infer<typeof ExchangeSchema>;
export type Metrics = z.infer<typeof MetricsSchema>; 