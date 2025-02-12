import { describe, test, expect } from 'vitest';
import { Can, Capabilities } from './capabilities';
import { 1, Interact } from '../ontology';

describe('ONE Capabilities', () => {
  test('has core capabilities', () => {
    expect(Capabilities.get('generate')).toMatchObject({
      type: Can.CODE,
      i: I.BUILD,
      interact: Interact.MAKE
    });

    expect(Capabilities.get('explain')).toMatchObject({
      type: Can.TEACH,
      i: I.THINK,
      interact: Interact.TELL
    });
  });

  test('capabilities have handlers', () => {
    const generate = Capabilities.get('generate');
    const explain = Capabilities.get('explain');

    expect(generate?.handler).toBeDefined();
    expect(explain?.handler).toBeDefined();
  });
}); 