import { describe, test, expect, beforeAll } from 'vitest';
import ONE from '../../1';
import Monitor from './monitor';
import Registry from '../../registry';

describe('ONE', () => {
  beforeAll(async () => {
    await ONE.init();
  });

  test('initializes successfully', async () => {
    expect(ONE.version).toBe('1.0.0');
  });

  test('loads configuration', async () => {
    const config = await ONE.load('config');
    expect(config).toBeDefined();
  });

  test('logs events', async () => {
    await Monitor.log('test', { data: true });
    const events = await Monitor.getEvents('test');
    expect(Array.isArray(events)).toBe(true);
  });

  test('registers handlers', async () => {
    const handler = async () => ({ success: true });
    await Registry.register('test', handler);
    const result = await Registry.execute('test', {});
    expect(result).toEqual({ success: true });
  });
}); 