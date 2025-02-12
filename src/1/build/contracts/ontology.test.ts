import { describe, test, expect } from 'vitest';
import { ONE, I, Interact, type Node, type Exchange } from './ontology';

describe('ONE Ontology', () => {
  test('I concepts are defined', () => {
    expect(I.THINK).toBe('think');
    expect(I.BUILD).toBe('build');
    expect(I.GROW).toBe('grow');
    expect(I.LINK).toBe('link');
  });

  test('interaction types are defined', () => {
    expect(Interact.ASK).toBe('ask');
    expect(Interact.TELL).toBe('tell');
    expect(Interact.SHOW).toBe('show');
    expect(Interact.MAKE).toBe('make');
  });

  test('can learn new knowledge', () => {
    const node: Node = {
      id: 'test.node',
      i: I.THINK,
      links: []
    };
    ONE.learn(node);
    const recalled = ONE.recall(I.THINK);
    expect(recalled).toContainEqual(node);
  });

  test('can link knowledge', () => {
    const node1: Node = {
      id: 'test.source',
      i: I.BUILD,
      links: []
    };
    const node2: Node = {
      id: 'test.target',
      i: I.BUILD,
      links: []
    };
    ONE.learn(node1);
    ONE.learn(node2);
    ONE.link(node1.id, node2.id, 0.8);
    const recalled = ONE.recall(I.BUILD);
    expect(recalled.find(n => n.id === node1.id)?.links)
      .toContainEqual({ to: node2.id, strength: 0.8 });
  });

  test('can engage in interaction', async () => {
    const exchange: Exchange = {
      type: Interact.ASK,
      from: 'test.user',
      intent: 'Learn about testing',
      context: { domain: 'code' }
    };
    const result = await ONE.engage(exchange);
    expect(result).toBeDefined();
    expect(ONE.getExchanges()).toContainEqual(exchange);
  });

  test('recognizes patterns', () => {
    ONE.recognize('code', 'testing');
    ONE.recognize('mind', 'learning');
    expect(async () => {
      await ONE.engage({
        type: Interact.ASK,
        from: 'test.user',
        intent: 'Show testing patterns',
        context: { domain: 'code' }
      });
    }).not.toThrow();
  });
}); 