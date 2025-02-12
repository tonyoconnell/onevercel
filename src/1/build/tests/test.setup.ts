import { beforeAll, afterAll, afterEach } from 'vitest';
import { db } from './database/database';
import { Monitor } from './monitor';

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Initialize monitoring
  await Monitor.init({
    enabled: true,
    level: 'debug',
    persistence: 'memory'
  });

  // Connect to test database
  await db.connect();
});

afterEach(async () => {
  // Clear test data
  const testDb = db.getDb();
  await testDb.dropDatabase();
});

afterAll(async () => {
  // Cleanup
  await db.disconnect();
  await Monitor.shutdown();
}); 